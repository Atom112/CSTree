---
id: digital-signatures
title: 数字签名与证书
summary: 数字签名用私钥签名、公钥验签——保证数据的完整性和来源可信。数字证书（X.509）把公钥和身份绑定起来，由 CA 签发
difficulty: advanced
order: 5
parent: public-key-crypto
children: []
related:
  - crypto-protocols
prerequisites:
  - public-key-crypto
tags:
  - crypto
  - signature
  - pki
createdAt: 2026-06-12
---

## 数字签名

```
签名：hash(文档) → 用私钥加密 hash → 签名
验证：用公钥解密签名 → 得到 hash1 → 对比文档 hash2
一致则签名有效
```

## PKI 体系

```
CA（根证书）→ 签发中间 CA → 签发服务器证书
                   ↓
浏览器信任根 CA → 验证整个证书链
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **签名** | 私钥签名，公钥验证 |
| **证书** | 把公钥绑定到身份 |
| **CA** | 受信任的证书签发机构 |

**为什么先学这个？** 签名和证书是[[crypto-protocols|密码协议（SSL/TLS）]]的基础。
