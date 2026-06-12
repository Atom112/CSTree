---
id: deadlock
title: 死锁（Deadlock）
summary: 死锁（Deadlock）是两个或多个线程互相等待对方释放资源，导致所有线程都无法继续执行的"僵局"——就像两个人面对面让路，你往左他往右，谁也过不去
difficulty: advanced
order: 10
parent: mutex-semaphore
children: []
related:
  - classic-sync-problems
prerequisites:
  - mutex-semaphore
tags:
  - os
  - deadlock
  - concurrency
createdAt: 2026-06-12
---

## 死锁是什么？

```c
// 线程 1                         // 线程 2
lock(&A);                         lock(&B);
// ...                              ...
lock(&B);  // ← 等 B              lock(&A);  // ← 等 A
```

线程 1 拿着 A 等 B，线程 2 拿着 B 等 A——两个都在等对方释放，谁也无法继续。

> 🏫 **类比：十字路口的"四辆车"死锁**
> 四个方向各来一辆车，每辆车都停在了路口中央，等着右边的车先走：
> ```
>   ↑A
> ←D  →B
>   ↓C
> ```
> A 等 C 走，C 等 B 走，B 等 D 走，D 等 A 走——谁都不让，全部卡死。

## 死锁的四个必要条件

**同时满足**这四个条件才会发生死锁：

### 1. 互斥（Mutual Exclusion）
资源一次只能被一个线程占用。
> 💡 如果资源可以共享（如只读数据），就不会有互斥等待。

### 2. 持有并等待（Hold and Wait）
线程拿着一些资源，同时在等另一些资源。
> 🏫 你占着一个座位，还去占另一个座位——别人想坐任何一个都不行。

### 3. 不可抢占（No Preemption）
资源不能被强制夺走，只能由持有者主动释放。
> 💡 如果可以强行拿走，死锁就被"破坏"了——但可能导致数据不一致。

### 4. 循环等待（Circular Wait）
存在一个线程-资源的循环链：T1 等 T2 的资源，T2 等 T3 的资源，...，Tn 等 T1 的资源。

```
      T1 ──→ 资源 A ─── T2
       ↑                   │
       │                    │
       │                    ↓
     资源 D              资源 B
       ↑                   │
       │                    │
       │                    ↓
      T4 ←── 资源 C ─── T3
```

> 💡 **破坏任意一个条件**，死锁就不会发生。

## 死锁预防（设计时解决）

通过破坏四个必要条件之一来预防死锁：

### 方案 1：破坏"持有并等待"

要求线程**一次性请求所有需要的资源**：

```c
// 坏：先拿 A 再拿 B，可能死锁
void transfer(Account* from, Account* to, int amount) {
    lock(&from->lock);
    lock(&to->lock);    // ← 可能在等
    // ...
}

// 好：一次获取所有锁（要么全拿，要么不拿）
void transfer(Account* from, Account* to, int amount) {
    while (true) {
        lock(&from->lock);
        if (trylock(&to->lock)) {  // trylock 不阻塞
            break;  // 两个锁都拿到了
        }
        unlock(&from->lock);  // 让出已拿到的锁
        // 过一会儿再试
    }
}
```

**缺点**：资源利用率低——可能拿到了暂时不用的资源，其他人想用也用不了。

### 方案 2：破坏"不可抢占"

允许操作系统**强行回收**资源——进程拿不到所需资源时，必须释放已占有的资源。

**缺点**：强制回收可能导致数据不一致，实现复杂。

### 方案 3：破坏"循环等待"

给所有资源编号，**要求线程按编号顺序请求资源**：

```c
// 坏：不同顺序可能死锁
lock(&account_a);  // 先锁 A
lock(&account_b);  // 再锁 B

lock(&account_b);  // 另一线程先锁 B
lock(&account_a);  // 再锁 A → 死锁！

// 好：按同一顺序（按地址大小排序）
void transfer(Account* from, Account* to, int amount) {
    // 总是先锁地址小的账户
    if (from < to) {
        lock(&from->lock);
        lock(&to->lock);
    } else {
        lock(&to->lock);
        lock(&from->lock);
    }
    from->balance -= amount;
    to->balance += amount;
    unlock(&to->lock);
    unlock(&from->lock);
}
```

> 💡 这是最实用的预防方法——Linux 内核的内存分配、数据库的事务锁都使用"固定顺序上锁"策略。

## 死锁避免（运行时决策）

**银行家算法（Banker's Algorithm）**——Dijkstra 提出的经典死锁避免算法：

### 类比：银行会不会借钱给所有人？

银行有 1000 万可用资金。三家企业各需要不同额度的贷款：

```
企业   已贷   还需   总额
A     300万  200万  500万
B     200万  400万  600万
C     400万  100万  500万
```

银行手上有 1000 - (300+200+400) = 100 万可用。

**问题**：现在如果 C 再申请 100 万——银行借不借？

**银行家算法说：** 先假设借了，看看系统是否还处于"安全状态"——即所有企业最终都能完成。

