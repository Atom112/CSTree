---
id: isolation-levels
title: 事务隔离级别
summary: 隔离级别在并发性能和正确性之间做权衡——级别越高数据越安全，但并发性能越低。脏读、不可重复读、幻读是隔离级别要解决的三个问题
difficulty: advanced
order: 14
parent: acid
children: []
related:
  - lock-concurrency
prerequisites:
  - acid
tags:
  - database
  - isolation
  - transaction
createdAt: 2026-06-12
---

## 并发事务的三个问题

| 问题 | 说明 | 举例 |
|:----:|------|------|
| **脏读** | 读到其他事务未提交的数据 | A 转钱未提交，B 看到了 |
| **不可重复读** | 同一事务两次读同一行，结果不同 | 读余额→别人改了→再读不同了 |
| **幻读** | 同一事务两次查询，结果集不同 | 读列表→别人插入了新行→第二次多了 |

## 四种隔离级别

```sql
-- 设置隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

| 级别 | 脏读 | 不可重复读 | 幻读 | 性能 |
|:----:|:----:|:---------:|:----:|:----:|
| **READ UNCOMMITTED** | ✅ 可能 | ✅ 可能 | ✅ 可能 | 最高 |
| **READ COMMITTED** | ❌ | ✅ 可能 | ✅ 可能 | ↓ |
| **REPEATABLE READ** | ❌ | ❌ | ✅ 可能 | 中 |
| **SERIALIZABLE** | ❌ | ❌ | ❌ | 最低 |

> 💡 PostgreSQL 默认 READ COMMITTED，MySQL InnoDB 默认 REPEATABLE READ。大部分应用用 READ COMMITTED 就够了。

## 小结

| 隔离级别 | 解决的问题 |
|:--------:|-----------|
| READ UNCOMMITTED | 无 |
| READ COMMITTED | 脏读 |
| REPEATABLE READ | 不可重复读 |
| SERIALIZABLE | 幻读 |

**为什么先学这个？** 隔离级别通过[[lock-concurrency|锁协议与并发控制]]实现。
