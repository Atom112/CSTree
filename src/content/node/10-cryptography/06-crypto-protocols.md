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
---

## TLS 握手

```
1. ClientHello — 支持的加密算法、随机数
2. ServerHello — 选定算法、服务器随机数、证书
3. 客户端验证证书 → 生成预主密钥 → 用服务器公钥加密发送
4. 服务器用私钥解密得到预主密钥
5. 双方计算会话密钥
6. 后续通信用对称加密（AES-GCM）
```

## TLS 1.3 改进

| 对比 | TLS 1.2 | TLS 1.3 |
|:----:|:--------:|:--------:|
| 握手次数 | 2-RTT | 1-RTT（或 0-RTT） |
| 加密套件 | 多种组合 | 固定安全套件 |
| 移除 | — | 不安全算法 |

**为什么先学这个？** TLS 是 Web 安全的基石。继续学习[[zero-knowledge-proofs|零知识证明]]。