```
借给 C 100 万后的情况：
可用 = 0
C 还需 0 万 → C 可以完成 → 释放 500 万
可用 = 500 万 → A 还需 200 万 → A 可以完成 → 释放 500 万
可用 = 1000 万 → B 还需 400 万 → B 可以完成 ✅

安全！可以借。
```

```c
// 银行家算法的核心数据结构
int available[m];    // 每种资源的可用数量
int max[n][m];       // 每个进程对每种资源的最大需求
int allocation[n][m]; // 每个进程当前已分配的资源
int need[n][m];      // 每个进程还需要的资源

bool is_safe_state() {
    int work[m] = available;
    bool finish[n] = {false};
    
    // 找一个能完成的进程
    for (int k = 0; k < n; k++) {
        bool found = false;
        for (int i = 0; i < n; i++) {
            if (!finish[i]) {
                bool can = true;
                for (int j = 0; j < m; j++) {
                    if (need[i][j] > work[j]) { can = false; break; }
                }
                if (can) {
                    // 模拟这个进程完成
                    for (int j = 0; j < m; j++)
                        work[j] += allocation[i][j];
                    finish[i] = true;
                    found = true;
                }
            }
        }
        if (!found) break;  // 找不到能完成的进程
    }
    
    // 检查是否所有进程都能完成
    for (int i = 0; i < n; i++)
        if (!finish[i]) return false;
    return true;
}
```

**缺点**：需要预知每个进程的最大资源需求——实际系统中很难做到。

## 死锁检测与恢复

如果既不预防也不避免，那就只能**检测并恢复**：

### 检测

操作系统定期检查资源分配图中是否有循环：

```
资源分配图：
T1 ───→ R1
 ↑      │
 │      ↓
 R2 ←── T2
```

可以用拓扑排序检测循环。有循环 → 死锁。

### 恢复

1. **终止进程**：杀死死锁中的某个进程，释放其资源
2. **抢占资源**：强制回收某些进程的资源，分给其他进程

> 💡 实际操作系统（Linux、Windows）**通常不预防也不完全避免死锁**——因为预防的成本太高（资源利用率下降）。它们提供死锁检测工具，主要由程序员在应用层确保不会死锁。

## 实际场景中的死锁

### 数据库事务死锁

```sql
-- 事务 1                          -- 事务 2
BEGIN;                             BEGIN;
UPDATE accounts SET balance=balance UPDATE accounts SET balance=balance
  -100 WHERE id=1;  -- 锁 id=1      -100 WHERE id=2;  -- 锁 id=2
UPDATE accounts SET balance=balance UPDATE accounts SET balance=balance
  +100 WHERE id=2;  -- 等 id=2      +100 WHERE id=1;  -- 等 id=1
COMMIT;                            COMMIT;

-- 互不相让！数据库检测到死锁后，会杀死其中一个事务：
ERROR: deadlock detected
DETAIL: Process 1234 waits for ShareLock on transaction 5678; 
         Process 5678 waits for ShareLock on transaction 1234.
HINT: See server log for query details.
```

### 加锁顺序不一致

```java
// 错误示范
synchronized(objA) {
    synchronized(objB) { ... }
}

// 另一处
synchronized(objB) {
    synchronized(objA) { ... }  // 死锁！
}
```

### 回调中的锁

```c
void handler() {
    lock(&mutex);
    // 调用回调函数——可能不小心也锁了同一个 mutex
    callback();  // ← 如果 callback 也锁了这个 mutex → 死锁
    unlock(&mutex);
}
```

## 避免死锁的工程实践

| 实践 | 说明 |
|------|------|
| **固定加锁顺序** | 所有线程按同一顺序获取锁 |
| **超时机制** | 用 `trylock` 设置超时，拿不到就放弃重试 |
| **缩小锁范围** | 临界区越小，死锁概率越低 |
| **锁层次化** | 给锁编号，不按顺序加锁就报错 |
| **死锁检测工具** | WITNESS（FreeBSD）、Lockdep（Linux） |

```c
// 超时机制示例
struct timespec timeout = {0, 100000000};  // 100ms
if (pthread_mutex_timedlock(&lock, &timeout) == 0) {
    // 拿到了锁
    // ...
    pthread_mutex_unlock(&lock);
} else {
    // 超时了——避免死锁
    // 放弃已有资源，重试
}
```

## 小结

| 概念 | 要点 |
|------|------|
| **死锁定义** | 多线程互相等待对方释放资源，全部无法执行 |
| **四个必要条件** | 互斥 + 持有并等待 + 不可抢占 + 循环等待 |
| **预防** | 破坏任意一个必要条件（如固定加锁顺序） |
| **避免** | 银行家算法（运行时判断是否安全） |
| **检测** | 资源分配图循环检测 |
| **工程最佳实践** | 固定顺序、超时、死锁检测工具 |

**为什么先学这个？** 死锁是并发编程中最严重的错误之一——理解了它，你在设计多线程程序时才能避开这个陷阱。接下来从 CPU 调度转向内存管理，看看[[memory-address-space|内存地址空间]]。
