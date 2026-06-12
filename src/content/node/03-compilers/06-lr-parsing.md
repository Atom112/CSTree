---
id: lr-parsing
title: 自底向上分析（LR, LALR）
summary: LR 解析器从输入的 Token 序列出发，逐步归约到开始符号——它能处理的文法种类比 LL 更多，是 Yacc/Bison 等解析器生成器使用的方法
difficulty: advanced
order: 6
parent: syntax-analysis
children: []
related:
  - ll-parsing
prerequisites:
  - syntax-analysis
tags:
  - compiler
  - parser
  - lr
createdAt: 2026-06-12
---

## 从具体到抽象

LL 解析是从"程序"开始一步步展开到"具体的 Token"。LR 反过来——从具体的 Token 开始，一步步"归约"（Reduce）成非终结符，最后归约到"程序"。

```
LR 解析过程（对 int a = 42;）：
栈（底→顶）              剩余输入             动作
空                      int a = 42; $       移入
int                     a = 42; $           移入
int a                   = 42; $             移入
int a =                 42; $               移入
int a = 42              ; $                 归约 数字→表达式
int a = 表达式          ; $                 移入
int a = 表达式 ;        $                   归约 语句
语句                    $                   归约 程序
程序                    $                   接受！
```

> 🏫 **类比：拼图**
> LL 是从整体设计图开始，选一块拼上，再选下一块。LR 是把零散的拼图块（Token）拼成小图案（非终结符），再把小图案拼成大图案（程序）。

## LR 解析器的结构

```
┌────────────────────────┐
│  输入缓冲区              │
│  int a = 42 ;           │
└────────┬───────────────┘
         │
┌────────▼────────┐  动作  ┌──────────────┐
│  解析表          │←──────│  状态栈       │
│  (ACTION/GOTO)  │──────→│  (状态编号)   │
└─────────────────┘       └──────────────┘
                                  │
                                  │ 归约时弹出/压入
                                  ▼
                           ┌──────────────┐
                           │  符号栈        │
                           │  (非终结符)    │
                           └──────────────┘
```

### 两种操作

| 操作 | 含义 | 具体做法 |
|------|------|---------|
| **Shift（移入）** | 读下一个 Token，压入栈 | 状态推进 |
| **Reduce（归约）** | 栈顶匹配某产生式右部 → 替换为左部 | 弹出→压入 |

### LR 解析表

```
状态 \ Token    int    id    =    ...    $       |   表达式   语句
──────────────────────────────────────────       ───────────────
0               s3    s4                         |    1       2
1                                            acc  |
2               r3    r3                         |
3                     s5                         |
...
```

- `s3` = 移入并进入状态 3
- `r2` = 按第 2 条产生式归约
- `acc` = 接受（解析成功）
- 空白 = 语法错误

## LR 家族

| 变体 | 解析表大小 | 能力 | 实现难度 |
|------|:--------:|:----:|:-------:|
| **LR(0)** | 小 | 弱 | 简单 |
| **SLR(1)** | 小 | 中等 | 简单 |
| **LR(1)** | 很大 | 最强 | 复杂 |
| **LALR(1)** | 中等 | 接近 LR(1) | 适中 |

> 💡 **LALR(1)** 是实际应用最广的变体——Yacc、Bison、JavaCC 都使用 LALR。它合并了 LR(1) 中状态相同但向前看符号不同的状态，在解析能力和表大小之间取得了平衡。

## 移入-归约冲突

LR 解析中最难处理的问题——不知道应该移入还是归约：

```
if (x) if (y) a = 1; else b = 2;
            ↑ else 应该属于哪个 if？
```

**悬空 else（Dangling Else）问题**：

```
语法：语句 → if 表达式 语句
      | if 表达式 语句 else 语句
      | 其他

遇到 else 时：
• 移入？→ else 属于内层 if
• 归约？→ else 属于外层 if
```

默认选择**移入**——else 匹配最近的 if（大多数语言的做法）。

## Yacc/Bison 示例

```yacc
%{
#include <stdio.h>
%}

%token NUMBER PLUS TIMES LPAREN RPAREN
%left PLUS
%left TIMES

%%
expr: expr PLUS expr
    | expr TIMES expr
    | LPAREN expr RPAREN
    | NUMBER
    ;

%%
int main() { yyparse(); return 0; }
int yylex() { /* 词法分析器 */ }
int yyerror(char* s) { printf("Error: %s\n", s); }
```

## 小结

| 概念 | 要点 |
|------|------|
| **LR 解析** | 自底向上归约，从 Token 到开始符号 |
| **移入** | 读入 Token 压入栈 |
| **归约** | 栈顶匹配产生式右部 → 替换为左部 |
| **LALR(1)** | LR 的实用变体，Yacc/Bison 使用 |
| **移入-归约冲突** | 不知道该移入还是归约（如悬空 else） |

**为什么先学这个？** 了解了 LL 和 LR 两种解析方式，下一节看看语法分析的输出——[[ast|抽象语法树（AST）]]。
