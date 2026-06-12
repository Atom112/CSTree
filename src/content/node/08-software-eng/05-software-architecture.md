---
id: software-architecture
title: 软件架构与设计模式
summary: 软件架构（Software Architecture）是系统的"骨架"——模块划分、组件关系、通信方式。设计模式（Design Pattern）是常见问题的可复用解决方案
difficulty: advanced
order: 5
parent: requirements-analysis
children:
  - uml-modeling
  - solid-principles
related: []
prerequisites:
  - requirements-analysis
tags:
  - software-eng
  - architecture
  - design-patterns
createdAt: 2026-06-12
---

## 架构风格

| 风格 | 特点 | 例子 |
|:----:|:----:|:----:|
| **分层架构** | 按层划分（表现层/业务层/数据层） | 大多 Web 应用 |
| **微服务** | 独立部署的小服务 | Netflix, Uber |
| **事件驱动** | 组件通过事件通信 | Kafka, 消息队列 |

## 设计模式

| 模式 | 目的 | 适用 |
|:----:|:----:|:----:|
| **单例** | 全局唯一实例 | 配置管理 |
| **工厂** | 创建对象 | 多种产品族 |
| **观察者** | 事件通知 | GUI 事件处理 |
| **策略** | 算法替换 | 多种排序、支付方式 |

**为什么先学这个？** 架构设计后，使用[[uml-modeling|UML 建模]]表达设计。
