---
id: logging-recovery
title: 日志与恢复（Undo/Redo）
summary: WAL（Write-Ahead Logging）是数据库故障恢复的核心——先写日志再写数据。Undo Log 回滚未提交的事务，Redo Log 重做已提交但未写入磁盘的事务
difficulty: advanced
order: 16
parent: acid
children: []
related: []
prerequisites:
  - acid
tags:
  - database
  - logging
  - recovery
createdAt: 2026-06-12
---

## WAL——先写日志，再写数据

**Write-Ahead Logging（预写日志）**规则：在修改数据页之前，先把修改记录写到日志文件。

```
事务提交：
1. 写 Redo Log（记录修改）
2. 写数据页（可能在之后才写）
3. COMMIT

如果写入日志后、写数据页前系统崩溃：
→ 重启后，Redo Log 重放——数据不会丢
```

## Redo Log vs Undo Log

| 日志 | 作用 | 场景 |
|:----:|:----:|------|
| **Redo Log** | 重做已提交但未写盘的事务 | 保证持久性 |
| **Undo Log** | 回滚未提交的事务 | 保证原子性 |

## ARIES 恢复算法

ARIES（Algorithms for Recovery and Isolation Exploiting Semantics）是工业标准的恢复算法：

```
1. 分析阶段：扫描日志，确定哪些事务已提交、哪些未提交
2. REDO 阶段：重做所有已提交但未写盘的修改
3. UNDO 阶段：回滚所有未提交的事务
```

## 小结

| 概念 | 要点 |
|------|------|
| **WAL** | 先写日志再写数据，保证可恢复 |
| **Redo** | 已提交事务的重做 |
| **Undo** | 未提交事务的回滚 |
| **检查点** | 定期把内存中的修改刷入磁盘 |

**为什么先学这个？** 理解恢复机制后，数据库核心内容结束。最后看看[[nosql-databases|NoSQL 数据库概述]]。
