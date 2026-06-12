---
id: email-protocols
title: 电子邮件协议（SMTP / POP / IMAP）
summary: 电子邮件靠三个协议协同工作——SMTP 负责发信（送到邮件服务器），POP3 和 IMAP 负责收信（从邮件服务器取到客户端）
difficulty: intermediate
order: 17
parent: network-layers
children: []
related:
  - dns
prerequisites:
  - network-layers
tags:
  - network
  - email
  - smtp
  - imap
createdAt: 2026-06-12
---

## 一封信的旅程

你从 QQ 邮箱发给 Gmail 一封信——这封信经历了三个协议：

```
你写邮件 → ① SMTP → QQ 邮件服务器 → ② SMTP → Gmail 邮件服务器
                                                      │
你读邮件 ← ③ POP3/IMAP ← Gmail 邮件服务器 ←───────
```

> 🏫 **类比：邮政系统**
> - **SMTP** = 你家楼下的邮筒——你把信投进去
> - **邮件服务器** = 邮局——暂存信件
> - **SMTP 之间** = 邮车——从一个城市运到另一个城市
> - **POP3/IMAP** = 你家的收件箱——拿信

## SMTP——发邮件

**SMTP（Simple Mail Transfer Protocol）** 负责把邮件从客户端发送到服务器，以及服务器之间转发。

```
客户端 → SMTP → 服务器 A → SMTP → 服务器 B → IMAP → 客户端

SMTP 对话示例：
S: 220 smtp.gmail.com ESMTP
C: HELO client.example.com
S: 250 Hello client.example.com
C: MAIL FROM:<sender@gmail.com>
S: 250 OK
C: RCPT TO:<recipient@gmail.com>
S: 250 OK
C: DATA
S: 354 Start mail input
C: Subject: Hello!
C: This is the email body.
C: .
S: 250 OK
C: QUIT
```

## POP3——收邮件

**POP3（Post Office Protocol 3）** 把邮件从服务器下载到本地，下载后通常从服务器删除。

```
优点：离线可读、节省服务器空间
缺点：换设备看不到历史邮件
```

## IMAP——同步邮件

**IMAP（Internet Message Access Protocol）** 邮件保留在服务器上，客户端和服务器保持同步。

```
优点：手机/电脑/网页看同一份邮件
缺点：需要服务器空间，离线不方便
```

### POP3 vs IMAP

| 对比 | POP3 | IMAP |
|------|:----:|:----:|
| **邮件存储** | 本地下载 | 服务器保留 |
| **多设备访问** | ❌ 只能在一台设备上看 | ✅ 所有设备同步 |
| **需要网络** | 读信不需要 | 需要（除非缓存） |
| **默认端口** | 110 (SSL: 995) | 143 (SSL: 993) |

## 小结

| 协议 | 用途 | 端口 |
|:----:|------|:----:|
| **SMTP** | 发邮件 | 25/465/587 |
| **POP3** | 收邮件（下载到本地） | 110/995 |
| **IMAP** | 收邮件（保持同步） | 143/993 |

> 💡 今天大部分邮件客户端（Gmail、Outlook）默认使用 **SMTP + IMAP** 组合。

**为什么先学这个？** 电子邮件协议是应用层经典范例。最后一节看看[[websocket|WebSocket 与实时通信]]。
