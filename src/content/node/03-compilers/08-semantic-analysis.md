---
id: semantic-analysis
title: 语义分析与符号表
summary: 语义分析（Semantic Analysis）检查程序的"逻辑合理性"——类型检查、变量是否声明、函数参数是否匹配。符号表（Symbol Table）记录每个标识符的属性信息
difficulty: advanced
order: 8
parent: ast
children:
  - ir-three-address
related: []
prerequisites:
  - ast
tags:
  - compiler
  - semantic
  - symbol-table
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🧠 语法对，但逻辑对吗？

语法分析只能检查"结构是否正确"——它无法判断 `"hello" + 42` 是否有意义。

**语义分析（Semantic Analysis）** 做更深层的检查：

```
语法分析检查：句子结构是否完整？
语义分析检查：句子说的是人话吗？

"我吃石头" → 语法正确（主谓宾） → 语义错误（石头不能吃）
"int a = 'hello'" → 语法正确 → 语义错误（类型不匹配）
```

## 🔍 语义分析的核心任务

### ① 类型检查

```c
int a = 42;
a = "hello";     // ❌ 错误：不能把 char* 赋给 int
a = a + 3.14;    // ⚠️ 浮点→整数：精度损失
```

### ② 作用域检查

```c
int x = 10;
void func() {
    int y = 20;
    z = 30;       // ❌ 错误：z 没有声明
}
```

### ③ 函数参数检查

```c
int add(int a, int b) { return a + b; }
add(1);          // ❌ 错误：缺少参数
add(1, 2, 3);    // ❌ 错误：参数过多
add("hi", 2);    // ❌ 错误：参数类型不匹配
```

## 📚 符号表

符号表记录每个标识符的"档案"——类似班级花名册记录每个学生的姓名、学号和班级。

```python
class SymbolTable:
    def __init__(self):
        self.table = {}
        self.parent = None  # 外层作用域
    
    def lookup(self, name):
        if name in self.table:
            return self.table[name]
        if self.parent:
            return self.parent.lookup(name)
        return None  # 未声明

# 作用域链：函数内的符号表指向全局符号表
# 查找时——先查当前函数 -> 查全局
```

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **语义分析** | 检查程序逻辑是否正确——类型/作用域/参数检查 |
| **类型检查** | 运算的类型必须匹配 |
| **符号表** | 记录每个标识符的"档案" |
| **作用域链** | 内层找不到就去外层找 |

**为什么先学这个？** 语义分析之后，AST 完整了——下一步翻译成[[ir-three-address|中间表示（IR, 三地址码）]]。
