---
id: evaluation-strategies
title: 求值策略（传值、传引用、惰性求值）
summary: 求值策略决定函数调用时参数的计算方式——传值（值拷贝）、传引用（地址）、传共享（对象引用）、惰性求值（需要时才算）
difficulty: intermediate
order: 3
parent: variable-scope
children:
  - lambda-calculus
  - garbage-collection
related: []
prerequisites:
  - variable-scope
tags:
  - pl
  - evaluation
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 📋 你的问题是"复印件"还是"原件"？

你要交一份课程报告给老师。你有两种方式：

**方式一：复印一份交上去**——老师在上面批注、修改，但原稿完好无损。

**方式二：直接交原稿**——老师在上面批注、修改，你的原稿也被改了。

这就是函数调用时参数传递方式的本质：**函数拿到的是"复印件"还是"原件"？拿到的是"值的副本"还是"值的地址"？**

不同的语言（甚至同一种语言的不同场景）有不同的选择——这叫做**求值策略（Evaluation Strategy）**。

> 📐 **定义**：求值策略决定了在函数调用时，参数表达式**什么时候被计算**、**传给函数的是什么**。

---

## 📄 传值调用（Call by Value）——最安全的方式

**行为**：函数内部拿到的是参数的**副本**——修改形参不影响实参。

```python
def foo(x):
    x = 10           # 修改的是副本
    print("内部:", x)

a = 5
foo(a)
print("外部:", a)    # 还是 5

# 输出：
# 内部: 10
# 外部: 5
```

**传值的特点**：
- 函数内部随便修改——不影响调用者的变量
- 安全、可预测——没有"副作用"
- **复制大对象时开销大**——每次调用都复制整个值

**典型语言**：C（所有基本类型）、Java（基本类型）、Python（不可变类型）

> 📑 **类比：复印身份证**
>
> 你把身份证复印件交给办事员。他在复印件上写字、画圈——但你的原件完好无损。
>
> 传值调用非常**安全**，但如果你需要复印一份 500 页的论文——时间成本很高。

---

## 📍 传引用调用（Call by Reference）——高效但危险

**行为**：函数内部拿到的是参数的**地址**——修改形参就是修改实参。

```cpp
// C++ 传引用
void foo(int &x) {
    x = 10;  // 直接修改原变量
}

int main() {
    int a = 5;
    foo(a);
    cout << a;  // 10 — 被改了！
    return 0;
}
```

**传引用的特点**：
- 没有复制开销——直接操作原数据
- 函数可以"修改"外部变量——副作用
- 调用者可能"意外"被改——需要仔细阅读函数签名才知道

```cpp
// C++ 传引用的典型场景——避免复制大对象
void processLargeData(const vector<int> &data) {
    // const 引用——既高效（不复制）又安全（不能修改）
    // data[0] = 100;  // ❌ 编译错误——const 禁止修改
}
```

> 📑 **类比：把作业原件交给老师批改**
>
> 老师直接在你的原稿上写批注——很高效（不用复印），但你的原稿被改动了。
>
> 在 C++ 中，`const &` 相当于"老师把批注写在便利贴上贴在你作业上"——不修改你的原稿，但老师可以看你的作业内容。

---

## 🔗 传共享调用（Call by Sharing）——Python 等语言的"折中"

**行为**：传的是**对象的引用（地址的副本）**——你可以通过引用修改对象的内部，但不能改变"这个引用指向谁"。

```python
def modify(lst):
    lst.append(4)      # ✅ 通过引用修改对象内部
    print("内部:", lst)

def reassign(lst):
    lst = [10, 20, 30]  # ❌ 只修改了局部变量 lst 指向的对象
    print("内部:", lst)

my_list = [1, 2, 3]
modify(my_list)
print("外部:", my_list)  # [1, 2, 3, 4] — 被改了！

reassign(my_list)
print("外部:", my_list)  # [1, 2, 3, 4] — 没变！
```

| 情况 | 传值 | 传共享 |
|:----:|:----:|:------:|
| 修改**形参本身** | ❌ 不影响实参 | ❌ 不影响实参指向 |
| 修改**形参的内部** | ❌ 副本内部改了也没事 | ✅ 影响实参的内容 |

