---
id: zero-knowledge-proofs
title: 零知识证明
summary: 零知识证明（ZKP）让证明者向验证者证明自己知道某个秘密，而不泄露秘密本身——"我能在不告诉你密码的情况下证明我知道密码"
difficulty: advanced
order: 7
parent: public-key-crypto
children: []
related: []
prerequisites:
  - public-key-crypto
tags:
  - crypto
  - zero-knowledge
createdAt: 2026-06-12
---

## 经典类比：阿里巴巴洞穴

```
证明者知道洞穴深处的咒语——但他可以在不念出咒语的情况下证明自己知道：
1. 验证者站在岔路口
2. 证明者从一条路进洞
3. 验证者喊"从左边出来"
4. 如果证明者真知道咒语，总能从指定方向出来
重复多次——概率证明
```

## 应用

| 场景 | 说明 |
|:----:|------|
| **身份验证** | 不泄露密码就能证明身份 |
| **区块链** | Zcash——隐藏交易金额和发送方 |
| **隐私计算** | 不泄露数据就能验证计算结果 |

**为什么先学这个？** 零知识证明是密码学前沿。学习[[quantum-cryptography|量子密码学]]。
