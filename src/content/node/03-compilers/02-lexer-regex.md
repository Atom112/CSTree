---
id: lexer-regex
title: 词法分析与正则表达式
summary: 词法分析（Lexical Analysis）是编译的第一个阶段——把源代码的字符流切分成"单词"（Token），交给语法分析器使用
difficulty: intermediate
order: 2
parent: compiler-overview
children:
  - finite-automata
related:
  - finite-state-machine
prerequisites:
  - compiler-overview
tags:
  - compiler
  - lexer
  - regex
createdAt: 2026-06-12
---

## 如何让计算机"看懂"代码？

你写 `int a = 42;`——这是一串字符 `i` `n` `t` ` ` `a` ` ` `=` ` ` `4` `2` `;`。CPU 看不懂这些。第一步：把这些字符归类为有意义的**单词（Token）**。

词法分析器的输出：
```
关键字: int
标识符: a
运算符: =
数字:   42
分号:   ;
```

> 🏫 **类比：英语句子的词性标注**
> "The quick brown fox jumps over the lazy dog."
> 词法分析就是标出每个单词的词性：
> - The → 冠词
> - quick → 形容词
> - fox → 名词
> - jumps → 动词

## Token 类型

典型的 Token 类型包括：

| Token 类型 | 举例 |
|-----------|------|
| **关键字** | `int`, `if`, `return`, `while` |
| **标识符** | 变量名、函数名（`sum`, `printf`） |
| **字面量** | 整数 `42`、浮点 `3.14`、字符串 `"hello"` |
| **运算符** | `+`, `-`, `*`, `/`, `=` |
| **分隔符** | `;`, `,`, `(`, `)`, `{`, `}` |
| **注释** | `//`, `/* ... */`（被词法分析器丢弃） |

```c
// C 源码片段
int max(int a, int b) {
    return a > b ? a : b;
}

// 词法分析后的 Token 序列
<int>  <标识符:max>  <(>  <int>  <标识符:a>  <,>
<int>  <标识符:b>    <)>  <{>
<return>  <标识符:a>  <运算符:>>  <标识符:b>  <?>
<标识符:a>  <:>  <标识符:b>  <;>
<}>
```

## 正则表达式——描述单词的模式

**正则表达式（Regular Expression）** 是描述字符串模式的数学记号——词法分析器用它来定义每种 Token 的"长相"。

### 基本规则

| 表达式 | 含义 | 匹配举例 |
|--------|------|---------|
| `a` | 字符 a 本身 | `"a"` |
| `a\|b` | a 或 b | `"a"`, `"b"` |
| `ab` | a 后跟 b | `"ab"` |
| `a*` | a 重复零次或多次 | `""`, `"a"`, `"aa"`, `"aaa"` |
| `a+` | a 重复一次或多次 | `"a"`, `"aa"`, ... |
| `a?` | a 出现零次或一次 | `""`, `"a"` |
| `[a-z]` | a 到 z 的任意字符 | `"m"`（但不匹配 `"M"`） |

### 常见 Token 的正则表达式

```
标识符（Identifier）:    [a-zA-Z_][a-zA-Z0-9_]*
整数（Integer Literal）: [0-9]+
浮点数（Float）:         [0-9]+"."[0-9]+
注释（Comment）:         "//"[^\n]*   （C++ 风格单行注释）
关键字（Keyword）:       "if" | "else" | "while" | "return" | ...
运算符（Operator）:      "+" | "-" | "*" | "/" | "=" | "==" | ...
```

> 💡 注意关键字和标识符的冲突——`if` 既是关键字，又符合标识符的模式 `[a-zA-Z_][a-zA-Z0-9_]*`。词法分析器通过**优先级**解决：关键字模式优先匹配。

## 从正则到词法分析器

```
正则表达式
    │  NFA（非确定有限自动机）
    │  DFA（确定有限自动机）
    ▼
词法分析器代码（自动生成）
```

### 手动编写的简易词法分析器

```python
import re

# Token 模式定义（按优先级排序）
TOKEN_PATTERNS = [
    ('KEYWORD',   r'\b(if|else|while|return|int|float)\b'),
    ('IDENTIFIER', r'[a-zA-Z_][a-zA-Z0-9_]*'),
    ('NUMBER',    r'[0-9]+(\.[0-9]+)?'),
    ('OPERATOR',  r'[+\-*/=<>!]+'),
    ('SEPARATOR', r'[;,\{\}\(\)]'),
    ('COMMENT',   r'//[^\n]*'),
    ('WHITESPACE', r'\s+'),  # 丢弃
]

def lex(code):
    tokens = []
    pos = 0
    while pos < len(code):
        match = None
        for tok_type, pattern in TOKEN_PATTERNS:
            regex = re.compile(pattern)
            match = regex.match(code, pos)
            if match:
                if tok_type != 'WHITESPACE':
                    tokens.append((tok_type, match.group()))
                pos = match.end()
                break
        if not match:
            raise SyntaxError(f"Illegal character at position {pos}: {code[pos]}")
    return tokens

# 测试
code = "int x = 42;"
print(lex(code))
# [('KEYWORD', 'int'), ('IDENTIFIER', 'x'), ('OPERATOR', '='),
#  ('NUMBER', '42'), ('SEPARATOR', ';')]
```

## Lex / Flex——自动生成词法分析器

手工写词法分析器太麻烦——Unix 工具 **Lex（及其 GNU 版本 Flex）** 可以从正则表达式自动生成 C 语言的词法分析器：

```lex
%{
#include "tokens.h"
%}

%%
"if"          { return IF; }
"else"        { return ELSE; }
"while"       { return WHILE; }
[a-zA-Z_][a-zA-Z0-9_]*  { return IDENTIFIER; }
[0-9]+        { return NUMBER; }
[ \t\n]+      { /* 跳过空白 */ }
.             { return UNKNOWN; }
%%

int main() {
    yylex();  // 自动生成的词法分析器
    return 0;
}
```

## 小结

| 概念 | 要点 |
|------|------|
| **词法分析** | 把字符流切分为 Token 序列 |
| **Token** | 有类型和值的最小语法单元 |
| **正则表达式** | 描述单词模式的数学语言 |
| **优先级** | 关键字优先于标识符匹配 |
| **Lex/Flex** | 自动从正则生成词法分析器 |

**为什么先学这个？** 词法分析是编译的第一步。正则表达式描述的 Token 模式会被编译为[[finite-automata|有限自动机（DFA/NFA）]]——下一节看看自动机如何高效识别字符串。
