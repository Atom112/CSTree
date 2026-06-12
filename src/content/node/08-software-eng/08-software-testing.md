---
id: software-testing
title: 软件测试（单元/集成/E2E）
summary: 软件测试是保证代码质量的核心手段——单元测试测函数，集成测试测模块协作，E2E 测试测完整业务流程
difficulty: intermediate
order: 8
parent: solid-principles
children:
  - ci-cd
related: []
prerequisites:
  - solid-principles
tags:
  - software-eng
  - testing
createdAt: 2026-06-12
---

## 测试金字塔

```
     /\           E2E 测试（少）
    /  \          端到端测试用户流程
   /    \
  /______\
 /________\      集成测试（中）
/          \      测试模块间协作
/____________\
|            |    单元测试（多）
| 单元测试    |    测试单个函数/类
|____________|
```

## 测试方法

| 类型 | 范围 | 速度 | 目的 |
|:----:|:----:|:----:|:----:|
| **单元测试** | 函数/方法 | 极快 | 验证逻辑正确 |
| **集成测试** | 模块间 | 中等 | 验证接口协作 |
| **E2E 测试** | 全系统 | 慢 | 验证用户流程 |

**为什么先学这个？** 测试需要自动化——[[ci-cd|CI/CD 与 DevOps]]。
