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
updatedAt: 2026-06-13
---

## 🤖 "自动售货机"——不需要人管

你投币、按按钮——售货机自动给你一瓶可乐。不需要店员、不需要人工确认。

**智能合约**就是这个逻辑——**部署在区块链上、自动执行的程序**。

```
传统合约：
甲方和乙方签合同 → 如果有纠纷 → 找法官/律师 → 执行

智能合约：
部署到区块链 → 条件满足时自动执行 → 不可停止，不可篡改
```

> 📐 **智能合约 = 在区块链上运行的代码。** 一旦部署，代码就"活"在链上——任何人都可以调用它定义好的函数，但没有人能修改已部署的代码。

---

## 📝 Solidity——以太坊智能合约语言

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 一个简单的众筹合约
contract CrowdFunding {
    address public owner;              // 合约创建者
    uint256 public goal;                // 众筹目标（wei）
    uint256 public raised;              // 已筹集金额
    mapping(address => uint256) public contributors;  // 贡献者列表
    
    event Contributed(address sender, uint256 amount);
    
    constructor(uint256 _goal) {
        owner = msg.sender;             // 部署合约的人
        goal = _goal;
    }
    
    // 捐赠函数——发送 ETH 时自动调用
    function contribute() public payable {
        require(msg.value > 0, "金额必须大于 0");
        contributors[msg.sender] += msg.value;
        raised += msg.value;
        emit Contributed(msg.sender, msg.value);
    }
    
    // 如果达到目标——所有者可取走资金
    function withdraw() public {
        require(msg.sender == owner, "只有所有者能取");
        require(raised >= goal, "未达到目标");
        payable(owner).transfer(address(this).balance);
    }
}
```

**关键点**：
- `msg.sender` = 谁在调用这个函数（自动获得，不需要传参）
- `payable` = 这个函数可以接收 ETH
- `require` = 条件检查——不满足则回滚所有状态
- 合约代码一旦部署**不可修改**——bug 就是永久性的

---

## ⛽ Gas——不要让合约"死循环"

如果智能合约里有 `while(true)` 会怎样？——它会永远运行下去。因为是去中心化的——没人能"停机"强制停止它。

**Gas（燃料）** 的解决方案：**每次调用合约函数都要预付费（Gas），用完了自动停止。**

```
每笔交易包含：
- Gas Limit：你愿意支付的"燃料"上限
- Gas Price：每单位燃料的价格（用 Gwei 计）

计算：
交易费 = Gas Used（实际消耗的 Gas 量）× Gas Price（单位价格）

简单转账：21,000 Gas
ERC-20 转账：约 50,000 Gas
复杂合约交互：100,000+ Gas
```

**Gas 的目的**：
1. 防止无限循环（"用完 Gas 自动终止"）
2. 防止滥用（每个操作都有成本——没人会恶意大量调用来浪费网络资源）
3. 激励矿工/验证者（Gas 费归出块者）

---

## 📋 代币标准

| 标准 | 含义 | 代表项目 |
|:----:|:----:|:---------|
| **ERC-20** | 可互换代币——每枚都一样 | USDT、UNI、LINK |
| **ERC-721** | 不可互换代币（NFT）——每个唯一 | CryptoPunks、BAYC |
| **ERC-1155** | 多代币标准——批量管理 | 游戏内物品 |

```solidity
// ERC-20 代币的简化核心
contract SimpleToken {
    mapping(address => uint256) public balanceOf;
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "余额不足");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **智能合约** | 区块链上的自动执行程序——"自动售货机" |
| **Solidity** | 以太坊智能合约编程语言（类似 JavaScript）|
| **EVM（以太坊虚拟机）** | 执行智能合约的去中心化"计算机" |
| **Gas** | 计算资源的"燃料"——防止恶意使用 |
| **ERC-20** | 可互换代币标准（USDT、UNI）|
| **ERC-721** | NFT 标准——每个代币唯一 |

**为什么先学这个？** 智能合约是 DApp 的"后端"。合约写好之后，怎么开发完整应用？——[[dapp|去中心化应用（DApp）]]。
