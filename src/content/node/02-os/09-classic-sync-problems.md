---
id: classic-sync-problems
title: 经典同步问题
summary: 生产者-消费者、读者-写者、哲学家就餐——这三个经典问题是并发同步的"面试题"，掌握它们就掌握了 Mutex、信号量和条件变量的实战用法
difficulty: advanced
order: 9
parent: mutex-semaphore
children: []
related:
  - deadlock
prerequisites:
  - mutex-semaphore
tags:
  - os
  - concurrency
  - synchronization
createdAt: 2026-06-12
---

## 为什么学经典问题？

并发同步的难点不在于 API，而在于**怎么设计**——这三个经典问题覆盖了最常见的同步模式：

| 问题 | 核心模式 | 用在真实哪里 |
|------|---------|-------------|
| **生产者-消费者** | 有界缓冲区同步 | 消息队列、管道、流处理 |
| **读者-写者** | 读多写少互斥 | 数据库缓存、配置中心 |
| **哲学家就餐** | 资源竞争与死锁 | 任何多资源加锁场景 |

## 问题 1：生产者-消费者（Producer-Consumer）

### 问题描述

有一个固定大小的缓冲区。生产者往缓冲区放数据，消费者从缓冲区取数据。要求：
- 缓冲区满时生产者不能继续放
- 缓冲区空时消费者不能取
- 数据不错乱（不出现两个生产者同时写到同一个位置）

> 🏫 **类比：奶茶店操作台**
> - 操作台上有 5 个位置能做奶茶（固定缓冲区）
> - 店员（生产者）做好的奶茶放操作台上
> - 取餐员（消费者）从操作台上拿走奶茶给顾客
> - 操作台满了就不能再做（生产者等待）
> - 操作台空了取餐员就等着（消费者等待）

### 解决方案——信号量版

```c
#define BUF_SIZE 5
int buffer[BUF_SIZE];
int in = 0, out = 0;

sem_t empty;  // 空位数量
sem_t full;   // 满位（数据）数量
sem_t mutex;  // 保护 buffer 索引

void init() {
    sem_init(&empty, 0, BUF_SIZE);  // 初始 5 个空位
    sem_init(&full, 0, 0);          // 初始 0 个数据
    sem_init(&mutex, 0, 1);         // 二值信号量当 Mutex
}

void producer() {
    while (1) {
        int item = produce_item();
        
        sem_wait(&empty);   // 拿一个空位（若无空位则阻塞）
        sem_wait(&mutex);   // 锁住 buffer 索引
        
        buffer[in] = item;
        in = (in + 1) % BUF_SIZE;
        
        sem_post(&mutex);   // 解锁
        sem_post(&full);    // 数据量 +1
    }
}

void consumer() {
    while (1) {
        sem_wait(&full);    // 拿一个数据（若无数据则阻塞）
        sem_wait(&mutex);   // 锁住 buffer 索引
        
        int item = buffer[out];
        out = (out + 1) % BUF_SIZE;
        
        sem_post(&mutex);   // 解锁
        sem_post(&empty);   // 空位 +1
        
        consume_item(item);
    }
}
```

> 💡 `sem_wait(&empty)` 和 `sem_wait(&full)` 的顺序很重要——先等"资源"再等"Mutex"。如果反过来（先等 Mutex 再等资源），可能出现死锁：消费者拿着 Mutex 等 full 信号量，生产者想放数据但拿不到 Mutex。

### 要点分析

```
缓冲区的状态变化：
初始：empty=5, full=0
                  ↓ 生产者放 3 个
      empty=2, full=3
                  ↓ 消费者取 2 个
      empty=4, full=1
                  ↓ 生产者放 4 个（只剩 1 个空位了）
      empty=0, full=5  ← 生产者第 4 个被阻塞
                  ↓ 消费者取 1 个
      empty=1, full=4  ← 生产者被唤醒
```

## 问题 2：读者-写者（Readers-Writers）

### 问题描述

多个读者可以同时读共享数据，但写者必须独占访问——写着写的时候谁都不能读，读者读的时候不能写。

> 🏫 **类比：微信群**
> - **群公告（写）**：管理员改群公告时，其他人不能同时改也不能看旧公告
> - **看群公告（读）**：所有人都能同时看，但管理员改的时候等大家都看完了再改

### 解决方案——读者优先

```c
pthread_rwlock_t rwlock = PTHREAD_RWLOCK_INITIALIZER;

void reader() {
    while (1) {
        pthread_rwlock_rdlock(&rwlock);  // 读锁：多个读者不互斥
        read_data();
        pthread_rwlock_unlock(&rwlock);
    }
}

void writer() {
    while (1) {
        pthread_rwlock_wrlock(&rwlock);  // 写锁：独占
        write_data();
        pthread_rwlock_unlock(&rwlock);
    }
}
```

