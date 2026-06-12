---
id: ci-cd
title: CI/CD 与 DevOps
summary: CI（持续集成）频繁把代码合并到主分支并自动构建测试，CD（持续部署/交付）自动化部署到生产环境——DevOps 是开发（Dev）和运维（Ops）的文化融合
difficulty: intermediate
order: 9
parent: software-testing
children: []
related: []
prerequisites:
  - software-testing
  - version-control
tags:
  - software-eng
  - devops
  - cicd
createdAt: 2026-06-12
---

## CI/CD 流水线

```
代码提交 → 自动构建 → 自动测试 → 自动部署 → 生产
   ↑                                  ↓
   └──────── 发现问题立即修复 ──────────┘
```

## 工具

| 环节 | 工具 |
|:----:|:----:|
| **版本控制** | Git, GitHub, GitLab |
| **CI 服务器** | GitHub Actions, Jenkins, GitLab CI |
| **容器化** | Docker, Kubernetes |
| **配置管理** | Ansible, Terraform |
| **监控** | Prometheus, Grafana |

**为什么先学这个？** 自动化流程后，需要[[code-review|代码审查与重构]]提升代码质量。
