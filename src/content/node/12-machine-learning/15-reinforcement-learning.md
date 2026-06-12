---
id: reinforcement-learning
title: 强化学习（Q-Learning, DQN）
summary: 强化学习中智能体通过与环境交互学习最优策略——奖励驱动。Q-Learning 维护 Q 表评估状态-动作价值，DQN 用神经网络近似 Q 函数
difficulty: advanced
order: 15
parent: transformer
children: []
related: []
prerequisites:
  - neural-network
tags:
  - ml
  - rl
  - q-learning
createdAt: 2026-06-12
---

## 马尔可夫决策过程（MDP）

```
智能体在状态 s 采取动作 a：
→ 转移到新状态 s'
→ 获得奖励 r
→ 目标：最大化累计奖励
```

## Q-Learning

```python
# Q 值更新
Q(s, a) = Q(s, a) + α * (r + γ * max Q(s', a') - Q(s, a))
# α = 学习率, γ = 折扣因子
```

## 小结

| 算法 | 特点 |
|:----:|------|
| **Q-Learning** | 离策略，Q 表 |
| **DQN** | 用神经网络近似 Q 函数 |
| **Policy Gradient** | 直接优化策略 |
| **AlphaGo** | MCTS + 深度 RL |

**为什么先学这个？** RL 后，学习[[nlp|自然语言处理（NLP）]]。
