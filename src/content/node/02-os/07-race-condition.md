---
id: race-condition
title: 竞争条件与临界区
summary: 竞争条件（Race Condition）是多个线程同时访问共享数据时，执行顺序影响结果的"竞速"问题——是并发编程中最常见也最难调试的 Bug 来源
difficulty: intermediate
order: 7
parent: threads
children:
  - mutex-semaphore
related:
  - deadlock
prerequisites:
  - threads
tags:
  - os
  - concurrency
  - race-condition
createdAt: 2026-06-12
---

## 钱为什么对不上？

你和室友共用一张银行卡，余额 1000 元。同时：
- 你在 ATM 取 800 元
- 室友用手机支付 500 元

取款流程：
```
你的操作：
if 余额(1000) >= 800:
    余额 = 1000 - 800  # 余额变成 200
    吐钞

室友的操作：
if 余额(1000) >= 500:
    余额 = 1000 - 500  # 余额变成 500
    扣款成功
```

如果这两个操作**同时发生**：

```
时间 →
你：读取余额 → 1000             你的 if 通过了
你：                              准备扣款 800
室友：       读取余额 → 1000      室友的 if 也通过了！
室友：       写入余额 → 500      室友扣了 500
你：写入余额 → 200               你扣了 800

结果：余额变成了 200
      （银行损失了 500 元——因为实际应该扣 1300，但只扣了 800）
```

这就是**竞争条件（Race Condition）**——多个线程同时访问共享数据，执行顺序不可控，导致结果依赖于"谁先跑到"。

> 🏫 **类比：抢课系统**
> 一门课只剩 1 个名额。你和室友同时刷新选课页面，都看到"余 1 人"，都点了选课——系统没有锁住查询和选课之间的操作，结果两个人都选上了（超员 1 人）。

## 临界区（Critical Section）

**临界区（Critical Section）** 是访问共享资源的代码片段——一次只能有一个线程进入。

```
线程 A                        线程 B
┌─────────────────────┐      ┌─────────────────────┐
│ 非临界区              │      │ 非临界区              │
│   ...                │      │   ...                │
│ ┌─ 临界区 ────────┐ │      │ ┌─ 临界区 ────────┐ │
│ │ 余额 -= 800      │ │      │ │ 余额 -= 500      │ │
│ └─────────────────┘ │      │ └─────────────────┘ │
│ 非临界区              │      │ 非临界区              │
│   ...                │      │   ...                │
└─────────────────────┘      └─────────────────────┘
```

**目标是**：任何时候最多只有一个线程在临界区内。

## 竞争条件的四个条件

要发生竞争条件，必须同时满足：

1. **两个或多个线程**同时执行
2. **共享数据**被多个线程访问
3. **至少一个线程在写**共享数据
4. **访问顺序影响结果**

> 💡 如果所有线程都只读不写，就没有竞争条件。如果每次只有一个线程运行（单核且禁止抢占），也没有竞争条件——但现代 OS 都允许抢占。

## 经典例子：计数器

```c
#include <stdio.h>
#include <pthread.h>

int counter = 0;  // 共享全局变量
#define TIMES 1000000

void* increment(void* arg) {
    for (int i = 0; i < TIMES; i++) {
        counter++;  // ← 这行不是原子的！
    }
    return NULL;
}

int main() {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, increment, NULL);
    pthread_create(&t2, NULL, increment, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    
    printf("期望值: %d\n", 2 * TIMES);   // 2000000
    printf("实际值: %d\n", counter);     // ??? 每次不同
    return 0;
}
```

`counter++` 在底层其实是三条指令：

```asm
; counter++ 实际上是：
mov  rax, [counter]   ; ① 从内存读到寄存器
add  rax, 1           ; ② 寄存器加1
mov  [counter], rax   ; ③ 写回内存
```

两个线程同时执行时可能交错：

```
线程 1                         线程 2
① 读 counter (0)
                               ① 读 counter (0)
② 加 1 → rax = 1
                               ② 加 1 → rax = 1
③ 写回 counter = 1
                               ③ 写回 counter = 1

结果：counter = 1（丢失了一次累加！）
```

> 💡 **这就是为什么并发 Bug 难以复现**——两条指令交错需要在极其精确的时间窗口内发生。你可能跑 100 次程序都没问题，第 101 次就出错了。

## 竞争条件的后果

| 后果 | 表现 |
|------|------|
| **数据不一致** | 计数器少计、余额不对 |
| **程序崩溃** | 指针在检查和使用之间被其他线程改了 |
| **安全漏洞** | TOCTOU（Time of Check to Time of Use）攻击 |
| **死锁** | 因竞争条件导致的资源争用 |

### TOCTOU 漏洞

```c
// 检查文件权限
if (access("/etc/passwd", W_OK) == 0) {  // ① 检查
    // ⚠️ 恶意程序在这里替换文件！
    fd = open("/etc/passwd", O_WRONLY);  // ② 使用
    write(fd, ...);
}
```

在 ① 检查权限和 ② 打开文件之间，攻击者用符号链接把文件指向了别的地方——经典的竞争条件安全漏洞。

## 如何解决竞争条件？

解决竞争条件的核心思想：**让临界区互斥执行**。

### 方案 1：锁（互斥）

```c
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void* increment(void* arg) {
    for (int i = 0; i < TIMES; i++) {
        pthread_mutex_lock(&lock);      // 加锁
        counter++;                       // 临界区
        pthread_mutex_unlock(&lock);    // 解锁
    }
    return NULL;
}
```

### 方案 2：原子操作

```c
#include <stdatomic.h>

atomic_int counter = 0;

void* increment(void* arg) {
    for (int i = 0; i < TIMES; i++) {
        atomic_fetch_add(&counter, 1);  // 硬件级的原子操作
    }
    return NULL;
}
```

### 方案 3：避免共享

```c
// 每个线程有独立的计数器，最后汇总
void* increment(void* arg) {
    int* local = (int*)arg;
    for (int i = 0; i < TIMES; i++) {
        (*local)++;
    }
    return NULL;
}
```

| 方案 | 原理 | 适用场景 |
|------|------|---------|
| **互斥锁** | 软件互斥，简单通用 | 绝大多数场景 |
| **原子操作** | 硬件保证，零开销 | 简单计数器、标志位 |
| **避免共享** | 根本没共享就没竞争 | 数据可以分片时 |

## 如何发现竞争条件

### 静态分析
```bash
# ThreadSanitizer——编译时插桩检测
gcc -fsanitize=thread -g -o program program.c
./program
```

### 动态检测
```bash
# Helgrind（Valgrind 工具）
valgrind --tool=helgrind ./program
```

### 压力测试
```bash
# 多次重复运行，增加触发概率
for i in {1..100}; do ./program || echo "第 $i 次发现问题！"; done
```

## 小结

| 概念 | 要点 |
|------|------|
| **竞争条件** | 多线程访问共享数据，执行顺序影响结果 |
| **临界区** | 访问共享资源的代码段，一次只能一个线程执行 |
| **发生条件** | 多线程 + 共享数据 + 至少一个在写 + 顺序敏感 |
| **非原子性** | `counter++` 在底层是三条指令，可被中断 |
| **解决方案** | 互斥锁、原子操作、避免共享 |
| **检测工具** | ThreadSanitizer、Helgrind、压力测试 |

**为什么先学这个？** 理解了竞争条件，你就知道为什么需要[[mutex-semaphore|互斥锁与信号量]]——下一节看看操作系统提供了哪些机制来确保临界区的互斥执行。
