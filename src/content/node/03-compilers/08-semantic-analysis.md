---
id: semantic-analysis
title: 语义分析与符号表
summary: 语义分析（Semantic Analysis）检查程序的逻辑正确性——变量有没有声明、类型是否匹配、函数参数对不对——这些语法分析器检查不了的事情
difficulty: advanced
order: 8
parent: ast
children:
  - type-checking
related: []
prerequisites:
  - ast
tags:
  - compiler
  - semantic
  - symbol-table
createdAt: 2026-06-12
---

## 语法正确，语义不一定对

```c
int a = "hello";  // 语法正确：int 标识符 = 表达式 ;
                   // 语义错误：不能把字符串赋给整数

b = 42;           // 语法正确：标识符 = 表达式 ;
                   // 语义错误：b 未声明

return "x" / 3;   // 语法正确：return 表达式 ;
                   // 语义错误：不能对字符串做除法
```

**语法分析**检查结构对不对。**语义分析**检查意思对不对。

> 🏫 **类比：造句"
> - 语法正确："我吃桌子。"（主谓宾结构完整）
> - 语义检查：桌子不能吃 → 语义错误！

## 符号表（Symbol Table）

**符号表**是语义分析的核心数据结构——记录每个标识符的属性：

```c
struct Symbol {
    char* name;        // 变量名/函数名
    Type* type;        // 类型信息
    int scope_level;   // 作用域层级
    bool is_initialized; // 是否已初始化
    // 函数特有的信息
    Type** param_types;  // 参数类型列表
    int param_count;     // 参数个数
};
```

```
符号表可视化：
作用域 0（全局）：
    printf     → [函数] (int, char*) → int
    MAX_SIZE   → [常量] int = 1024

作用域 1（函数 main）：
    argc       → [变量] int, 已初始化
    argv       → [变量] char**, 已初始化
    i          → [变量] int, 未初始化

作用域 1.1（for 循环内）：
    j          → [变量] int, 已初始化
```

### 作用域管理

```python
class SymbolTable:
    def __init__(self, parent=None):
        self.symbols = {}       # 当前作用域的符号
        self.parent = parent    # 外层作用域
    
    def define(self, name, symbol):
        self.symbols[name] = symbol
    
    def lookup(self, name):
        if name in self.symbols:
            return self.symbols[name]
        if self.parent:
            return self.parent.lookup(name)  # 递归查找外层
        return None  # 未找到——未声明变量
    
    def enter_scope(self):
        return SymbolTable(self)  # 创建子作用域
    
    def exit_scope(self):
        return self.parent  # 回到父作用域
```

## 语义检查的类型

| 检查项 | 例子 | 错误信息 |
|-------|------|---------|
| **未声明** | `x = 1;`（x 未声明） | `error: 'x' undeclared` |
| **类型不匹配** | `int x = "hello"` | `error: incompatible types` |
| **重复声明** | `int x; float x;` | `error: redeclaration of 'x'` |
| **函数参数** | `printf(42)`（缺参数） | `error: too few arguments` |
| **返回值** | `int f() { }`（没有 return） | `warning: no return value` |

## 属性文法（Attribute Grammar）

语义分析的理论基础——给文法符号附加"属性"，在语法分析过程中计算这些属性：

```
产生式                         语义规则
表达式 → 表达式 + 项            表达式.val = 表达式.val + 项.val
表达式 → 项                    表达式.val = 项.val
语句 → 类型 标识符 = 表达式 ;   符号表.define(标识符.name, 类型)
```

**综合属性**：从子节点传到父节点（自底向上）
**继承属性**：从父节点传到子节点（自顶向下）

## 小结

| 概念 | 要点 |
|------|------|
| **语义分析** | 检查程序逻辑正确性，语法分析做不到的事 |
| **符号表** | 记录标识符的名称、类型、作用域等信息 |
| **作用域** | 嵌套作用域，内层可访问外层变量 |
| **语义检查** | 未声明、类型不匹配、重复声明等 |
| **属性文法** | 语义规则的形式化描述 |

**为什么先学这个？** 语义分析中最重要的部分是[[type-checking|类型检查与类型推导]]——下一节深入看看编译器如何推理类型。
