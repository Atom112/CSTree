---
id: ir-three-address
title: 中间表示（IR, 三地址码）
summary: 中间表示（Intermediate Representation, IR）是编译器前端的输出和后端的输入——它比 AST 更接近机器码，但又独立于具体架构，是"优化"的主战场
difficulty: advanced
order: 10
parent: ast
children:
  - code-generation
  - basic-optimizations
related:
  - ll-parsing
prerequisites:
  - ast
tags:
  - compiler
  - ir
  - optimization
createdAt: 2026-06-12
---

## 为什么需要 IR？

如果编译器直接从 AST 生成机器码：
- C 编译器要生成 x86 代码
- 换成 ARM 架构 → 要重写整个编译器

**解决方案：** 引入与平台无关的**中间表示（IR）**。

```
C 源码 → C 前端 → LLVM IR → x86 后端 → x86 机器码
                         → ARM 后端 → ARM 机器码
                         → RISC-V 后端 → RISC-V 机器码
```

> 🏫 **类比：通用翻译中转**
> 中文 → 世界语（中间语言） → 英语、法语、日语……
> 不需要为每种语言对（中-英、中-法、中-日）各建一套翻译系统。

## 三地址码（Three-Address Code, TAC）

**三地址码**是最常见的 IR 形式——每条指令最多有三个操作数（两个源、一个目标）。

```
x = y op z        # 二元运算：x = y + z
x = op y          # 单目运算：x = -y
x = y             # 赋值
goto L            # 无条件跳转
if x goto L       # 条件跳转
param x           # 传参数
call f, n         # 函数调用
return x          # 返回值
```

### C 代码到三地址码

```c
// C 源码
int sum(int n) {
    int result = 0;
    for (int i = 1; i <= n; i++)
        result += i;
    return result;
}
```

```asm
// 三地址码
sum:
    result = 0
    i = 1
L1:
    if i > n goto L2
    result = result + i
    i = i + 1
    goto L1
L2:
    return result
```

## LLVM IR

LLVM 的 IR 是业界最广泛使用的中间表示：

```llvm
; LLVM IR 示例
define i32 @sum(i32 %n) {
entry:
  br label %loop

loop:
  %i = phi i32 [1, %entry], [%next, %loop]
  %result = phi i32 [0, %entry], [%sum, %loop]
  %sum = add i32 %result, %i
  %next = add i32 %i, 1
  %cond = icmp sle i32 %next, %n
  br i1 %cond, label %loop, label %exit

exit:
  ret i32 %sum
}
```

**LLVM IR 的特点：**
- **SSA 形式**（Static Single Assignment）——每个变量只赋值一次（使用 Φ 函数）
- 无穷"虚拟寄存器"
- 类型系统完整

> 💡 SSA 形式让优化变得更简单——因为每个变量只赋值一次，数据流分析变得直接。

## IR 的三种形式

| 形式 | 特点 | 使用阶段 |
|------|------|---------|
| **HIR（高级 IR）** | 保留更多源码信息 | 前端附近 |
| **MIR（中级 IR）** | 平衡信息量和抽象度 | 优化阶段 |
| **LIR（低级 IR）** | 接近目标机器 | 代码生成附近 |
| **LLVM IR** | 统一格式，贯穿始终 | 全程使用 |

## 控制流图（CFG）

**控制流图（Control Flow Graph, CFG）** 把 IR 组织成基本块（Basic Block）的图：

```
sum 函数的 CFG：
┌─────────┐
│  entry   │
│  result=0│
│  i=1     │
└────┬────┘
     │
     ▼
┌─────────┐
│   L1    │ ←──────┐
│ if i>n  │        │
│ goto L2 │        │
└────┬────┘        │
     │ false       │ true
     ▼             │
┌─────────┐       │
│ L1 body │       │
│ res+=i  │───────┘
│ i++     │
└─────────┘
     │
     ▼
┌─────────┐
│   L2    │
│ return  │
└─────────┘
```

> 💡 CFG 是所有控制流优化（如循环优化）的基础数据结构。

## 小结

| 概念 | 要点 |
|------|------|
| **IR** | 介于 AST 和机器码之间的中间表示 |
| **三地址码** | 每条指令最多三个操作数 |
| **LLVM IR** | 业界最广泛的 IR，SSA 形式 |
| **SSA** | 每个变量只赋值一次，简化优化 |
| **CFG** | 基本块组成的控制流图 |

**为什么先学这个？** IR 是编译器后端的输入。接下来进入[[code-generation|代码生成]]——把 IR 翻译成真正的机器码。同时也看看[[basic-optimizations|基本优化]]——让生成的代码跑得更快。
