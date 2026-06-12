---
id: http
title: HTTP / HTTPS
summary: HTTP（超文本传输协议）是 Web 的"语言"——浏览器和服务器通过它交换 HTML、图片、API 数据。HTTPS 在 HTTP 上加了一层加密（SSL/TLS），让数据不被窃听
difficulty: intermediate
order: 16
parent: network-layers
children: []
related:
  - dns
  - tcp-handshake
prerequisites:
  - network-layers
  - tcp-handshake
tags:
  - network
  - http
  - https
  - web
createdAt: 2026-06-12
---

## 你每天都在用 HTTP

每一次打开网页、刷新朋友圈、刷短视频——背后都是 HTTP 请求和响应。

> 🏫 **类比：点餐**
> 你（浏览器）看菜单（URL），告诉服务员（HTTP 请求）你要什么。服务员去厨房（服务器）拿来菜（HTTP 响应），放在你桌上。

## HTTP 请求

```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
Accept-Language: zh-CN
```

### 请求方法

| 方法 | 含义 | 示例 |
|:----:|------|------|
| **GET** | 获取资源 | 打开网页、获取数据 |
| **POST** | 提交数据 | 登录、提交表单 |
| **PUT** | 更新资源 | 修改用户信息 |
| **DELETE** | 删除资源 | 删除一篇文章 |
| **PATCH** | 部分更新 | 修改用户头像 URL |
| **HEAD** | 获取响应头 | 检查资源是否存在 |

## HTTP 响应

```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
Set-Cookie: session_id=abc123

<html>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```

### 状态码

| 分类 | 范围 | 含义 | 例子 |
|:----:|:----:|------|------|
| **1xx** | 100-199 | 信息 | 101 Switching Protocols（WebSocket 升级） |
| **2xx** | 200-299 | 成功 | 200 OK, 201 Created |
| **3xx** | 300-399 | 重定向 | 301 Moved Permanently, 302 Found |
| **4xx** | 400-499 | 客户端错误 | 400 Bad Request, 404 Not Found |
| **5xx** | 500-599 | 服务器错误 | 500 Internal Server Error, 502 Bad Gateway |

## HTTP/1.1 → HTTP/2 → HTTP/3

| 版本 | 年份 | 特点 |
|:----:|:----:|------|
| **HTTP/1.1** | 1997 | 每个请求一个 TCP 连接（慢） |
| **HTTP/2** | 2015 | 多路复用（一个 TCP 连接同时发多个请求） |
| **HTTP/3** | 2022 | 基于 QUIC（UDP）——更快的连接建立和更好的拥塞控制 |

## HTTPS——安全的 HTTP

**HTTPS = HTTP + TLS（传输层安全协议）**

```
HTTP：明文传输
你 → [GET /login password=12345] → 服务器
       ↑ 任何人都能看到你的密码！

HTTPS：加密传输
你 → [加密的乱码] → 服务器
       ↑ 即使被截获也看不懂
```

### TLS 握手

```
1. 客户端 → 服务器：支持的加密算法、随机数
2. 服务器 → 客户端：证书（含公钥）、服务器随机数
3. 客户端验证证书是否可信
4. 客户端生成"预主密钥"，用服务器公钥加密后发送
5. 服务器用私钥解密，得到预主密钥
6. 双方用预主密钥算出会话密钥
7. 之后的所有通信都用会话密钥加密
```

> 💡 证书由**证书颁发机构（CA）**签名——浏览器信任 CA，CA 信任网站。这就是"信任链"。

## 小结

| 概念 | 要点 |
|------|------|
| **HTTP** | Web 的应用层协议，请求-响应模型 |
| **状态码** | 1xx~5xx 表示请求结果 |
| **HTTPS** | HTTP + TLS 加密 |
| **TLS 握手** | 证书验证 + 密钥交换 |
| **HTTP/2** | 多路复用、头部压缩 |
| **HTTP/3** | 基于 UDP 的 QUIC 协议 |

**为什么先学这个？** HTTP/HTTPS 是互联网最广泛使用的协议。继续看看[[email-protocols|电子邮件协议（SMTP/POP/IMAP）]]。
