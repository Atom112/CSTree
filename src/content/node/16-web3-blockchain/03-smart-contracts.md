---
id: smart-contracts
title: 智能合约
summary: 智能合约（Smart Contract）是运行在区块链上的自动执行程序——代码即法律。Solidity 是以太坊智能合约的主要语言，Gas 是执行合约的"燃料"
difficulty: advanced
order: 3
parent: pow-consensus
children:
  - dapp
related: []
prerequisites:
  - blockchain-data-structure
tags:
  - blockchain
  - solidity
  - contract
createdAt: 2026-06-12
---

## Solidity 示例

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private data;
    
    function set(uint256 x) public {
        data = x;
    }
    
    function get() public view returns (uint256) {
        return data;
    }
}
```

## Gas

```
每笔交易消耗 Gas——防止无限循环和滥用
Gas = Gas Used × Gas Price
Gas Price 以 Gwei 为单位（1 ETH = 10⁹ Gwei）
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **EVM** | 以太坊虚拟机，执行智能合约 |
| **Gas** | 计算资源定价单位 |
| **ERC-20** | 代币标准 |
| **ERC-721** | NFT 标准 |

**为什么先学这个？** 合约后，学习[[dapp|去中心化应用（DApp）]]。
