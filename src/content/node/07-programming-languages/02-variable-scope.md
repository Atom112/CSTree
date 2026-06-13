---
id: variable-scope
title: 变量、作用域与绑定
summary: 作用域（Scope）决定变量在哪些区域可见——静态作用域看代码结构，动态作用域看调用链。绑定（Binding）是把名字和实体关联起来的过程
difficulty: intermediate
order: 2
parent: programming-paradigms
children:
  - evaluation-strategies
related: []
prerequisites:
  - programming-paradigms
tags:
  - pl
  - scope
  - binding
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🏘️ "张三"到底指的是谁？

你在宿舍喊了一声"张三"——如果你在计算机系宿舍楼，可能有三四个人同时回头。因为这一层住着好几个叫张三的人。

但在你们宿舍内部（你的小程序里），"张三"只指你的室友（局部变量）。

"张三"这个名字**绑定**到哪个人，取决于你**在什么地方、什么时候**喊出这个名字——这就是编程语言中**作用域（Scope）** 和**绑定（Binding）** 要解决的问题。

> 📐 **概念速览**：
> - **绑定（Binding）**——把"名字"和"实体"关联起来的过程
> - **作用域（Scope）**——名字在哪些区域是可见的
> - **作用域规则**——语言决定"这个名字到底指的是什么"的规则

---

## 🔗 绑定——名字是怎么关联到实体的

在编程中，"变量名"和"它所代表的值"不是天然绑定的——是语言（或编译器/解释器）把它们关联起来的。

```python
x = 42
# "x" 这个名字被绑定到了整数 42
```

绑定的时机不同，决定了语言的灵活性：

| 绑定时机 | 含义 | 例子 |
|:--------:|------|:----:|
| **静态绑定（Static Binding）** | 编译时确定 | C 中调用函数——编译时就知道调哪个 |
| **动态绑定（Dynamic Binding）** | 运行时确定 | Python 中调用方法——运行时才查对象有没有这个方法 |

```python
# Python 中绑定的动态性
x = 42        # x → 整数 42
x = "hello"   # x → 字符串 "hello"（运行时重新绑定）

# 在 C 中：
# int x = 42;  // 编译时 x 就被绑定为 int 类型
# x = "hello"; // ❌ 编译错误——类型已经固定
```

> 📦 **类比：教室里的座位**
> 
> **静态绑定** = 开学第一天就分配好了固定座位——你的名字固定在某个座位上。不管谁来上课，座位号对应的都是你。
>
> **动态绑定** = 自由占座——今天你坐这里，明天可能换到另一个位置。"你的座位"不是固定的，随时可能变。

---

## 🔍 静态作用域（词法作用域）——最常用的规则

**静态作用域（Static/Lexical Scope）**：变量的可见性由**代码的书写结构**决定——看函数定义在哪个作用域里。

```python
x = 1  # 全局变量

def outer():
    x = 2  # 局部变量，覆盖了全局的 x
    
    def inner():
        print(x)  # 输出多少？
    
    inner()

outer()  # 输出 2
```

**为什么是 2？** 因为 `inner` 函数定义在 `outer` 内部——在定义 `inner` 时，它能看到的外部作用域是 `outer`，而 `outer` 中的 `x = 2` 覆盖了全局的 `x = 1`。

这就是"静态"的含义：**不需要运行代码，光看结构就知道结果。**

```python
def outer():
    x = 2
    inner()  # 这里会输出什么？

def inner():
    print(x)  # 根据静态作用域，这个 x 是全局的 x

x = 1
outer()  # 输出 1，不是 2！
```

最流行的语言（C、Java、Python、JavaScript、Rust）都使用静态作用域。

---

## 🔄 动态作用域——看调用链

**动态作用域（Dynamic Scope）**：变量的可见性由**运行时的调用栈**决定——看当前通过哪些函数调用过来的。

```bash
# Bash 使用动态作用域
x=1
function outer { 
    local x=2
    inner
}
function inner {
    echo $x  # 输出？
}
outer  # 输出 2（Bash 的动态作用域）
```

在动态作用域中，`inner` 查找 `x` 时不是看 `inner`"定义"的位置，而是看**谁调用了它**——因为 `inner` 是被 `outer` 调用的，而 `outer` 中定义了 `x=2`，所以输出 2。

除了 Bash，**Emacs Lisp** 也使用动态作用域。但大多数现代语言（包括几乎所有学生现在用的 Python、Java、JavaScript）都使用静态作用域。

> 📝 **一句话区分**：
> - **静态作用域**：看"你这个函数是在哪里写的"
> - **动态作用域**：看"你这个函数是在哪里被调用的"
>
> 静态作用域在编译器看来就是"看代码结构"——不需要运行就能分析。动态作用域需要"追踪调用链"——只有运行时才知道。

---

## 🧩 作用域的层级

大多数现代语言有层级嵌套的作用域：

```python
# Python 的作用域层级（LEGB 规则）
b = 0  # Built-in（内建）: print, len...

def outer():
    a = 1  # Enclosing（外部函数）
    
    def inner():
        c = 3  # Local（局部）
        print(c)  # 局部 → 3
        print(a)  # 外部 → 1
        print(b)  # 全局 → 0
    
    inner()
```

查找变量时的顺序（LEGB）：
1. **L**ocal（局部）——当前函数内部的变量
2. **E**nclosing（外部）——外层函数的变量
3. **G**lobal（全局）——模块级别的变量
4. **B**uilt-in（内建）——语言自带的函数（print、len 等）

```python
x = "全局"

def outer():
    x = "outer 内部"
    
    def inner():
        x = "inner 内部"
        print(x)  # 1. Local → "inner 内部"
    
    inner()
    print(x)  # 2. Enclosing → "outer 内部"

outer()
print(x)  # 3. Global → "全局"
```

---

## ⏳ 变量的生存期——和作用域不同

作用域说的是"在哪里可见"，**生存期（Lifetime）** 说的是"存在多久"。

```python
def create_counter():
    count = 0  # 每次调用都创建
    
    def increment():
        nonlocal count
        count += 1
        return count
    
    return increment

counter = create_counter()
print(counter())  # 1
print(counter())  # 2  ← count 没有被销毁！它还在
```

通常函数的局部变量在函数返回后就销毁了。但这里的 `count` 因为被闭包（返回的 `increment` 函数）捕获了——它的生存期被延长了。

这就是为什么需要理解作用域和生存期的区别：**作用域是"静态"规则（哪里能访问），生存期是"动态"规则（存在多久）。**

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **绑定（Binding）** | 名字→实体的关联过程 |
| **静态作用域** | 看代码定义位置决定变量所指（C、Java、Python）|
| **动态作用域** | 看调用链决定变量所指（Bash、Emacs Lisp）|
| **LEGB 规则** | 变量查找顺序：Local → Enclosing → Global → Built-in |
| **生存期** | 变量存在的时间——和作用域不同 |

> 🎯 **小练习**：下面的代码输出什么？用 LEGB 规则分析每一步：
> ```python
> x = 1
> def f():
>     y = x
>     x = 2
>     return y
> print(f())
> ```

**为什么先学这个？** 作用域决定了"你写的变量名到底指代什么"。理解之后，下一步看看[[evaluation-strategies|求值策略（传值、传引用、惰性求值）]]——函数调用时参数是怎么传递的。
