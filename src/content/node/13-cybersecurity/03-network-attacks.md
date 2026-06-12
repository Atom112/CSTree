---
id: network-attacks
title: 网络攻击与防御（DDoS, MITM）
summary: DDoS 用海量流量淹没目标，MITM 在通信双方之间窃听或篡改。防御需要多层策略——限流、加密、认证、监控
difficulty: intermediate
order: 3
parent: authentication-access-control
children:
  - web-security
related: []
prerequisites:
  - authentication-access-control
tags:
  - security
  - network
  - ddos
createdAt: 2026-06-12
---

## 常见网络攻击

| 攻击 | 原理 | 防御 |
|:----:|:----:|:----:|
| **DDoS** | 海量请求耗尽资源 | CDN、限流、WAF |
| **MITM** | 拦截通信 | HTTPS、证书验证 |
| **DNS 劫持** | 伪造 DNS 响应 | DNSSEC |
| **端口扫描** | 探测开放端口 | 防火墙、最小暴露 |

## 防御策略

```
纵深防御：防火墙 + IDS/IPS + WAF + 端点保护
最小暴露：只开放必要端口
加密传输：TLS 1.3
持续监控：异常流量检测
```

**为什么先学这个？** 网络攻击后，学习[[web-security|Web 安全（XSS, SQL 注入）]]。
