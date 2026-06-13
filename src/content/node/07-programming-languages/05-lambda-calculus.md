---
id: lambda-calculus
title: Lambda 演算基础
summary: Lambda 演算（λ-calculus）是函数式编程的理论基础——只用三样东西（变量、抽象、应用）就能表达一切计算
difficulty: advanced
order: 5
parent: evaluation-strategies
children: []
related: []
prerequisites:
  - evaluation-strategies
tags:
  - pl
  - lambda
  - theory
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🧬 计算的"最小 DNA"

你有没有想过一个问题：**要表达一切计算，最少需要多少"基本元素"？**

你需要循环吗？需要 if-else 吗？需要赋值吗？需要变量类型吗？

1930 年代，数学家 Alonzo Church 给出了一个惊人的答案：**只需要三样东西**——变量、函数定义、函数应用。

这就是 **Lambda 演算（λ-calculus）**——一个极其简洁但**图灵完备**的数学模型。它只用三条规则就表达了所有可能的计算。

> 🧱 **类比：乐高的基础积木**
>
> 乐高有成千上万种零件，但最基础的"2×4 积木块"只有一种形状。用足够多的基础积木，你可以拼出任何东西——城堡、飞船、恐龙……
>
> Lambda 演算就是编程世界的"基础积木"——它本身很简单，但足以构建任何程序。现代编程语言（尤其是函数式语言）的所有特性，都能追溯到 Lambda 演算中的某个概念。

---

## 📐 Lambda 演算的三要素

Lambda 演算只有三种构造：

```
λ-calculus 语法：
⟨表达式⟩ := ⟨变量⟩          — 比如 x, y, z
         | ⟨λ⟩⟨变量⟩.⟨表达式⟩ — 函数定义（抽象）
         | ⟨表达式⟩ ⟨表达式⟩  — 函数应用
```

### 1️⃣ 变量（Variable）

```
x         — 名字，指代某个值
y
```

### 2️⃣ 抽象（Abstraction）——定义函数

```
λx. x    — 接收参数 x，返回 x（恒等函数）
λx. x+1  — 接收参数 x，返回 x+1
```

**语法**：`λ` 后面跟参数名，`.` 后面跟函数体。

用 Python 来类比：

```python
# λx. x        → lambda x: x
# λx. x+1      → lambda x: x+1
# λx. λy. x    → lambda x: lambda y: x
```

### 3️⃣ 应用（Application）——调用函数

```
(λx. x) y    — 把 y 传给恒等函数
(λx. x+1) 5  — 把 5 传给"加一"函数
```

---

## 🔄 β 归约——计算的本质

Lambda 演算中的"计算"就是做 **β 归约（Beta Reduction）**——把函数应用于参数，用参数替换函数体中的变量。

```
(λx. M) N  →  M[x := N]
```

把这个 N 代入 M 中所有的 x 出现的位置。

### 例子

```
(λx. x) apple            → apple        （恒等函数）
(λx. λy. x) a b          → a            （取第一个参数）
(λx. λy. y) a b          → b            （取第二个参数）

(λx. x * x) 5            → 5 * 5        → 25
(λf. f 3) (λx. x + 1)    → (λx. x+1) 3  → 3+1  → 4
```

### 多步归约

```
(λx. λy. x) (λz. z) (λw. w)
→ (λy. (λz. z)) (λw. w)    — 把 (λz.z) 代入 x
→ (λz. z)                   — 把 (λw.w) 代入 y（但 y 没在函数体中出现）
```

这就是计算的本质——**反复做替换，直到不能再替换（得到范式）。**

---

## 🎯 用 Lambda 演算"编码"数据

Lambda 演算没有数字、没有布尔值、没有 if-else。但这些概念都可以用函数"编码"出来：

### Church 编码：布尔值

