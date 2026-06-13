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
updatedAt: 2026-06-13
---

## 🧱 "门卫"与"监控摄像头"

防火墙和入侵检测系统（IDS）是网络安全中最基础的两道防线。

> 🏪 **类比：宿舍楼的安全**
>
> **防火墙** = 宿舍楼门口的**门卫**——检查每个进入的人"有卡吗？"——没卡的拦下（拒绝/允许规则）。
>
> **IDS** = 楼道里的**监控摄像头**——观察每个经过的人"这个人在撬门？"——发现可疑行为就报警。
>
> **IPS** = 监控摄像头 + 自动关门——发现撬门的直接锁门阻止。

---

## 🔥 防火墙——"谁可以进来"

防火墙根据预设规则决定：允许还是拒绝网络流量。

### 防火墙的三种类型

```
包过滤防火墙（网络层）：
  检查每个 IP 包的：来源 IP、目标 IP、端口号
  规则示例："允许来自 10.0.0.0/8 的 TCP/22（SSH）"
  
状态检测防火墙（传输层）：
  不仅看单个包——还跟踪连接状态
  规则示例："允许已建立的连接通过"

应用层防火墙（WAF）：
  理解应用协议（HTTP），检查请求内容
  规则示例："阻止 URL 中包含 /etc/passwd 的请求"
```

```bash
# iptables——Linux 的包过滤防火墙
# 允许来自内网的 SSH 连接
iptables -A INPUT -s 10.0.0.0/8 -p tcp --dport 22 -j ACCEPT
# 阻止所有其他入站连接
iptables -A INPUT -j DROP
```

---

## 🚨 IDS/IPS——"谁在干坏事"

### 两种检测方法

| 方法 | 原理 | 优点 | 缺点 |
|:----:|:----:|:----:|:----:|
| **签名检测** | 匹配已知攻击模式 | 准确、误报少 | 只能检测已知攻击 |
| **异常检测** | 偏离正常基线的行为报警 | 能发现新攻击 | 误报多（"正常行为"难定义）|

```python
# IDS 签名示例——检测 SQL 注入尝试
rules = [
    {"pattern": "'.*OR.*1=1",      "name": "SQL注入检测"},
    {"pattern": "<script>",        "name": "XSS检测"},
    {"pattern": "/etc/passwd",     "name": "路径遍历"},
]

for request in network_traffic:
    for rule in rules:
        if re.search(rule["pattern"], request):
            alert(f"告警：{rule['name']}")
```

### WAF——Web 应用防火墙

WAF 是专门保护 Web 应用的防火墙：
- 检测 SQL 注入、XSS、CSRF 等 Web 攻击
- 可配置规则或自动学习正常流量
- 典型产品：ModSecurity（开源）、Cloudflare WAF

---

## 📝 小结

| 设备 | 作用 | 工作层 |
|:----:|:----:|:------:|
| **防火墙** | 允许/拒绝流量（门卫）| 网络/传输/应用层 |
| **IDS** | 检测攻击并告警（监控）| 网络/应用层 |
| **IPS** | 检测并阻止攻击（监控+自动关门）| 网络/应用层 |
| **WAF** | 保护 Web 应用 | 应用层（HTTP）|

**为什么先学这个？** 技术层面的防御之后，看看"流程层面"的安全——[[ssdlc|安全开发生命周期（SSDLC）]]。
