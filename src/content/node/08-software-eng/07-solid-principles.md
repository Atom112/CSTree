---
id: solid-principles
title: SOLID 原则
summary: SOLID 是面向对象设计的五大原则——让代码更易维护、扩展、测试
difficulty: intermediate
order: 7
parent: software-architecture
children:
  - software-testing
related: []
prerequisites:
  - software-architecture
tags:
  - software-eng
  - solid
  - oop
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🧱 好的设计不是玄学——有原则可循

假设你接手了一个学长的课程项目代码——几千行全在一个文件里、一个函数做十件事、改一个地方崩三个功能。

你肯定会想：**这代码怎么这么烂？**

但"好代码"和"烂代码"的区别不是玄学。Robert C. Martin（Uncle Bob）在 2000 年代总结了面向对象设计的**五大原则**——**SOLID**。一句话总结：

> **好的设计：改一个需求，只改一处代码。**
> **烂的设计：改一个需求，牵连十处。**

> 📐 **SOLID** 是五个原则首字母的缩写：
> - **S**ingle Responsibility（单一职责）
> - **O**pen-Closed（开闭原则）
> - **L**iskov Substitution（里氏替换）
> - **I**nterface Segregation（接口隔离）
> - **D**ependency Inversion（依赖反转）

---

## S — 单一职责原则（SRP）

**核心思想：一个类只应该有一个引起它变化的原因。** ——俗称"一个类只做一件事"。

### ❌ 反面例子

```python
class UserService:
    def create_user(self, name, email):
        # 职责 1：业务逻辑（创建用户）
        user = User(name=name, email=email)
        db.save(user)
        
        # 职责 2：发送邮件
        send_email(email, "欢迎注册！")
        
        # 职责 3：写日志
        logger.info(f"用户 {name} 注册成功")
        
        # 职责 4：生成统计数据
        stats.increment("new_user")
        
        return user
```

这个类有**四个职责**。如果邮件服务改了（从 SMTP 换成第三方 API）——你要改这个类。如果日志格式变了——你还要改这个类。**一个类有多个变化原因 = 需要频繁修改 = 容易出错。**

### ✅ 正确做法：拆

```python
# 每个类只负责一件事
class UserService:
    def create_user(self, name, email):
        user = User(name=name, email=email)
        db.save(user)
        return user

class EmailService:
    def send_welcome(self, email):
        send_email(email, "欢迎注册！")

class Logger:
    def log(self, message):
        logger.info(message)

class StatsService:
    def new_user(self):
        stats.increment("new_user")
```

> 🏪 **类比：医院科室"
>
> **违反 SRP** = 一个医生同时做挂号、看病、拿药、收费——全栈式服务，但效率低，一个人出问题整个流程卡住。
>
> **遵守 SRP** = 挂号台管挂号、医生管看病、药房管拿药、收费处管收费——各司其职，改一个科室不影响其他科室。

---

## O — 开闭原则（OCP）

**核心思想：对扩展开放，对修改关闭。** ——添加新功能时，尽量通过"加新代码"而不是"改旧代码"来实现。

### ❌ 反面例子

```python
class PaymentProcessor:
    def process(self, payment_type, amount):
        if payment_type == "alipay":
            # 处理支付宝
            ...
        elif payment_type == "wechat":
            # 处理微信支付
            ...
        # 每次加新支付方式，都要改这个类！
```

### ✅ 正确做法

```python
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount): pass

class Alipay(PaymentMethod):
    def pay(self, amount): 
        print(f"支付宝支付 {amount}")

class WechatPay(PaymentMethod):
    def pay(self, amount):
        print(f"微信支付 {amount}")

# 新增支付方式——不需要改旧代码
class ApplePay(PaymentMethod):
    def pay(self, amount):
        print(f"Apple Pay 支付 {amount}")
        
class PaymentProcessor:
    def process(self, method: PaymentMethod, amount: float):
        method.pay(amount)  # 对扩展开放——不用改 process 方法
```

> 🧩 **类比：USB 接口**
>
> 电脑的 USB 接口——插 U 盘、鼠标、键盘、手机都可以。你不用因为出了新款 U 盘就换电脑。
>
> USB 接口是"对扩展开放"——新的 USB 设备插上去就能用。
> 电脑的 USB 驱动是"对修改关闭"——不用因为新设备更新驱动程序。

---

## L — 里氏替换原则（LSP）

**核心思想：子类型必须能替换父类型。** ——如果 S 是 T 的子类，用 T 的地方换成 S 应该一切正常。

### ❌ 经典反面例子：正方形 vs 矩形

