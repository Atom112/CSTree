---
id: uml-modeling
title: UML 建模
summary: UML（统一建模语言）是用图形表达软件设计的标准语言——类图描述结构，时序图描述交互，用例图描述需求
difficulty: intermediate
order: 6
parent: software-architecture
children: []
related: []
prerequisites:
  - software-architecture
tags:
  - software-eng
  - uml
createdAt: 2026-06-12
---

## 常用 UML 图

| 类型 | 用途 | 元素 |
|:----:|:----:|:----:|
| **类图** | 类及其关系 | 类、属性、方法、关系线 |
| **时序图** | 对象间交互顺序 | 生命线、消息、激活条 |
| **用例图** | 系统功能 | 用例、角色、边界 |
| **活动图** | 业务流程 | 动作、分支、并行 |

## 类图关系

```
继承：  ──▷  实线三角箭头
实现：  - -▷  虚线三角箭头
关联：  ───→ 实线箭头
依赖：  - -→ 虚线箭头
聚合：  ──◇  空心菱形（整体-部分）
组合：  ──◆  实心菱形（更强整体-部分）
```

**为什么先学这个？** UML 表达设计后，需要[[solid-principles|SOLID 原则]]保证设计质量。
