---
id: digital-forensics
title: 数字取证
summary: 数字取证（Digital Forensics）从电子设备中收集和分析证据——硬盘取证恢复删除文件，内存取证分析运行中的恶意软件，网络取证追踪攻击流量
difficulty: advanced
order: 8
parent: ssdlc
children: []
related: []
prerequisites:
  - malware-analysis
tags:
  - security
  - forensics
createdAt: 2026-06-12
---

## 取证类型

| 类型 | 对象 | 工具 |
|:----:|:----:|:----:|
| **硬盘取证** | 磁盘镜像 | FTK Imager, Autopsy |
| **内存取证** | RAM 镜像 | Volatility |
| **网络取证** | 网络流量 | Wireshark, tcpdump |
| **移动取证** | 手机 | Cellebrite |

## 取证原则

```
1. 不修改原始数据（只读挂载，写保护）
2. 记录完整证据链（Chain of Custody）
3. 先易失（内存）后非易失（硬盘）
4. 完整复制（位对位镜像）
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **证据链** | 谁、何时、何处接触过证据 |
| **易失性** | 内存 > 网络 > 硬盘 |
| **镜像** | 位对位复制，不修改原介质 |

**为什么先学这个？** 网络安全板块完。进入分布式系统板块。
