---
id: quantum-cryptography
title: 量子密码学
summary: 量子计算对经典密码学构成威胁——Shor 算法可以破解 RSA 和 ECC。量子密钥分发（QKD）利用量子力学原理保证通信安全
difficulty: advanced
order: 8
parent: public-key-crypto
children:
  - cryptanalysis
related: []
prerequisites:
  - public-key-crypto
tags:
  - crypto
  - quantum
  - qkd
createdAt: 2026-06-12
---

## 量子威胁

| 算法 | 被什么破解 | 后果 |
|:----:|:----------:|:----:|
| RSA | Shor 算法 | 因式分解多项式时间 |
| ECC | Shor 算法 | 离散对数多项式时间 |
| AES-256 | Grover 算法 | 密钥强度减半（128 位） |

## 后量子密码

NIST 正在标准化抗量子算法：
- **CRYSTALS-Kyber**（密钥封装）
- **CRYSTALS-Dilithium**（数字签名）

**为什么先学这个？** 量子密码学引出[[cryptanalysis|密码分析]]——攻击和防御的对抗。
