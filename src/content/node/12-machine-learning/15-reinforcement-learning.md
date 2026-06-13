---
id: reinforcement-learning
title: 强化学习（Q-Learning, DQN）
summary: 强化学习让智能体在环境中通过"试错"学习——做动作获得奖励，目标是最大化总奖励。Q-Learning 学习动作价值函数，DQN 用神经网络近似 Q 函数
difficulty: advanced
order: 15
parent: transformer
children: []
related: []
prerequisites:
  - neural-network
tags:
  - dl
  - rl
  - q-learning
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🎮 训练 AI 打游戏——完全靠"试"

你训练一只小狗：做对了给零食，做错了没奖励。狗狗慢慢学会了"坐下→有零食"。

**强化学习（Reinforcement Learning, RL）** 就是这种"试错学习"——智能体（Agent）在环境（Environment）中做动作（Action），获得奖励（Reward），目标最大化总奖励。

> 📐 **四个关键元素**：
> - **智能体（Agent）**：做决策的程序
> - **环境（Environment）**：智能体所处的世界
> - **动作（Action）**：智能体能做的事情
> - **奖励（Reward）**：做得好给的分数

---

## 📋 Q-Learning——"这张状态下这个动作有多好"

**Q 函数** Q(s, a) = 在状态 s 下做动作 a，后面**能获得的总奖励**。

```python
# Q-Learning 核心更新公式
# 每次"经验"后更新 Q 值：
Q[s][a] = Q[s][a] + α * (r + γ * max(Q[s'][a']) - Q[s][a])

# α = 学习率（学多快）
# γ = 折扣因子（未来的奖励值多少）
# r = 当前动作得到的奖励
# max(Q[s'][a']) = 新状态下能获得的最大未来奖励

# 简单说：新的 Q = 旧的 Q + α × (当前奖励 + 未来奖励 - 旧的 Q)
```

**Q 表**：把所有"状态×动作"的 Q 值存在一个表里。但状态太多时（比如围棋 10¹⁷⁰ 种状态）——表太大，存不下。

---

## 🧠 DQN——用神经网络代替 Q 表

DQN（Deep Q-Network）的改进：**用神经网络来近似 Q 函数**——输入状态，输出每个动作的 Q 值。

```python
import torch.nn as nn

class DQN(nn.Module):
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, action_dim)  # 输出：每个动作的 Q 值
        )
    
    def forward(self, state):
        return self.net(state)  # → 所有动作的 Q 值

# 训练 DQN：
# 1. 观察当前状态 s
# 2. 选 Q 值最大的动作 a（或随机探索）
# 3. 执行 a，得到奖励 r 和新状态 s'
# 4. 把 (s, a, r, s') 存入"经验池"
# 5. 从经验池随机采样训练 DQN
```

**关键技巧**：
- **经验回放（Experience Replay）**：存历史经验，随机采样训练——打破时间相关性
- **ε-贪婪探索**：以 ε 概率选随机动作（探索新策略），1-ε 概率选最优动作（利用已知策略）

---

## 🏆 经典成果

```
AlphaGo（2016）：RL + 蒙特卡洛树搜索 → 打败围棋世界冠军
AlphaFold（2020）：RL 用于蛋白质结构预测
ChatGPT（RLHF）：RL + 人类反馈 → 对齐人类偏好

RLHF（Reinforcement Learning from Human Feedback）：
1. 训练一个"奖励模型"——预测人类会喜欢什么回答
2. 用 RL 训练大模型——最大化这个奖励
这就是 ChatGPT 对话能力的关键训练步骤
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **强化学习** | 试错学习——做动作→获奖励→优化策略 |
| **Q-Learning** | 学习"每个状态下每个动作有多好" |
| **DQN** | 用神经网络近似 Q 函数——处理大状态空间 |
| **RLHF** | 用人类反馈训练奖励模型——ChatGPT 的关键技术 |
| **探索 vs 利用** | 应该尝试新动作（探索）还是选已知好动作（利用）？|

**为什么先学这个？** RL 是"决策"——和"理解""生成"一起构成 AI 的三大能力。看看 AI 在具体领域的应用——[[nlp|自然语言处理（NLP）]]。
