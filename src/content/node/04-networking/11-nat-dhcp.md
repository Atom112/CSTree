---
id: nat-dhcp
title: NAT 与 DHCP
summary: NAT（网络地址转换）让多个设备共享一个公网 IP——你的手机、电脑、平板共用一个路由器的公网 IP 上网。DHCP 自动分配 IP 地址——不用每台设备手动配置
difficulty: intermediate
order: 11
parent: ip-protocol
children: []
related:
  - ip-protocol
  - subnet-cidr
prerequisites:
  - ip-protocol
tags:
  - network
  - nat
  - dhcp
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🏠 一个公网 IP，全家一起用

IPv4 地址早就用完了。你的手机、电脑、平板、电视——但它们都能同时上网。

你的路由器只有一个公网 IP，但它能让全家所有设备都上网——靠的是 **NAT（Network Address Translation，网络地址转换）**。

> 🏪 **类比：公司前台"
>
> 一栋写字楼只有一个总机号码（公网 IP）。你打电话给楼里某个人——拨总机，告诉前台"转 301"。
> 
> NAT 就是前台：所有设备（员工）共用总机号（公网 IP），NAT 负责把回来的数据"转"给对应的设备。

---

## 🔄 NAT 的工作原理

```
内网设备（私有 IP）    路由器（NAT）        互联网
192.168.1.2:5000  →   修改为：               → 服务器
                       公网 IP:25000
                       记录映射表：
                       (192.168.1.2:5000 ↔ 公网IP:25000)

服务器响应回来：       NAT 查映射表：         ← 服务器响应
公网 IP:25000 收到    → (公网IP:25000 → 192.168.1.2:5000)
                       修改目标地址
                       → 转发给内网设备
```

```bash
# Linux 查看 NAT 表——路由器上执行的命令
$ iptables -t nat -L -n
Chain POSTROUTING
target  prot opt source           destination
MASQUERADE  all  --  192.168.0.0/24    !192.168.0.0/24

# 查看当前 NAT 映射
$ conntrack -L | grep 192.168.1.2
tcp  ...  src=192.168.1.2 sport=5000  dst=203.0.113.5 dport=80
          src=203.0.113.5 sport=80    dst=192.168.1.2 dport=5000
```

### NAT 的类型

| 类型 | 行为 | 适用场景 |
|:----:|:----:|:---------|
| **对称 NAT** | 每个外发连接用不同端口 | 最安全——但 P2P 连接困难 |
| **锥形 NAT** | 固定映射内部 IP:端口 | 常见于家用路由器 |
| **UPnP** | 应用主动请求端口映射 | BT 下载、游戏主机加速 |

---

## 📋 DHCP——不用手动配 IP

没有 DHCP 时——你要手动设置每台设备的 IP 地址、子网掩码、网关、DNS。如果 50 台设备，每台都要配，而且不能冲突。

**DHCP（Dynamic Host Configuration Protocol，动态主机配置协议）** 自动做这件事：

```
设备连上 Wi-Fi → 自动获得 IP：

1. DISCOVER：新设备广播"有 DHCP 服务器吗？"
2. OFFER：  DHCP 服务器回应"给你这个 IP 用，要不要？"
3. REQUEST：设备说"要，我确认"
4. ACK：    服务器说"好的，这个 IP 租给你 24 小时"
```

```bash
# Linux 查看 DHCP 获取到的 IP
$ ip addr show
2: wlan0: ... state UP
    inet 192.168.1.102/24         ← DHCP 分配
    valid_lft 86395sec            ← 租期剩余（24 小时）

# 查看 DHCP 租约信息
$ dhclient -r                      # 释放 IP
$ dhclient                         # 重新请求 IP
```

### DHCP 分配的信息

```
DHCP 不只是分配 IP——它还告诉设备：
- IP 地址：192.168.1.102
- 子网掩码：255.255.255.0
- 网关：192.168.1.1（路由器地址）
- DNS 服务器：8.8.8.8, 114.114.114.114
- 租期：86400 秒（24 小时）
```

---

## 🏢 NAT + DHCP = 家用路由器

你的家用路由器同时运行了这两个协议：

```
Wi-Fi 接入
    │
    ▼
DHCP 服务器（给手机/电脑分配私有 IP 192.168.1.x）
    │
    ▼
NAT（把内网请求映射到公网 IP 发出）
    │
    ▼
公网（最终和服务器通信）
```

这就是为什么你买来路由器插上电、连上网线——所有设备直接就能上网了。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **NAT** | 多个设备共享一个公网 IP——通过端口号区分不同设备 |
| **NAT 映射表** | 记录"内网 IP:端口 ↔ 公网 IP:端口"的对应关系 |
| **DHCP** | 自动分配 IP 地址和设备网络配置 |
| **DHCP 租期** | 分配的 IP 有使用期限——到期要续约 |
| **家用路由器** | NAT + DHCP + 路由 + Wi-Fi 四合一 |
