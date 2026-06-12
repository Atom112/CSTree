---
id: dma
title: DMA（直接存储器访问）
summary: DMA（Direct Memory Access）让硬件设备可以直接读写内存，不需要 CPU 参与每字节的数据搬运——是现代高速 I/O（网卡、磁盘、GPU）性能的基石
difficulty: advanced
order: 20
parent: interrupt-handling
children: []
related:
  - io-interface
  - interrupt-handling
prerequisites:
  - interrupt-handling
tags:
  - os
  - dma
  - io
createdAt: 2026-06-12
---

## 搬运数据——CPU 该不该亲自干？

没有 DMA 时，硬盘读数据到内存要走以下流程：

```
程序调用 read()
    │
CPU 发命令给磁盘控制器：从扇区 N 开始读
    │
CPU 忙等：循环检查状态寄存器（PIO 方式）
或者 CPU 去做其他事，等磁盘中断
    │
磁盘准备好数据
    │
CPU 逐字从设备读入内存：
  mov rax, [设备数据寄存器]
  mov [内存缓冲区], rax
  重复 256 次…
    │
数据读取完成 → 程序继续
```

**问题**：一个 4KB 的扇区，CPU 需要执行上千条指令来搬运数据——如果系统正在大量读写磁盘或网络，CPU 大部分时间都在做"搬运工"而不是真正的计算。

> 🏫 **类比：快递搬运**
> 你（CPU）在写论文（计算任务），快递员（硬盘）送来一个大箱子（数据）。没有 DMA：你必须自己把箱子搬进书房、拆箱、把东西放好——论文写不下去了。有 DMA：快递员直接把箱子搬进书房放好，然后通知你"东西到了"——你可以写完手头这页再去整理。

## DMA 的工作原理

**DMA 控制器（DMAC）** 是一个独立的硬件模块，可以在不打扰 CPU 的情况下在设备和内存之间传输数据。

```
没有 DMA：                        有 DMA：
CPU ─→ 设备数据 ─→ CPU ─→ 内存    CPU ─→ 配置 DMA → 其他工作
                                  │
                              DMA 控制器
                              ─→ 设备数据 ─→ 内存（或反向）
                                        │
                                    完成 → 中断通知 CPU
```

### 传输流程

```
步骤 1：CPU 配置 DMA 控制器
  DMA 控制器有三个寄存器：
  • 源地址（设备或内存的地址）
  • 目的地址（内存或设备的地址）
  • 传输长度

步骤 2：CPU 启动 DMA 传输
  CPU 写控制寄存器 → DMA 开始工作

步骤 3：DMA 独立传输
  DMA 控制器在总线上直接读写内存和设备
  CPU 可以继续执行程序（缓存在 CPU 缓存中命中时不受影响）

步骤 4：传输完成
  DMA 控制器发中断通知 CPU
  CPU 在中断处理程序中知道数据已就绪
```

### 三种 DMA 传输方式

| 方式 | 流程 | 总线占用 |
|------|------|---------|
| **突发模式（Burst）** | DMAC 独占总线，传完一个块才释放 | 全程占用 |
| **周期窃取（Cycle Stealing）** | DMAC 每传一个字节释放一次总线 | 一个周期 |
| **透明模式（Transparent）** | 只在 CPU 不用总线时传输 | 零影响 |

> 💡 现代系统大多用**总线主控 DMA（Bus-Mastering DMA）**——设备自己就是"总线主控"，可以直接读写内存，不需要专门的 DMA 控制器芯片。

## 操作系统中 DMA 的使用

```c
// Linux 内核中 DMA 操作的简化流程

// 1. 分配 DMA 缓冲区（物理连续）
dma_addr_t dma_handle;
void* cpu_addr = dma_alloc_coherent(dev, size, &dma_handle, GFP_KERNEL);

// 2. 告诉设备 DMA 缓冲区的物理地址
//    设备通过 PCIe BAR 空间得到这个地址
writel(dma_handle, dev->regs + DMA_ADDR_REG);
writel(size, dev->regs + DMA_SIZE_REG);
writel(CMD_DMA_START, dev->regs + DMA_CMD_REG);
//    设备开始 DMA 传输，CPU 可以继续执行

// 3. 设备完成 DMA 后发中断
//    中断处理程序中：
irqreturn_t dma_done_handler(int irq, void* dev_id) {
    // DMA 已完成，数据在 cpu_addr 指向的内存中
    process_data(cpu_addr);
    
    // 启动下一次 DMA 传输（如果需要）
    return IRQ_HANDLED;
}
```

## DMA 的类型

### 1. 块设备 DMA（磁盘）

