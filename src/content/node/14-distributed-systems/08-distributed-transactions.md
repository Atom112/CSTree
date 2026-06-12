---
id: distributed-transactions
title: 分布式事务（2PC, Saga）
summary: 分布式事务跨越多个节点——2PC（两阶段提交）用协调者保证所有节点全提交或全回滚，但阻塞。Saga 把长事务拆分为子事务+补偿操作
difficulty: advanced
order: 8
parent: container-orchestration
children: []
related: []
prerequisites:
  - distributed-system-models
tags:
  - distributed
  - transactions
  - saga
createdAt: 2026-06-12
---

## 2PC——两阶段提交

```
阶段 1（准备）：协调者问所有参与者"能提交吗？"
阶段 2（提交）：如果全部答"能"→提交；任一个"不能"→回滚
```

## Saga

```
Saga 把事务拆成多个子事务 T₁, T₂, ..., Tₙ
每个子事务 Tᵢ 有补偿操作 Cᵢ

如果 T₃ 失败：
执行 T₁, T₂ → 执行 C₂, C₁（补偿）
```

## 小结

| 方案 | 一致性 | 可用性 | 适用 |
|:----:|:------:|:-----:|:----:|
| **2PC** | 强一致 | 低（阻塞） | 短事务 |
| **TCC** | 强一致 | 中 | 支付场景 |
| **Saga** | 最终一致 | 高 | 长事务 |

**为什么先学这个？** 分布式系统板块完。进入量子计算板块。
