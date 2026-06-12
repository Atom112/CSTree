---
id: hash-functions
title: 哈希函数（SHA, MD）
summary: 密码学哈希函数把任意长度输入映射为固定长度输出——抗碰撞、单向。SHA-256 是当前标准，MD5 和 SHA-1 已被破解
difficulty: advanced
order: 4
parent: public-key-crypto
children: []
related: []
prerequisites:
  - public-key-crypto
tags:
  - crypto
  - hash
createdAt: 2026-06-12
---

## 哈希的性质

```
输入 "Hello" → SHA256 → 2cf24dba... (64 hex chars)
输入 "Hello " → SHA256 → 5891b5b3...（完全不同！）
输入 "Hello" → SHA256 → 2cf24dba...（相同输入必相同输出）
```

| 性质 | 含义 |
|:----:|------|
| **抗碰撞** | 找不到两个不同输入产生相同哈希 |
| **单向** | 由哈希值反推输入不可行 |
| **雪崩效应** | 输入改一比特，输出一半比特翻转 |

## 应用

| 场景 | 说明 |
|:----:|------|
| **密码存储** | 存哈希不存明文 |
| **文件完整性** | 对比文件哈希是否一致 |
| **数字签名** | 先哈希再签名 |
| **区块链** | 区块链接（Merkle Tree） |

**为什么先学这个？** 哈希函数是[[digital-signatures|数字签名与证书]]的基础。
