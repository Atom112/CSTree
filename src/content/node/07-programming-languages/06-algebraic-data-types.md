---
id: algebraic-data-types
title: 代数数据类型与模式匹配
summary: 代数数据类型（Algebraic Data Type, ADT）用"组合"的方式构造类型——积类型（Product）是 AND，和类型（Sum）是 OR。模式匹配（Pattern Matching）是解构 ADT 的优雅方式
difficulty: intermediate
order: 6
parent: higher-order-functions
children:
  - lazy-evaluation
related: []
prerequisites:
  - higher-order-functions
tags:
  - pl
  - types
  - pattern-matching
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🍱 套餐 vs 套餐选项——两种组合方式

去食堂打饭：

**套餐（Product）**：一份套餐 = 主食 + 主菜 + 配菜——**三者都要有**。这和"AND（与）"是一个意思：套餐 = 主食 AND 主菜 AND 配菜。

**选项（Sum）**：主食三选一 = 米饭 OR 馒头 OR 面条——**三选一**。这和"OR（或）"是一个意思。

**代数数据类型（Algebraic Data Type, ADT）** 就是用这两种基本方式组合类型的：

- **积类型（Product Type）**：多个类型"同时存在"——AND
- **和类型（Sum Type）**：多个类型"选一个"——OR

这个"代数"的名字很贴切：积类型的可能取值数 = 各类型取值数的**乘积**，和类型的可能取值数 = 各类型取值数的**和**。

> 🧮 **代数运算的对应**：
> - 积类型 → 乘法（a × b）
> - 和类型 → 加法（a + b）
> - 函数类型 → 指数（a → b = b^a）
>
> ```haskell
> -- Bool 有 2 个值（True/False）
> -- 积类型 (Bool, Bool) 有 2×2 = 4 个值
> -- 和类型 Either Bool Bool 有 2+2 = 4 个值
> -- 函数 Bool → Bool 有 2^2 = 4 个可能的函数
> ```

---

## 📦 积类型（Product Type）——同时拥有多个值

积类型就是"多个值打包在一起"——类似于 C 语言中的 `struct`：

```haskell
-- Haskell —— 积类型
data Person = Person String Int String
--            姓名     年龄  城市
-- Person 类型由"姓名 AND 年龄 AND 城市"组成

-- 创建 Person 值
p = Person "张三" 20 "北京"
--     String  Int  String
```

```python
# Python 中可以这样理解积类型
# 积类型 = 一个"定制的容器"，所有字段同时存在
@dataclass
class Person:
    name: str
    age: int
    city: str

p = Person("张三", 20, "北京")  # 必须提供所有字段
```

**积类型的"积"在哪里？** 如果 String 有无限多种可能（所有可能的字符串），Int 有 2³² 种可能——那么 Person 的可能取值数 = ∞ × 2³² × ∞ = 无限种。但在限制条件下，积类型取值数确实是各个类型取值数的乘积。

---

## 🎨 和类型（Sum Type）——多个可能性中选一个

和类型是大多数非函数式语言**没有**但极其重要的概念。它表示"要么是 A，要么是 B"：

```haskell
-- Haskell —— 和类型
data Shape = Circle Float        -- 圆（半径）
           | Rect Float Float    -- 矩形（宽×高）
           | Triangle Float Float Float  -- 三角形（三边长）
```

这里 `Shape` 可以是 `Circle`、`Rect` 或 `Triangle` 中的**一种**——但不会同时是两种。

```python
# Python 没有内建的和类型，但可以用 Union 类型模拟
from typing import Union

# 一个形状要么是圆，要么是矩形，要么是三角形
Shape = Union[Circle, Rect, Triangle]
```

**为什么大多数非函数式语言没有和类型？** C 语言有 `union`（联合体）但不安全——你无法知道当前存储的是哪个变体。Java/C++ 通过继承多态模拟和类型（父类引用指向任意子类）。函数式语言直接内置了**带标签的联合体（Tagged Union）**。

### 和类型 vs 继承的区别

