---
id: jit-compilation
title: JIT（即时编译）
summary: JIT（Just-In-Time Compilation）在程序运行时把热点代码编译成机器码——结合了解释器的灵活性和编译器的性能。Java JVM、V8（JavaScript）、LuaJIT 都使用 JIT
difficulty: advanced
order: 16
parent: ir-three-address
children: []
related: []
prerequisites:
  - ir-three-address
tags:
  - compiler
  - jit
  - runtime
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## ⚡ "先跑起来，慢了再优化"

编译器一次性编译完再运行——启动慢但执行快。
解释器逐行运行——启动快但执行慢。

JIT（Just-In-Time Compilation，即时编译）**结合两者的优点**：

```
先解释执行 → 快速启动
↓
监控哪些代码运行最频繁（热点代码）
↓
热点代码 → 编译成机器码 → 加速执行
↓
不再热了的代码 → 丢弃编译结果 → 回到解释执行
```

> 🏪 **类比：做饭的两种方式**
>
> **传统编译（AOT）** = 你提前做好一整周的便当放冰箱——吃的时候微波炉一热就行（执行快），但准备时间长（编译慢）。
>
> **解释执行** = 每顿现做——想吃什么立刻做（启动快），但每次都要洗菜切菜炒菜（执行慢）。
>
> **JIT** = 平时吃速食（解释执行），但发现你每周三都吃鱼香肉丝——提前做好一批鱼香肉丝冻着，周三直接热来吃（热点编译）。

---

## 🔥 热点检测——"值得编译吗"

JIT 不是把所有代码都编译——只编译"热点（Hot Spot）"。

```java
// JVM 的热点检测
int sum = 0;
for (int i = 0; i < 1000000; i++) {  // 这个循环执行了 100 万次
    sum += arr[i];                      // → 被标记为"热点"
}                                       // → JIT 把这个循环编译成机器码
                                        // → 后续执行直接用编译后的机器码
```

JVM 使用**计数器阈值**：

```
方法调用计数器：一个方法被调用超过 N 次 → 编译
回边计数器：循环体被执行超过 M 次 → 编译

阈值可调：-XX:CompileThreshold=10000
```

---

## 📊 编译等级——从"快速"到"极致"

JVM 的 JIT 有多个编译等级（-client 到 -server）：

```
等级 0：解释执行（启动最快）
等级 1：简单 C1 编译（快速优化，不花太多时间）
等级 2：C1 编译 + 更多 profiling
等级 3：C1 编译 + 全 profiling
等级 4：C2 编译（极致优化——花更多时间编译，生成更快的代码）

随着运行时间推移——代码从等级 0 逐步上升到等级 4
如果等级 4 的代码不再频繁执行——回退到解释模式
```

```python
# JIT 编译的思想在 Python 中的体现——PyPy
# CPython（标准 Python）：纯解释器 → 慢
# PyPy：包含 JIT 编译器 → 比 CPython 快 4-10 倍

def sum_array(n):
    total = 0
    for i in range(n):
        total += i
    return total

# CPython：每次运行都逐行解释 → 慢
# PyPy：第一次解释，发现 total += i 是热点
#       → 编译成机器码 → 后续直接跑机器码 → 快
```

---

## 🏢 使用 JIT 的语言

| 语言/平台 | JIT 实现 | 特点 |
|:---------:|:--------:|:----:|
| **Java（JVM）** | C1（Client）、C2（Server）、Graal | 分层编译，自适应优化 |
| **JavaScript（V8）** | TurboFan + Ignition | 解释器+JIT，快速启动 |
| **C#（.NET）** | RyuJIT | 兼顾启动速度和峰值性能 |
| **PyPy（Python）** | 内建 JIT | 比 CPython 快 4-10 倍 |
| **LuaJIT** | 高度优化的 JIT | 号称最快的动态语言实现 |

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **JIT（即时编译）** | 运行时把热点代码编译成机器码——解释器+编译器的混合 |
| **热点检测** | 监控方法调用次数/循环次数——达到阈值就编译 |
| **分层编译** | 从解释→轻度编译→深度优化编译——渐进式 |
| **去优化（Deoptimization）** | 编译后的代码不再适用→回退到解释模式 |
| **PyPy vs CPython** | JIT 是 PyPy 比 CPython 快几倍的核心原因 |

**为什么先学这个？** JIT 是编译器技术的"运行时应用"。现代语言的性能很大程度上取决于 JIT 的质量——理解了 JIT，你就理解了"为什么 Java 越来越快"和"为什么 Python 可以更快"。
