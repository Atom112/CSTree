---
id: file-system-interface
title: 文件系统接口与实现
summary: 文件系统（File System）是操作系统中管理持久数据的模块——它把磁盘的原始扇区组织成文件和目录，让应用程序不用关心数据到底存在磁盘的哪个柱面
difficulty: intermediate
order: 15
parent: system-calls
children:
  - directory-structure
related:
  - dma
prerequisites:
  - system-calls
tags:
  - os
  - file-system
  - storage
createdAt: 2026-06-12
---

## 文件是什么？

**文件（File）** 是操作系统中信息存储的逻辑单元——它是一段有名字的数据。

你每天操作系统打交道最多的就是文件：`.c`、`.docx`、`.jpg`、`.mp4`——都是文件。

> 🏫 **类比：图书馆的图书**
> 想象一个没有编目的图书馆——所有书随便堆在仓库里。要找到一本特定的书得翻遍整个仓库。
> 
> **文件系统 = 图书馆的编目系统**
> - 每本书有编号（文件名）
> - 有分区分类（目录）
> - 有借阅记录（访问权限）
> - 有索引卡片（目录项）

## 文件系统的抽象层次

```
应用程序
  │  open(), read(), write(), close()
  ▼
虚拟文件系统（VFS）
  │  统一接口，屏蔽底层差异
  ├──┬── ext4（Linux 默认）
  │  ├── NTFS（Windows）
  │  ├── FAT32（U 盘）
  │  └── NFS（网络文件系统）
  │
  ▼
块设备层（Block Layer）
  │  I/O 调度、合并请求
  ▼
磁盘驱动 → 物理磁盘（SSD / HDD）
```

### 虚拟文件系统（VFS）

VFS（Virtual File System）是 Linux 的核心抽象——它定义了一套统一的接口，让 `open()`、`read()` 等系统调用不依赖于底层文件系统格式。

```c
// VFS 定义的核心操作接口
struct file_operations {
    ssize_t (*read)(struct file*, char*, size_t, loff_t*);
    ssize_t (*write)(struct file*, const char*, size_t, loff_t*);
    int (*open)(struct inode*, struct file*);
    int (*release)(struct inode*, struct file*);
    loff_t (*llseek)(struct file*, loff_t, int);
};
// 每种文件系统实现这个接口
```

> 💡 这就是为什么 U 盘可用 FAT32、移动硬盘用 NTFS、系统盘用 ext4——但你在 Linux 下都用同样的 `cp`、`mv`、`cat` 命令。

## 文件操作的系统调用

```c
#include <fcntl.h>
#include <unistd.h>

int main() {
    // 打开（或创建）文件
    // O_CREAT: 不存在则创建
    // O_WRONLY: 只写
    // 0644: 权限（owner rw, group r, others r）
    int fd = open("hello.txt", O_CREAT | O_WRONLY, 0644);
    if (fd == -1) {
        perror("open failed");
        return 1;
    }
    
    // 写入
    const char* msg = "Hello, File System!";
    write(fd, msg, strlen(msg));
    
    // 文件位置指针偏移
    lseek(fd, 0, SEEK_SET);  // 回到文件开头
    
    // 读取
    char buf[64];
    read(fd, buf, 64);
    
    // 关闭
    close(fd);
    return 0;
}
```

### 文件描述符（File Descriptor）

每个打开的文件在进程中用一个整数标识——**文件描述符（fd）**。

```
进程的 PCB
┌──────────────────────┐
│ 文件描述符表           │
│                      │
│ fd 0 → stdin         │
│ fd 1 → stdout        │
│ fd 2 → stderr        │
│ fd 3 → hello.txt     │
│ fd 4 → log.txt       │
│ ...                  │
└──────────────────────┘
```

```bash
# 查看进程打开的文件
$ lsof -p 1234
COMMAND  PID   FD   TYPE DEVICE SIZE NODE  NAME
myprog  1234  cwd  DIR   8,1   4096 12345 /home/user
myprog  1234  txt  REG   8,1   16384 67890 /usr/bin/myprog
myprog  1234  rtd  DIR   8,1   4096     2 /
myprog  1234  u    REG   8,1    512 11111 /home/user/hello.txt
```

## 文件系统的内部结构

一个典型的磁盘文件系统在磁盘上的布局：

```
┌──────────────┬──────────────────┬──────────────┬───────────────┐
│  引导块      │  超级块          │  索引节点区    │  数据块区      │
│ (Boot Block) │ (Super Block)   │ (inode 表)   │ (Data Blocks) │
└──────────────┴──────────────────┴──────────────┴───────────────┘
```

