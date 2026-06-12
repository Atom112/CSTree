---
id: ssdlc
title: 安全开发生命周期（SSDLC）
summary: SSDLC 在软件开发的每个阶段嵌入安全实践——需求阶段做威胁建模，设计阶段做安全架构评审，开发阶段做安全编码，测试阶段做渗透测试
difficulty: advanced
order: 7
parent: firewall-ids
children:
  - digital-forensics
related: []
prerequisites:
  - web-security
tags:
  - security
  - ssdlc
  - devsecops
createdAt: 2026-06-12
---

## SSDLC 阶段

```
需求 → 威胁建模（STRIDE）
设计 → 安全架构评审
编码 → 安全编码规范 + 静态分析（SAST）
测试 → 动态分析（DAST）+ 渗透测试
部署 → 配置安全检查
运维 → 监控 + 漏洞管理
```

## DevSecOps

把安全融入 DevOps 流水线——自动扫描依赖漏洞、容器镜像扫描、基础设施即代码（IaC）安全检。

## 小结

| 实践 | 工具 |
|:----:|:----:|
| **SAST** | SonarQube, Semgrep |
| **DAST** | OWASP ZAP, Burp Suite |
| **SCA** | Snyk, Dependabot |
| **渗透测试** | Metasploit, Kali Linux |

**为什么先学这个？** 最后学习[[digital-forensics|数字取证]]。
