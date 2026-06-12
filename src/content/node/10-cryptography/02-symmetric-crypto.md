---
id: symmetric-crypto
title: 对称加密（AES, DES）
summary: 对称加密用同一密钥加密和解密——DES 曾是标准但已被破解，AES 是当前标准。Feistel 结构和 SPN 是两种主要的分组密码设计
difficulty: advanced
order: 2
parent: classical-ciphers
children:
  - public-key-crypto
related: []
prerequisites:
  - classical-ciphers
tags:
  - crypto
  - symmetric
  - aes
createdAt: 2026-06-12
---

## AES——现代加密标准

AES 用 128/192/256 位密钥加密 128 位数据块：

```
步骤：
1. AddRoundKey—密钥异或
2. SubBytes—S 盒替换
3. ShiftRows—行移位
4. MixColumns—列混淆
重复 10/12/14 轮（取决于密钥长度）
```

## 对称加密 vs 非对称

| 对比 | 对称 | 非对称 |
|:----:|:----:|:------:|
| 速度 | 极快 | 慢 1000 倍 |
| 密钥管理 | 共享密钥问题 | 公钥公开，私钥保密 |
| 用途 | 加密大量数据 | 密钥交换、数字签名 |

**为什么先学这个？** 掌握对称加密后，学习[[public-key-crypto|公钥密码（RSA, ECC）]]。
