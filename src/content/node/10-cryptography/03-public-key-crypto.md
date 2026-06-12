---
id: public-key-crypto
title: 公钥密码（RSA, ECC）
summary: 公钥密码用一对密钥——公钥加密、私钥解密，解决了对称加密的密钥分发问题。RSA 基于大整数分解，ECC 基于椭圆曲线离散对数
difficulty: advanced
order: 3
parent: symmetric-crypto
children:
  - hash-functions
  - digital-signatures
  - crypto-protocols
related: []
prerequisites:
  - symmetric-crypto
tags:
  - crypto
  - rsa
  - ecc
createdAt: 2026-06-12
---

## RSA

```python
# RSA 核心
p, q = 大素数
n = p * q
φ(n) = (p-1)(q-1)
选择 e, 计算 d ≡ e⁻¹ mod φ(n)

公钥: (n, e)
私钥: (n, d)

加密: c = m^e mod n
解密: m = c^d mod n
```

## ECC 的优势

| 安全性 | RSA 密钥长度 | ECC 密钥长度 |
|:-----:|:-----------:|:-----------:|
| 80 位 | 1024 位 | 160 位 |
| 128 位 | 3072 位 | 256 位 |
| 256 位 | 15360 位 | 512 位 |

## 小结

| 算法 | 数学基础 | 主要用途 |
|:----:|:--------:|:--------:|
| RSA | 大整数分解 | 加密、签名 |
| ECC | 椭圆曲线 | 签名、密钥交换 |

**为什么先学这个？** 公钥密码是数字签名和证书的基础。学习[[hash-functions|哈希函数（SHA, MD）]]。
