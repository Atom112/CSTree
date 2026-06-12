---
id: interrupt-handling
title: 中断处理
summary: 中断（Interrupt）是硬件通知 CPU 的"紧急信号"——键盘被按下了、网卡收到数据了、磁盘读完了，都通过中断通知 CPU 来处理
difficulty: advanced
order: 19
parent: io-drivers
children:
  - dma
related:
  - interrupts-exceptions
prerequisites:
  - io-drivers
tags:
  - os
  - interrupt
  - io
createdAt: 2026-06-12
---

## 中断——CPU 的"来电通知"

你做作业时——妈妈叫你吃饭。你停下来，记住刚才做到第几题，去吃饭，吃完回来继续。

**中断（Interrupt）** 就是硬件发给 CPU 的"叫我吃饭"信号——CPU 暂停当前工作，处理硬件事件，处理完再回来。

> 💡 中断和[[interrupts-exceptions|异常（Exception）]]的区别：中断是外部硬件发起的（异步），异常是指令执行中产生的（同步，如除零）。

## 中断的完整流程

```
时间 →
                    ┌─── CPU 正在执行程序 ───┐
                    │                        │
网卡收到数据 ───→  网卡发中断信号给中断控制器
                    │                        │
                    中断控制器通知 CPU
                    │                        │
                    CPU 完成当前指令
                    │                        │
                    CPU 保存上下文（寄存器、栈）
                    │                        │
                    CPU 查找中断向量表（IVT）
                    │                        │
                    CPU 跳转到中断处理程序
                    │                        │
                    CPU 处理网卡数据（在中断上下文中）
                    │                        │
                    CPU 恢复上下文
                    │                        │
                    CPU 继续执行之前的程序
                    └──────────────────────────┘
```

### 中断向量表（IVT）

**中断向量表（Interrupt Vector Table, IVT）** 是一个数组，每个条目对应一个中断号，存储对应的处理函数地址。

```
中断号   处理函数
  0    → divide_error_handler       # 除零错误
  1    → debug_handler              # 调试异常
  ...
  32   → irq_0_handler              # 定时器
  33   → irq_1_handler              # 键盘
  ...
  255  → spurious_interrupt_handler # 伪中断
```

```asm
; x86-64 设置中断处理函数（IDT——中断描述符表）
; 内核初始化时填充 IDT
set_idt_entry:
    ; 将 handler_address 写入 IDT[n]
    mov  [idt + n*16 + 0], handler_low   ; 处理函数低 16 位
    mov  [idt + n*16 + 2], selector      ; 代码段选择子
    mov  [idt + n*16 + 4], 0x8E          ; 类型：中断门
    mov  [idt + n*16 + 6], handler_high  ; 处理函数高 16 位
    ; ...
    lidt [idt_ptr]                        ; 加载 IDT
```

## 中断控制器

早期 PC 用 **8259A PIC（Programmable Interrupt Controller）**——两个 8259A 级联支持 15 个中断。

现代系统用 **APIC（Advanced Programmable Interrupt Controller）**：

```
                   ┌──────────────┐
 定时器 ─────────→│              │
 键盘  ─────────→│  I/O APIC    │─→ 系统总线
 显卡  ─────────→│              │
 网卡  ─────────→│              │
                   └──────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │ 本地 APIC    │（每个 CPU 核有一个）
                   │  ┌────────┐ │
                   │  │ CPU 核  │ │
                   │  └────────┘ │
                   └──────────────┘
```

**APIC 的优势：**
- 支持更多的中断源（最多 256 个）
- 中断可以发往**指定 CPU 核**
- 支持**中断亲和性**——把特定设备的中断绑定到特定核

```bash
# 查看中断亲和性设置
$ cat /proc/irq/19/smp_affinity
00000001    # 发往 CPU 0

# 改为 CPU 1
$ echo 2 > /proc/irq/19/smp_affinity
```

> 💡 在 8 核服务器上，把网卡中断绑定到 CPU 0-1，把磁盘中断绑定到 CPU 2-3，可以避免所有中断挤在一个核上。

## 中断处理：上半部与下半部

中断处理程序应该尽可能快——因为在中断上下文中，其他中断可能被屏蔽。所以 Linux 把中断处理分为两半：

```
中断发生时
    │
    ▼
┌─────────────────────────────────────┐
│ 上半部（Top Half / Hard IRQ）       │
│ • 在中断上下文中执行                │
│ • 关闭当前 CPU 的中断              │
│ • 只做最少操作（确认中断、拷贝数据）│
│ • 必须非常快（微秒级）              │
│ → 调度"下半部"做剩余工作           │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ 下半部（Bottom Half / Soft IRQ）    │
│ • 不在中断上下文中（可以休眠）      │
│ • 中断是打开的（可被其他中断打断）  │
│ • 做主要的处理工作                  │
│ • 可以花毫秒级时间                 │
└─────────────────────────────────────┘
```

```c
// 网卡中断处理程序（上半部）
static irqreturn_t nic_interrupt(int irq, void* dev_id) {
    struct nic_device* nic = dev_id;
    
    // 1. 读取设备状态寄存器（确定中断来源）
    u32 status = readl(nic->regs + REG_STATUS);
    
    // 2. 确认中断（告诉设备：我收到信号了）
    writel(status, nic->regs + REG_STATUS_ACK);
    
    if (status & RX_DONE) {
        // 3. 把数据从设备拷贝到内核缓冲区
        //    （如果时间太长——调度下半部）
        schedule_softirq(NET_RX_SOFTIRQ);
    }
    
    return IRQ_HANDLED;
}

// 下半部处理
static void net_rx_softirq(void) {
    // 在软中断上下文处理网络包
    // 可以花更多时间
    process_received_packets();
}
```

## 中断的屏蔽与恢复

在处理关键操作时，操作系统需要暂时关闭中断：

```c
// 在 x86-64 上控制中断
asm volatile("cli");   // 关闭中断（Clear Interrupt Flag）
asm volatile("sti");   // 开启中断（Set Interrupt Flag）

// Linux 内核中的包装
unsigned long flags;
local_irq_save(flags);    // 关闭本地 CPU 中断，保存标志
// ... 临界区（不允许中断）...
local_irq_restore(flags); // 恢复原来的中断状态
```

## 中断亲和性与性能优化

```bash
# 查看系统中每个核处理的中断数量
$ cat /proc/interrupts
           CPU0    CPU1    CPU2    CPU3
0:         120      0       0       0   IO-APIC  timer
1:          0       8       0       0   IO-APIC  i8042
8:          0       1       0       0   IO-APIC  rtc0
19:      50000   30000   20000   10000   IO-APIC  eth0
```

> 💡 `eth0` 网卡中断分布在 4 个核上——这叫**中断负载均衡**。Linux 的 `irqbalance` 守护进程自动分配中断到各核。

## 小结

| 概念 | 要点 |
|------|------|
| **中断** | 硬件通知 CPU 的异步信号 |
| **中断向量表** | 中断号→处理函数地址的映射表 |
| **APIC** | 现代中断控制器，支持多核分发 |
| **上半部** | 快速响应中断，调度下半部 |
| **下半部** | 延迟处理，可被其他中断打断 |
| **中断亲和性** | 指定中断发往哪个 CPU 核 |

**为什么先学这个？** 中断是 I/O 效率的关键。最后一节看看终极 I/O 优化技术：[[dma|DMA（直接存储器访问）]]。
