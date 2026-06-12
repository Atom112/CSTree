---
id: mutex-semaphore
title: 互斥锁与信号量
summary: 互斥锁（Mutex）是"一把钥匙开一把锁"，信号量（Semaphore）是"限流栏杆"——它们是操作系统解决并发同步问题的两大经典工具
difficulty: advanced
order: 8
parent: race-condition
children:
  - classic-sync-problems
  - deadlock
related: []
prerequisites:
  - race-condition
tags:
  - os
  - concurrency
  - synchronization
createdAt: 2026-06-12
---

## 怎么让临界区互斥？

上节提到竞争条件需要"互斥执行"来解决——关键问题是：**怎么实现互斥？**

### 软硬件方案的发展

| 方案 | 原理 | 问题 |
|------|------|------|
| **屏蔽中断** | 进临界区前关中断，不许切换 | 单核有效，多核无效；特权指令 |
| **自旋锁** | 循环等待直到锁可用 | 忙等浪费 CPU |
| **互斥锁（Mutex）** | 拿不到锁就休眠 | 需要 OS 支持 |
| **信号量（Semaphore）** | 更通用的同步工具 | 接口复杂容易用错 |

## 互斥锁（Mutex）

**互斥锁（Mutex, Mutual Exclusion）** 是最基本的同步机制——同一时刻只能有一个线程持有锁。

```c
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void* worker(void* arg) {
    pthread_mutex_lock(&lock);      // 尝试获取锁
    // 临界区——一次只有一个线程在这里
    counter++;
    pthread_mutex_unlock(&lock);    // 释放锁
    return NULL;
}
```

> 🏫 **类比：自习室占座卡**
> 自习室门口挂着"空闲"卡。你进去取走卡（上锁），其他人看到没卡就得等着。你出来把卡挂回去（解锁），下一个人才能进。
> 
> Mutex 就是这张卡——谁拿着它，谁就有资格进临界区。

### Mutex 的实现原理

```c
// 简化的 mutex 实现思路
typedef struct {
    int locked;    // 1 = 已锁, 0 = 未锁
    queue_t waiters; // 等待队列
} mutex_t;

void mutex_lock(mutex_t* m) {
    // 原子地检查并设置 locked 位
    while (atomic_exchange(&m->locked, 1) == 1) {
        // 锁已被占用→把自己加入等待队列→让出CPU
        thread_sleep(&m->waiters);
    }
}

void mutex_unlock(mutex_t* m) {
    m->locked = 0;
    // 唤醒等待队列中的一个线程
    thread_wakeup(&m->waiters);
}
```

> 💡 `atomic_exchange` 是硬件支持的原子操作——它"交换"一个值并返回旧值，整个过程不可中断。这是所有锁机制的基石。

### Mutex 的类型

| 类型 | 行为 | 适用场景 |
|------|------|---------|
| **普通锁** | 同一线程重复加锁 → 死锁 | 简单同步 |
| **递归锁** | 同一线程可重复加锁 | 递归函数中加锁 |
| **读写锁** | 读读不互斥，读写互斥 | 读多写少的场景 |
| **自旋锁** | 拿不到锁就忙等 | 临界区极短时 |

### 读写锁

```c
pthread_rwlock_t rwlock;

void read_data() {
    pthread_rwlock_rdlock(&rwlock);   // 读锁：多个线程可以同时读
    printf("数据: %d\n", shared_data);
    pthread_rwlock_unlock(&rwlock);
}

void write_data(int val) {
    pthread_rwlock_wrlock(&rwlock);   // 写锁：只有一个线程能写
    shared_data = val;
    pthread_rwlock_unlock(&rwlock);
}
```

> 🏫 **类比：图书馆的阅览室和办公室**
> - **阅览室（读锁）**：可以很多人同时在里面看书
> - **办公室（写锁）**：只能一个人进去办公——他在改文件时别人进去会干扰

## 信号量（Semaphore）

**信号量（Semaphore）** 是 Dijkstra 在 1965 年提出的经典同步工具——它用一个整数计数器和两个原子操作 `P`（等待）和 `V`（发送）来实现同步。

```c
#include <semaphore.h>

sem_t sem;
sem_init(&sem, 0, 3);  // 初始值 = 3

sem_wait(&sem);    // P 操作：信号量 -1，如果为负则阻塞
// ... 临界区 ...
sem_post(&sem);    // V 操作：信号量 +1，唤醒一个等待线程
```