```python
class Rectangle:
    def __init__(self):
        self.width = 0
        self.height = 0
    
    def set_width(self, w): self.width = w
    def set_height(self, h): self.height = h
    def area(self): return self.width * self.height

class Square(Rectangle):
    def set_width(self, w):
        self.width = w
        self.height = w  # 强制保持正方形
    
    def set_height(self, h):
        self.width = h
        self.height = h

# 使用者按 Rectangle 的逻辑使用
def resize_and_print(r: Rectangle):
    r.set_width(5)
    r.set_height(10)
    print(f"面积 = {r.area()}")  # Rectangle → 50 ✅
                                    # Square → 100 ❌（用户预期是 50）
```

这里 `Square` 违反了 LSP——它不能透明地替换 `Rectangle`。数学上"正方形是矩形"，但在可变对象的语境中——行为不同。

> 🐦 **类比：如果"企鹅"继承"鸟"**
>
> ```python
> class Bird:
>     def fly(self): ...
> class Penguin(Bird):  # ❌ 企鹅不能飞
>     def fly(self): raise Exception("企鹅不会飞")
> ```
>
> 这就是违反 LSP——用 Bird 的地方不能替换成 Penguin。正确的做法：把"能飞的"抽象成 `Flyable` 接口。

**LSP 的实际含义**：子类可以扩展父类的功能，但不能改变父类的行为约定。

---

## I — 接口隔离原则（ISP）

**核心思想：不要强迫客户端依赖它不需要的接口。** ——大接口拆成小的、专门化的接口。

### ❌ 反面例子

```python
class Worker(ABC):
    @abstractmethod
    def work(self): pass
    @abstractmethod
    def eat(self): pass
    @abstractmethod
    def sleep(self): pass

class Human(Worker):
    def work(self): print("工作")
    def eat(self): print("吃饭")
    def sleep(self): print("睡觉")

class Robot(Worker):
    def work(self): print("工作")
    # ❌ Robot 不需要 eat 和 sleep，但被迫实现了
    def eat(self): pass
    def sleep(self): pass
```

### ✅ 正确做法

```python
class Workable(ABC):
    @abstractmethod
    def work(self): pass

class Eatable(ABC):
    @abstractmethod
    def eat(self): pass

class Sleepable(ABC):
    @abstractmethod
    def sleep(self): pass

class Human(Workable, Eatable, Sleepable): ...
class Robot(Workable): ...  # 只实现需要的接口
```

---

## D — 依赖反转原则（DIP）

**核心思想：依赖抽象，不依赖具体实现。** ——高层模块不依赖低层模块，两者都依赖抽象接口。

### ❌ 反面例子

```python
class MySQLDatabase:
    def save(self, data):
        print(f"保存到 MySQL: {data}")

class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # 直接依赖具体实现
    
    def create_user(self, name):
        self.db.save({"name": name})
```

如果要换成 PostgreSQL——你必须改 `UserService` 的代码。

### ✅ 正确做法

```python
from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def save(self, data): pass

class MySQLDatabase(Database):
    def save(self, data):
        print(f"保存到 MySQL: {data}")

class PostgreSQLDatabase(Database):
    def save(self, data):
        print(f"保存到 PostgreSQL: {data}")

class UserService:
    def __init__(self, db: Database):  # 依赖抽象
        self.db = db
    
    def create_user(self, name):
        self.db.save({"name": name})

# 切换数据库——不需改 UserService
service = UserService(MySQLDatabase())  # 用 MySQL
service = UserService(PostgreSQLDatabase())  # 或者用 PostgreSQL
```

> 💡 **DIP 的实际应用**：依赖注入（Dependency Injection, DI）——在构造函数中"注入"依赖，而不是在内部创建依赖。Spring 框架的核心就是 DI。

---

## 📝 小结

| 原则 | 一句话 | 怎么检查你在违反它？|
|:----:|--------|:------------------:|
| **SRP 单一职责** | 一个类只做一件事 | "我为什么要改这个类？"有多个原因就是违反 |
| **OCP 开闭原则** | 加功能不修改旧代码 | "加个新功能要改几个文件？"改一大堆就是违反 |
| **LSP 里氏替换** | 子类能替换父类 | "子类有没有抛出父类不会抛的异常？" |
| **ISP 接口隔离** | 接口不要太大 | "实现类有没有空方法？" |
| **DIP 依赖反转** | 依赖接口不依赖实现 | "换数据库需要改业务代码吗？" |

> 🎯 **小练习**：找一个你之前写过的"不太满意"的类，对照 SOLID 的五个原则分析它违反了哪几条，然后动手重构。

**为什么先学这个？** 好的设计原则指导你写出可维护的代码——但还需要[[software-testing|软件测试]]来验证代码的正确性。
