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
updatedAt: 2026-06-13
---

## 🍜 每一次打开网页——都是一次"点餐"

你在浏览器输入 `www.baidu.com`，按下回车——几毫秒后页面出现了。

这个过程中，你的浏览器（客户端）和百度服务器之间进行了一次**HTTP 会话**——就像你去餐厅吃饭：

```
你（浏览器）→ 看菜单（输入 URL）
你 → 告诉服务员你要什么（发送 HTTP 请求）
服务员 → 去厨房拿菜（服务器处理请求）
服务员 → 把菜端到你桌上（返回 HTTP 响应）
```

> 📐 **HTTP（HyperText Transfer Protocol，超文本传输协议）** 是 Web 的"语言"——定义了客户端和服务器之间怎么请求和响应。

---

## 📤 HTTP 请求——"我要什么"

浏览器每次请求，发给服务器的内容：

```
GET /index.html HTTP/1.1           ← 请求行（方法 + 路径 + 版本）
Host: www.example.com               ← 请求头（键值对）
User-Agent: Mozilla/5.0
Accept: text/html
Accept-Language: zh-CN
Cookie: session_id=abc123
                                    ← 空行
（请求体——GET 没有，POST 才有）    ← 请求体（可选）
```

### 请求方法

| 方法 | 含义 | 是否幂等 | 是否有请求体 |
|:----:|------|:--------:|:----------:|
| **GET** | 获取资源 | ✅ | ❌ |
| **POST** | 提交数据 | ❌ | ✅ |
| **PUT** | 整体替换 | ✅ | ✅ |
| **PATCH** | 部分修改 | ❌ | ✅ |
| **DELETE** | 删除资源 | ✅ | 可选 |
| **HEAD** | 只获取响应头 | ✅ | ❌ |

> 💡 **幂等** = 多次执行和一次执行效果相同。GET 请求 10 次和 1 次一样（不会改变服务器状态）。POST 提交 10 次订单——你会下 10 个订单（不幂等）。

---

## 📥 HTTP 响应——服务器的回复

```
HTTP/1.1 200 OK                     ← 状态行（版本 + 状态码 + 原因短语）
Content-Type: text/html              ← 响应头
Content-Length: 1234
Set-Cookie: session_id=abc123
Cache-Control: max-age=3600
                                    ← 空行
<html>                               ← 响应体（实际数据）
  <body>
    <h1>欢迎！</h1>
  </body>
</html>
```

### 状态码分类

| 范围 | 类别 | 含义 | 常见例子 |
|:----:|:----:|:----|:---------|
| **1xx** | 信息 | 请求已收到，继续处理 | 101 Switching Protocols（WebSocket 升级）|
| **2xx** | 成功 | 请求成功处理 | **200 OK**、**201 Created**、204 No Content |
| **3xx** | 重定向 | 需要进一步操作 | **301 Moved Permanently**、**302 Found**、304 Not Modified |
| **4xx** | 客户端错误 | 请求有问题 | **400 Bad Request**、**401 Unauthorized**、**403 Forbidden**、**404 Not Found** |
| **5xx** | 服务器错误 | 服务器出问题 | **500 Internal Server Error**、502 Bad Gateway、503 Service Unavailable |

---

## 🔒 HTTPS——加密的 HTTP

HTTP 是明文传输的——你连了公共 WiFi 登录网站，密码在空气中裸奔。

**HTTPS = HTTP + TLS（加密层）**：

```
HTTP： 你能看到的内容 → 明文传输 → 服务器
HTTPS：你能看到的内容 → 加密 → 服务器（中间人看到乱码）
```

HTTPS 握手过程（简化的 TLS 1.3）：

```
1. 客户端 → 服务器：我要建立安全连接，支持这些加密算法
2. 服务器 → 客户端：选了这个算法，这是我的证书（含公钥）
3. 客户端验证证书→ 协商出对称密钥
4. 后续通信对称加密（AES-GCM）
```

---

## 📋 HTTP 版本演进

| 版本 | 年份 | 关键改进 | 特点 |
|:----:|:----:|---------|:----:|
| **HTTP/1.1** | 1997 | 持久连接、管道 | 仍是最广泛使用 |
| **HTTP/2** | 2015 | 多路复用、头部压缩 | 一个 TCP 连接并行传输 |
| **HTTP/3** | 2022 | 基于 QUIC（UDP）| 减少连接延迟，解决 TCP 队头阻塞 |

```python
# HTTP/2 的一个关键改进：多路复用
# HTTP/1.1：请求 A → 等响应 A → 请求 B → 等响应 B → ...
# HTTP/2：请求 A → 请求 B → 请求 C → ...
#          ← 响应 B ← 响应 A ← 响应 C（一个连接并行）
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **HTTP** | Web 的通信协议——请求 + 响应模式 |
| **GET vs POST** | GET 取资源（幂等），POST 提交数据（不幂等）|
| **状态码** | 2xx(成功)、3xx(重定向)、4xx(客户端错)、5xx(服务器错)|
| **HTTPS** | HTTP + TLS 加密——防窃听、防篡改 |
| **HTTP/2** | 多路复用——一个连接同时传多个请求 |
| **HTTP/3** | 基于 QUIC(UDP)——解决 TCP 队头阻塞 |

**为什么先学这个？** HTTP 是 Web 的基础。下一个看看[[dns|DNS 域名系统]]——怎么把 `baidu.com` 变成 IP 地址。
