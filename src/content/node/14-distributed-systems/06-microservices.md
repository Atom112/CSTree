---
id: microservices
title: 微服务架构
summary: 微服务把应用拆分成独立部署的小服务——每个服务专注一件事，独立开发、部署、扩展。服务发现、API 网关、熔断是微服务的关键基础设施
difficulty: advanced
order: 6
parent: message-queues
children:
  - container-orchestration
related: []
prerequisites:
  - distributed-system-models
tags:
  - distributed
  - microservices
  - architecture
createdAt: 2026-06-12
---

## 微服务 vs 单体

```
单体应用：           微服务：
┌──────────┐       ┌──┐ ┌──┐ ┌──┐
│ 用户管理  │       │用户│ │订单│ │支付│
│ 订单管理  │  →    │服务│ │服务│ │服务│
│ 支付      │       └──┘ └──┘ └──┘
│ ── 全部  │        独立部署、独立技术栈
│ 在一个进程│        通过 API 通信
└──────────┘
```

## 关键组件

| 组件 | 作用 | 工具 |
|:----:|:----:|:----:|
| **API 网关** | 统一入口、路由、限流 | Kong, Envoy |
| **服务发现** | 自动注册和发现服务 | Consul, etcd |
| **熔断器** | 防止故障级联 | Resilience4j |
| **分布式追踪** | 链路监控 | Jaeger, Zipkin |

## 小结

| 概念 | 要点 |
|:----:|------|
| **好处** | 独立部署、技术异构、弹性扩展 |
| **挑战** | 分布式复杂性、调试困难、网络开销 |

**为什么先学这个？** 微服务后，学习[[container-orchestration|容器与编排（Docker, K8s）]]。
