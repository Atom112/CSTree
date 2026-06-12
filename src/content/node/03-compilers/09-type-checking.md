---
id: type-checking
title: 类型检查与类型推导
summary: 类型检查（Type Checking）确保程序中的每个表达式类型一致——整数不能当函数用，字符串不能做除法。类型推导（Type Inference）则能自动推断类型，你不用写 int x = 1 中的 int
difficulty: advanced
order: 9
parent: semantic-analysis
children: []
related: []
prerequisites:
  - semantic-analysis
  - ast
tags:
  - compiler
  - type-system
createdAt: 2026-06-12
---

## 类型检查——编译器做"数学题"

```c
int a = 42;
float b = 3.14;
char c = 'x';

a = b;     // 类型不匹配：float → int（隐式转换，可能精度丢失）
c = a + b; // int + float → float，然后 float → char（有损）
```

类型检查器通过遍历 AST，对每个节点计算类型，并检查一致性。

> 🏫 **类比：拼图的形状**
> 每块拼图有特定的形状（类型）——只有形状匹配的拼图才能拼在一起。类型检查器就是检查拼图形状的工具。

## 类型系统的分类

| 类型系统 | 特点 | 例子 |
|---------|------|------|
| **静态类型** | 编译时检查类型 | C, Java, Rust, TypeScript |
| **动态类型** | 运行时检查类型 | Python, JavaScript, Ruby |
| **强类型** | 类型严格，不隐式转换 | Rust, Haskell |
| **弱类型** | 允许隐式类型转换 | C, JavaScript |
| **显式类型** | 必须写类型标注 | C, Java |
| **类型推导** | 编译器自动推断类型 | Rust, Haskell, TypeScript |

### 静态 vs 动态——各自的代价

```
静态类型：编译时发现类型错误 ✓
         写代码时要标注类型（或复杂推导）

动态类型：写代码快，不需要标注类型 ✓
         运行时才暴露类型错误 ✗
```

> 💡 **渐进类型（Gradual Typing）**——TypeScript 在 JavaScript 上加类型标注、Python 的 type hints——在动态语言中引入静态检查。

## 类型推导——Hindley-Milner 算法

类型推导让编译器自动推断表达式的类型——你不需要写 `int x = 42` 中的 `int`。

```
let x = 42;      // 编译器推导出 x: int
let y = x + 1;   // 编译器推导出 y: int
let f a = a + 1; // 编译器推导出 f: int → int
```

### 推导过程

```
表达式：λf. λx. f x（函数应用）

推导步骤：
1. f 有类型 α → β（某个参数类型到某返回值类型）
2. x 有类型 α（因为 x 作为 f 的参数）
3. f x 有类型 β（函数应用的结果类型）
4. 整个表达式的类型：(α → β) → α → β
```

## 类型合一（Type Unification）

类型推导的核心算法——**合一**——解类型方程：

```
表达式：twice(f, x) = f(f(x))

约束：
1. f 的类型：α → β
2. x 的类型：α
3. f(x) 的类型：β
4. f(f(x)) 的类型：β 且 β = α（因为 f 的参数类型是 α，返回类型是 β，
   而 f(x) 又作为 f 的参数，所以 β = α）
5. 所以 twice 的类型：(α → α) → α → α
```

## 运行时类型 vs 编译时类型

```c
// C 语言的类型检查在编译时
// 运行时没有类型信息
struct Animal { void (*speak)(); };
struct Dog { Animal base; int fur_type; };

void treat(Animal* a) {
    a->speak();  // 编译时只知道是 Animal
                 // 运行时可以是 Dog 或 Cat
}
```

**动态分发（Dynamic Dispatch）**：在运行时根据实际类型决定调用哪个函数——面向对象语言的多态基础。

## 小结

| 概念 | 要点 |
|------|------|
| **类型检查** | 在 AST 上检查类型一致性 |
| **静态 vs 动态** | 编译时 vs 运行时检查 |
| **类型推导** | 自动推断表达式类型 |
| **Hindley-Milner** | 经典的函数式语言类型推导算法 |
| **合一** | 通过解类型方程推导类型 |

**为什么先学这个？** 类型检查确保程序语义正确。完成语义分析后，编译器开始生成[[ir-three-address|中间表示（IR）]]——平台无关的代码表示。
