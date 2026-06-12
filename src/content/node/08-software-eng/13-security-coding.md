---
id: security-coding
title: 安全编程实践
summary: 安全编程（Secure Coding）是编写不易受攻击的代码——输入验证、输出编码、最小权限、纵深防御是四条基本原则
difficulty: advanced
order: 13
parent: software-lifecycle
children:
  - performance-tuning
related: []
prerequisites:
  - software-lifecycle
tags:
  - software-eng
  - security
  - secure-coding
createdAt: 2026-06-12
---

## 常见安全漏洞

| 漏洞 | 说明 | 防御 |
|:----:|------|:----:|
| **SQL 注入** | 拼接 SQL 字符串 | 参数化查询 |
| **XSS** | 注入恶意脚本 | 输出编码 |
| **CSRF** | 跨站请求伪造 | CSRF Token |
| **路径遍历** | 访问不该访问的文件 | 输入白名单 |

## 安全原则

```
- 最小权限：只给必要的权限
- 纵深防御：多层安全，不依赖单层
- 永不信任用户输入：验证+过滤+转义
- HTTPS：传输加密
```

**为什么先学这个？** 安全之后，最后一个主题——[[performance-tuning|性能分析与调优]]。