**典型语言**：Python、Java（所有对象类型）、JavaScript、Ruby

```java
// Java 传共享——和 Python 一样
void addItem(List<String> list) {
    list.add("hello");       // ✅ 可以修改对象内容
}

void reassign(List<String> list) {
    list = new ArrayList<>(); // ❌ 不影响原变量
}
```

---

## 😴 惰性求值（Lazy Evaluation）——需要用的时候才算

**行为**：表达式不立即计算，而是等**真正需要结果的时候**才计算。

```haskell
-- Haskell 默认惰性求值

-- 定义一个无穷列表
numbers = [1..]  -- 1, 2, 3, 4, 5, ...

-- 取前 5 个元素——不会计算整个列表！
take 5 numbers  -- [1, 2, 3, 4, 5]

-- 再比如：
let result = expensiveComputation()  -- 还没算！
if condition then use(result) else skip()
-- 如果 condition 为 False——expensiveComputation 永远不会执行！
```

### 惰性求值的好处

```haskell
-- 1. 无穷数据结构
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
take 10 fibs  -- [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

-- 2. 避免不必要的计算
-- 只有实际需要前 3 个元素时才会计算
let allPrimes = sieve [2..]  -- 所有质数（无穷）
take 3 allPrimes             -- [2, 3, 5]

-- 3. 短路操作是惰性的自然结果
(False && expensive())  -- 不计算 expensive，直接返回 False
```

### 惰性求值的代价

```haskell
-- 每个"待计算的表达式"被包装成一个 thunk（延迟对象）
-- thunk 占内存，且"强制求值"时有额外开销

-- 在严格求值语言中，你可以精确控制计算时机
-- 在惰性求值语言中，编译器决定——你无法精确控制
```

> 📑 **类比：视频网站的预加载**
>
> **严格求值** = 你打开一个视频网站，它一口气把整部电影下载完——不管你看不看。
>
> **惰性求值** = 网站根据你的网速，只加载你当前正在看的部分和接下来几分钟的内容。如果你只看了开头 5 分钟就关掉了——剩下的 115 分钟根本没下载，不必要的流量省了。
>
> 但惰性求值有"缓冲"开销——每次拖动进度条需要等待加载（thunk 需要被计算）。

---

## ⚔️ 四种策略对比

| 策略 | 传递内容 | 函数内修改影响外部？ | 代表语言 |
|:----:|:--------:|:-------------------:|:--------:|
| **传值** | 值的副本 | ❌ 不影响 | C（基本类型）|
| **传引用** | 变量的地址 | ✅ 可以 | C++（引用参数）|
| **传共享** | 对象引用的副本 | ✅ 可改内容，❌ 不能改指向 | Python, Java, JS |
| **惰性求值** | 表达式（thunk） | 取决于语言 | Haskell |

> 💡 **Python 的常见困惑**：
> ```python
> def append_to(element, target=[]):  # 默认参数只创建一次！
>     target.append(element)
>     return target
> 
> print(append_to(1))  # [1]
> print(append_to(2))  # [1, 2]  ← 意外！默认参数被持续修改了
> ```
> 这是因为默认参数在**函数定义时**就创建了（不是调用时），而且传共享让函数可以修改列表内容。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **传值（Call by Value）** | 复制一份——安全但可能慢 |
| **传引用（Call by Reference）** | 给地址——高效但容易有副作用 |
| **传共享（Call by Sharing）** | 给引用副本——Python/Java 的方式 |
| **惰性求值（Lazy Evaluation）** | 需要时才计算——省资源但难预测 |
| **副作用（Side Effect）** | 函数修改了外部状态 |

> 🎯 **小练习**：下面的 Python 代码会输出什么？说说每一步涉及什么求值策略：
> ```python
> def extend_list(val, lst=[]):
>     lst.append(val)
>     return lst
> 
> l1 = extend_list(10)
> l2 = extend_list(20, [])
> l3 = extend_list(30)
> print(l1)
> print(l2)
> print(l3)
> ```

**为什么先学这个？** 求值策略是理解函数调用的基础。接下来学习[[lambda-calculus|Lambda 演算基础]]——函数式编程的理论基石。
