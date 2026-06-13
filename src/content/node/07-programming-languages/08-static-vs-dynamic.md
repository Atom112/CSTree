---
id: static-vs-dynamic
title: 静态 vs 动态类型
summary: 静态类型在编译时检查类型，动态类型在运行时检查——静态类型更安全但编写时约束多，动态类型更灵活但运行时可能暴露错误
difficulty: intermediate
order: 8
parent: programming-paradigms
children:
  - type-inference
related: []
prerequisites:
  - programming-paradigms
tags:
  - pl
  - type-system
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🍳 钢印 vs 柔性——什么时候"确定"类型？

你在食堂打饭，有两种方式：

**方式一（静态）**：提前印好的餐券——上面写着"红烧肉套餐"。你只能用它换红烧肉套餐，不能换别的。食堂大妈看餐券就知道你要什么——**从头就定死了**。

**方式二（动态）**：你去窗口直接说"我要一份红烧肉套餐"。你可以临时改主意说"换成鱼香肉丝"——**你说了算，但大妈可能告诉你"鱼香肉丝已经卖完了"**。

编程语言的类型检查也是这个区别：

- **静态类型（Static Typing）**：编译时检查——变量类型定了就不能改
- **动态类型（Dynamic Typing）**：运行时检查——类型可以灵活变化，但可能暴露运行时错误

```python
# Python（动态类型）——变量可以随时改变类型
x = 42              # x 现在是整数
x = "hello"         # 没问题——x 现在是字符串（类型变了）
x = [1, 2, 3]      # 也没问题——x 现在是列表
```

```java
// Java（静态类型）——变量类型一旦声明就不能变
int x = 42;         // x 是 int 类型
x = "hello";        // ❌ 编译错误：String 不能赋给 int
```

> 📐 **类型系统（Type System）**：一组规则，定义语言中的值"属于什么类型"，以及不同类型之间如何交互。

---

## ⚔️ 两种哲学的根本区别

### 静态类型：编译时抓住错误

```java
// Java——静态类型在编译时就检查
public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        System.out.println(add(5, "10"));  // ❌ 编译错误！
        // 类型不匹配：String 不能转换为 int
    }
}
```

**优点**：
- 很多错误在**写代码时就被发现了**（而不是用户运行时才崩溃）
- 编译器可以优化（知道变量类型和大小，可以生成更高效的代码）
- 类型本身就是"文档"——看函数签名就知道怎么用

**缺点**：
- 写起来更啰嗦（需要标注类型）
- 不够灵活（有些在"人看起来没问题"的代码，编译器会拒绝）

### 动态类型：灵活性至上

```python
# Python——运行时才检查
def add(a, b):
    return a + b

print(add(5, 10))         # 15 ✅
print(add("hello", " world"))  # "hello world" ✅
print(add(5, "hello"))    # ❌ 运行时报错：不能拼接 int 和 str
```

**优点**：
- 代码更简洁——不需要类型标注
- 更灵活——同样的函数可以处理不同类型的参数（鸭子类型）
- 上手快——不用理解复杂的类型系统

**缺点**：
- 运行时才暴露类型错误——用户可能成为"测试员"
- 大型项目重构困难——改了一个函数的参数类型，不知道哪些调用方受影响

---

## 🧩 鸭子类型（Duck Typing）——动态类型的核心思想

**"如果它走起来像鸭子，叫起来像鸭子，那它就是鸭子。"**

```python
# Python 的鸭子类型——不看类型看行为
class Duck:
    def quack(self):
        print("嘎嘎")

class Person:
    def quack(self):
        print("学鸭子叫：嘎嘎")

def make_it_quack(thing):
    thing.quack()  # 不检查 thing 是 Duck 还是 Person
                   # 只要它有 quack 方法就行

make_it_quack(Duck())    # 嘎嘎
make_it_quack(Person())  # 学鸭子叫：嘎嘎
```

在静态类型语言中，你需要定义接口：

```java
// Java——需要显式接口
interface Quackable {
    void quack();
}

class Duck implements Quackable { ... }
class Person implements Quackable { ... }
```

