---
id: type-inference
title: 类型推导与多态
summary: 类型推导（Type Inference）让编译器自动推断类型——你不用写 `int x = 1` 中的 int。参数多态（泛型）让函数对不同类型都适用
difficulty: advanced
order: 9
parent: static-vs-dynamic
children: []
related: []
prerequisites:
  - static-vs-dynamic
tags:
  - pl
  - type-inference
  - polymorphism
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🔍 侦探式推理——编译器怎么猜出变量类型？

假设你看到一段代码：

```python
x = 42           # x 是整数？还是浮点？还是……？
y = x + 1        # y 呢？
```

作为人类，你"不假思索"就知道：x 是整数（42 是整数），y 也是整数（整数 + 1 还是整数）。

编译器能像你一样"推理"出来吗？——**能。这就是类型推导（Type Inference）。**

> 🕵️ **类比：侦探破案**
>
> 一个侦探走进房间，看到：
> - 房间里有脚印（`x = 42`）
> - 房间里有烟灰（`y = x + 1`）
>
> 侦探推理：
> - 鞋印 42 码 → 嫌疑人 A
> - A 的同伙 B 也在现场（y 是从 x 算出来的）
> → 结论：A 和 B 都是男性（都是整数类型）
>
> 编译器做的就是这个——**从代码片段中"收集线索"，推导出每部分的类型。**

---

## 📐 类型推导——从上下文猜类型

类型推导让静态类型语言变得不那么"啰嗦"：

### 不需要写类型

```haskell
-- Haskell——几乎所有类型都能自动推导

-- 你完全不用写类型
add x y = x + y
-- 编译器推导出：add :: Num a => a -> a -> a
-- 意思是："对于任何数字类型 a，接收两个 a，返回一个 a"

-- 推导过程：
-- 1. + 要求两个参数类型一致，结果也是同一类型
-- 2. 所以 x, y 和结果都是同一类型
-- 3. 这个类型必须有 Num（数字）约束——因为 + 的定义属于 Num
-- 4. 结论：add :: Num a => a -> a -> a
```

### Rust 的局部类型推导

```rust
// Rust——函数签名需要标注，但局部变量可以推导
fn main() {
    let x = 42;           // Rust 推断 x 是 i32（整数默认类型）
    let y = 3.14;         // f64（浮点默认类型）
    
    let v = Vec::new();   // v: Vec<_>（具体类型未定）
    v.push("hello");      // 现在确定 v: Vec<&str>
    
    // 如果类型不明确，需要手动标注
    let z: u64 = "42".parse().unwrap();
}
```

### TypeScript 的类型推导

```typescript
// TypeScript——能推导出的就不需要写
let x = 42;          // x: number（自动推导）
let y = "hello";     // y: string（自动推导）

function add(a: number, b: number) {
    return a + b;    // 返回值类型自动推导为 number
}
```

---

## 🧩 Hindley-Milner 类型推导算法

Hindley-Milner（HM）是最经典的类型推导算法，Haskell、OCaml、F# 都使用它。

算法分为两步：

### 第 1 步：收集约束

```haskell
-- 代码
f x = x + 1

-- 编译器收集：
-- f :: a → b        （f 接收类型 a 的参数，返回类型 b 的结果）
-- x :: a            （参数 x 的类型就是 a）
-- (+) :: Num c => c → c → c  （+ 要求两个参数和结果都是同一数字类型）
-- 1 :: Num d => d   （1 是数字类型）
-- 约束：a = c, c = d, b = c
```

### 第 2 步：统一（Unification）

把收集到的约束求解：

```
约束求解：
a = c（x 传给 +，所以 x 的类型 = + 的参数类型）
c = d（+ 的两个参数类型一致，1 也是数字）
b = c（返回值类型 = + 的结果类型）
→ a = c = d = b, 且满足 Num
→ f :: Num a => a → a → a
```

> 💡 **参数多态（Parametric Polymorphism）** 就是 HM 系统的自然产物——当类型推导得到一个"带类型变量"的类型（如 `a → a`），表示这个函数对所有类型 a 都适用。这就是"泛型"。

