---
id: higher-order-functions
title: 高阶函数与闭包
summary: 高阶函数是把函数当成"一等公民"——函数可以作为参数传递、作为返回值返回。闭包（Closure）是函数 + 捕获的环境
difficulty: intermediate
order: 4
parent: programming-paradigms
children:
  - algebraic-data-types
related: []
prerequisites:
  - programming-paradigms
tags:
  - pl
  - functional
  - closure
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🏭 函数不只是"被调用的"——函数也是"数据"

在大多数编程语言中，你习惯了这样写代码：

```python
def add(x, y):
    return x + y

result = add(3, 5)  # 调用函数
```

但有没有想过——**函数本身能不能被当成数据传递？**

```python
# 把函数赋给变量
my_func = add
print(my_func(3, 5))  # 8 — 通过变量调用函数

# 把函数作为参数传给另一个函数
def apply(func, x, y):
    return func(x, y)

print(apply(add, 3, 5))  # 8 — add 被当作参数传递了
```

这就是**高阶函数（Higher-Order Function）**——函数可以作为**参数**和**返回值**。如果一个语言支持这个特性，我们说函数是**一等公民（First-Class Citizen）**。

> 🎪 **类比：工厂流水线**
>
> 普通函数就像流水线上的一台特定机器——只做一件事（比如拧螺丝）。
>
> 高阶函数就像一条"可编程流水线"——你可以告诉它："今天拧螺丝，明天钻孔"。它接受的"加工方案"本身就是一个参数。
>
> ```
> 流水线（高阶函数） ├── 放上机器 A（函数参数）
>                   └── 出来的是加工好的零件
> ```

---

## 🔄 最常用的三个高阶函数

你很可能已经在用高阶函数了——`map`、`filter`、`reduce`：

```python
numbers = [1, 2, 3, 4, 5]

# map：对每个元素应用函数（转换）
doubled = list(map(lambda x: x * 2, numbers))
print(doubled)  # [2, 4, 6, 8, 10]

# filter：保留满足条件的元素（筛选）
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]

# reduce：把序列"归约"成一个值（聚合）
from functools import reduce
total = reduce(lambda a, b: a + b, numbers)
print(total)  # 15 = 1+2+3+4+5
```

> 📝 **如果不用高阶函数**：
> ```python
> # 命令式版本——更多代码
> doubled = []
> for x in numbers:
>     doubled.append(x * 2)
> ```
> 
> ```python
> # 高阶函数版本——一行代码，更接近数学表达
> doubled = list(map(lambda x: x * 2, numbers))
> ```

### Python 的列表推导式——更 Pythonic 的高阶思想

Python 有更简洁的语法来表达同样的操作：

```python
numbers = [1, 2, 3, 4, 5]

doubled = [x * 2 for x in numbers]       # map
evens = [x for x in numbers if x % 2 == 0]  # filter
```

列表推导式内部就是用 map/filter 实现的——只是语法更友好。

---

## 🎁 函数作为返回值——装饰器模式

高阶函数不只是"接收函数作为参数"，还可以**返回函数**：

```python
def make_multiplier(n):
    """返回一个把输入乘以 n 的函数"""
    def multiplier(x):
        return x * n
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15
```

这里 `make_multiplier(2)` 返回了一个函数——这个函数"记住了" `n=2`。

这就是**装饰器（Decorator）** 的原理：

```python
def log_calls(func):
    """装饰器：打印函数调用日志"""
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}({args})")
        return func(*args, **kwargs)
    return wrapper

@log_calls
def add(x, y):
    return x + y

add(3, 5)
# 输出：
# 调用 add((3, 5))
# 8
```

> 💡 `@log_calls` 等价于 `add = log_calls(add)`——把 add 函数传进去，得到一个包装后的新函数。

---

## 🔐 闭包（Closure）——函数"记住"了它的环境

闭包是"高阶函数返回函数"时最重要的副产品。

### 什么是闭包？

**闭包（Closure） = 函数 + 它被创建时所在的环境（捕获的变量）**

```python
def create_counter():
    count = 0  # 外部变量
    
    def counter():  # 内部函数
        nonlocal count
        count += 1
        return count
    
    return counter

my_counter = create_counter()
print(my_counter())  # 1
print(my_counter())  # 2
print(my_counter())  # 3
```

`count` 是 `create_counter` 的局部变量——它按理说应该在 `create_counter` 返回后销毁。但 `counter` 函数"捕获"了它——`count` 被保留下来。

从内存的角度看：
- `create_counter` 返回时，正常情况下 `count` 被销毁
- 但因为 `counter` 还在引用它——`count` 的生存期被**延长**了
- 每次调用 `my_counter()`，修改的都是同一个 `count`

```python
# 两个独立的计数器
counter1 = create_counter()
counter2 = create_counter()

print(counter1())  # 1 ← counter1 自己的 count
print(counter1())  # 2
print(counter2())  # 1 ← counter2 有自己的 count（独立）
```

> 📦 **类比：外卖 App 里的"我的收藏"**
>
> 你在一家店里点了餐，加了收藏。下次打开 App → 你的收藏里还是有这家店。
>
> 闭包 = App + 你的个人收藏数据。即使你关闭了 App 又打开，你的"个人数据"（捕获的变量）还在。
>
> 每次调用 `create_counter()` 就像注册一个新用户——每个用户都有自己的收藏列表（独立的闭包环境）。

---

## 🏢 闭包的实际应用

### 回调函数与事件处理

```javascript
// JavaScript 中最常见的闭包用例
function setupButton(buttonId) {
    let clickCount = 0;
    document.getElementById(buttonId)
        .addEventListener('click', function() {
            clickCount++;
            console.log(`按钮被点击了 ${clickCount} 次`);
        });
}
// 每次点击按钮——闭包中的 clickCount 递增
```

### 函数工厂

```python
def make_discount(discount_rate):
    """创建一个打折函数"""
    def apply_discount(price):
        return price * (1 - discount_rate)
    return apply_discount

student_discount = make_discount(0.5)   # 学生价 5 折
member_discount = make_discount(0.8)    # 会员 8 折

print(student_discount(100))  # 50.0
print(member_discount(100))   # 80.0
```

### 回调中的状态保持

```python
def make_ratelimiter(max_calls, period):
    """限流器——在 period 秒内最多调用 max_calls 次"""
    calls = []
    
    def can_call():
        now = time.time()
        # 清除过期的调用记录
        while calls and calls[0] < now - period:
            calls.pop(0)
        if len(calls) < max_calls:
            calls.append(now)
            return True
        return False
    
    return can_call
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **一等公民（First-Class）** | 函数可以像值一样被传递和返回 |
| **高阶函数（HOF）** | 接收或返回函数的函数 |
| **map/filter/reduce** | 三种最常用的高阶函数——转换/筛选/聚合 |
| **闭包（Closure）** | 函数 + 捕获的外部环境变量 |
| **装饰器（Decorator）** | 高阶函数的经典应用——在不修改原函数的前提下增强功能 |
| **作用** | 让代码更简洁、可组合、模块化 |

> 🎯 **小练习**：实现一个 `once` 高阶函数——它接收一个函数作为参数，返回一个新函数。新函数第一次调用时执行原函数，之后所有调用都直接返回第一次的结果而不执行。（提示：利用闭包保存"是否已调用"的状态）

**为什么先学这个？** 高阶函数是函数式编程的基石。接下来看其理论基础——[[lambda-calculus|Lambda 演算基础]]。
