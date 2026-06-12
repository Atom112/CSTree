---
id: ll-parsing
title: 自顶向下分析（LL）
summary: LL 解析器从开始符号出发，从左到右扫描输入，进行最左推导——它"预测"每一步应该用哪个产生式，实现简单、错误信息友好
difficulty: advanced
order: 5
parent: syntax-analysis
children: []
related:
  - lr-parsing
prerequisites:
  - syntax-analysis
tags:
  - compiler
  - parser
  - ll
createdAt: 2026-06-12
---

## 预测式解析

LL(1) 解析器从左到右扫描（第一个 L），进行最左推导（第二个 L），向前看 1 个 Token（1）。

```
输入：int a = 42;

解析步骤（自顶向下展开）：
程序
→ 语句 程序
→ "int" 标识符 "=" 表达式 ";" 程序
→ "int" a "=" 表达式 ";" 程序
→ "int" a "=" 数字 ";" 程序
→ "int" a "=" 42 ";" 程序
→ "int" a = 42 ";" 空
```

> 🏫 **类比：做菜按菜谱**
> 菜谱上说"做红烧肉"——你展开（推导）成具体步骤：切肉→焯水→炒糖色→加料→炖煮。每一步如果还是太抽象，就继续展开。这就是自顶向下的过程。

## LL(1) 解析表

LL(1) 解析器的核心是一张**预测表（Parsing Table）**——告诉你面对某个非终结符和下一个 Token 时，该用哪条产生式。

```
非终结符 \ 下一个 Token    int     identifier    ...   $
程序                     语句 程序     错误              ε
语句                     int id = 表达式 ;   错误
表达式                    数字              标识符
```

```python
# LL(1) 解析器的简化实现
tokens = [('int', 'int'), ('id', 'a'), ('=', '='), 
          ('num', '42'), (';', ';')]
pos = 0

def match(expected):
    global pos
    if pos < len(tokens) and tokens[pos][0] == expected:
        pos += 1
    else:
        raise SyntaxError(f"Expected {expected}, got {tokens[pos]}")

def parse_program():
    parse_statement()
    # 程序 → 语句 程序 | ε

def parse_statement():
    match('int')
    match('id')
    match('=')
    parse_expression()
    match(';')

def parse_expression():
    match('num')  # 简化：表达式只接受数字

parse_program()
```

## FIRST 和 FOLLOW 集

计算 LL(1) 解析表需要两个集合：

**FIRST(X)** = 从 X 推导出的所有句子的第一个终结符

```
FIRST(表达式) = { 数字, 标识符, ( }
FIRST(语句) = { int, float, if, while, return }
```

**FOLLOW(X)** = 在所有推导中，紧跟在 X 后面的终结符

```
FOLLOW(表达式) = { ), ; }
FOLLOW(语句) = { int, float, if, else, while, return, $ }
```

> 💡 如果存在某个非终结符对同一个 Token 有两条以上产生式，这个文法就不是 LL(1) 的——需要改写文法或使用更强大的 LL(k) 解析器。

## 递归下降解析

LL 解析器最常用的实现方式——每个非终结符对应一个函数：

```python
# 递归下降解析器
class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0
    
    def peek(self):
        return self.tokens[self.pos][0] if self.pos < len(self.tokens) else '$'
    
    def consume(self, expected):
        if self.peek() == expected:
            self.pos += 1
        else:
            raise SyntaxError(f"Expected {expected}")
    
    def parse_expression(self):
        # 表达式 → 项 表达式'
        self.parse_term()
        self.parse_expr_tail()
    
    def parse_expr_tail(self):
        # 表达式' → '+' 项 表达式' | ε
        if self.peek() == '+':
            self.consume('+')
            self.parse_term()
            self.parse_expr_tail()
        # 否则 ε——什么都不做
    
    def parse_term(self):
        # 项 → 因子 项'
        self.parse_factor()
        self.parse_term_tail()
    
    def parse_term_tail(self):
        if self.peek() == '*':
            self.consume('*')
            self.parse_factor()
            self.parse_term_tail()
    
    def parse_factor(self):
        if self.peek() == 'num':
            self.consume('num')
        elif self.peek() == '(':
            self.consume('(')
            self.parse_expression()
            self.consume(')')
        else:
            raise SyntaxError(f"Unexpected token: {self.peek()}")
```

## 小结

| 概念 | 要点 |
|------|------|
| **LL(1)** | 从左到右、最左推导、1 个 Token 向前看 |
| **预测表** | 决定每个非终结符遇到 Token 时用哪条产生式 |
| **FIRST 集** | 非终结符能推导出的第一个终结符集合 |
| **FOLLOW 集** | 非终结符后面可能出现的终结符集合 |
| **递归下降** | 每个非终结符 = 一个函数，最常用的实现方式 |

**为什么先学这个？** LL 解析器是实现最简单的手写解析器方式——GCC 早期的手写解析器就是递归下降的。但 LL 能处理的文法有限，更强大的[[lr-parsing|自底向上分析（LR）]]可以处理更多语言结构。
