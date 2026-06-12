---
id: io-drivers
title: I/O 硬件与驱动模型
summary: 设备驱动（Device Driver）是操作系统与硬件设备之间的"翻译官"——每种硬件设备都有自己独特的通信协议，而驱动程序把这些差异封装成统一的接口
difficulty: intermediate
order: 18
parent: interrupts-exceptions
children:
  - dma
related:
  - io-interface
prerequisites:
  - interrupts-exceptions
tags:
  - os
  - io
  - drivers
  - hardware
createdAt: 2026-06-12
---

## 操作系统怎么跟设备说话？

你的电脑连接了显卡、网卡、硬盘、键盘、鼠标……它们的接口、速度、协议各不相同。操作系统需要一种统一的方式来与这些设备通信。

**设备驱动（Device Driver）** 就是负责这个"翻译"工作的内核模块——它知道设备的硬件细节，向上给操作系统提供标准接口。

> 🏫 **类比：电源转换插头**
> 你从中国带了笔记本电脑去英国。中国的插头（设备硬件）是两脚扁头的，英国的插座（操作系统接口）是三角方头的。你需要一个**转换插头（设备驱动）**。

## I/O 硬件基础

### I/O 端口 vs 内存映射 I/O

CPU 与设备通信的两种方式：

| 方式 | 原理 | 指令 |
|------|------|------|
| **I/O 端口**（Port I/O） | 独立的 I/O 地址空间 | `in`/`out` 指令 |
| **内存映射 I/O**（MMIO） | 设备寄存器映射到内存地址空间 | 普通 `mov` 指令 |

```asm
; I/O 端口方式读设备状态
mov  dx, 0x3F8        ; COM1 串口的端口地址
in   al, dx           ; 从端口读一个字节

; 内存映射 I/O（更常见）
mov  rax, [0xFEC00000] ; 像读内存一样读设备寄存器
```

> 💡 MMIO 更简单（不需要特殊指令），现代设备大多用 MMIO。PCIe 配置空间也通过 MMIO 访问。

### 设备寄存器

每个设备有一组**寄存器**，CPU 通过读写这些寄存器来控制设备：

```
设备寄存器类型：

状态寄存器（Status）    ← CPU 读：设备忙不忙？数据准备好了吗？
控制寄存器（Control）   → CPU 写：启动操作、复位设备
数据寄存器（Data）      ↔ CPU 读/写：传输数据
```

```c
// 网卡驱动伪代码——操作 MMIO 寄存器
#define NIC_BASE    0xFEC00000   // 网卡的 MMIO 基地址
#define REG_STATUS  (NIC_BASE + 0x00)
#define REG_CMD     (NIC_BASE + 0x04)
#define REG_TX_BUF  (NIC_BASE + 0x08)

void nic_send_packet(void* data, int len) {
    // 1. 等待设备就绪
    while (*(volatile int*)REG_STATUS & BUSY);
    
    // 2. 把数据写入发送缓冲区
    memcpy((void*)REG_TX_BUF, data, len);
    
    // 3. 写控制寄存器，通知设备发送
    *(volatile int*)REG_CMD = CMD_SEND;
}
```

## I/O 控制方式

### 1. 程序控制 I/O（PIO）

CPU 直接参与每一次数据传输——每读/写一个字都要 CPU 执行指令。

```c
// PIO 方式读硬盘（以 ATA 接口为例）
void pio_read_sector(void* buf, int sector) {
    // CPU 直接读写数据寄存器
    outb(0x1F2, 1);          // 读 1 个扇区
    outb(0x1F3, sector);     // 扇区号低 8 位
    outb(0x1F4, sector>>8);  // 扇区号中 8 位
    outb(0x1F7, 0x20);       // 命令：读扇区
    
    // 等待数据就绪
    while (!(inb(0x1F7) & 0x08));
    
    // CPU 逐字读取（每个扇区 256 个字）
    for (int i = 0; i < 256; i++)
        ((uint16_t*)buf)[i] = inw(0x1F0);
}
```

