---
id: entanglement-bell
title: 量子纠缠与贝尔不等式
summary: 量子纠缠是两个 qubit 之间存在非经典关联——测量一个 qubit 瞬间影响另一个，无论距离多远。贝尔不等式验证了量子力学不是"局域隐变量"理论
difficulty: advanced
order: 2
parent: qubit-gates
children:
  - quantum-algorithms
related: []
prerequisites:
  - qubit-gates
tags:
  - quantum
  - entanglement
createdAt: 2026-06-12
---

## 纠缠态

```
|Φ⁺⟩ = 1/√2 (|00⟩ + |11⟩)

测量第一个 qubit → 如果是 |0⟩，第二个也必是 |0⟩
                  如果是 |1⟩，第二个也必是 |1⟩
                  （即使两个 qubit 相隔光年）
```

## EPR 佯谬

Einstein 称量子纠缠为"鬼魅般的超距作用"——他相信存在隐变量。贝尔不等式提供了实验验证的方法，实验证明量子力学是正确的。

## 小结

| 概念 | 要点 |
|:----:|------|
| **纠缠** | 两 qubit 的非经典关联 |
| **贝尔不等式** | 实验排除隐变量理论 |
| **应用** | 量子密钥分发、量子隐形传态 |

**为什么先学这个？** 纠缠后，学习[[quantum-algorithms|量子算法（Grover, Shor）]]。
