---
id: arp
title: ARP 协议
summary: ARP（Address Resolution Protocol）把 IP 地址解析为 MAC 地址——当你知道对方的 IP 地址，但不知道它在哪台交换机端口时，ARP 帮你"喊一声"找到它
difficulty: intermediate
order: 6
parent: mac-ethernet
children: []
related:
  - switch-learning
  - ip-protocol
prerequisites:
  - mac-ethernet
  - ip-protocol
tags:
  - network
  - arp
  - protocol
createdAt: 2026-06-12
---

## IP 地址 vs MAC 地址——两个地址的故事

IP 地址解决"目标在哪里"（逻辑位置），MAC 地址解决"目标是谁"（物理身份）。

```
就像：
IP 地址 = 你公司的地址（"广东省深圳市南山区…"）
MAC 地址 = 你的工位号（"A 栋 3 楼 5 号位"）

快递先送到公司地址（IP），然后前台的同事找到你的工位号（MAC）把包裹放你桌上。
```

**ARP（Address Resolution Protocol）** 就是"怎么通过 IP 地址找到 MAC 地址"的协议。

## ARP 工作流程

```
A（192.168.1.1）想发给 B（192.168.1.2）

1. A 查自己的 ARP 缓存
   ┌──────────────┬─────────────────┐
   │ IP           │ MAC             │
   ├──────────────┼─────────────────┤
   │ 192.168.1.1  │ AA:AA:AA:AA:AA  │（自己）
   │ 192.168.1.2  │ ???             │（没有 B 的信息）
   └──────────────┴─────────────────┘

2. A 发送 ARP 请求（广播）
   目标 MAC = FF:FF:FF:FF:FF:FF（广播地址）
   "谁是 192.168.1.2？请告诉 192.168.1.1"

3. 所有设备都收到这个广播，只有 B 回复

4. B 发送 ARP 回复（单播）
   目标 MAC = A 的 MAC
   "我是 192.168.1.2，我的 MAC 是 BB:BB:BB:BB:BB"

5. A 收到后更新 ARP 缓存
   ┌──────────────┬─────────────────┐
   │ 192.168.1.2  │ BB:BB:BB:BB:BB  │
   └──────────────┴─────────────────┘

6. A 现在可以用 B 的 MAC 地址发送数据了！
```

## ARP 缓存

为了减少广播，系统缓存 ARP 结果：

```bash
# 查看 ARP 缓存
$ arp -a
? (192.168.1.1) at aa:aa:aa:aa:aa:aa on en0 ifscope [ethernet]
? (192.168.1.2) at bb:bb:bb:bb:bb:bb on en0 ifscope [ethernet]
? (192.168.1.254) at cc:cc:cc:cc:cc:cc on en0 ifscope [ethernet]

# 清除 ARP 缓存（调试网络问题时有用）
$ arp -d 192.168.1.2
```

> 💡 ARP 缓存通常 20 分钟过期——时间太长可能导致设备移动后无法通信，太短则增加 ARP 广播量。

## ARP 欺骗攻击

ARP 协议没有认证机制——任何设备都可以回复 ARP 请求：

```
攻击者发送假 ARP 回复：
"我是 192.168.1.1，我的 MAC 是 EE:EE:EE:EE:EE"

受害者的 ARP 缓存被污染：
┌──────────────┬─────────────────┐
│ 192.168.1.1  │ EE:EE:EE:EE:EE  │← 攻击者的 MAC！
│              │（应该是网关的）   │
└──────────────┴─────────────────┘

结局：受害者发给网关的数据，全部发给了攻击者（中间人攻击）。
```

**防御措施：** 静态 ARP 表、DAI（Dynamic ARP Inspection）。

## 小结

| 概念 | 要点 |
|------|------|
| **ARP 作用** | IP 地址 → MAC 地址的解析 |
| **ARP 请求** | 广播，询问"谁是 X.X.X.X" |
| **ARP 回复** | 单播，回复自己的 MAC |
| **ARP 缓存** | 减少广播次数，有老化时间 |
| **安全风险** | ARP 欺骗——无认证的协议 |

**为什么先学这个？** ARP 是 IP 层和链路层之间的"翻译官"。接下来进入真正的核心——[[ip-protocol|IP 协议与 IPv4 地址]]。
