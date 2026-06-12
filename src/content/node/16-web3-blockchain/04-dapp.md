---
id: dapp
title: 去中心化应用（DApp）
summary: DApp 是运行在区块链上的应用——前端 + 智能合约。用户通过钱包签名交易与合约交互，数据存储在链上，不可篡改
difficulty: advanced
order: 4
parent: smart-contracts
children:
  - layer2-scaling
related: []
prerequisites:
  - smart-contracts
tags:
  - blockchain
  - dapp
  - web3
createdAt: 2026-06-12
---

## DApp 架构

```
前端（HTML/JS）←→ 钱包（MetaMask）←→ 智能合约 ←→ 区块链
```

## 技术栈

| 层 | 工具 |
|:---:|:----:|
| **前端** | React, ethers.js, wagmi |
| **钱包** | MetaMask, WalletConnect |
| **合约开发** | Solidity, Hardhat, Foundry |
| **测试网** | Sepolia, Goerli |
| **存储** | IPFS, Arweave |

**为什么先学这个？** DApp 后，学习[[layer2-scaling|Layer2 与扩容方案]]。
