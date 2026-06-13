---
id: microservices
title: 微服务架构
summary: 微服务把单体应用拆成独立小服务——每个服务独立开发、部署、扩展。服务发现、API 网关、配置中心、链路追踪是微服务架构的关键组件
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
updatedAt: 2026-06-13
---

## 🏪 一个超市 vs 商业街

**单体应用（Monolith）** = 大型超市——什么东西都在一栋楼里。生鲜、日用品、电器都在同一栋楼——进出方便，但重新装修要关掉整个超市。

**微服务（Microservices）** = 商业街——独立的水果店、药店、面包店各开各的。一家店装修不影响其他店；面包店生意好了可以单独多雇人（独立扩展）；

> 📐 **微服务定义**：把应用拆分成多个**独立部署的小服务**，每个服务负责一个业务领域，通过轻量级 API（HTTP/RPC）通信。

---

## 📊 单体 vs 微服务

| 对比 | 单体应用 | 微服务 |
|:----:|:--------:|:-------:|
| **代码库** | 一个仓库 | 每个服务独立仓库 |
| **部署** | 整体部署 | 独立部署 |
| **扩展** | 整体扩展（全或都不）| 只扩展瓶颈服务 |
| **技术栈** | 统一技术栈 | 各服务可选不同语言 |
| **团队** | 大团队共同维护 | 小团队各自负责 |
| **故障影响** | 一个 Bug 拖垮整个系统 | 一个服务挂了不影响其他 |

```python
# 单体应用
mymonolith/
├── controllers/
│   ├── user_controller.py
│   ├── order_controller.py
│   └── payment_controller.py
├── models/
├── services/
└── main.py
# 部署：一个 main.py 跑所有功能

# 微服务
services/
├── user-service/     # 独立部署
├── order-service/    # 独立部署
├── payment-service/  # 独立部署
└── notification-service/  # 独立部署
# 部署：每个 service 各自跑
```

---

## 🔧 微服务的关键组件

### ① API 网关——统一入口

```
客户端（App/浏览器）
    │
    ▼
┌──────────────┐
│  API Gateway   │  ← 统一入口：路由、认证、限流、日志
└───────┬───────┘
    │       │       │
    ▼       ▼       ▼
 用户服务  订单服务  支付服务
```

### ② 服务发现——怎么找到彼此

微服务的 IP 地址是动态的（扩容时飘忽不定），不能写死在配置文件里。

```python
# 服务发现：服务启动时注册到注册中心
# 调用方从注册中心查"订单服务的地址在哪"

# Consul——服务注册与发现
$ consul members
Node         Address         Status
order-svc-1  10.0.0.5:8080   alive  ← 自动注册
order-svc-2  10.0.0.6:8080   alive
```

### ③ 分布式追踪——一个请求经过了哪些服务？

一个用户请求可能经过：API 网关 → 用户服务 → 订单服务 → 支付服务 → 通知服务。

某个环节慢了——你怎么知道是哪个服务的问题？

```python
# Jaeger/Zipkin——分布式追踪
# 每个请求分配一个 Trace ID
# 经过每个服务时记录 Span（起止时间）
# 可视化看到："哦，支付服务花了 2 秒——瓶颈在这"

# Trace ID: abc123
# Gateway → User → Order → Payment → Notification
#          5ms     50ms    2000ms    30ms
```

---

## 🏢 微服务的挑战

| 挑战 | 说明 |
|:----:|------|
| **分布式复杂性** | 网络延迟、部分失败、重试——比单机复杂得多 |
| **数据一致性** | 各服务有自己的数据库——跨服务事务需要 Saga |
| **运维成本** | 部署 10 个服务比部署 1 个麻烦 10 倍 |
| **调试困难** | 一个 Bug 可能跨多个服务——追查困难 |
| **服务间通信** | HTTP 慢还是 gRPC 快？重试策略怎么设计？|

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **微服务** | 独立部署的小服务——各司其职 |
| **API 网关** | 统一入口——路由、认证、限流 |
| **服务发现** | 动态找到其他服务的地址 |
| **分布式追踪** | Trace ID 追踪请求经过的所有服务 |
| **挑战** | 分布式复杂性、数据一致性、运维成本 |

**为什么先学这个？** 微服务每个服务运行在容器中——需要[[container-orchestration|容器与编排（Docker, K8s）]]管理。
