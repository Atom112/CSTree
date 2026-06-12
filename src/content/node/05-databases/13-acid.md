---
id: acid
title: ACID 特性
summary: ACID 是数据库事务的四大特性——原子性（要么全做要么全不做）、一致性（数据总是正确）、隔离性（并发事务互不干扰）、持久性（提交了就永久保存）
difficulty: advanced
order: 13
parent: sql-advanced
children:
  - isolation-levels
  - lock-concurrency
  - logging-recovery
related: []
prerequisites:
  - sql-advanced
tags:
  - database
  - transaction
  - acid
createdAt: 2026-06-12
---

## ACID 是什么？

| 特性 | 含义 | 类比 |
|:----:|------|------|
| **A**tomicity（原子性） | 事务要么全成功，要么全回滚 | 转账：扣钱和加钱要么都做，要么都不做 |
| **C**onsistency（一致性） | 事务前后数据满足所有约束 | 转账后总金额不变 |
| **I**solation（隔离性） | 并发事务互不可见中间状态 | 你转账时别人看到的是转前或转后的余额 |
| **D**urability（持久性） | 提交的事务结果永久保存 | 转账完成后即使断电，钱也不会丢 |

> **事务的性质**：转账 100 元从 A 到 B——要么 A 扣 100 且 B 加 100，要么余额不变。不会出现 A 扣了但 B 没加的情况。

## 实现方式

| 特性 | 实现 |
|:----:|------|
| **原子性** | Undo Log（回滚日志） |
| **持久性** | Redo Log（重做日志）+ WAL（Write-Ahead Logging） |
| **隔离性** | 锁 + MVCC（多版本并发控制） |
| **一致性** | 应用层约束 + 数据库完整性检查 |

## 小结

| 概念 | 要点 |
|------|------|
| **原子性** | All or nothing |
| **一致性** | 数据始终合法 |
| **隔离性** | 并发事务隔离 |
| **持久性** | 提交即永久 |

**为什么先学这个？** ACID 是事务的基础。接下来看看[[isolation-levels|事务隔离级别]]——不同隔离级别的权衡。
