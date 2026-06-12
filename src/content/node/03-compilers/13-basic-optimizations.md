---
id: basic-optimizations
title: 基本优化（常量折叠、死代码消除）
summary: 编译器优化（Optimization）在不解变程序语义的前提下改进代码——常量折叠、死代码消除、公共子表达式消除等"基本优化"是所有优化的基础
difficulty: advanced
order: 13
parent: ir-three-address
children:
  - loop-optimizations
related:
  - register-allocation
prerequisites:
  - ir-three-address
tags:
  - compiler
  - optimization
createdAt: 2026-06-12
---

## 优化——让代码跑得更快

编译器的优化阶段不改变程序的行为，只改变实现方式——让最终生成的代码更小、更快。

> 🏫 **类比：作文润色**
> "今天天气很好，今天我去公园散步了，公园的景色很美。"
> → 润色："今天天气很好，我去公园散步，景色很美。"
> 意思完全一样，但更简洁了。

## 常量折叠（Constant Folding）

在编译时计算常量表达式，避免运行时重复计算：

```c
// 优化前
int x = 60 * 60 * 24;  // 编译器可以算出 86400

// 优化后
int x = 86400;
```

```llvm
; LLVM IR 常量折叠
%1 = add i32 10, 20    →    %1 = i32 30
```

> 💡 编译时计算比运行时快——因为运行时根本不需要执行这条指令！

## 常量传播（Constant Propagation）

如果确定某个变量的值是常量，直接用它替换：

```c
// 优化前
int a = 42;
int b = a + 1;
printf("%d", a);

// 优化后
int b = 43;           // a 被替换为 42 → 42+1 → 43
printf("%d", 42);     // a 被替换为 42
// （甚至可能直接把 printf 优化为 "42"）
```

## 死代码消除（Dead Code Elimination）

删除计算结果从未被使用的指令：

```c
// 优化前
int x = compute_something();  // x 从未被使用
int y = 42;
return y;

// 优化后
// compute_something() 的调用被删除
int y = 42;
return y;
```

```llvm
; LLVM IR 死代码消除
%1 = add i32 %a, %b     ; %1 从未被使用
%2 = mul i32 %c, %d     ; %2 被使用 → 保留
ret i32 %2
↓
%2 = mul i32 %c, %d     ; %1 和对应的 add 被删除
ret i32 %2
```

## 公共子表达式消除（CSE）

如果同一个表达式计算了多次，保留第一次的结果：

```c
// 优化前
int a = x + y * z;
int b = x + y * z - 1;

// 优化后
int t = x + y * z;      // 子表达式 x + y * z 只算一次
int a = t;
int b = t - 1;
```

## 复写传播（Copy Propagation）

消除不必要的赋值：

```asm
; 优化前                    ; 优化后
mov rax, rbx               mov rax, rbx
mov rcx, rax    →           ;（直接使用 rbx 替代 rcx）
add rcx, 10                 add rbx, 10
```

## 代数简化（Algebraic Simplification）

利用代数恒等式简化表达式：

```c
x + 0 = x
x * 1 = x
x * 0 = 0
x - x = 0
x * 2 = x << 1    // 乘法变移位，更快
x / 2 = x >> 1    // 除法变移位
```

## 优化的层次

| 层次 | 范围 | 举例 | 效果 |
|------|------|------|------|
| **窥孔优化** | 相邻几条指令 | 冗余指令删除 | 小 |
| **局部优化** | 基本块内 | 常量折叠 | 中 |
| **全局优化** | 整个函数 | CSE, 死代码消除 | 大 |
| **过程间优化** | 跨函数 | 内联展开 | 很大 |

## GCC/LLVM 优化级别

```bash
gcc -O0   # 不优化（编译最快，适合调试）
gcc -O1   # 基本优化（常量折叠、死代码消除）
gcc -O2  # 更积极的优化（大多数项目默认）
gcc -O3  # 最激进的优化（可能增加代码体积）
gcc -Os  # 优化代码体积（嵌入式场景）
gcc -Ofast # O3 + 放宽浮点精度
```

> 💡 `-O3` 不一定比 `-O2` 更快——有些优化会增大代码体积导致指令缓存压力增大。数据库、游戏等大型应用有时用 `-O2` 效果更好。

## 小结

| 优化 | 原理 | 效果 |
|------|------|------|
| **常量折叠** | 编译时计算常量表达式 | 减少运行时计算 |
| **常量传播** | 用常量替换变量引用 | 创造更多优化机会 |
| **死代码消除** | 删除无用指令 | 减小代码体积 |
| **CSE** | 复用相同的子表达式结果 | 减少重复计算 |
| **代数简化** | 利用数学恒等式简化 | 指令替换为更快版本 |

**为什么先学这个？** 基本优化是优化的"第一步"。接下来看看最重要的优化领域——[[loop-optimizations|循环优化与数据流分析]]。
