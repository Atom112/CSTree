---
id: blockchain-data-structure
title: 区块链数据结构（Merkle Tree）
summary: 区块链是一个不断增长的"区块"链——每个区块链接到前一个区块的哈希。Merkle Tree 把区块中的交易组织成树状哈希结构，高效验证交易完整性
difficulty: advanced
order: 1
parent:
children:
  - pow-consensus
related: []
prerequisites: []
tags:
  - blockchain
  - merkle
  - crypto
createdAt: 2026-06-12
---

## 区块结构

```
┌─────────────────────────┐
│ 区块头                   │
│   - 前块哈希             │ ← 链接到上一个块
│   - Merkle Root         │ ← 所有交易的哈希根
│   - 时间戳               │
│   - Nonce               │ ← 工作量证明
│   - 难度目标             │
├─────────────────────────┤
│ 交易列表（Merkle Tree）   │
└─────────────────────────┘
```

## Merkle Tree

```
         Root
        /    \
      H12    H34
     /  \    /  \
   H1   H2 H3   H4
   │    │  │    │
   tx1 tx2 tx3 tx4

验证 tx3 是否在区块中：只需要 H4、H12、Root——O(log n)
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **哈希链** | 每个区块指向前一个区块的哈希 |
| **Merkle Tree** | 高效验证交易存在性 |
| **不可篡改** | 修改任何交易会改变所有后续哈希 |

**为什么先学这个？** 了解结构后，学习[[pow-consensus|工作量证明与共识]]。
