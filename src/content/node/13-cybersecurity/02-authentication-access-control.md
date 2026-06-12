---
id: authentication-access-control
title: 身份认证与访问控制
summary: 身份认证证明"你是谁"（密码、指纹、MFA），访问控制决定"你能做什么"（RBAC、ACL）。OAuth 2.0 是现代 Web 的授权标准
difficulty: intermediate
order: 2
parent: cybersecurity-basics
children:
  - network-attacks
related: []
prerequisites:
  - cybersecurity-basics
tags:
  - security
  - auth
  - oauth
createdAt: 2026-06-12
---

## 认证三要素

| 要素 | 例子 | 漏洞 |
|:----:|:----:|:----:|
| **你知道的** | 密码 | 弱密码、泄露 |
| **你拥有的** | 手机令牌 | 丢失、被盗 |
| **你是什么** | 指纹/人脸 | 不可更改 |

## 访问控制模型

| 模型 | 说明 |
|:----:|------|
| **DAC** | 文件所有者控制权限 |
| **MAC** | 系统强制控制（军事级） |
| **RBAC** | 基于角色的访问控制 |

## 小结

| 概念 | 要点 |
|:----:|------|
| **MFA** | 多因素认证，至少用两种要素 |
| **OAuth 2.0** | 授权框架，不用分享密码 |
| **JWT** | JSON Web Token，无状态认证 |

**为什么先学这个？** 认证后，学习[[network-attacks|网络攻击与防御]]。
