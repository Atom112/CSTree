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
updatedAt: 2026-06-13
---

## 📱 记 IP 地址？人类做不到

142.250.80.4——这是 Google 的 IP 地址。即使你记住了这一个——你记得住几百个网站的吗？

你每次打开网页、刷视频、用外卖 App——背后都发生了一次 DNS 查询。

> 📖 **类比：电话通讯录**
> 你记不住朋友的手机号（IP 地址）——但你在通讯录里存了"张三"（域名），一点就能打。
> DNS 就是互联网的通讯录：你输入 `www.baidu.com` → DNS 返回 `39.156.66.10`。

**DNS（Domain Name System，域名系统）** 就是把域名翻译成 IP 地址的分布式数据库。

---

## 🌳 DNS 的层次结构——像文件系统的目录

```
根（13 组根服务器，ICANN 管理）
  ├── .com     ← 顶级域（TLD）
  │   ├── google.com    ← 二级域（注册的域名）
  │   │   └── www.google.com   ← 主机名（FQDN）
  │   ├── baidu.com
  │   │   └── www.baidu.com
  │   └── ...
  ├── .org
  ├── .cn       ← 中国国家顶级域
  │   ├── baidu.cn
  │   └── ...
  ├── .edu      ← 教育机构
  └── .gov      ← 政府部门
```

完全限定域名（FQDN）从右向左读：`www.example.com.`

```
www  .  example  .  com  .
↑        ↑         ↑     ↑
主机名    二级域    顶级域  根（通常省略）
```

---

## 🔍 DNS 查询过程——你输入网址后发生了什么？

```python
# 你在浏览器输入 www.google.com——查询链
步骤 1：浏览器查自己的 DNS 缓存
  │ 没有 → 查操作系统的 DNS 缓存
  │ 没有 → 查 hosts 文件 (/etc/hosts)
  │ 没有 → 发出 DNS 查询到本地 DNS 服务器
  ▼
步骤 2：本地 DNS 服务器（如 8.8.8.8）
  │ 也没有缓存 → 代表你递归查询
  ▼
步骤 3：递归查询链
  ① 本地 DNS → 根服务器 → "www.google.com 的 IP 在哪？"
     根： "问 .com 服务器，它在 x.x.x.x"
  ② 本地 DNS → .com 服务器 → "www.google.com 的 IP 在哪？"
     .com： "问 google.com 的权威服务器，它在 y.y.y.y"
  ③ 本地 DNS → google.com 权威服务器 → "www.google.com 的 IP 在哪？"
     权威： "它在 142.250.80.4"
  ④ 本地 DNS 缓存这个结果 → 返回给浏览器
```

```bash
# 用 dig 命令观察完整 DNS 查询过程
$ dig +trace www.google.com

; ① 从根开始
.            518400  IN  NS  a.root-servers.net.

; ② 查 .com
com.          172800  IN  NS  a.gtld-servers.net.

; ③ 查 google.com
google.com.   172800  IN  NS  ns1.google.com.

; ④ 得到结果
www.google.com. 300  IN  A   142.250.80.4
```

---

## 📋 DNS 记录类型

| 类型 | 含义 | 示例 |
|:----:|:----:|------|
| **A** | IPv4 地址（最常用）| `www.google.com → 142.250.80.4` |
| **AAAA** | IPv6 地址 | `google.com → 2404:6800:4005:810::2004` |
| **CNAME** | 域名别名（A→B→IP）| `www → @`（主域名指向）|
| **MX** | 邮件服务器 | `@ → mail.google.com` 优先级 10 |
| **NS** | 权威域名服务器 | `google.com → ns1.google.com` |
| **TXT** | 文本（验证/反垃圾邮件）| `v=spf1 include:_spf.google.com` |

### 实用 DNS 命令

```bash
# 基本查询
dig www.baidu.com                  # 查询 A 记录
dig mx qq.com                      # 查询邮件服务器
dig -x 8.8.8.8                     # 反向查询（IP → 域名）

# 简洁输出
nslookup www.baidu.com

# 查看/清除本地缓存
ipconfig /displaydns               # Windows 查看缓存
ipconfig /flushdns                 # Windows 清除缓存
sudo dscacheutil -flushcache       # macOS 清除
```

---

## 💡 DNS 在工程中的应用技巧

**负载均衡**：一个域名对应多个 IP——DNS 服务器按轮询或地域返回不同 IP。

```bash
$ dig www.baidu.com +short
39.156.66.10      # 百度有多个 IP——负载均衡
39.156.66.14
180.101.49.11
180.101.49.12
```

**CDN 加速**：DNS 根据用户地理位置返回最近的 CDN 节点 IP。

**域名劫持**：如果你访问正常网站却被重定向到广告页——很可能是 DNS 被篡改了。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **DNS** | 域名→IP 的翻译系统——互联网的通讯录 |
| **层次结构** | 根→顶级域→二级域→主机名——分级管理 |
| **递归查询** | 本地 DNS 代表你逐级询问——直到拿到结果 |
| **缓存** | 各级 DNS 和浏览器都缓存结果——加速后续访问 |
| **A/CNAME/MX 记录** | 不同类型的 DNS 记录对应不同用途 |
| **负载均衡** | 一个域名多个 IP——DNS 轮询分发请求 |

**为什么先学这个？** DNS 解决"找服务器在哪"的问题。找到之后用[[http|HTTP / HTTPS]]获取内容。
