---
id: mlops
title: MLOps 与模型部署
summary: MLOps 把 DevOps 实践应用到机器学习——实验追踪、模型版本管理、CI/CD 训练、模型服务、监控和漂移检测
difficulty: advanced
order: 18
parent: computer-vision
children:
  - ai-ethics
related: []
prerequisites:
  - computer-vision
tags:
  - ml
  - mlops
  - deployment
createdAt: 2026-06-12
---

## MLOps 生命周期

```
数据采集 → 实验 → 训练 → 评估 → 部署 → 监控
  ↑                                       │
  └───────────────────────────────────────┘
               反馈循环
```

## 工具

| 阶段 | 工具 |
|:----:|:----:|
| **实验追踪** | MLflow, Weights & Biases |
| **模型训练** | PyTorch, TensorFlow |
| **模型服务** | Triton, TorchServe, BentoML |
| **特征存储** | Feast, Tecton |
| **监控** | Prometheus + Grafana, Evidently |

## 小结

| 概念 | 要点 |
|:----:|------|
| **漂移检测** | 数据/概念分布变化报警 |
| **A/B 测试** | 新模型与旧模型对比 |
| **模型版本** | 回滚、金丝雀发布 |

**为什么先学这个？** 最后学习[[ai-ethics|AI 伦理与公平性]]。