> 💡 **鸭子类型的价值**：在 Python/JavaScript 中，你不需要提前设计接口。只要对象有你需要的方法，就能用。这大大降低了代码耦合度，但也意味着：如果你传入了一个`quack`方法做其他事的对象，你可能会得到莫名其妙的运行时错误。

---

## 📊 静态 vs 动态——主要语言一览

| 语言 | 类型检查 | 强度 | 备注 |
|:----:|:--------:|:----:|------|
| **C/C++** | 静态 | 弱 | 可以强制类型转换绕过检查 |
| **Java** | 静态 | 强 | 泛型增强了类型安全 |
| **Rust** | 静态 | 超强 | 所有权系统 + 类型系统 |
| **Haskell** | 静态 | 极强 | 类型推断，几乎不需要写类型 |
| **Python** | 动态 | 强 | 但鸭子类型给了很多灵活性 |
| **JavaScript** | 动态 | 弱 | `'5' - 3` 这种隐式转换 |
| **Ruby** | 动态 | 强 | 和 Python 类似 |
| **TypeScript** | 静态（可选）| 强 | JavaScript + 类型标注 |

### 类型强度

**强类型（Strong Typing）** 和**弱类型（Weak Typing）** 是另一个维度：

```python
# Python——强类型：不允许隐式类型转换（除非是"合理"的）
"hello" + 5  # ❌ TypeError

# JavaScript——弱类型：允许很多隐式转换
"5" - 3      # 2（字符串"5"被隐式转成数字）
"5" + 3      # "53"（数字 3 被隐式转成字符串）
```

---

## 🔀 两种类型系统的"汇合"——逐渐趋同

有趣的是：**动态类型语言在加入类型标注，静态类型语言在加入类型推断**——它们正从两端向中间靠拢。

### 动态 + 类型标注（渐进类型）

```python
# Python 从 3.5 开始支持类型标注
from typing import List, Optional

def find_student(students: List[dict], name: str) -> Optional[dict]:
    for s in students:
        if s["name"] == name:
            return s
    return None

# 类型标注不影响运行——但可以用 mypy 等工具做静态检查
```

```typescript
// TypeScript——JavaScript + 类型标注
function add(a: number, b: number): number {
    return a + b;
}
```

### 静态 + 类型推断

```haskell
-- Haskell——几乎所有类型都能自动推断
-- 你不需要写类型（但编译器会自动推导）
add x y = x + y
-- 自动推导出：add :: Num a => a -> a -> a
```

```rust
// Rust——函数签名需要标注类型，但局部变量可以推断
let x = 42;           // 编译器知道 x 是 i32
let mut v = Vec::new();  // 知道 v 是 Vec<_>，具体类型等上下文确定
v.push("hello");       // 现在确定 v 是 Vec<&str>
```

---

## 🎯 如何选择？

```python
# 场景 1：快速原型、数据科学、脚本
# → 动态类型（Python、JavaScript）
# 原因：开发速度快，灵活性优先

# 场景 2：大型项目、多人协作
# → 静态类型（Java、TypeScript、Rust）
# 原因：编译器帮你找到错误，重构更安全

# 场景 3：性能敏感、系统编程
# → 静态类型（C、Rust）
# 原因：类型信息辅助编译器生成高效代码
```

> 💡 **现实中的组合**：很多公司"内层用静态、外层用动态"——核心服务用 Rust/Java 写，快速原型和脚本用 Python。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **静态类型** | 编译时检查类型——更安全、更高效、更啰嗦 |
| **动态类型** | 运行时检查类型——更灵活、更简洁、更危险 |
| **鸭子类型** | 动态类型的核心理念——"看行为不看类型" |
| **强类型 vs 弱类型** | 是否允许隐式类型转换 |
| **渐进类型** | 动态+可选类型标注（Python/TypeScript）|
| **类型推断** | 静态+自动推导类型（Haskell/Rust）|

> 🎯 **小练习**：下面的 JavaScript 代码输出什么？这反映了什么类型特性？
> ```javascript
> console.log([] + [])    // ?
> console.log({} + [])    // ?
> ```

**为什么先学这个？** 理解了静态/动态类型的区别后，看看静态类型语言如何"自动推断"类型——[[type-inference|类型推导与多态]]。
