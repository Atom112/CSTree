---
id: lock-concurrency
title: 锁协议与并发控制
summary: 数据库用锁和 MVCC（多版本并发控制）来保证并发事务的隔离性——锁防止写冲突，MVCC 让读不阻塞写
difficulty: advanced
order: 15
parent: acid
children: []
related:
  - isolation-levels
prerequisites:
  - acid
tags:
  - database
  - lock
  - concurrency
  - mvcc
createdAt: 2026-06-12
---

## 锁的类型

| 锁 | 说明 |
|:----:|------|
| **共享锁（S）** | 读锁——多个事务可同时持有 |
| **排他锁（X）** | 写锁——只能一个事务持有 |

## 两阶段锁（2PL）

```
事务的锁操作分为两个阶段：
1. 加锁阶段：只能加锁，不能解锁
2. 解锁阶段：只能解锁，不能加锁
```

## MVCC——读不阻塞写

**MVCC（Multi-Version Concurrency Control）**——每个事务看到的是数据的一个"快照"，读操作不需要加锁：

```
事务 A：BEGIN; SELECT * FROM accounts WHERE id=1; → 100
事务 B：UPDATE accounts SET balance=200 WHERE id=1; COMMIT;
事务 A：SELECT * FROM accounts WHERE id=1; → 100（自己的快照）
```

## 小结

| 概念 | 要点 |
|------|------|
| **2PL** | 两阶段锁，保证可串行化 |
| **死锁** | 数据库自动检测并杀死一个事务 |
| **MVCC** | 读不阻塞写，写不阻塞读 |

**为什么先学这个？** 并发控制之后，学习故障恢复——[[logging-recovery|日志与恢复（Undo/Redo）]]。
