---
id: classical-ciphers
title: 古典密码（凯撒、维吉尼亚）
summary: 古典密码是早期加密方法——凯撒密码把字母按固定位移替换，维吉尼亚密码用关键词决定每位位移。它们已被现代密码学取代，但核心思想（替换+置换）沿用至今
difficulty: intermediate
order: 1
parent:
children:
  - symmetric-crypto
related: []
prerequisites: []
tags:
  - crypto
  - classical
createdAt: 2026-06-12
---

## 凯撒密码

```
明文：HELLO
密钥：3
密文：KHOOR

每个字母向后移 3 位：
A→D, B→E, C→F, ..., X→A, Y→B, Z→C
```

## 维吉尼亚密码

```
明文：HELLO
密钥：KEY
加密：H+ K→R, E+ E→I, L+ Y→J, L+ K→V, O+ E→S
密文：RIJVS
```

## 小结

| 密码 | 原理 | 破解方法 |
|:----:|:----:|:--------:|
| **凯撒** | 固定移位 | 暴力穷举（最多 25 种） |
| **维吉尼亚** | 关键词变位 | Kasiski 测试找密钥长度 |

**为什么先学这个？** 古典密码是理解现代密码的起点。接下来学习[[symmetric-crypto|对称加密（AES, DES）]]。