```
和类型（代数数据类型）：
  一个 Shape = Circle | Rect | Triangle
  → 所有可能性是"封闭的"——编译器知道所有子类型

继承（面向对象）：
  Shape 的子类可以无限扩展
  → 子类型是"开放的"——编译器不知道所有子类型
```

这就是"表达式问题（Expression Problem）"的核心：**和类型使添加新操作容易（但添加新类型困难），继承使添加新子类容易（但添加新操作困难）。**

---

## 🎯 模式匹配——解构 ADT 的方式

有了积类型和和类型，你需要一种方式来"拆开"它们——**模式匹配（Pattern Matching）**：

```haskell
-- Haskell 模式匹配
area :: Shape -> Float
area (Circle r) = 3.14 * r * r               -- 如果是 Circle，提取半径 r
area (Rect w h) = w * h                       -- 如果是 Rect，提取宽 w 和高 h
area (Triangle a b c) = sqrt(s*(s-a)*(s-b)*(s-c))  -- 如果是 Triangle，提取三边
    where s = (a+b+c)/2
```

**模式匹配 = 检查类型 + 提取数据的组合。**

不用 if-else，不用类型判断——直接在函数参数中"匹配"不同的构造器。

### Python 3.10+ 的 match-case

Python 从 3.10 开始引入了 `match` 语句，和模式匹配类似：

```python
def describe(value):
    match value:
        case 0:
            return "零"
        case [x, y]:  # 匹配两个元素的列表
            return f"列表：{x} 和 {y}"
        case {"name": n, "age": a}:  # 匹配字典结构
            return f"{n}，{a}岁"
        case _:  # 默认
            return "其他"
```

虽然 Python 的 match 没有 Haskell 那样强大，但基本思想相同——**按结构匹配并提取数据**。

---

## 📋 现实中的应用

### Rust 的 Option 和 Result

Rust 非常依赖和类型来处理错误和可选值：

```rust
// Rust —— 和类型的典型应用

// Option：要么有值（Some），要么没有值（None）
enum Option<T> {
    Some(T),
    None,
}

// Result：要么成功（Ok），要么失败（Err）
enum Result<T, E> {
    Ok(T),
    Err(E),
}

// 使用模式匹配——强制处理所有可能性
fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 { None } else { Some(a / b) }
}

match divide(10.0, 2.0) {
    Some(result) => println!("结果是：{}", result),
    None => println!("除数不能为零"),
}
// 编译器会警告：如果你没处理 None 分支——这是和类型的核心优势
```

### 象棋程序中的 ADT

```haskell
data Piece = King | Queen | Rook | Bishop | Knight | Pawn
data Color = Black | White
data Square = Square Color Piece  -- 积类型
data MaybePiece = Occupied Square | Empty  -- 和类型

-- 判断某个走法是否合法
isValidMove :: MaybePiece -> Position -> Position -> Bool
isValidMove Empty _ _ = False  -- 空格子上没有棋子可走
isValidMove (Occupied (Square color piece)) from to = 
    -- 实际的走法判断逻辑
    case piece of
        King -> ...
        Queen -> ...
        ...
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **积类型（Product Type）** | AND——多个字段同时存在（类似 struct）|
| **和类型（Sum Type）** | OR——几个选项中选一个（类似 enum）|
| **代数数据类型（ADT）** | 积类型 + 和类型的统称 |
| **模式匹配** | 解构 ADT 的方式——检查类型 + 提取数据 |
| **Tagged Union** | 带标签的和类型——编译器知道当前是哪个变体 |
| **表达式问题** | 和类型易操作难扩类型，继承易扩类型难操作 |

> 🎯 **小练习**：用 Python 的 `@dataclass` 和 `Union` 类型，定义一个"表达式"ADT——一个表达式可以是 `Number(value)`、`Add(left, right)` 或 `Multiply(left, right)`。然后写一个函数计算表达式的值。

**为什么先学这个？** 理解 ADT 后，学习函数式编程的一个重要工具——[[lazy-evaluation|惰性求值与无穷数据结构]]。
