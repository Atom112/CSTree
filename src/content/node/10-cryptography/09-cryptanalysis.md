---
id: cryptanalysis
title: 密码分析
summary: 密码分析（Cryptanalysis）是研究如何破解密码系统的科学——从频率分析破解古典密码到侧信道攻击窃取现代密钥，攻防对抗推动密码学发展
difficulty: advanced
order: 9
parent: quantum-cryptography
children: []
related: []
prerequisites:
  - classical-ciphers
  - symmetric-crypto
tags:
  - crypto
  - cryptanalysis
  - attack
createdAt: 2026-06-12
---

## 攻击分类

| 攻击类型 | 攻击者拥有什么 |
|:--------:|---------------|
| **唯密文** | 只截获密文 |
| **已知明文** | 密文+部分明文对 |
| **选择明文** | 可让加密任意明文 |
| **选择密文** | 可让解密任意密文 |

## 侧信道攻击

不直接破解算法——而是利用物理实现泄密：

```
- 时序攻击：加密时间与密钥相关
- 功耗分析：芯片功耗模式泄露密钥
- 电磁攻击：电磁辐射泄露信息
- 缓存攻击：Meltdown/Spectre
```

## 小结

| 攻击 | 目标 | 防御 |
|:----:|:----:|:----:|
| **暴力** | 穷举密钥 | 足够长的密钥 |
| **频率分析** | 替换密码 | 多表替换 |
| **侧信道** | 物理泄露 | 常数时间算法 |
| **量子** | RSA/ECC | 后量子密码 |

**为什么先学这个？** 密码学板块完。进入[[2d-3d-transforms|计算机图形学]]。
