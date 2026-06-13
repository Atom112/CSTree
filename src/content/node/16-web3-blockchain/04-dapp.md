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
updatedAt: 2026-06-13
---

## 📱 App vs DApp——什么区别？

普通 App：
```
用户 ←→ 公司的服务器 ←→ 公司的数据库
        ↑ 公司完全控制
```

DApp：
```
用户（钱包）←→ 智能合约 ←→ 区块链
       ↑           ↑ 开源、不可篡改
   用户控制私钥
```

**DApp = 前端 + 智能合约**。前端是一个普通的 Web 页面——但后端不是"自己的服务器"，而是在区块链上运行的智能合约。

---

## 🔧 DApp 技术栈

```
                 ┌──────────────────┐
                 │ 前端 (React, Next) │  ← 用户界面
                 └────────┬─────────┘
                          │ ethers.js / wagmi
                 ┌────────┴─────────┐
                 │ 钱包 (MetaMask)   │  ← 身份 + 签名
                 └────────┬─────────┘
                          │ RPC
                 ┌────────┴─────────┐
                 │ 智能合约 (Solidity)│  ← 业务逻辑
                 └────────┬─────────┘
                          │
                 ┌────────┴─────────┐
                 │ 区块链 (以太坊)    │  ← 数据存储
                 │ + IPFS (文件存储)  │
                 └──────────────────┘
```

```javascript
// 用 ethers.js 连接智能合约
import { ethers } from 'ethers';

// 连接钱包（用户点击 MetaMask）
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// 连接智能合约
const contract = new ethers.Contract(
    contractAddress,    // 合约地址
    contractABI,        // 合约接口定义
    signer
);

// 调用合约函数（这会弹出一个 MetaMask 确认窗口）
const tx = await contract.contribute({ value: ethers.parseEther("0.1") });
await tx.wait();  // 等交易上链
console.log("捐赠成功！");
```

---

## 🏪 DApp vs 传统应用

| 对比 | 传统应用 | DApp |
|:----:|:--------:|:----:|
| **后端** | 公司服务器 | 智能合约（区块链）|
| **数据库** | 公司数据库 | 区块链 + IPFS |
| **身份** | 用户名+密码 | 钱包地址+私钥 |
| **登录** | 输入密码 | 钱包签名（不需要密码）|
| **部署** | 发布到服务器 | 合约部署到链上（不可修改）|
| **停机** | 服务器挂 → 服务停 | 只要链在跑→永不停机 |
| **费用** | 服务器成本由公司付 | 用户付 Gas 费 |
| **审查** | 公司可关闭 | 没人能关 |

---

## 📦 去中心化存储——IPFS

DApp 不能把大量数据直接存到区块链——太贵（每字节都要付 Gas）。大文件（图片、视频）存在 **IPFS（星际文件系统）**。

```javascript
// 用 IPFS 存文件
import { create } from 'ipfs-http-client';

const ipfs = create({ url: 'https://ipfs.infura.io:5001' });

// 上传文件 → 得到一个"内容哈希"
const result = await ipfs.add(fileData);
const cid = result.cid.toString();  // "QmX...Z"

// 把这个 CID 存到智能合约
await contract.setNFTMetadata(cid);
// 其他人通过这个 CID 从 IPFS 下载文件
```

IPFS 不是"一台服务器存文件"——而是**分布式文件系统**：文件按内容寻址（不是按位置），可以被多个节点缓存和提供。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **DApp** | 前端 + 智能合约——去中心化应用 |
| **钱包（MetaMask）** | 管理私钥、签名交易、连接 DApp |
| **ethers.js** | JavaScript 库——让前端和合约交互 |
| **IPFS** | 去中心化文件存储——存大文件（图片、NFT 元数据）|
| **Gas 费** | 用户付——不是公司付 |
| **不可停机** | 只要区块链运行——DApp 就在 |

**为什么先学这个？** DApp 跑在 L1（以太坊主链）上太贵太慢——需要[[layer2-scaling|Layer2 与扩容方案]]。