```c
// 磁盘读操作的 DMA 流程
void disk_read(struct disk* disk, void* buf, int sector, int count) {
    // 1. 分配 DMA 缓冲区
    dma_addr_t dma_buf = dma_map_single(disk->dev, buf, count * 512, DMA_FROM_DEVICE);
    
    // 2. 配置 DMA
    write_reg(disk->regs, SECTOR_REG, sector);
    write_reg(disk->regs, COUNT_REG, count);
    write_reg(disk->regs, DMA_ADDR_REG, dma_buf);
    write_reg(disk->regs, CMD_REG, CMD_READ_DMA);
    // CPU 返回，做别的事
    
    // 3. 传输完成 → 中断 → 数据已在 buf 中
}
```

### 2. 网络 DMA

网卡收到的数据包直接通过 DMA 写入内存——CPU 不碰数据。

```
网卡收到网络包 ──→ 网卡通过 DMA 写入内存中的环形缓冲区
                         │
                      DMA 完成
                         │
                 网卡发中断通知 CPU
                         │
           CPU 从缓冲区取出数据发给协议栈
```

**零拷贝网络（Zero-Copy Networking）**：数据从网卡到应用程序全程不走 CPU——DMA 直接传到用户空间缓冲区。

```bash
# 一些网卡支持零拷贝（如 Intel DPDK）
# 应用程序直接操作 DMA 缓冲区，不需要 read() 系统调用
```

### 3. GPU DMA

```c
// GPU 通过 DMA 从 CPU 内存读取数据
// （典型的游戏渲染数据流）
cudaMemcpy(gpu_buffer, cpu_buffer, size, cudaMemcpyHostToDevice);
//          ↑ GPU 显存    ↑ CPU 内存
// 背后：CPU 启动 DMA 传输 → DMA 将数据从内存复制到 GPU 显存 → CPU 继续执行
```

## DMA 与缓存一致性（Cache Coherency）

**DMA 的数据在内存中，CPU 的数据在缓存中——它们会不一致！**

```
问题场景：
1. CPU 写变量 x = 42（x 在缓存中，还没写回内存）
2. 设备通过 DMA 从内存读 x → 读到旧值！
                    或者
1. 设备通过 DMA 写内存（更新了 x）
2. CPU 读 x → 缓存中是旧值！
```

### 解决方案

```c
// 方案 1：一致性 DMA 缓冲区（dma_alloc_coherent）
// 这块内存不会被 CPU 缓存（或硬件保证缓存一致性）
void* buf = dma_alloc_coherent(dev, size, &dma_handle, GFP_KERNEL);

// 方案 2：流式 DMA 映射（dma_map_single）
// 使用前需要 CPU 主动刷新缓存
dma_addr_t addr = dma_map_single(dev, cpu_buf, size, DMA_FROM_DEVICE);
// CPU 不能读写 cpu_buf，直到 dma_unmap_single
dma_unmap_single(dev, addr, size, DMA_FROM_DEVICE);
// 这里保证了数据一致性
```

> 💡 现代 x86 CPU 使用 **MESI 协议** 维护缓存一致性——设备写入内存后，CPU 的缓存行自动失效。但有些架构（如 ARM）需要软件显式处理。

## DMA 的性能优势

```
场景：读取 1MB 数据从磁盘到内存

没有 DMA（PIO 方式）：
  • CPU 逐字读取：1MB / 8 字节 × 每次 ~10 个周期 ≈ 1.3M 条指令
  • CPU 利用率：100%（啥也干不了）
  • 传输时间：~10ms（受 CPU 限制）

有 DMA：
  • CPU 启动 DMA：几十条指令（微秒级）
  • CPU 利用率：接近 0%（可以继续计算）
  • 传输时间：~5ms（受磁盘/总线限制）
```

**DMA 让 CPU 从"数据搬运工"变成了"任务管理者"**——告诉硬件做什么，然后去做更重要的事。

## 小结

| 概念 | 要点 |
|------|------|
| **DMA 定义** | 硬件设备直接读写内存，无需 CPU 逐字拷贝 |
| **工作流程** | CPU 配置 DMA → DMA 独立传输 → 中断通知完成 |
| **总线主控** | 现代设备自带的 DMA 能力（非专用 DMAC） |
| **缓存一致性** | DMA 内存和 CPU 缓存之间的数据同步问题 |
| **零拷贝** | 数据从设备到应用程序全程不经 CPU |
| **性能收益** | CPU 从数据搬运中解放，专注计算任务 |

**为什么先学这个？** DMA 是计算机系统 I/O 性能的终极解决方案。至此，你已经学完了操作系统板块的全部核心知识——从进程管理、并发同步、内存管理、文件系统到 I/O 系统。接下来你可以进入计算机网络或编译原理板块继续学习。
