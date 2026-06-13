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
updatedAt: 2026-06-13
---

## 🚪 "证明你是谁"——和"放你进来"是两回事

进宿舍楼需要刷卡——刷卡证明了你"是这栋楼的学生"（**认证**）。然后门禁系统根据你的权限让学生进、不让外人进（**访问控制**）。

- **认证（Authentication）**：你是谁？→ 出示证件
- **授权（Authorization）**：你能做什么？→ 学生能进、教师能进办公室、管理员能进机房

---

## 🔑 三种认证要素

```
要素 1：你知道的       → 密码、PIN 码
要素 2：你拥有的       → 手机验证码、硬件令牌（U 盾）
要素 3：你是什么       → 指纹、人脸、虹膜

单因素认证（只用其中一种）：         不安全
多因素认证（MFA，至少两种组合）：   安全得多
```

```python
# MFA 的典型流程
# 第 1 步：输入密码（你知道的）
# 第 2 步：输入手机验证码（你拥有的）
# → 两步都通过 → 认证成功

# 为什么 MFA 安全？
# 密码泄露了——攻击者没有你的手机
# 手机丢了——攻击者不知道你的密码
```

> 💡 **安全的 Trade-off**：安全性越高的认证方式 ≈ 越麻烦。好的系统在"安全"和"用户体验"之间做权衡——银行转账用 MFA，但查看余额只需要密码。

---

## 🏛️ 访问控制模型

| 模型 | 含义 | 适用场景 |
|:----:|:----:|:---------|
| **DAC（自主访问控制）** | 文件所有者自己决定权限 | Linux 文件权限、Windows |
| **MAC（强制访问控制）** | 系统统一管理，用户不能改 | 军事、政府机密系统 |
| **RBAC（基于角色的访问控制）** | 权限绑定到"角色"，用户分配到角色 | 企业系统——最常用 |

```python
# RBAC 示例
roles = {
    "student": ["view_courses", "enroll_courses", "view_grades"],
    "teacher": ["create_courses", "grade_students", "view_reports"],
    "admin":   ["manage_users", "system_config", "all_permissions"],
}

def check_permission(user, action):
    if action in roles[user.role]:
        return True
    return False  # "你没有权限执行此操作"
```

---

## 🌐 OAuth 2.0——"用微信登录"的工作原理

你第一次打开一个新的 App——不想注册，直接点了"用微信登录"。

这就是 OAuth 2.0：**你授权第三方 App 访问你在另一个平台上的部分信息（头像、昵称），但不用把微信密码告诉它。**

```
用户 ←→ App（想读你的微信昵称）
  │          │
  │          ↓
  │── 请求授权 ──→ 微信登录页
  │← 用户确认 ──── "App 将获得您的昵称和头像"
  │← 授权码 ───── 微信发给 App 一个临时令牌
  │── 用令牌获取数据 → 微信 API
  │← 昵称/头像 ────
```

> 💡 OAuth 2.0 的核心：**不用分享密码也能授权。**

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **认证（Authentication）** | 证明你是谁——密码/指纹/MFA |
| **授权（Authorization）** | 你能做什么——RBAC 最常用 |
| **MFA（多因素认证）** | 至少两种要素组合——大幅提升安全性 |
| **RBAC** | 权限→角色→用户——企业管理标准 |
| **OAuth 2.0** | 授权第三方访问数据——不分享密码 |

**为什么先学这个？** 身份认证是安全的第一道门。接下来看常见的网络攻击——[[network-attacks|网络攻击与防御（DDoS, MITM）]]。
