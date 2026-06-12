---
id: tlb
title: TLB 与内存映射
summary: TLB（Translation Lookaside Buffer）是 CPU 内部的高速缓存，缓存最近使用的页表项——没有它，每次内存访问都要查 4 次页表，性能直接崩盘
difficulty: advanced
order: 14
parent: paging
children: []
related:
  - virtual-memory
  - cache-memory
prerequisites:
  - paging
tags:
  - os
  - memory
  - tlb
  - mmu
createdAt: 2026-06-12
---

## 查一次地址要访存 4 次？

四级页表查询走完需要：
1. 读取 PML4 页表项 → 1 次内存访问
2. 读取 PDP 页表项 → 1 次内存访问
3. 读取 PD 页表项 → 1 次内存访问
4. 读取 PT 页表项 → 1 次内存访问
5. 访问目标数据 → 1 次内存访问

总共 **5 次内存访问** 才能读一个数据！比单级页表（2 次访问）慢太多了。

**TLB（Translation Lookaside Buffer）** 就是来解决这个问题的——它把最近用过的虚拟页→物理页框映射保存在 CPU 内部的高速缓存中。

> 🏫 **类比：你的微信通讯录**
> 要联系隔壁宿舍的同学，你不用去查全校花名册（四级页表）——你直接打开微信通讯录（TLB）找到他就行。
> 
> 查通讯录 = 1 秒钟。查全校花名册 = 10 分钟（还要跑教务处）。

## TLB 的工作原理

```
虚拟地址 → 检查 TLB
    │
    ├── TLB 命中（Hit）→ 直接拿到物理页框号 → 访问内存
    │
    └── TLB 未命中（Miss）→ 查四级页表
                 │
                 ├── 更新 TLB（加入新的映射）
                 │
                 └── 访问物理内存
```

**TLB 命中率通常超过 99%**——这就是为什么多级页表没拖垮系统性能。

### TLB 结构

```
┌────────┬────────┬──────────┐
│ 虚拟页号│ 物理页框│ 标志位   │
├────────┼────────┼──────────┤
│ 0x12345│ 0x9ABCD│ Valid=1  │
│ 0x67890│ 0x24680│ Valid=1  │
│ ...    │ ...    │ ...      │
│ ...    │ ...    │ ...      │
└────────┴────────┴──────────┘
64-512 个条目（现代 CPU 有数百个）

每个条目存储：
• 虚拟页号（VPN）
• 物理页框号（PPN）
• 有效位
• 保护位（r/w/x）
• ASID（地址空间标识符）
• ... 其他标志
```

> 💡 现代 CPU 有**独立的指令 TLB（iTLB）和数据 TLB（dTLB）**——指令和数据分开缓存，避免竞争。还分 L1 TLB 和 L2 TLB（容量更大但稍慢）。

## TLB 未命中的处理

### 硬件处理（x86）

x86 的 TLB 未命中由 **MMU 硬件自动处理**——它遍历页表，找到物理地址，填充 TLB，整个过程不需要操作系统介入。

```
CPU → TLB 未命中 → 硬件自动遍历页表 → 更新 TLB → 重试
                              ↑
                         不需操作系统参与
```

### 软件处理（一些 RISC 架构）

MIPS 等架构的 TLB 未命中触发异常，操作系统负责查页表并填充 TLB。

```
CPU → TLB 未命中 → 触发 TLB 异常 → OS 查页表 → 写 TLB → 返回重试
                              ↑
                         操作系统参与（更灵活但更慢）
```

## TLB 刷新与 ASID

### 上下文切换时 TLB 怎么办？

切换进程时，新进程的页表完全不同——TLB 中的旧映射必须失效。

```
进程切换 → 切换 CR3（页表基址）
    │
    ├── 方案 A：**全部刷新**（x86 传统做法）
    │    把所有 TLB 条目标记为无效
    │    缺点：切换后大量 TLB 未命中
    │
    └── 方案 B：**ASID（地址空间标识符）**
         每个条目标记所属的进程 ID
         切换后 TLB 保留，只匹配当前 ASID
         TLB 条目 = VPN + ASID → PPN
         不同进程可以用相同 VPN 但不同 ASID
```

