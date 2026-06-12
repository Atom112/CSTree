---
id: web-security
title: Web 安全（XSS, SQL 注入, CSRF）
summary: Web 安全漏洞是 OWASP Top 10 中最常见的安全风险——XSS 注入脚本、SQL 注入操纵数据库、CSRF 伪造用户请求。输入验证和输出编码是防御核心
difficulty: intermediate
order: 4
parent: network-attacks
children:
  - malware-analysis
related: []
prerequisites:
  - network-attacks
tags:
  - security
  - web
  - owasp
createdAt: 2026-06-12
---

## OWASP Top 10 核心漏洞

| 漏洞 | 原理 | 防御 |
|:----:|:----:|:----:|
| **XSS** | 注入恶意脚本 | 输出编码、CSP |
| **SQL 注入** | 拼接 SQL 语句 | 参数化查询 |
| **CSRF** | 跨站请求伪造 | CSRF Token、SameSite Cookie |
| **SSRF** | 服务器端请求伪造 | URL 白名单 |

## 示例

```python
# ❌ 不安全——SQL 注入
query = f"SELECT * FROM users WHERE name='{user_input}'"

# ✅ 安全——参数化查询
query = "SELECT * FROM users WHERE name=?"
cursor.execute(query, (user_input,))
```

## 小结

| 原则 | 说明 |
|:----:|------|
| **永远不信任用户输入** | 验证+过滤+转义 |
| **最小权限** | 数据库账户只给必要权限 |
| **纵深防御** | 不止依赖一层防护 |

**为什么先学这个？** Web 安全后，学习[[malware-analysis|恶意软件分析]]。
