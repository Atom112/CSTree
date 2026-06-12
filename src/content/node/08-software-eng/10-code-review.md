---
id: code-review
title: 代码审查与重构
summary: 代码审查（Code Review）让其他开发者检查你的代码——发现 Bug、提高可读性、分享知识。重构是在不改变外部行为的前提下优化内部结构
difficulty: intermediate
order: 10
parent: ci-cd
children: []
related: []
prerequisites:
  - ci-cd
tags:
  - software-eng
  - code-review
  - refactoring
createdAt: 2026-06-12
---

## 代码审查要点

| 检查项 | 关注点 |
|:------:|--------|
| **正确性** | 逻辑是否对？边缘情况处理？ |
| **可读性** | 命名清晰？注释必要？ |
| **安全性** | 输入验证？SQL 注入？ |
| **性能** | 不必要的循环？缓存缺失？ |
| **测试** | 单元测试覆盖？ |

## 重构手法

| 手法 | 说明 |
|:----:|------|
| **提取函数** | 大函数拆小 |
| **重命名** | 让名字表达意图 |
| **简化条件** | 复杂 if 拆成分支函数 |
| **引入参数对象** | 多参数聚合成对象 |

**为什么先学这个？** 代码质量之后，看看设计——[[api-design|API 设计与 REST]]。
