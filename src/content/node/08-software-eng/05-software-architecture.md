---
id: software-architecture
title: 软件架构与设计模式
summary: 软件架构（Software Architecture）是系统的"骨架"——模块划分、组件关系、通信方式。设计模式（Design Pattern）是常见问题的可复用解决方案
difficulty: advanced
order: 5
parent: requirements-analysis
children:
  - uml-modeling
  - solid-principles
related: []
prerequisites:
  - requirements-analysis
tags:
  - software-eng
  - architecture
  - design-patterns
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🏛️ 从"茅草屋"到"摩天大楼"

你写一个"Hello World"——一个文件，十行代码，没有设计可言。

但如果你要写一个淘宝——几百个模块、几百个工程师、每天上亿次请求——没有规划就开干，结果就是"一团乱麻"。

**软件架构（Software Architecture）** 就是系统的"骨架设计"——决定系统由哪些组件组成、组件之间怎么交互、数据怎么流动。

> 📖 **类比：建筑蓝图"
>
> 盖一栋 30 层的写字楼，不能直接让施工队开工。必须有**蓝图**——哪里是承重墙、电梯井在哪、水电管道怎么走。
>
> 软件架构也是一样——在写第一行代码之前，先设计好"蓝图"：
> - **分层**：表现层、业务层、数据层（对应建筑的楼层功能分区）
> - **模块**：用户模块、订单模块、支付模块（对应建筑的各个功能区域）
> - **接口**：模块之间怎么通信（对应走廊、电梯、管道）

---

## 🏗️ 三种主流架构风格

### ① 分层架构（Layered Architecture）——最经典

系统按职责分成若干层，每一层只和相邻层交互：

```
┌──────────────────────┐
│  表现层（UI）         │  用户界面、API 入口
├──────────────────────┤
│  业务逻辑层（Service）│  核心业务处理
├──────────────────────┤
│  数据访问层（DAO）    │  数据库操作
├──────────────────────┤
│  数据库               │  数据存储
└──────────────────────┘
```

```python
# 分层架构的 Python 示例
# 表现层
@app.route('/api/users/<id>')
def get_user(id):
    return jsonify(user_service.get_user(id))

# 业务层
class UserService:
    def get_user(self, id):
        user = user_dao.find_by_id(id)
        if not user:
            raise NotFound("用户不存在")
        return user.to_dict()

# 数据层
class UserDAO:
    def find_by_id(self, id):
        return db.session.query(User).get(id)
```

**优点**：职责清晰、易于理解、各层可独立修改。
**缺点**：层数多了有性能开销，不适合非常复杂的业务。

> 大多数 Web 后端（Spring Boot、Django、Flask）默认就是分层架构。

### ② 微服务架构（Microservices）——当前最热门

系统由多个**独立部署的小服务**组成，每个服务负责一个业务领域，通过 API 通信：

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ 用户服务   │  │ 订单服务   │  │ 支付服务   │  │ 商品服务   │
│ (独立部署) │  │ (独立部署) │  │ (独立部署) │  │ (独立部署) │
└─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘
      └──────────────┴──────────────┴──────────────┘
                       │ API Gateway（统一入口）
                       ↓
                   客户端（App/浏览器）
```

**优点**：
- 每个服务可以独立开发、部署、扩展
- 一个服务出问题不影响其他服务
- 不同服务可以用不同的技术栈

**缺点**：
- 分布式系统的复杂性（网络延迟、数据一致性、服务发现）
- 调试和测试更困难

> 🏪 **类比：大型超市 vs 社区小店群**
>
> 分层架构 = 大型超市——所有东西在一栋楼里，分楼层（生鲜在一楼、日用品在二楼）
>
> 微服务架构 = 社区小店群——独立的水果店、面包店、药店各开各的。一家店装修不影响其他店。周末人多时面包店可以临时加人手（独立扩展）。

### ③ 事件驱动架构（Event-Driven Architecture）

组件通过**事件**来通信——一个组件发布事件，其他组件订阅感兴趣的事件：

```python
# 事件驱动示例
# 用户注册后——触发一连串事件

