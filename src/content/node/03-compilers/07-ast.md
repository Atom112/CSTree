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
---

## 从语法树到抽象语法树

语法分析产生的是**具体语法树（Parse Tree）**——包含所有语法细节。但对后续阶段来说，很多细节（括号、分号）是冗余的。**AST** 只保留程序结构的关键信息。

```
具体语法树（parse tree）：         抽象语法树（AST）：
     语句                          =
    / / \ \ \                     / \
int  a  = 表达式 ;                a   +
        / | \                       / \
      表达式 + 表达式              42   1
        |        |
       42        1
```

> 🏫 **类比：房屋结构图 vs 装修效果图**
> - 具体语法树 = 建筑蓝图（标注了每根钢筋、每个螺丝）
> - AST = 装修效果图（只显示房间布局、门、窗——没人需要在效果图里看到螺丝钉）

## AST 的节点类型

```python
# AST 节点类型
class ASTNode:
    pass

class Program(ASTNode):
    def __init__(self, statements):
        self.statements = statements  # 语句列表

class BinaryOp(ASTNode):
    def __init__(self, op, left, right):
        self.op = op          # '+', '-', '*', '/', ...
        self.left = left      # ASTNode（左操作数）
        self.right = right    # ASTNode（右操作数）

class Number(ASTNode):
    def __init__(self, value):
        self.value = value    # 整数或浮点值

class Variable(ASTNode):
    def __init__(self, name):
        self.name = name      # 变量名

class Assignment(ASTNode):
    def __init__(self, var, expr):
        self.var = var        # Variable 节点
        self.expr = expr      # 赋值的表达式

class IfStatement(ASTNode):
    def __init__(self, condition, then_body, else_body=None):
        self.condition = condition
        self.then_body = then_body
        self.else_body = else_body
```

### 构建 AST（语法分析阶段）

```python
# 在递归下降解析器中构建 AST
class Parser:
    def parse_expression(self):
        left = self.parse_term()
        while self.peek() in ('+', '-'):
            op = self.consume()
            right = self.parse_term()
            left = BinaryOp(op, left, right)  # 构建 AST 节点
        return left
    
    def parse_if(self):
        self.consume('if')
        self.consume('(')
        cond = self.parse_expression()
        self.consume(')')
        then_body = self.parse_statement()
        else_body = None
        if self.peek() == 'else':
            self.consume('else')
            else_body = self.parse_statement()
        return IfStatement(cond, then_body, else_body)
```

## AST 的遍历

AST 建好后可以被遍历以执行各种操作：

```python
# 遍历 AST 并打印
def print_ast(node, indent=0):
    prefix = '  ' * indent
    if isinstance(node, Program):
        print(f"{prefix}Program")
        for stmt in node.statements:
            print_ast(stmt, indent + 1)
    elif isinstance(node, BinaryOp):
        print(f"{prefix}BinaryOp({node.op})")
        print_ast(node.left, indent + 1)
        print_ast(node.right, indent + 1)
    elif isinstance(node, Number):
        print(f"{prefix}Number({node.value})")
    elif isinstance(node, Variable):
        print(f"{prefix}Var({node.name})")
    elif isinstance(node, Assignment):
        print(f"{prefix}Assignment")
        print_ast(node.var, indent + 1)
        print_ast(node.expr, indent + 1)
```

## 小结

| 概念 | 要点 |
|------|------|
| **AST** | 去掉语法细节的程序结构树 |
| **vs 具体语法树** | AST 更简洁，只保留语义相关信息 |
| **节点类型** | 每种程序结构对应一种 AST 节点 |
| **递归构建** | 在语法分析过程中递归创建 AST 节点 |
| **遍历** | 递归遍历 AST 是后续阶段的基础 |

**为什么先学这个？** AST 是编译器中前端的最终输出，也是后端（代码生成、优化）的输入。接下来看看[[semantic-analysis|语义分析与符号表]]——如何在 AST 上检查类型和语义正确性。
