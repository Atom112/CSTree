---
id: dns
title: DNS 域名系统
summary: DNS（Domain Name System）把人类易记的域名（www.google.com）解析为机器可读的 IP 地址——是互联网的"通讯录"
difficulty: intermediate
order: 15
parent: ip-protocol
children: []
related:
  - http
prerequisites:
  - ip-protocol
tags:
  - network
  - dns
  - application
createdAt: 2026-06-12
---

## 记 IP 地址？人类做不到

让你记住 142.250.80.4 可能不难——但要记住几百个网站的 IP 地址？不可能。

> 🏫 **类比：电话通讯录**
> 你记不住朋友的手机号（IP 地址）——但你在通讯录里存了"张三"（域名），点一下就能拨号。DNS 就是互联网的通讯录。

## DNS 的层次结构

```
根域名  （全球 13 组根服务器，由 ICANN 管理）
  │
  ├── .com（商业）
  ├── .org（组织）
  ├── .cn（中国）
  ├── .edu（教育）
  └── ...
       │
       ├── google.com
       ├── baidu.com
       └── ...
            │
            └── www.baidu.com
                 mail.baidu.com
```

### 完全限定域名（FQDN）

```
www.example.com.
↑  ↑       ↑   ↑
│  │       │   根
│  │       二级域名
│  一级域名（顶级域）
主机名
```

## DNS 查询过程

```
浏览器输入 www.google.com
    │
    ▼
1. 浏览器查自己的 DNS 缓存
    │ 没有 → 查操作系统缓存
    │ 没有 → 查 hosts 文件
    │ 没有 → 发出 DNS 查询
    ▼
2. 查询本地 DNS 服务器（通常由 ISP 提供，如 8.8.8.8）
    │
    ▼
3. 如果本地 DNS 没有缓存：
   ① 本地 DNS → 根服务器 → 指向 .com 顶级域服务器
   ② 本地 DNS → .com 服务器 → 指向 google.com 的权威服务器
   ③ 本地 DNS → google.com 权威服务器 → 返回 www.google.com 的 IP
   ④ 本地 DNS 缓存结果，返回给浏览器
```

## DNS 记录类型

| 类型 | 含义 | 示例 |
|:----:|------|------|
| **A** | IPv4 地址 | `www.google.com → 142.250.80.4` |
| **AAAA** | IPv6 地址 | `www.google.com → 2404:6800:4005:810::2004` |
| **CNAME** | 别名 | `www → @`（主域名） |
| **MX** | 邮件服务器 | `@ → mail.google.com`（优先级 10） |
| **NS** | 域名服务器 | `google.com → ns1.google.com` |
| **TXT** | 文本记录 | 验证域名所有权、SPF 反垃圾邮件 |

```bash
# DNS 查询示例
$ dig www.google.com
www.google.com. 300 IN A 142.250.80.4

$ dig mx google.com
google.com. 600 IN MX 10 smtp.google.com.

# 反向查询（IP → 域名）
$ dig -x 8.8.8.8
8.8.8.8.in-addr.arpa. 7200 IN PTR dns.google.
```

## DNS 缓存

DNS 结果可以缓存——减少重复查询，加快访问速度：

```bash
# 查看 DNS 缓存（Windows）
ipconfig /displaydns

# 清除 DNS 缓存
ipconfig /flushdns      # Windows
sudo dscacheutil -flushcache  # macOS
sudo systemd-resolve --flush-caches  # Linux
```

## 小结

| 概念 | 要点 |
|------|------|
| **DNS** | 域名 → IP 地址的解析系统 |
| **层次结构** | 根 → 顶级域 → 权威服务器 |
| **缓存** | 各级 DNS 服务器和浏览器都缓存结果 |
| **负载均衡** | 一个域名对应多个 IP（轮询或地域感知） |

**为什么先学这个？** DNS 是应用层的基础服务。下一节看看[[http|HTTP / HTTPS]]——Web 的基石。
