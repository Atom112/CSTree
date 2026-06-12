---
id: jit-compilation
title: JIT（即时编译）
summary: JIT（Just-In-Time）编译在运行时把字节码或热点代码编译为机器码——兼得跨平台（先编译成字节码）和性能（热点代码编译为本地码）。Java JVM、JavaScript V8、LLVM 都使用 JIT 技术
difficulty: advanced
order: 16
parent: ir-three-address
children: []
related:
  - ir-three-address
  - code-generation
prerequisites:
  - ir-three-address
tags:
  - compiler
  - jit
  - runtime
createdAt: 2026-06-12
---

## 编译方式的光谱

```
纯解释器                   纯 AOT 编译器
Python                   C, Rust, Go
  │                          │
  └────── JIT（中间地带）─────┘
         Java JVM, JavaScript V8
         LuaJIT, PyPy
```

| 方式 | 优点 | 缺点 |
|:----:|:----:|:----:|
| **解释执行** | 启动快，跨平台 | 执行慢 |
| **AOT 编译** | 执行快 | 启动慢，不跨平台 |
| **JIT 编译** | 兼顾两者 | 实现复杂，内存开销 |

> 🏫 **类比：翻译方式**
> - **解释器**：你读一句英文，我翻译一句中文（慢但即时）
> - **AOT 编译器**：先把整本书翻译成中文，再给你看（快但需等翻译完）
> - **JIT 编译器**：先直接读英文，发现某段话反复出现，再把它翻译成中文备查（越来越快）

## JIT 的工作流程

```
Java 源码 → 字节码（.class）→ JVM 解释执行
                                    │
                        ┌───────────┴───────────┐
                        │  方法调用计数器          │
                        │  循环回溯计数器          │
                        └───────────┬───────────┘
                                    │ 超过阈值（热点代码）
                                    ▼
                         ┌─────────────────────┐
                         │  JIT 编译器           │
                         │  将字节码编译为本地码   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         本地机器码（直接执行）
```

> 💡 Java 的**分层编译**：C1（客户端编译器）编译快但优化少，C2（服务端编译器）编译慢但优化多。方法先被 C1 编译，如果继续热点再被 C2 编译。

## 热点检测

JIT 通过计数器识别"热点代码"——值得编译的部分：

```java
// JVM 的方法调用计数器（-XX:CompileThreshold=10000）
// 方法被调用 10000 次后触发 JIT 编译

void hot_method() {      // ← 被频繁调用
    for (int i = 0; i < n; i++) {
        sum += array[i];
    }
}
```

| 策略 | 触发条件 | 特点 |
|:----:|:--------:|:----:|
| **方法编译** | 方法调用次数超阈值 | 编译整个方法 |
| **栈上替换（OSR）** | 循环次数超阈值 | 编译正在执行的循环 |
| **分层编译** | 逐步升级编译级别 | 启动快，峰值性能高 |

## 去优化（Deoptimization）

JIT 编译器可能基于某些假设做了激进的优化——当假设不成立时，必须回退到解释执行：

```java
// JIT 假设 obj.getClass() 总是同一个类型
// → 优化为直接方法调用（而非虚函数分派）

void foo(Object obj) {
    obj.method();  // JIT: 内联优化！
}

// 如果突然传入一个不同的类型 → 去优化
// 回退到解释器，重新编译
```

> 💡 去优化是 JIT 特有的"后悔药"——AOT 编译器编译后就定了，JIT 可以随时重新编译。

## 内联缓存（Inline Cache）

JIT 的一个关键优化——缓存方法调用的目标类型：

```javascript
// JavaScript 是动态类型，但实际中 obj.method()
// 99% 的情况下 obj 是同一个类型

function add(obj) {
    return obj.value + 1;
    // V8 的 JIT：第一次调用后缓存 obj 的类型
    // 之后如果类型相同，直接调用优化后的代码
    // 类型不同→去优化+重新编译
}
```

## JIT 编译器对比

| 语言/平台 | JIT 实现 | 特点 |
|:---------:|:--------:|:----:|
| **Java (JVM)** | C1/C2 (HotSpot) | 分层编译，Graal JIT |
| **JavaScript (V8)** | SparkPlug / TurboFan | 多级编译，内联缓存 |
| **.NET (CLR)** | RyuJIT | 即时编译，分层 |
| **Lua** | LuaJIT | 轻量极速，FFI 支持 |
| **PyPy** | RPython JIT | Python 的 JIT 实现 |

## JIT 的挑战

| 挑战 | 说明 |
|:----:|------|
| **编译开销** | 运行时编译消耗 CPU——不能优化太多 |
| **内存占用** | 编译后的本地码占用代码缓存 |
| **启动时间** | JIT 预热需要时间（Java 启动慢的原因） |
| **去优化** | 假设不成立时回退成本高 |

```bash
# 查看 JVM JIT 编译统计
$ java -XX:+PrintCompilation MyApp
     23   1       3       java.lang.String::hashCode (55 bytes)
     24   2       3       java.lang.Object::<init> (1 bytes)
     25   3       4       java.lang.String::charAt (5 bytes)   ← 3=分层级别
     26   4       4       MyApp::hot_method (12 bytes)
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **JIT** | 运行时将热点代码编译为机器码 |
| **热点检测** | 通过调用/循环计数器识别 |
| **分层编译** | C1 轻量编译，C2 深度优化 |
| **去优化** | 假设不成立时回退到解释器 |
| **内联缓存** | 缓存动态类型信息优化调用 |
| **典型应用** | Java JVM、JavaScript V8、LuaJIT |

**为什么先学这个？** JIT 是现代语言运行时的核心——它把编译技术的"编译时优化"和解释器的"运行时信息"结合起来。至此编译原理板块全部完成！
