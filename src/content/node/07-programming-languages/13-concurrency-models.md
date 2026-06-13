---
id: concurrency-models
title: 并发编程模型（Actor, CSP）
summary: 并发模型解决了"多个执行流怎么协作"的问题——Actor 模型通过消息传递（Erlang、Akka），CSP 通过通道（Go、Clojure），共享内存通过锁（Java、C++）
difficulty: advanced
order: 13
parent: garbage-collection
children: []
related:
  - mutex-semaphore
prerequisites:
  - garbage-collection
tags:
  - pl
  - concurrency
  - actor
  - csp
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 👥 "多人协作"的不同方式

你和室友一起做一顿饭。有三种合作方式：

**方式一（共享内存）**：你们共用一块案板、一把菜刀。你切菜时室友必须等着，室友用刀时你必须等着。怕冲突，你们定了一个规则——"谁先用刀谁拿着，用完了放回去"（用锁保护共享资源）。

**方式二（Actor）**：你们各自用自己的菜板和刀，各做各的菜。需要交换食材时——你把胡萝卜递给他（发消息），他把土豆递给你（收消息）。你们不共享任何工具，只通过"递东西"沟通。

**方式三（CSP）**：你们之间有一根"传送带"。你把切好的菜放在传送带上，室友从传送带上取走。你们不直接接触，不共享工具——只通过传送带（通道）沟通。

这三种方式对应了三种主要的**并发编程模型**。

> 📐 **并发（Concurrency）** ≠ **并行（Parallelism）**：
> - 并发是"逻辑上同时处理多个任务"——就像一个人同时做几件事（一会切菜，一会炒菜）
> - 并行是"物理上同时执行"——多个人各做各的事

---

## 🔐 模型一：共享内存 + 锁（Shared Memory + Locks）

**核心思想**：多个线程共享同一块内存，通过**锁（Lock）** 来保护共享数据。

```java
// Java——共享内存 + 锁
public class BankAccount {
    private int balance = 0;
    
    // synchronized = 一次只有一个线程能执行这个方法
    public synchronized void deposit(int amount) {
        balance += amount;  // 临界区
    }
    
    public synchronized void withdraw(int amount) {
        if (balance >= amount) {
            balance -= amount;
        }
    }
}
```

**优点**：
- 直观——和单线程编程方式类似
- 性能好（竞争不激烈时）
- 直接映射到硬件（CPU 原子指令）

**问题**：
- **死锁（Deadlock）**：A 等 B，B 等 A——互相等待，永远卡住
- **竞争条件（Race Condition）**：不加锁或锁范围不对，数据被同时修改
- **难以推理**：多线程的执行顺序不确定，bug 可能只在特定时机出现

```java
// 死锁的经典例子
class DeadlockExample {
    Object lock1 = new Object();
    Object lock2 = new Object();
    
    void method1() {
        synchronized(lock1) {
            synchronized(lock2) {  // 等 lock2
                // ...
            }
        }
    }
    
    void method2() {
        synchronized(lock2) {
            synchronized(lock1) {  // 等 lock1
                // ...
            }
        }
    }
    // 如果 method1 和 method2 同时被不同线程调用
    // → 死锁：method1 持有 lock1 等 lock2
    //     method2 持有 lock2 等 lock1
}
```

> 🚗 **类比：十字路口的红绿灯**
>
> 共享内存 = 没有红绿灯的多车道路口——四个方向的车都可以走。为了避免撞车，你要"加锁"：看左边没车就左转，看右边没车就右转。
>
> 如果每个司机都守规矩（正确加锁），运行良好。但如果一个司机误判了（忘了锁），就可能出事故（数据竞争）。

---

## 💌 模型二：Actor 模型

**核心思想**：万物皆 Actor——每个 Actor 有自己的状态和邮箱（Mailbox）。Actor 之间通过**异步消息**通信，不共享任何状态。

```scala
// Akka（Scala/Java 的 Actor 框架）
class BankAccount extends Actor {
    var balance = 0
    
    def receive = {
        case Deposit(amount) =>
            balance += amount
            sender() ! "ok"  // 回复消息
        case Withdraw(amount) if balance >= amount =>
            balance -= amount
            sender() ! "ok"
        case Withdraw(_) =>
            sender() ! "insufficient_funds"
        case GetBalance =>
            sender() ! balance
    }
}
```

**Actor 的特性**：
1. **封装**：Actor 内部状态不共享——只能通过消息修改
2. **异步通信**：发消息不阻塞，收消息在邮箱中排队
3. **每个 Actor 依次处理消息**：同一个 Actor 内部不会并发

