---
id: ast
title: 抽象语法树（AST）
summary: 抽象语法树（Abstract Syntax Tree, AST）是语法分析的核心输出——它去掉了括号、分号等语法细节，只保留程序的"骨架结构"
difficulty: intermediate
order: 7
parent: syntax-analysis
children:
  - semantic-analysis
  - ir-three-address
related: []
prerequisites:
  - syntax-analysis
tags:
  - compiler
  - ast
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🌳 一棵"树"——去掉标点，只留骨架

语法分析（Parser）产生的**具体语法树**包含了所有细节——括号、分号、逗号——这些对编译器后续阶段是冗余的。

**AST（Abstract Syntax Tree，抽象语法树）** 去掉这些冗余，只保留程序的逻辑骨架。

> 🏪 **类比：房屋结构图 vs 装修效果图**
>
> **具体语法树** = 建筑蓝图——标注了每根钢筋、每个螺丝的位置。非常精确，但信息太多。
>
> **AST** = 装修效果图——只显示房间布局、门窗位置。没人需要在效果图里看到螺丝钉的位置。
>
> 编译器后续阶段（语义分析、代码生成）只关心"房间怎么布局"——不需要知道"螺丝钉钉在哪"。

```
具体语法树（含分号、括号）：          AST（只留骨架）：
       语句                              =
      / / \ \ \                         / \
  int  a  = 表达式 ;                   a   +
          / | \                           / \
       表达式 + 表达式                  42   1
         |        |
        42        1
```

---

## 🧱 AST 的节点类型

```python
# AST 的节点类型定义——每种节点对应一种语法构造

class ASTNode:
    """所有 AST 节点的基类"""
    pass

class Program(ASTNode):
    def __init__(self, statements):
        self.statements = statements  # 语句列表

class BinaryOp(ASTNode):
    """二元运算：a + b, a * b 等"""
    def __init__(self, op, left, right):
        self.op = op          # '+', '-', '*', '/', ...
        self.left = left      # ASTNode（左操作数）
        self.right = right    # ASTNode（右操作数）

class Number(ASTNode):
    """整数字面量：42"""
    def __init__(self, value):
        self.value = value

class Variable(ASTNode):
    """变量引用：a, b, sum"""
    def __init__(self, name):
        self.name = name

class Assignment(ASTNode):
    """赋值语句：a = expr"""
    def __init__(self, target, value):
        self.target = target  # Variable
        self.value = value    # ASTNode

class Print(ASTNode):
    """输出语句：print(x)"""
    def __init__(self, expr):
        self.expr = expr
```

---

## 🔍 遍历 AST——编译器"读"程序的方式

编译器不是"看"源文件的——它遍历 AST。AST 是递归结构，所以遍历也是递归的：

```python
# 递归遍历 AST——计算表达式的值（解释器模式）
def evaluate(node):
    if isinstance(node, Number):
        return node.value
    
    elif isinstance(node, BinaryOp):
        left = evaluate(node.left)
        right = evaluate(node.right)
        if node.op == '+': return left + right
        if node.op == '-': return left - right
        if node.op == '*': return left * right
        if node.op == '/': return left // right
    
    elif isinstance(node, Assignment):
        value = evaluate(node.value)
        # 存入符号表
        symbol_table[node.target.name] = value
        return value
    
    elif isinstance(node, Print):
        value = evaluate(node.expr)
        print(value)
        return value
    
    elif isinstance(node, Program):
        for stmt in node.statements:
            evaluate(stmt)

# 用 AST 表示 a = 42 + 1 并求值
ast = Assignment(
    Variable("a"),
    BinaryOp('+', Number(42), Number(1))
)
print(evaluate(ast))  # 43
```

**这段代码本质上就是一个微型解释器**——递归遍历 AST，执行每个节点对应的操作。实际的 Python 解释器也是这样工作的。

---

## 🔧 AST 在编译器各阶段的作用

```
AST 是编译器的"中央数据结构"——前端各阶段都围绕它工作：

语法分析（Parser）→ 生成 AST
     ↓
语义分析 → 在 AST 上添加类型信息、检查语义正确性
     ↓
IR 生成 → 递归遍历 AST，生成三地址码
     ↓
优化 → 在某些编译器中直接在 AST 上做
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **AST（抽象语法树）** | 去掉标点符号等冗余的程序骨架结构——树状 |
| **具体语法树 vs AST** | 具体树包含所有细节，AST 只保留逻辑结构 |
| **节点类型** | 每种语法构造对应一种节点（BinaryOp、Number、Assignment 等）|
| **递归遍历** | 编译器"读"程序的方式——递归访问 AST 节点 |
| **AST 的角色** | 编译器的"中央数据结构"——前后端围绕它工作 |

**为什么先学这个？** AST 是语义分析的基础——下一步在 AST 上做[[semantic-analysis|语义分析与符号表]]。
