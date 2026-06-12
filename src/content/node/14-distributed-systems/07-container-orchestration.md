---
id: container-orchestration
title: 容器与编排（Docker, Kubernetes）
summary: 容器（Container）轻量级虚拟化——共享宿主机内核，但隔离进程和文件系统。Kubernetes 自动管理容器的部署、扩缩容、服务发现、负载均衡
difficulty: advanced
order: 7
parent: microservices
children:
  - distributed-transactions
related: []
prerequisites:
  - microservices
tags:
  - distributed
  - docker
  - kubernetes
createdAt: 2026-06-12
---

## 容器 vs 虚拟机

```
虚拟机：       容器：
┌──────────┐  ┌──────────┐
│ 应用 A   │  │ 应用 A   │
│ 完整 OS  │  │ 共享内核  │
│ 虚拟硬件  │  │ 隔离进程  │
└──────────┘  └──────────┘
  重量级        轻量级
  启动分钟      启动毫秒
  GB 级         MB 级
```

## Kubernetes 核心概念

| 概念 | 说明 |
|:----:|------|
| **Pod** | 最小的部署单元，一个或多个容器 |
| **Service** | 固定 IP+DNS，负载均衡到 Pod |
| **Deployment** | 声明式 Pod 管理（滚动更新） |
| **ConfigMap** | 配置注入 |
| **PV/PVC** | 持久化存储 |

## 小结

| 工具 | 用途 |
|:----:|------|
| **Docker** | 构建和运行容器 |
| **K8s** | 编排和管理容器集群 |
| **Helm** | K8s 包管理 |

**为什么先学这个？** 容器后，学习[[distributed-transactions|分布式事务（2PC, Saga）]]。