---

## 🔄 多态（Polymorphism）——多种形态

多态让同一个函数可以处理不同类型的参数。主要有三种：

### ① 参数多态（Parametric Polymorphism）——泛型

**对一个函数来说：对所有类型 T，行为都一样。**

```python
# Python 不需要泛型（动态类型本身就有这个效果）
# 但 Python 的类型标注支持泛型
from typing import List, TypeVar

T = TypeVar('T')
def first(items: List[T]) -> T:
    return items[0]

# 对任意类型的列表都适用
first([1, 2, 3])         # int → 1
first(["a", "b", "c"])  # str → "a"
```

```java
// Java 泛型——实现参数多态
class Box<T> {
    private T value;
    public void set(T v) { this.value = v; }
    public T get() { return value; }
}

Box<Integer> intBox = new Box<>();  // T = Integer
Box<String> strBox = new Box<>();   // T = String
```

> 📦 **类比：快递箱**
>
> 一个"快递箱"（泛型容器）可以装任何东西——手机、书、衣服。不管装什么，箱子本身的使用方式（开门、关门）是一样的。
>
> `Box<T>` 就是"可以装任意类型 T 的箱子"。

### ② 特设多态（Ad-hoc Polymorphism）——重载

**对不同的类型，有不同的实现。**

```java
// Java 方法重载——同名函数不同参数类型
class Printer {
    void print(int x) { System.out.println("整数: " + x); }
    void print(String s) { System.out.println("字符串: " + s); }
    void print(double d) { System.out.println("浮点: " + d); }
}

Printer p = new Printer();
p.print(42);       // 整数: 42
p.print("hello");  // 字符串: hello
```

```python
# Python —— 通过 isinstance 模拟重载
def process(value):
    if isinstance(value, int):
        return value * 2
    elif isinstance(value, str):
        return value.upper()
    # ...
```

### ③ 子类型多态（Subtype Polymorphism）——继承

**子类可以替换父类使用。**

```java
// Java——继承多态
class Animal {
    void speak() { System.out.println("..."); }
}
class Dog extends Animal {
    void speak() { System.out.println("汪汪！"); }
}
class Cat extends Animal {
    void speak() { System.out.println("喵~"); }
}

// 子类型多态——函数接收父类型，实际传入子类型
void makeSound(Animal a) {
    a.speak();  // 实际调用子类的方法
}

makeSound(new Dog());  // 汪汪！
makeSound(new Cat());  // 喵~
```

---

## 📊 三种多态对比

| 类型 | 核心思想 | 代表语言实现 | 类似概念 |
|:----:|---------|:-----------:|:--------:|
| **参数多态** | 对所有类型同一实现 | Java 泛型、C++ 模板、Rust 泛型 | 快递箱 |
| **特设多态** | 不同类型不同实现 | 函数重载、运算符重载 | 对不同的食材用不同的菜谱 |
| **子类型多态** | 子类替换父类 | Java/C++ 继承 | "它是一只狗，也是动物" |

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **类型推导（Type Inference）** | 编译器自动推断表达式类型 |
| **Hindley-Milner** | 经典的类型推导算法——收集约束 + 统一求解 |
| **参数多态（泛型）** | 同一实现适用于所有类型 |
| **特设多态（重载）** | 不同类型有不同实现 |
| **子类型多态（继承）** | 子类可以当作父类使用 |
| **类型变量** | 推导结果中的 `a`、`b`——表示"任意类型" |

> 🎯 **小练习**：下面的 Haskell 表达式——编译器会推导出什么类型？
> ```haskell
> mystery f x y = f (x + y)
> ```
> 提示：`+` 的类型是 `Num a => a → a → a`。按照 HM 算法的步骤分析。

**为什么先学这个？** 类型推导和参数多态是静态类型系统的核心能力。接下来看子类型多态带来的一个复杂问题——[[subtyping|子类型与变型（协变/逆变）]]。
