---
id: code-review
title: 代码审查与重构
summary: 代码审查（Code Review）让其他开发者检查你的代码——发现 Bug、提高可读性、分享知识。重构是在不改变外部行为的前提下优化内部结构
difficulty: intermediate
order: 10
parent: ci-cd
children: []
related: []
prerequisites:
  - ci-cd
tags:
  - software-eng
  - code-review
  - refactoring
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 📝 为什么需要"别人"来看你的代码？

你写了一篇论文，自己检查了三遍，觉得没问题了。但导师一看——"第二段的论证有逻辑漏洞"。

**自己检查自己的代码很难发现所有问题**——因为你对自己的思路太熟悉了，会不自觉地"脑补"正确的逻辑。你的眼睛看的是代码，但脑子里自动运行的是"正确的版本"。

**代码审查（Code Review）** 就是让**另一个开发者**阅读你的代码——用"新鲜的眼睛"找到你自己看不到的问题。

> 📖 **类比：互相改作文**
>
> 高中的时候，老师让你们互相交换作文本批改。
>
> **你给自己找 Bug** = 看自己的作文——"我觉得写得挺好的啊"
>
> **代码审查** = 同桌看你的作文——"这里逻辑不通顺""这里有个错别字"
>
> 审查者不熟悉你的思路，反而更容易发现你想当然的地方。

---

## ✅ 代码审查的好处

### 1️⃣ 发现 Bug

有些 Bug 你自己测了很多次都没发现——但别人一眼就看到了。

```python
# 开发者写的
def calculate_total(items):
    total = 0
    for item in items:
        total += item.price * item.quantity
    return total

# 审查者："如果 items 是空列表，会返回 0——这是预期的吗？"
# 开发者："啊，空列表应该返回 None 表示没有订单，不是 0！"
```

研究发现，**代码审查可以发现 60-90% 的 Bug**——比测试发现的更多。

### 2️⃣ 知识分享

资深开发者审查新人的代码——新人学到了"怎么写更好"。新人的代码里有些新技巧——资深者也学到了。

```
"哦，原来 Python 3.10 的 match-case 可以这么用！"
"这个算法复杂度太高了，试试用哈希表优化？"
```

### 3️⃣ 代码风格一致

整个团队用同一个标准——不会出现"一个文件用驼峰命名、另一个文件用下划线命名"的混乱。

### 4️⃣ 每人负责，但不止一人知道

核心代码至少两个人熟悉——不会出现"张三请假了，没人懂支付模块"的情况。

---

## 🔍 代码审查时看什么？

```python
# 一份 PR 给审查者的参考检查清单

def process_order(order_data):
    """处理订单——假设这是你要审查的代码"""
    
    # 1️⃣ 正确性——逻辑对吗？
    if not order_data.get("items"):
        return {"error": "订单不能为空"}
    
    # 2️⃣ 边界条件——空值、零、异常处理
    total = sum(item["price"] * item["quantity"] 
                for item in order_data["items"])
    
    # 3️⃣ 安全性——有没有注入风险？输入验证？
    # 如果 item["price"] 是用户输入的，有没有验证是数字？
    
    # 4️⃣ 性能——有没有不必要的循环或查询？
    # 这里用了列表推导，性能 OK
    
    # 5️⃣ 可读性——命名清晰？需要注释？
    # "process_order" 太泛了，建议改为 "calculate_order_total"
    
    # 6️⃣ 测试——有对应的测试吗？
    # 审查者应该能看到对应的测试文件修改
    
    return {"total": total}
```

### 给审查者的原则

```
✅ 关注"能不能改善"，而不是"挑刺"
✅ 说清楚"为什么"——不只是"这样不对"
✅ 对事不对人——审查的是代码，不是写代码的人
✅ 小 PR 更容易审查——一个大 PR 改成 5 个小 PR
```

### 给提交者的原则

```
✅ 写清楚的 PR 描述——"做了什么"和"为什么"
✅ PR 越小越好——一次只改一个功能
✅ 对审查意见表示感谢——"好建议，我改一下"
✅ PR 不要留到第二天——24 小时内开始审查
```

---

## 🔧 重构——不改变功能，只改善结构

**重构（Refactoring）** 和代码审查紧密相关——审查发现代码"可以写得更好"，但改了之后功能不变。

> **重构 = 在不改变外部行为的前提下，优化内部结构。**

```python
# 重构前——一个大函数做所有事
def process_user_data(user_data):
    # 验证
    if not user_data.get("name") or len(user_data["name"]) > 50:
        return {"error": "名字无效"}
    if not user_data.get("email") or "@" not in user_data["email"]:
        return {"error": "邮箱无效"}
    
    # 创建用户
    user = User(name=user_data["name"], email=user_data["email"])
    db.session.add(user)
    db.session.commit()
    
    # 发送通知
    send_email(user.email, "欢迎注册！")
    
    # 记录日志
    logger.info(f"新用户: {user.name}")
    
    return {"id": user.id, "name": user.name}
```

```python
# 重构后——拆成小函数，每个只做一件事
def validate_user_data(data):
    errors = []
    if not data.get("name") or len(data["name"]) > 50:
        errors.append("名字无效")
    if not data.get("email") or "@" not in data["email"]:
        errors.append("邮箱无效")
    return errors

def create_user(data):
    user = User(name=data["name"], email=data["email"])
    db.session.add(user)
    db.session.commit()
    return user

def notify_user(email):
    send_email(email, "欢迎注册！")

def process_user_data(data):
    errors = validate_user_data(data)
    if errors:
        return {"error": errors}
    
    user = create_user(data)
    notify_user(user.email)
    logger.info(f"新用户: {user.name}")
    
    return {"id": user.id, "name": user.name}
```

### 常见重构手法

| 手法 | 适用场景 | 怎么做 |
|:----:|---------|:------|
| **提取函数** | 函数太长 | 把一段逻辑拆成独立函数 |
| **重命名** | 名字不能表达意图 | `calc(a,b)` → `calculate_discount(price, rate)` |
| **简化条件** | if-else 太复杂 | 拆成多个小函数，或用策略模式 |
| **引入参数对象** | 参数太多 | 把多个参数聚合成一个对象 |
| **用多态替换条件** | 多个 if-else 检查对象类型 | 用不同的子类代替 |

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **代码审查（Code Review）** | 别人看你的代码——发现你自己看不到的问题 |
| **审查要点** | 正确性、边界、安全、性能、可读性、测试 |
| **PR 原则** | 小 PR、描述清晰、及时审查 |
| **重构（Refactoring）** | 改善内部结构，不改变外部行为 |
| **常见重构** | 提取函数、重命名、简化条件、引入参数对象 |
| **测试保障** | 重构前有测试覆盖——不改坏功能 |

> 🎯 **小练习**：找一段你之前写过但觉得"可以更好"的代码，应用本篇学到的重构手法（至少 3 种），写出重构前后的对比。

**为什么先学这个？** 代码质量有了保证，接下来看看系统之间怎么交互——[[api-design|API 设计与 REST]]。
