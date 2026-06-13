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
updatedAt: 2026-06-13
---

## 🌊 把高速公路堵死——DDoS

**DDoS（分布式拒绝服务攻击）**：攻击者控制大量"僵尸"计算机，同时向目标服务器发送海量请求——把服务器"堵死"，正常用户访问不了。

> 🏪 **类比：食堂打饭**
>
> 食堂窗口只能每分钟服务 10 个人。某天，200 个人同时挤到窗口前——不管是不是真来吃饭的——窗口被堵死，真正想吃饭的人进不来。
>
> 这就是 DDoS——用远超处理能力的请求量淹没目标。

**常见 DDoS 类型**：

| 类型 | 原理 | 防御 |
|:----:|:----:|:----:|
| **流量型** | 用海量带宽塞满网络 | CDN 分散流量、云清洗 |
| **应用层** | 发送大量 HTTP 请求耗尽 CPU | WAF、限流、验证码 |
| **协议型** | 利用协议漏洞（如 SYN Flood）| 防火墙规则、TCP 参数优化 |

---

## 🕵️ 中间人攻击——MITM

**MITM（Man-in-the-Middle，中间人攻击）**：攻击者插入通信双方之间——窃听、篡改消息。

```
正常通信：
你 →→→→→→ 网站
（直接对话）

MITM 攻击：
你 →→→ 攻击者 →→→ 网站
    （窃听+篡改）
```

**防御 MITM 的唯一有效方案：HTTPS（TLS 加密）。**

```
为什么 HTTPS 能防 MITM？
1. TLS 加密——攻击者看到的是乱码
2. 证书验证——服务器有 CA 签名的证书
   攻击者无法伪造（没有 CA 的私钥）
```

---

## 🛡️ 网络防御策略

```python
# 纵深防御——多层防护
defenses = {
    "网络层": "防火墙、IPS、DDoS 清洗",
    "传输层": "TLS 1.3、证书固定",
    "应用层": "WAF、限流、验证码",
    "端点":   "杀毒软件、EDR",
    "监控":   "SIEM、异常流量检测",
}
```

---

## 📝 小结

| 攻击 | 原理 | 主要防御 |
|:----:|:----:|:--------:|
| **DDoS** | 海量流量耗尽资源 | CDN、限流、WAF |
| **MITM** | 拦截通信并窃听/篡改 | HTTPS、证书验证 |
| **DNS 劫持** | 伪造 DNS 响应 | DNSSEC |
| **端口扫描** | 探测开放端口 | 防火墙、最小暴露 |

**为什么先学这个？** 了解网络层攻击后，看看 Web 应用层的威胁——[[web-security|Web 安全（XSS, SQL 注入, CSRF）]]。
