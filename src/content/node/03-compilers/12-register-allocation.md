---
id: register-allocation
title: 寄存器分配（图着色）
summary: 寄存器分配（Register Allocation）把 IR 中无穷多的虚拟寄存器映射到 CPU 有限的物理寄存器——放不下的变量只好"溢出"到内存
difficulty: advanced
order: 12
parent: code-generation
children: []
related:
  - basic-optimizations
prerequisites:
  - code-generation
tags:
  - compiler
  - codegen
  - register
createdAt: 2026-06-12
---

## 无穷 VS 有限

```
LLVM IR：虚拟寄存器数量没有限制
  %1, %2, %3, ..., %10000

x86-64 物理寄存器：
  通用寄存器：RAX, RBX, RCX, RDX, RSI, RDI, RBP, RSP, R8-R15
  总共 16 个通用寄存器（其中 RSP 和 RBP 通常被占用）
  
  ARM64：31 个通用寄存器
  RISC-V：32 个通用寄存器
```

**寄存器分配（Register Allocation）** 解决的核心问题：谁住寄存器，谁住内存？

> 🏫 **类比：办公室工位**
> 公司有 100 人（虚拟寄存器），但只有 16 个工位（物理寄存器）——大部分人得在家办公（内存）。工位分配策略：
> - 经常开会的人 → 给工位（频繁使用的变量 → 寄存器）
> - 几乎不来公司的 → 在家办公（不常用的变量 → 内存"溢出"）

## 冲突图（Interference Graph）

变量 X 和变量 Y 如果**同时活跃**（live），就不能放在同一个寄存器中。

```llvm
; 三地址码
a = 1       ; a 开始活跃
b = 2       ; b 开始活跃，a 仍活跃
c = a + b   ; a 和 b 冲突（都不能与 c 冲突）
d = c + 1   ; a 不再活跃，b 不再活跃
```

**冲突图（Interference Graph）：**
```
   a ──── b
         / \
        c───d
```
- a 与 b 冲突（不能同寄存器）
- c 与 a、b、d 冲突
- d 与 c 冲突

## 图着色寄存器分配

把冲突图看成地图——相邻的国家（冲突的变量）不能用同一种颜色（寄存器）。

```python
# 简化版图着色分配
def color_allocation(interference_graph, k):
    """
    interference_graph: 冲突图（邻接表）
    k: 可用寄存器数量
    返回：变量→寄存器的映射
    """
    colors = {}  # 变量→颜色（寄存器）
    
    # 简化：按照度数从高到低排序
    nodes = sorted(interference_graph.keys(),
                   key=lambda n: len(interference_graph[n]),
                   reverse=True)
    
    for node in nodes:
        # 找到邻居已用的颜色
        used = {colors[n] for n in interference_graph[node]
                if n in colors}
        # 选一个可用的颜色
        for color in range(k):
            if color not in used:
                colors[node] = color
                break
        else:
            # 所有颜色都被邻居占了 → 溢出到内存
            colors[node] = 'spill'
    
    return colors
```

**无法着色 → 溢出（Spill）**：把变量放到内存中，需要时加载到寄存器。

## 溢出（Spilling）

```asm
; 没有溢出——快速
add rax, rbx

; 有溢出——慢（需要访存）
mov rcx, [rbp - 8]   ; 从内存加载到寄存器
add rax, rcx
mov [rbp - 16], rax  ; 存回内存
```

> 💡 溢出是寄存器分配最影响性能的部分——每次溢出都增加内存访问。好的分配算法尽量减少溢出。

## 实际挑战

| 问题 | 影响 |
|------|------|
| **寄存器不足** | 不得不溢出 → 性能下降 |
| **调用约定** | 函数调用时某些寄存器必须保存/恢复 |
| **预着色** | 某些指令要求操作数在特定寄存器 |
| **移动指令太多** | 寄存器之间的 mov 指令增加代码体积 |

```asm
; x86-64 调用约定的寄存器使用
; 参数传递：RDI, RSI, RDX, RCX, R8, R9
; 被调用者保存：RBX, RBP, R12-R15
; 调用者保存：RAX, RCX, RDX, RSI, RDI, R8-R11
```

## LLVM 的寄存器分配

LLVM 使用多阶段寄存器分配：
1. **快速分配**：贪心算法，快速但可能溢出多
2. **贪心分配**：默认的分配器，效果较好
3. **PBQP 分配**：基于图的精确分配，质量最高但慢

## 小结

| 概念 | 要点 |
|------|------|
| **寄存器分配** | 无穷虚拟寄存器 → 有限物理寄存器 |
| **冲突图** | 同时活跃的变量不能同寄存器 |
| **图着色** | K 种颜色给冲突图着色 = K 个寄存器分配 |
| **溢出** | 放不下的变量存到内存 |
| **调用约定** | 哪些寄存器调用者/被调用者保存 |

**为什么先学这个？** 寄存器分配是代码生成的关键步骤。下一步看看两种重要的优化：[[basic-optimizations|基本优化]]和[[loop-optimizations|循环优化与数据流分析]]。