```asm
; 普通 CR3 切换（全部刷新 TLB）
mov cr3, rax          ; TLB 全部失效

; 使用 INVPCID 指令选择性刷新（现代 x86）
invpcid eax, 0        ; 刷新指定进程的 TLB
invpcid eax, 1        ; 刷新指定页
invpcid eax, 2        ; 刷新所有
```

> 💡 **ASID** 显著减少了上下文切换后的 TLB 未命中——Linux 内核在 2010 年后支持 ASID，切换进程时不再需要全部刷新 TLB。

### TLB 一致性

当操作系统修改了页表（比如把某个页换出），必须确保 TLB 中的旧映射也失效：

```c
// 修改页表后，刷新对应的 TLB 条目
void unmap_page(struct mm_struct *mm, unsigned long addr) {
    // 1. 清除页表项
    pte_clear(&mm->page_table[addr >> PAGE_SHIFT]);
    
    // 2. 刷新 TLB 中对应的条目
    flush_tlb_page(addr);
    // x86: invlpg 指令刷新单页
    // 或: MOV CR3 刷新全部（一杆子打死）
}
```

## 大页与 TLB 覆盖率

**TLB 覆盖范围** = TLB 条目数 × 页大小

```
4KB 页： 64 个条目 → 覆盖 256KB  → ❌ 太小了
2MB 页： 64 个条目 → 覆盖 128MB  → ✅ 足够了
1GB 页： 64 个条目 → 覆盖 64GB   → ✅ 适合数据库
```

**这就是为什么大页（Huge Pages）能提升性能**——TLB 可以覆盖更大的内存区域，减少未命中。

```bash
# 启用透明大页（Linux）
echo always > /sys/kernel/mm/transparent_hugepage/enabled

# 查看进程的大页使用
$ cat /proc/1234/smaps | grep -i huge
AnonHugePages:      2048 kB
```

**数据库场景**：一个 PostgreSQL 实例可能需要几十 GB 内存。大页让 TLB 覆盖从 256KB → 128MB，TPC-H 基准测试能快 10-20%。

## 内存映射 I/O（mmap）

TLB 还有一个重要用途：**内存映射 I/O**——把文件直接映射到进程的地址空间，读文件就像读内存一样。

```c
#include <sys/mman.h>
#include <fcntl.h>

int fd = open("bigfile.dat", O_RDONLY);
size_t len = 1024 * 1024 * 1024;  // 1GB

// 把 1GB 文件映射到内存
void* addr = mmap(NULL, len, PROT_READ, MAP_PRIVATE, fd, 0);

// 现在可以像访问数组一样访问文件
char c = ((char*)addr)[42];  // 读文件第 42 个字节
// ← 这里会缺页 → OS 从磁盘读入 → TLB 缓存映射 → 下次更快

munmap(addr, len);
close(fd);
```

**mmap 的工作原理：**
1. `mmap()` 在进程的虚拟地址空间中保留一段区域，但不分配物理页
2. 首次访问时触发缺页异常 → OS 从文件读取数据到物理内存 → 创建页表项
3. 页表项被缓存到 TLB → 后续访问像普通内存一样快

> 💡 **内存映射文件**比 `read()`/`write()` 更快的原因是：它绕过了内核缓冲区的复制（不需要从内核缓冲区拷贝到用户缓冲区），并且利用分页机制按需加载。

## 小结

| 概念 | 要点 |
|------|------|
| **TLB** | CPU 内部的页表项缓存，加速地址翻译 |
| **命中率** | >99%，没有 TLB 多级页表不可用 |
| **ASID** | 区分不同进程的 TLB 条目，减少刷新 |
| **大页** | 更大的页 → 更高的 TLB 覆盖率 |
| **mmap** | 利用分页和 TLB 实现高效的文件访问 |
| **TLB 一致性** | 修改页表后要刷新对应的 TLB 条目 |

**为什么先学这个？** TLB 是理解内存性能的关键——为什么大页快、为什么进程切换慢、为什么 mmap 高效。接下来转向文件系统：[[file-system-interface|文件系统接口与实现]]。