> 🏫 **类比：地铁限流栏杆**
> - 信号量的值 = 当前可用的"通行名额"
> - `sem_wait()` = 刷一次卡（名额-1）——没名额了就等着
> - `sem_post()` = 出来一个人（名额+1）——等的人可以进来了

### 二值信号量 vs 计数信号量

```
二值信号量（初始值 = 1）       计数信号量（初始值 = N）
┌─────┐                      ┌─────┐
│ 值  │  0 或 1               │ 值  │  0 ~ N
│ 作用│  类似 Mutex            │ 作用│  限流（最多 N 个线程）
│ 用例│  保护共享变量           │ 用例│  连接池（最多 5 个连接）
└─────┘                      └─────┘
```

| 特性 | 二值信号量 | 互斥锁（Mutex） |
|------|-----------|----------------|
| **初始值** | 1 | 已解锁 |
| **所有权** | 无（任何线程都可 post） | 有（只有加锁线程可解锁） |
| **典型用途** | 事件通知、同步 | 保护临界区 |

> ⚠️ **关键区别**：Mutex 有"所有权"概念——同一线程必须 lock 和 unlock 成对出现。信号量没有所有权——线程 A 可以 `wait`，线程 B 可以 `post`。这使信号量更灵活，但也更容易出错。

### 信号量的经典用途

#### 1. 限流（控制并发数）

```c
sem_t pool;
sem_init(&pool, 0, 10);  // 最多 10 个并发连接

void handle_request() {
    sem_wait(&pool);       // 获取连接"令牌"
    // 处理请求...
    sem_post(&pool);       // 归还令牌
}
```

#### 2. 同步（生产者-消费者）

```c
sem_t empty;  // 缓冲区中空位的数量
sem_t full;   // 缓冲区中数据的数量
sem_init(&empty, 0, BUF_SIZE);
sem_init(&full, 0, 0);

void producer() {
    sem_wait(&empty);   // 等一个空位
    // 放入数据...
    sem_post(&full);    // 数据量 +1
}

void consumer() {
    sem_wait(&full);    // 等有数据
    // 取出数据...
    sem_post(&empty);   // 空位 +1
}
```

## 条件变量（Condition Variable）

除了 Mutex 和信号量，还有一个常用同步工具：**条件变量**——它让线程在满足某个条件之前休眠。

```c
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;
int ready = 0;

// 等待方
pthread_mutex_lock(&lock);
while (!ready) {
    pthread_cond_wait(&cond, &lock);  // 自动释放锁并休眠
}
// ready 为 true 了，继续执行
pthread_mutex_unlock(&lock);

// 通知方
pthread_mutex_lock(&lock);
ready = 1;
pthread_cond_signal(&cond);  // 唤醒一个等待线程
pthread_mutex_unlock(&lock);
```

> 🏫 **类比：等外卖**
> - **忙等**：每 10 秒去门口看一眼（浪费 CPU）
> - **条件变量**：躺在床上，外卖到了小哥打电话叫醒你

## 锁的选择指南

| 场景 | 推荐工具 | 原因 |
|------|---------|------|
| 保护共享变量 | **Mutex** | 简单、所有权明确 |
| 读多写少 | **读写锁** | 不阻塞读操作 |
| 限流（并发上限） | **计数信号量** | 天然支持 N 个并发 |
| 生产者-消费者 | **信号量** | 计数 + 同步 |
| 等条件满足 | **条件变量** | 避免忙等 |
| 临界区极短 | **自旋锁** | 避免休眠开销 |
| 递归加锁 | **递归锁** | 同一线程可重入 |

## 小结

| 工具 | 核心思想 | 一句话记忆 |
|------|---------|-----------|
| **Mutex** | 独占访问（有所有权） | "我锁了就只能我开" |
| **读写锁** | 读共享、写互斥 | "大家一起看，但要一个一个改" |
| **信号量** | 计数同步（无所有权） | "还剩几张票？" |
| **条件变量** | 条件满足再唤醒 | "好了叫我" |
| **自旋锁** | 循环等待 | "你快点，我在这等" |

**为什么先学这个？** 有了这些同步工具，我们就可以解决实际的并发问题了。下一节看看[[classic-sync-problems|经典同步问题]]——生产者-消费者、哲学家就餐、读者-写者问题。
