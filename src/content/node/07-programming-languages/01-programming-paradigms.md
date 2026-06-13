---
id: programming-paradigms
title: 编程语言范式概述
summary: 编程范式（Programming Paradigm）是编写程序的"思维模式"——命令式、面向对象、函数式、逻辑式，每种范式对"计算是什么"有不同理解
difficulty: beginner
order: 1
parent:
children:
  - variable-scope
  - higher-order-functions
related: []
prerequisites: []
tags:
  - pl
  - paradigm
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🍳 同一种食材，不同的做法

同样是鸡蛋——你可以做番茄炒蛋（中式）、也可以做煎蛋（西式）、还可以做蛋炒饭。食材一样，但"做法"完全不同。

写程序也是一样。同样的问题是"计算学生成绩的平均分"，不同的"编程范式"会有完全不同的写法：

**命令式（Imperative）**——告诉计算机"怎么做"每个步骤：
```python
total = 0
count = 0
for score in scores:
    total += score
    count += 1
avg = total / count
print(avg)
```

**函数式（Functional）**——告诉计算机"算什么"，而不是"怎么算"：
```python
avg = sum(scores) / len(scores)
print(avg)
```

**面向对象（Object-Oriented）**——把数据和操作打包成"对象"：
```python
class GradeCalculator:
    def __init__(self, scores):
        self.scores = scores
    def average(self):
        return sum(self.scores) / len(self.scores)

calc = GradeCalculator(scores)
print(calc.average())
```

**逻辑式（Logic）**——描述"事实和规则"，让计算机自己推导答案（Prolog）：
```prolog
% 定义平均分规则
average(Scores, Avg) :- sumlist(Scores, Sum), length(Scores, N), Avg is Sum / N.
```

四种方式得到同样的结果——但思考路径完全不同。这就是"范式"——解决问题的**思维模式**。

> 📐 **定义**：编程范式（Programming Paradigm）是编写程序时的基本"思维风格"或"世界观"——它决定了你如何组织代码、如何看待数据和控制流。

---

## 🏛️ 四大主流范式

### 1⃣ 命令式/过程式（Imperative / Procedural）

**思想**：程序 = 一系列指令，告诉计算机"每一步做什么"。

**代表语言**：C、Pascal、BASIC

**核心概念**：变量、赋值、循环、条件分支

命令式编程就像**照着菜谱做菜**：
1. 打开火（第一步）
2. 倒入油（第二步）
3. 放入鸡蛋（第三步）
4. 翻炒均匀（第四步）

每一步都是明确的指令，顺序至关重要。

```c
// C 语言——命令式风格
int sum = 0;
for (int i = 0; i < 10; i++) {
    sum += i;
}
```

### 2⃣ 面向对象（Object-Oriented）

**思想**：程序 = 对象之间的交互——对象把数据和方法打包在一起。

**代表语言**：Java、C++、Python、Ruby

**核心概念**：类（Class）、对象（Object）、封装（Encapsulation）、继承（Inheritance）、多态（Polymorphism）

面向对象编程就像**用乐高积木搭房子**——每个积木是一个"对象"，有自己的形状（数据）和连接方式（方法）。你关心的是"有哪些积木"和"它们怎么拼在一起"。

```java
// Java——面向对象风格
public class Dog {
    private String name;
    
    public Dog(String name) {
        this.name = name;
    }
    
    public void bark() {
        System.out.println(name + " says: 汪汪！");
    }
}

Dog myDog = new Dog("旺财");
myDog.bark();  // 旺财 says: 汪汪！
```

> 💡 你在学习操作系统时读过的[C语言代码]其实大多是命令式风格。而你在写 Python 时（如定义 class），已经不知不觉在用面向对象范式了。

### 3⃣ 函数式（Functional）

**思想**：程序 = 函数的组合——用纯函数（没有副作用）来描述计算。

**代表语言**：Haskell、Scheme、Clojure、F#、Elixir

**核心概念**：纯函数、不可变数据、高阶函数、递归

函数式编程就像**数学公式的推导**——你定义函数 f(x) = x²，然后计算 f(3) + f(4)，结果一定是 25。不管你算多少次、在什么时候算，结果都一样。

函数式强调**没有副作用**——函数不会改变外部状态，每次调用同一个函数传入同样的参数，一定得到同样的结果。

```haskell
-- Haskell——函数式风格
sumZeroToN n = sum [0..n]  -- 声明"做什么"，不是"怎么做"
```

> 💡 Python 中也支持函数式特性：`map(lambda x: x*2, [1,2,3])`。但 Python 不是纯函数式——它只是"吸收了函数式的思想"。

### 4⃣ 逻辑式（Logic）

**思想**：程序 = 事实 + 规则——描述"什么是真的"，让计算机自己推理出结果。

**代表语言**：Prolog、Datalog

**核心概念**：事实（Fact）、规则（Rule）、查询（Query）、回溯（Backtracking）

逻辑式编程就像**破案**——你告诉侦探所有已知事实（"张三在案发现场"、"李四有作案动机"），以及推理规则（"如果有人有动机又在现场，他是嫌疑人"），侦探自己推导出谁是凶手。

```prolog
% Prolog——逻辑式风格
% 事实
father(张三, 张伟).
father(张伟, 小明).
% 规则
grandfather(X, Y) :- father(X, Z), father(Z, Y).
% 查询：?- grandfather(张三, Y). → Y = 小明.
```

---

## 🗺️ 范式不是非此即彼

现代编程语言绝大多数是**多范式（Multi-paradigm）** 的：

| 语言 | 主要范式 | 也支持 |
|:----:|:--------:|:------:|
| **Python** | 面向对象 + 命令式 | 函数式（map/filter/reduce）|
| **Java** | 面向对象 | 函数式（Java 8+ 的 lambda）|
| **JavaScript** | 面向对象 + 函数式 | 基于原型（Prototype-based）|
| **C++** | 面向对象 + 命令式 | 泛型、函数式 |
| **Scala** | 函数式 + 面向对象 | 命令式 |
| **Rust** | 命令式 + 函数式 | 面向对象特性 |

**最佳实践不是"选一个范式坚持到底"，而是"在不同的场景用最合适的范式"：**

```python
# Python 中混合使用三种范式
# 面向对象：组织数据
class Student:
    def __init__(self, name, scores):
        self.name = name
        self.scores = scores

# 函数式：处理数据
top_students = filter(lambda s: s.avg() > 90, students)
# 命令式：输出结果
for s in top_students:
    print(f"{s.name}: {s.avg()}")
```

---

## 📝 小结

| 范式 | 核心思想 | 一句话类比 |
|:----:|---------|:---------:|
| **命令式** | 程序 = 一步步指令 | 菜谱——先放油，再炒蛋 |
| **面向对象** | 程序 = 对象交互 | 乐高积木——积木拼在一起 |
| **函数式** | 程序 = 函数组合 | 数学公式——f(g(x)) |
| **逻辑式** | 程序 = 事实+规则 | 破案——已知事实推出结论 |

> 🎯 **小练习**：用"对一个整数列表做平方后求和"这个任务，分别用命令式、函数式、面向对象三种范式实现。体会不同的"思维方式"有何不同。

**为什么先学这个？** 范式是你理解不同编程语言的基础。接下来深入第一个核心概念——[[variable-scope|变量、作用域与绑定]]。
