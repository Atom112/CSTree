---
id: crypto-protocols
title: 密码协议（SSL/TLS）
summary: SSL/TLS 是互联网安全传输的基石——在 TCP 之上提供加密、身份验证和完整性保证。握手协议协商密钥，记录协议加密数据
difficulty: advanced
order: 6
parent: public-key-crypto
children: []
related:
  - http
prerequisites:
  - public-key-crypto
tags:
  - crypto
  - ssl
  - tls
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🔒 你在网上的一举一动——如果没有 HTTPS

你在宿舍连了校园网，打开一个 HTTP 网站。

这个校园网里可能有人（或者路由器本身）在做"抓包"——你提交的表单、输入的密码、浏览的页面——全是**明文传输**的。

```
你的电脑                         服务器
  │                                │
  │── POST /login ────────────────→│  密码：zhangsan123
  │  密码：zhangsan123              │   ← 明文！任何人都能看到
  │                                │
```

**SSL/TLS** 就是在 TCP 之上加了一层"安全壳"——所有数据在发送前加密，接收后解密。中间人看到的全是乱码。

> 📐 **SSL（Secure Sockets Layer）** → **TLS（Transport Layer Security）**：SSL 是 90 年代的协议，现在的标准是 TLS（1.2 和 1.3）。

---

## 🤝 TLS 握手——建立安全连接

TLS 握手是"密室搭建"的过程——双方在公开的信道上协商出一个仅他们俩知道的密钥。

### TLS 1.2 握手（4 次消息）

```
客户端                     服务器
  │                          │
  │── ClientHello ──────────→│  支持的加密算法、随机数
  │                          │
  │← ServerHello ───────────│  选定的算法、服务器随机数、证书
  │                          │
  │（客户端验证证书）         │
  │                          │
  │── ClientKeyExchange ────→│  预主密钥（用服务器公钥加密）
  │                          │
  │（双方计算会话密钥）       │
  │                          │
  │── ChangeCipherSpec ─────→│  后续用对称加密
  │── Finished ────────────→│
  │                          │
  │← ChangeCipherSpec ──────│
  │← Finished ─────────────│
  │                          │
  │  =========== 安全通道建立 ============
  │                          │
  │── 加密的 HTTP 数据 ─────→│  用对称密钥加密
```

```python
# 简化理解
session_key = hash(client_random + server_random + pre_master_secret)
# 三者结合的数学推导，使得：
# 1. 只有持有服务器私钥的人能解密 pre_master_secret
# 2. 最终所有通信都用 session_key（AES）加密
# 3. 每次连接使用不同的随机数 → 每次密钥都不同
```

> 🏪 **类比：两个间谍接头**
>
> 两个间谍在街上第一次见面，要用一种方式"建立一个只有他俩知道的密码本"。
>
> 1. A 向 B 打招呼："我用中文还是英文？"（ClientHello——支持的算法）
> 2. B 回复："用中文"加上自己的证件（ServerHello + 证书）
> 3. A 检查证件无误，把一个密码箱（预主密钥）给 B——只有 B 能打开
> 4. 双方根据之前说的语言和密码箱里的内容，建立共享密码本（会话密钥）
>
> 之后所有通信都用这个密码本加密——即使有人听到了前面的对话，没有 B 的私钥也解不开密码箱。

---

## ⚡ TLS 1.3——更快、更安全

TLS 1.3 在 2018 年发布，做了两项关键改进：

### 1. 更快的握手

```
TLS 1.2：2 次往返（2-RTT）才建立连接
TLS 1.3：1 次往返（1-RTT）建立连接
TLS 1.3（恢复）：0-RTT——直接发数据！
```

**怎么做到的？** 客户端在 ClientHello 中**直接猜**服务端会用哪个密钥协商算法——如果猜对了，一次往返就完成握手。

### 2. 更少的选项，更安全

```
TLS 1.2：30+ 种加密套件（很多不安全）
TLS 1.3：5 种加密套件（全部强制安全）

移除：
❌ RSA 密钥交换（不支持前向安全性）
❌ RC4、DES、3DES（已被破解的加密算法）
❌ SHA-1、MD5（已被破解的哈希）
```

**前向安全性（Forward Secrecy）**：即使以后服务器私钥泄露了，以前的所有通信记录仍然安全——因为会话密钥是通过临时密钥协商的，不是由私钥算出的。

---

## 🔐 实际中的 HTTPS

```bash
# 你能确认当前连接使用的是 TLS 1.3
# Chrome → 地址栏 🔒 → 连接是安全的
# 会显示：TLS 1.3  /  AES_128_GCM  /  X25519
#          协议版本    加密算法           密钥交换
```

### 如何配置 HTTPS（网站管理员）？

```bash
# Let's Encrypt——免费的证书
# 用 Certbot 自动获取和更新证书

certbot --nginx -d example.com -d www.example.com
# 证书有了 → HTTPS 配置好了

# nginx 配置参考
server {
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # 只允许安全协议和算法
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **TLS** | TCP 之上的加密层——保护互联网通信 |
| **TLS 握手** | 协商加密算法、验证身份、建立会话密钥 |
| **TLS 1.2** | 2-RTT 握手，30+ 种加密套件 |
| **TLS 1.3** | 1-RTT 握手，5 种强制安全套件 |
| **前向安全性** | 会话密钥用完即弃——私钥泄露也不影响历史通信 |
| **HTTPS** = HTTP + TLS | 浏览器的 🔒 标志 |

> 🎯 **思考题**：如果攻击者能截获和篡改所有网络通信——在 TLS 的保护下，他还能做什么？不能做什么？假设他有一台超级计算机，但没有服务器的私钥。

**为什么先学这个？** TLS 是密码学在互联网中最重要的应用。接下来看看另一个前沿方向——[[zero-knowledge-proofs|零知识证明]]。