**优点**：简单，不需要特殊硬件
**缺点**：**CPU 被占用**——传输过程中 CPU 不能干别的事

### 2. 中断驱动 I/O

设备完成操作后发中断通知 CPU，CPU 在中断处理程序中接收数据。

```
CPU 发命令给设备 → CPU 继续做别的事
                         ↓
设备完成操作 → 发出中断信号 → CPU 暂停当前工作
                                    ↓
                         中断处理程序处理数据 → 恢复之前的工作
```

**优点**：CPU 不需要忙等
**缺点**：每次传输都触发中断——高吞吐量场景中断太多

### 3. DMA（直接存储器访问）

见 [[dma|DMA（直接存储器访问）]]。

## Linux 设备驱动模型

### 设备文件——"一切皆文件"

在 Unix/Linux 中，设备被抽象为**设备文件**，可以用标准的 `open`/`read`/`write`/`ioctl` 操作。

```bash
# 查看设备文件
$ ls -l /dev/
crw-rw-rw- 1 root root   1, 3  /dev/null      # 字符设备
brw-rw---- 1 root root   8, 0  /dev/sda       # 块设备

# 字符设备（c）——串行读写，如键盘、串口
# 块设备（b）——随机访问，如硬盘
```

```c
// 操作设备文件就像操作普通文件
int fd = open("/dev/sda", O_RDONLY);
char buf[512];
read(fd, buf, 512);  // 读硬盘第一个扇区
close(fd);
```

> 💡 主设备号（major number）标识驱动程序，次设备号（minor number）标识具体的设备实例。

### 驱动程序的层次结构

```
应用程序（用户态）
    │  open/read/write/ioctl
    ▼
VFS（虚拟文件系统）
    │
    ▼
设备驱动框架（字符设备 / 块设备 / 网络）
    │  注册 file_operations 回调
    ▼
具体设备驱动（如 rtl8139 网卡驱动）
    │  操作 MMIO 寄存器、处理中断、管理 DMA
    ▼
硬件设备
```

```c
// 一个简化的字符设备驱动框架
#include <linux/fs.h>
#include <linux/module.h>

static int my_device_open(struct inode* inode, struct file* file) {
    // 初始化设备
    return 0;
}

static ssize_t my_device_read(struct file* file, char* buf,
                               size_t len, loff_t* off) {
    // 从设备读数据
    return len;
}

static struct file_operations my_device_fops = {
    .owner = THIS_MODULE,
    .open = my_device_open,
    .read = my_device_read,
};

// 模块初始化
static int __init my_driver_init(void) {
    // 注册字符设备
    register_chrdev(240, "my_device", &my_device_fops);
    return 0;
}

module_init(my_driver_init);
```

## 热插拔与设备枚举

现代设备通过 **PCIe / USB** 等总线连接，支持热插拔：

```bash
# 查看 PCI 设备
$ lspci
00:00.0 Host bridge
00:02.0 VGA compatible controller
00:14.0 USB controller
02:00.0 Ethernet controller

# 查看 USB 设备
$ lsusb
Bus 001 Device 003: ID 046d:c077 Logitech Mouse
Bus 001 Device 005: ID 8087:0026 Intel Bluetooth
```

当设备插入时，操作系统自动：
1. 检测总线上的新设备
2. 读取设备配置空间（Vendor ID、Device ID）
3. 查找匹配的驱动程序
4. 加载驱动、创建设备文件、通知用户空间

## 小结

| 概念 | 要点 |
|------|------|
| **设备驱动** | 操作系统与硬件之间的"翻译层" |
| **I/O 端口 vs MMIO** | 特殊指令 vs 内存读写访问设备 |
| **PIO** | CPU 直接参与每字节传输（慢） |
| **中断驱动** | 设备完成后通知 CPU（无需忙等） |
| **设备文件** | "一切皆文件"——设备通过文件接口操作 |
| **热插拔** | 自动检测设备，加载驱动 |

**为什么先学这个？** I/O 驱动是操作系统与硬件交互的最后一道桥梁。最后看看最强大的 I/O 技术：[[dma|DMA（直接存储器访问）]]。
