---
id: code-generation
title: 代码生成
summary: 代码生成（Code Generation）是编译器的最后阶段——把平台无关的 IR 翻译成目标机器的汇编或机器码，涉及指令选择、寄存器分配和指令调度
difficulty: advanced
order: 11
parent: ir-three-address
children:
  - register-allocation
  - instruction-scheduling
related: []
prerequisites:
  - ir-three-address
  - isa-overview
tags:
  - compiler
  - codegen
createdAt: 2026-06-12
---

## 从 IR 到机器码

```llvm
; LLVM IR
%sum = add i32 %a, %b
```

```asm
; x86-64 汇编
add eax, ebx    ; 如果 a 在 eax 中，b 在 ebx 中
```

> 🏫 **类比：食谱翻译**
> IR 是一份通用食谱（"切菜→热油→炒制"）。代码生成器把它翻译成具体厨房的操作：
> - 中餐厨房：用炒锅、煤气灶、菜刀
> - 西餐厨房：用平底锅、电炉、主厨刀

## 指令选择（Instruction Selection）

把 IR 指令映射到目标机器的指令——**关键问题**：一条 IR 指令可能对应多条机器指令，多条 IR 指令也可能拼成一条机器指令。

### 树覆盖方法

把 IR 视为树，用目标机器的指令模式去"覆盖"这棵树：

```
IR 树：              x86 指令模式：
    +              
   / \              add src, dst
  a   b            （单条指令覆盖 + 子树）

    *              
   / \              imul src, dst
  a   b            （单条指令覆盖 * 子树）

    a[i]            mov rax, [base + offset*scale]
   / \             （一条指令完成整个数组访问）
 base index
```

> 💡 指令选择通常用**树模式匹配**或**动态规划**实现——找到最"便宜"的指令组合。

## 窥孔优化（Peephole Optimization）

在生成的指令序列上"滑动"一个小窗口（窥孔），寻找可以优化的局部模式：

```asm
; 优化前                      ; 优化后
mov rax, rbx                  mov rax, rbx
mov rcx, rax     →            mov rcx, rbx  ; 省略多余的 mov
                              
cmp rax, 0                    test rax, rax  ; 更短的指令
                              
jmp L1                        ; ...直接删除，如果 L1 就是下一条
L1:
```

## 指令选择示例

```c
// AST → x86-64 代码生成
void gen_expr(ASTNode* node) {
    switch (node->type) {
    case BINARY_OP: {
        gen_expr(node->left);   // 计算左操作数 → rax
        emit("push rax");        // 保存到栈
        gen_expr(node->right);  // 计算右操作数 → rax
        emit("pop rcx");         // 恢复左操作数
        switch (node->op) {
        case '+': emit("add rax, rcx"); break;
        case '-': emit("sub rax, rcx"); break;
        case '*': emit("imul rax, rcx"); break;
        case '/': emit("idiv rcx"); break;  // rax / rcx
        }
        break;
    }
    case NUMBER: {
        emit("mov rax, %d", node->value);
        break;
    }
    case VARIABLE: {
        emit("mov rax, [rbp - %d]", node->offset);
        break;
    }
    }
}
```

## 代码生成的关键问题

| 问题 | 描述 | 解决方案 |
|------|------|---------|
| **指令选择** | 选哪条机器指令 | 树模式匹配 |
| **寄存器分配** | 无穷虚拟寄存器 → 有限物理寄存器 | 图着色算法 |
| **指令调度** | 重排指令顺序利用流水线 | 列表调度 |
| **调用约定** | 函数调用时参数放哪 | ABI 规范 |

## 小结

| 概念 | 要点 |
|------|------|
| **指令选择** | IR 指令映射到目标机器指令 |
| **树覆盖** | 用目标指令模式覆盖 IR 树 |
| **窥孔优化** | 局部滑动窗口优化指令序列 |
| **关键问题** | 指令选择、寄存器分配、指令调度、调用约定 |

**为什么先学这个？** 代码生成的关键挑战之一是[[register-allocation|寄存器分配]]——下一节看看编译器如何把无穷多的虚拟变量塞进有限的物理寄存器。
