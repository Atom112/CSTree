---
id: code-generation
title: 代码生成
summary: 代码生成（Code Generation）是编译器的"后端"——把平台无关的 IR 翻译成目标 CPU（x86、ARM、RISC-V）的机器指令。指令选择和寄存器分配是两大核心任务
difficulty: advanced
order: 11
parent: ir-three-address
children:
  - register-allocation
  - basic-optimizations
related: []
prerequisites:
  - ir-three-address
tags:
  - compiler
  - code-gen
  - backend
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🏭 从"通用"到"专用"——IR 翻译成机器码

前面几节生成了平台无关的 IR（三地址码）。但 IR 不能在 CPU 上运行——需要翻译成目标 CPU 的机器指令。

**代码生成（Code Generation）** 就是做这个：

```
IR（三地址码）          → 代码生成 → 目标机器码（x86/ARM/RISC-V）
t1 = 42 + 1             → mov eax, 43        （x86）
a = t1                  → mov [rbp-4], eax   （x86）
```

> 🏪 **类比：舞台剧本 → 各地演出**
>
> IR = 舞台剧本（用标准的语言写的，可以给任何剧团用）
> 代码生成 = 导演把剧本改编成具体演出方式：
> - 在北京演 → 用普通话（x86）
> - 在上海演 → 用上海话（ARM）
> - 在广东演 → 用粤语（RISC-V）
>
> 故事（逻辑）一样——但具体的"表达方式"不同。

---

## 🔄 指令选择——找"最匹配"的指令

同一个 IR 操作，不同 CPU 有不同的指令来实现：

```c
// IR: a = b + c
// 在不同架构上的指令选择

x86-64：  mov eax, [rbp-8]     ; 加载 b
          add eax, [rbp-12]    ; 加 c
          mov [rbp-4], eax     ; 存 a

ARM64：   ldr w0, [x29, -8]   ; 加载 b
          ldr w1, [x29, -12]  ; 加载 c
          add w0, w0, w1      ; a = b + c
          str w0, [x29, -4]   ; 存 a

RISC-V：  lw   a0, -8(s0)     ; 加载 b
          lw   a1, -12(s0)    ; 加载 c
          add  a0, a0, a1     ; a = b + c
          sw   a0, -4(s0)     ; 存 a
```

**核心思路**：IR 指令 → 匹配 CPU 的指令模板 → 生成具体的二进制机器码。这个过程叫"tile-based code generation"（基于模板的代码生成）。

---

## 📊 不同操作的指令选择示例

| IR 操作 | x86-64 选择 | ARM64 选择 |
|:-------:|:----------:|:----------:|
| `a = 42`（赋值常量）| `mov [rbp-4], 42` | `mov w0, #42; str w0, [x29,-4]` |
| `t = a + 1`（加常数）| `add eax, 1` | `add w0, w0, #1` |
| `t = a * 2`（乘 2^k）| `shl eax, 1`（移位优化）| `lsl w0, w0, #1`（移位优化）|
| `if t < 0 goto L` | `cmp eax, 0; jl L` | `cmp w0, #0; b.lt L` |

---

## 🔧 代码生成的挑战——以 `a[i] = b + c * d` 为例

```c
// 源码
a[i] = b + c * d;

// 可能的 IR
t1 = c * d
t2 = b + t1
t3 = i * 4          // 地址偏移（int 占 4 字节）
t4 = &a + t3
*t4 = t2
```

编译器需要：
1. 决定每个临时变量 `t1`-`t4` 放在寄存器还是栈上
2. 选择最合适的 x86/ARM 指令来实现每个操作
3. 安排指令顺序以最大化 CPU 流水线效率
4. 处理寻址模式——`a[i]` 的地址计算

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **代码生成** | 把 IR 翻译成目标 CPU 的机器码——"剧本→演出" |
| **指令选择** | 为每个 IR 操作找到 CPU 对应的指令 |
| **寄存器分配** | 决定哪些数据放寄存器、哪些放栈——后续专题 |
| **寻址模式** | 利用 CPU 的地址计算能力简化指令（如 `a[i]`）|
| **多目标支持** | 同一个 IR 可以生成 x86、ARM、RISC-V 的不同代码 |

**为什么先学这个？** 代码生成依赖[[register-allocation|寄存器分配]]——寄存器不够用时怎么办？