**Actor 的使用场景**：Erlang/Elixir 的 Actor 模型是电信级系统的基石（传说中 99.9999999% 可用性）：

```elixir
# Elixir——Actor 模型（Erlang VM）
defmodule BankAccount do
  def start(balance) do
    spawn(fn -> loop(balance) end)
  end
  
  def loop(balance) do
    receive do
      {:deposit, amount, caller} ->
        send(caller, :ok)
        loop(balance + amount)    # 递归：新状态
      {:withdraw, amount, caller} when balance >= amount ->
        send(caller, :ok)
        loop(balance - amount)
      {:get_balance, caller} ->
        send(caller, balance)
        loop(balance)
    end
  end
end
```

> 📬 **类比：办公室里的员工"
>
> 每个员工坐在自己的工位上（Actor），有自己的文件堆（状态）。员工不能直接去改别人的文件（不共享状态）。如果想协调工作——写便签（消息）传过去。
>
> 每个员工一次只看一张便签（按消息顺序处理），处理完再看下一张。如果某个员工忙不过来（消息队列变长）——你可以多招几个员工（创建更多 Actor）。

---

## 🔄 模型三：CSP（Communicating Sequential Processes）

**核心思想**：多个**进程**（轻量级线程）通过**通道（Channel）** 通信。和 Actor 不同：CSP 的通信是**同步的**（发消息的人等接收者准备好）。

```go
// Go——CSP 模型（goroutine + channel）

func main() {
    // 创建通道
    ch := make(chan int)
    
    // 启动一个 goroutine（轻量级进程）
    go func() {
        result := 42
        ch <- result  // 发送到通道（会阻塞直到有人接收）
    }()
    
    value := <-ch  // 从通道接收（会阻塞直到有人发送）
    fmt.Println(value)  // 42
}
```

**Go 的并发哲学**：

> "Do not communicate by sharing memory; instead, share memory by communicating."
> ——"不要通过共享内存来通信，而要通过通信来共享内存。"

```go
// Go——用 channel 实现"工作池"
func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        results <- job * 2  // 处理任务，发结果
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    // 启动 3 个 worker
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // 发 5 个任务
    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)
    
    // 收集结果
    for r := 1; r <= 5; r++ {
        <-results
    }
}
```

**CSP vs Actor 的关键区别**：

| 特性 | Actor | CSP |
|:----:|:----:|:---:|
| **通信方式** | 异步（发完就继续） | 同步（会阻塞等待对方）|
| **"地址"** | 每个 Actor 有地址 | 通过通道（无地址）|
| **消息队列** | 每个 Actor 自带邮箱 | 通道独立于进程 |
| **耦合度** | 发送者知道接收者 | 发送者只知道通道 |

---

## 📊 三种模型对比

| 模型 | 核心 | 状态管理 | 通信方式 | 代表语言 |
|:----:|:----:|:--------:|:--------:|:--------:|
| **共享内存+锁** | 多线程共享变量 | 锁保护 | 直接读写共享变量 | Java、C++、Python |
| **Actor** | 无共享状态 | 封装在 Actor 内 | 异步消息 | Erlang、Elixir、Akka |
| **CSP** | 通道连接进程 | 各进程独立 | 同步通道 | Go、Clojure |

```python
# Python 三种方式都能写（但都不是"原生"的）
# 共享内存：threading + Lock
# Actor：第三方库 pykka
# CSP：第三方库 py-csp
```

**实际选择指南**：
- 需要**高性能计算**（大量 CPU 密集型）→ 共享内存 + 锁（直接利用多核）
- 需要**高可用分布式系统**（电信、游戏服务器）→ Actor（容错性好）
- 需要**清晰的数据流**（微服务、管道）→ CSP（通道让数据流可视化）

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **共享内存+锁** | 多线程共享数据，用锁互斥——直接但容易出错 |
| **Actor 模型** | 万物皆 Actor——通过消息通信，不共享状态（Erlang/Elixir）|
| **CSP** | 进程通过通道通信——"不通过共享内存通信，而是通过通信共享内存"|
| **死锁** | A 等 B，B 等 A——互相等待 |
| **竞争条件** | 多个线程同时读写共享数据导致结果不确定 |
| **goroutine** | Go 语言的轻量级"协程"——比线程轻量得多 |

> 🎯 **思考题**：在 Actor 模型中，如果 Actor A 给 Actor B 发消息，B 在处理消息时又给 A 发消息——会发生死锁吗？为什么？（提示：Actor 处理消息的方式和锁有什么区别？）

**为什么先学这个？** 并发模型之后，PL 板块的最后一个话题——[[domain-specific-languages|领域特定语言（DSL）]]。
