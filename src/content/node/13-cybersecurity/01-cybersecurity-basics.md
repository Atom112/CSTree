---
id: cybersecurity-basics
title: 安全基础概念（CIA 三元组）
summary: CIA 三元组是信息安全的核心——机密性（Confidentiality）防止未授权访问，完整性（Integrity）防止数据篡改，可用性（Availability）确保服务正常运行
difficulty: intermediate
order: 1
parent:
children:
  - authentication-access-control
related: []
prerequisites: []
tags:
  - security
  - cia
createdAt: 2026-06-12
---

## CIA 三元组

```
机密性 ─── 只有授权者可访问 → 加密、访问控制
完整性 ─── 数据未被篡改 → 哈希、数字签名
可用性 ─── 服务正常可访问 → 冗余、DDoS 防护
```

## 其他原则

| 原则 | 说明 |
|:----:|------|
| **不可否认性** | 不能否认自己做过的事（数字签名） |
| **最小权限** | 只给完成任务所需的最小权限 |
| **纵深防御** | 多层安全防护 |

**为什么先学这个？** 了解基础后，学习[[authentication-access-control|身份认证与访问控制]]。