```python
# True = λx. λy. x
TRUE = lambda x: lambda y: x

# False = λx. λy. y
FALSE = lambda x: lambda y: y

# if-then-else：接收一个条件、一个真分支、一个假分支
# if cond then t else f = cond t f
# 因为 True t f = t，False t f = f

IF = lambda cond: lambda t: lambda f: cond(t)(f)

# 测试
print(IF(TRUE)("yes")("no"))   # "yes"
print(IF(FALSE)("yes")("no"))  # "no"
```

**为什么这就是布尔值？** `True` 返回第一个参数，`False` 返回第二个参数——这就是"条件选择"的本质。

### Church 编码：数字

```python
# 数字 n = λf. λx. f(f(...f(x)...)) — 把 f 应用 n 次到 x
ZERO = lambda f: lambda x: x                # 应用 0 次
ONE = lambda f: lambda x: f(x)              # 应用 1 次
TWO = lambda f: lambda x: f(f(x))           # 应用 2 次
THREE = lambda f: lambda x: f(f(f(x)))      # 应用 3 次

# 后继：数字 + 1
SUCC = lambda n: lambda f: lambda x: f(n(f)(x))

print(SUCC(ONE)(lambda x: x+1)(0))  # 2 — 验证
```

> 💡 **Church 编码的核心思想**：数字 n 就是"把 f 应用 n 次"。加法就是"先应用 m 次 f，再应用 n 次 f"。

---

## 🔬 Lambda 演算为什么重要？

| 意义 | 说明 |
|:----:|------|
| **计算的数学模型** | 图灵机描述"硬件级"计算，λ演算描述"逻辑级"计算 |
| **函数式编程的根基** | 函数式语言（Haskell、Scheme）直接基于 λ 演算设计 |
| **变量作用域** | λ 演算中的"绑定变量"和"自由变量"就是变量作用域的数学定义 |
| **类型系统** | 简单类型 λ 演算（Simply Typed Lambda Calculus）是类型系统的起点 |
| **编程语言语义** | 很多语言的语义通过"翻译成 λ 演算"来定义 |

### 自由变量 vs 绑定变量

```
λx. (x y)
     ↑   ↑
    绑定  自由

x 是绑定变量（由 λx 绑定）
y 是自由变量（没有被 λ 绑定）
```

**联系作用域**：这就是[[variable-scope|变量作用域]]的数学定义——绑定变量就是局部变量，自由变量就是捕获的外部变量。

---

## 🧠 递归——Y 组合子

在 Lambda 演算中，函数没有名字（都是匿名的）。那怎么实现递归——函数调用自己？

答案是用 **Y 组合子（Y Combinator）**——一个神奇的函数，可以在没有命名的系统中实现递归：

```python
# Y = λf. (λx. f (x x)) (λx. f (x x))
Y = lambda f: (lambda x: f(x(x)))(lambda x: f(x(x)))

# 用 Y 实现阶乘
fact = Y(lambda f: lambda n: 1 if n == 0 else n * f(n-1))
print(fact(5))  # 120
```

> 💡 你不需要记住 Y 组合子的实现细节。它的意义在于证明了：**即使没有"命名函数"的能力，递归仍然可以做得到**。这也是 Lambda 演算图灵完备的关键证明。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **λ 演算** | 计算的数学模型——只用变量、抽象、应用 |
| **β 归约** | 把参数代入函数体——计算的本质 |
| **Church 编码** | 用函数表示布尔值、数字、数据结构 |
| **自由/绑定变量** | 作用域的数学定义 |
| **Y 组合子** | 匿名系统中实现递归的"魔法函数" |
| **图灵完备** | λ 演算可以表达任何可计算函数 |

> 🎯 **思考题**：`(λx. x x) (λx. x x)` 这个表达式归约会得到什么？（提示：这是一个"永恒循环"——每次归约后得到自身。它是 Lambda 演算中"无限循环"的表达。）

**为什么先学这个？** Lambda 演算是函数式编程的理论源泉。接下来看看基于函数式思想的数据结构——[[algebraic-data-types|代数数据类型与模式匹配]]。