def on_user_registered(user):
    # 发布"用户注册"事件
    event_bus.publish("user.registered", user)

# 这些处理器"订阅"了这个事件
@event_bus.subscribe("user.registered")
def send_welcome_email(user):
    email_service.send(user.email, "欢迎注册！")

@event_bus.subscribe("user.registered")
def init_user_profile(user):
    profile_service.create_profile(user.id)

@event_bus.subscribe("user.registered")  
def add_to_crm(user):
    crm_service.add_contact(user.email)
```

**优点**：松耦合、可扩展性强、适合异步处理。
**缺点**：事件流程不直观（"到底哪个 handler 在处理这个事件？"）、调试困难。

---

## 🧩 设计模式（Design Patterns）

设计模式是**常见问题的可复用解决方案**——不是代码库，而是"经验总结"。

### 创建型模式——怎么创建对象

| 模式 | 解决什么问题 | 类比 |
|:----:|------------|:----:|
| **单例（Singleton）** | 全局只需要一个实例 | 全班只有一个班长 |
| **工厂（Factory）** | 根据条件创建不同类型的对象 | 食堂窗口——说"套餐A"，给你对应套餐 |
| **建造者（Builder）** | 创建复杂对象，分步骤构造 | 组装电脑——选CPU→选显卡→选内存……最后组装 |

```python
# 单例模式
class Config:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

# 不管在哪里调用 Config()，得到的都是同一个对象
c1 = Config()
c2 = Config()
print(c1 is c2)  # True
```

### 结构型模式——怎么组织类和对象

| 模式 | 解决什么问题 | 类比 |
|:----:|------------|:----:|
| **适配器（Adapter）** | 让不兼容的接口能一起工作 | 电源转换插头 |
| **代理（Proxy）** | 控制对对象的访问 | 经纪人——你找明星拍戏，联系经纪人不是直接联系明星 |
| **装饰器（Decorator）** | 动态给对象添加职责 | 手机壳——给手机加保护，但不改变手机本身 |

### 行为型模式——怎么处理对象之间的交互

| 模式 | 解决什么问题 | 类比 |
|:----:|------------|:----:|
| **观察者（Observer）** | 一个对象变化时通知所有依赖者 | 班级群——老师发通知，全班都收到 |
| **策略（Strategy）** | 算法的替换和选择 | 去火车站——可以打车/地铁/公交（策略不同，结果一样）|
| **模板方法（Template Method）** | 固定算法骨架，部分步骤子类实现 | 做饭——都是"准备→烹饪→装盘"，但具体内容不同 |

```python
# 策略模式——支付的多种方式
class PaymentStrategy:
    def pay(self, amount): pass

class Alipay(PaymentStrategy):
    def pay(self, amount):
        print(f"支付宝支付 {amount} 元")

class WechatPay(PaymentStrategy):
    def pay(self, amount):
        print(f"微信支付 {amount} 元")

class BankCard(PaymentStrategy):
    def pay(self, amount):
        print(f"银行卡支付 {amount} 元")

# 使用——运行时可切换策略
def checkout(strategy, amount):
    strategy.pay(amount)

checkout(Alipay(), 100)    # 支付宝支付 100 元
checkout(WechatPay(), 200) # 微信支付 200 元
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **分层架构** | 表现层/业务层/数据层——经典 Web 架构 |
| **微服务** | 独立小服务组合——独立部署、独立扩展 |
| **事件驱动** | 通过事件通信——松耦合、异步 |
| **单例模式** | 全局唯一实例——配置文件、连接池 |
| **策略模式** | 算法可替换——多种支付方式、多种排序 |
| **观察者模式** | 1:N 通知——事件监听、消息订阅 |

> 🎯 **小练习**：你的课程项目需要一个"通知系统"——用户注册时、选课成功时、退课时都需要发送通知（邮件 + 站内消息 + 短信）。你会用哪种设计模式来实现？为什么？

**为什么先学这个？** 架构设计后，需要把设计可视化——[[uml-modeling|UML 建模]]。