| 区域 | 内容 |
|------|------|
| **引导块** | 文件系统元信息，包含启动代码 |
| **超级块** | 文件系统全局信息（块大小、总块数、inode 数量、空闲块等） |
| **索引节点区** | inode 数组，每个文件/目录对应一个 inode |
| **数据块区** | 实际的文件内容 |

### inode（索引节点）

**inode** 是文件系统最重要的数据结构——它记录了文件的所有元信息，除了文件名。

```c
struct ext4_inode {
    __u16  i_mode;       // 文件类型+权限
    __u16  i_uid;        // 所有者用户 ID
    __u32  i_size;       // 文件大小（字节）
    __u32  i_atime;      // 最后访问时间
    __u32  i_ctime;      // 最后状态改变时间
    __u32  i_mtime;      // 最后修改时间
    __u32  i_dtime;      // 删除时间
    __u16  i_gid;        // 组 ID
    __u16  i_links_count; // 硬链接数
    __u32  i_blocks;     // 占用的块数
    __u32  i_flags;      // 标志
    // ... 省略 ...
    __u32  i_block[15];  // 数据块指针（12个直接 + 1个间接 + 1个二级 + 1个三级）
};
```

> 💡 **文件名和 inode 是分开存储的**——文件名存在目录中，inode 存在 inode 表中。这就是为什么可以给一个文件起多个名字（硬链接）：多个目录项指向同一个 inode。

### 数据块寻址

一个文件的数据存在不同的数据块中——关键问题是：**怎么找到这些块？**

```
inode 的 i_block[15] 数组：

[0]  ───→ 数据块 1（直接指针）
[1]  ───→ 数据块 2
...
[11] ───→ 数据块 12

[12] ───→ [间接块] → 数据块 13, 14, 15...（1 级间接）
                    → 每个间接块可指向 1024/4=256 个数据块

[13] ───→ [二级间接] → [间接块] → [间接块] → 数据块（2 级）
                    → 256 × 256 = 65536 个数据块

[14] ───→ [三级间接] → ...（3 级）
                    → 256 × 256 × 256 = 1677 万个数据块
```

> 💡 使用多级索引，ext4 可以支持最大单文件 16TB（4K 块大小）。

## 硬链接 vs 软链接

```bash
# 创建文件
$ echo "Hello" > original.txt

# 硬链接——两个文件名指向同一个 inode
$ ln original.txt hardlink.txt
$ ls -i original.txt hardlink.txt
12345 original.txt
12345 hardlink.txt    # 相同 inode 号！

# 软链接——一个特殊的文件，内容是指向另一个文件的路径
$ ln -s original.txt softlink.txt
$ ls -l softlink.txt
lrwxrwxrwx ... softlink.txt -> original.txt
```

| 对比 | 硬链接 | 软链接（符号链接） |
|------|-------|------------------|
| **inode** | 共享同一个 | 不同 inode |
| **跨文件系统** | ❌ | ✅ |
| **链接目录** | ❌ | ✅ |
| **源文件删除后** | 链接仍然有效 | 断链（dangling） |

## 文件系统的类型对比

| 文件系统 | 最大文件 | 最大卷 | 日志 | 适用场景 |
|---------|---------|-------|:----:|---------|
| **FAT32** | 4GB | 2TB | ❌ | U 盘兼容性 |
| **NTFS** | 16EB | 256TB | ✅ | Windows 系统盘 |
| **ext4** | 16TB | 1EB | ✅ | Linux 系统盘 |
| **XFS** | 8EB | 8EB | ✅ | 大型文件服务器 |
| **Btrfs** | 16EB | 16EB | ✅ | 快照、压缩、校验 |
| **ZFS** | 16EB | 256ZB | ✅ | 企业级存储 |

## 小结

| 概念 | 要点 |
|------|------|
| **文件** | 有名字的数据集合，OS 管理持久数据的基本单位 |
| **VFS** | 统一接口层，屏蔽不同文件系统差异 |
| **文件描述符** | 进程打开文件的索引号 |
| **inode** | 存储文件元信息（除文件名外） |
| **多级索引** | 通过直接+间接块指针寻址文件数据块 |
| **硬链接 vs 软链接** | 共享 inode vs 存储路径 | 

**为什么先学这个？** 文件系统接口是用户和存储之间的桥梁。下一节看看[[directory-structure|目录结构与文件分配]]——文件系统如何组织目录和分配磁盘空间。
