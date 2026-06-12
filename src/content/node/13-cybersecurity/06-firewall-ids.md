---
id: firewall-ids
title: 防火墙与入侵检测
summary: 防火墙控制网络流量访问规则（允许/拒绝），IDS/IPS 检测并阻止可疑活动。规则匹配和异常检测是两种基本方法
difficulty: intermediate
order: 6
parent: malware-analysis
children:
  - ssdlc
related: []
prerequisites:
  - network-attacks
tags:
  - security
  - firewall
  - ids
createdAt: 2026-06-12
---

## 防火墙类型

| 类型 | 工作层 | 特点 |
|:----:|:------:|------|
| **包过滤** | 网络层 | 检查 IP+端口 |
| **状态检测** | 传输层 | 跟踪连接状态 |
| **应用层** | 应用层 | 理解协议内容（WAF） |

## IDS/IPS

```
IDS（入侵检测）：监测并告警
IPS（入侵防御）：检测并阻断

检测方法：
- 签名检测：匹配已知攻击模式
- 异常检测：基线偏离告警
```

## 小结

| 技术 | 作用 |
|:----:|------|
| **防火墙** | 访问控制 |
| **IDS** | 告警 |
| **IPS** | 阻断 |
| **WAF** | Web 应用防护 |

**为什么先学这个？** 防御后，学习[[ssdlc|安全开发生命周期（SSDLC）]]。