用信号量的手写版本：

```c
sem_t resource;   // 控制写者互斥
sem_t read_count_mutex;  // 保护 readers 计数
int readers = 0;

void reader() {
    sem_wait(&read_count_mutex);
    readers++;
    if (readers == 1) sem_wait(&resource);  // 第一个读者→阻止写者
    sem_post(&read_count_mutex);
    
    read_data();
    
    sem_wait(&read_count_mutex);
    readers--;
    if (readers == 0) sem_post(&resource);  // 最后一个读者→允许写者
    sem_post(&read_count_mutex);
}

void writer() {
    sem_wait(&resource);  // 等所有读者结束
    write_data();
    sem_post(&resource);
}
```

> ⚠️ **读者优先的代价**：只要有读者持续到来，写者可能永远等不到——写者"饿死"。解决方案是"写者优先"或"公平读写锁"。

## 问题 3：哲学家就餐（Dining Philosophers）

### 问题描述

五位哲学家坐在圆桌前，每人面前有一盘意面。每两人之间有一根筷子。哲学家要么在思考，要么在吃饭。吃饭需要同时拿起左右两根筷子。

```
        哲学家 0
      ╱      ╲
   筷子 0    筷子 4
   ╱              ╲
哲学家 1          哲学家 4
   ╲              ╱
   筷子 1    筷子 3
      ╲      ╱
        哲学家 2 — 筷子 2 — 哲学家 3
```

**问题**：如果每个哲学家都拿起左手的筷子，然后等右手的筷子——就会**死锁**，所有人都吃不上。

> 🏫 **类比：五人聚餐**
> 五个人围一桌，每人左手边有一瓶啤酒。规则是必须同时有左右两瓶啤酒才能喝。如果每个人都拿起左边的啤酒等右边的——所有人都在等，没人能喝。

### 解决方案——破坏死锁条件

#### 方案 A：最多允许 4 个人同时拿起筷子

```c
sem_t chopsticks[5];
sem_t max_diners;  // 初始值 = 4

void philosopher(int i) {
    while (1) {
        think();
        
        sem_wait(&max_diners);          // 限制并发数
        sem_wait(&chopsticks[i]);       // 拿左手筷子
        sem_wait(&chopsticks[(i+1)%5]); // 拿右手筷子
        
        eat();
        
        sem_post(&chopsticks[i]);       // 放左手
        sem_post(&chopsticks[(i+1)%5]); // 放右手
        sem_post(&max_diners);          // 释放名额
    }
}
```

#### 方案 B：拿筷子的顺序不同（奇数位先左后右，偶数位先右后左）

```c
void philosopher(int i) {
    while (1) {
        think();
        
        if (i % 2 == 0) {
            sem_wait(&chopsticks[i]);           // 左
            sem_wait(&chopsticks[(i+1)%5]);     // 右
        } else {
            sem_wait(&chopsticks[(i+1)%5]);     // 右
            sem_wait(&chopsticks[i]);           // 左
        }
        
        eat();
        
        sem_post(&chopsticks[i]);
        sem_post(&chopsticks[(i+1)%5]);
    }
}
```

> 💡 方案 B 破坏了死锁的循环等待条件——因为最后一个哲学家拿起右边筷子时，他左边的筷子可能已被邻座拿了，但他不拿右边的，所以不会出现所有人各拿一根互相等的局面。

## 三个问题的规律总结

| 问题 | 关键难点 | 解决方案核心 |
|------|---------|-------------|
| **生产者-消费者** | 缓冲区满/空的条件同步 | 两个计数信号量 + Mutex |
| **读者-写者** | 读不互斥、写互斥 | 读者计数 + 写锁 |
| **哲学家就餐** | 避免死锁 | 破坏循环等待条件或限制并发 |

**设计同步方案的基本步骤：**
1. 识别**共享资源**（缓冲区、数据、筷子）
2. 识别**同步约束**（满不写、空不读、写独占、读共享）
3. 选择合适的**同步原语**（Mutex、信号量、条件变量）
4. 检查**死锁**和**饥饿**

## 小结

| 问题 | 一句话总结 |
|------|-----------|
| **生产者-消费者** | 信号量管理缓冲区空位和数据计数 |
| **读者-写者** | 读锁不互斥，写锁独占 |
| **哲学家就餐** | 资源竞争陷阱，破坏循环等待条件 |

**为什么先学这个？** 这三个问题覆盖了并发同步的基本模式——理解了它们，你就能应对绝大多数实际并发场景。接下来看看并发中的"终极陷阱"：[[deadlock|死锁（Deadlock）]]。
