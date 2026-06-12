---
id: simd-instructions
title: SIMD / 向量指令
summary: SIMD（Single Instruction, Multiple Data，单指令多数据）让 CPU 用一条指令同时处理多个数据——是多媒体处理、科学计算和 AI 推理加速的基石
difficulty: advanced
order: 14
parent: buffer-overflow
children: []
related:
  - buffer-overflow
  - arithmetic-logic-instructions
  - data-transfer-instructions
prerequisites:
  - arithmetic-logic-instructions
tags:
  - assembly
  - simd
  - performance
createdAt: 2026-06-12
---

## 一次处理一堆数据

普通的 `ADD` 指令一次加两个数。但如果要对 100 万个数做加法——你得循环 100 万次。

**SIMD（Single Instruction, Multiple Data，单指令多数据）** 让 CPU 用一条指令同时处理多个数据：

```
普通加法（SISD）：                    SIMD 加法：
ADD R0, R1                          ADD XMM0, XMM1
只加一对数                          同时加 4 对 32 位数（SSE）
                                   或 8 对 16 位数
                                   或 16 对 8 位数
```

### 类比：流水线上的打包

- **SISD（单指令单数据）** = 一个工人一次打包一个箱子——慢但简单
- **SIMD（单指令多数据）** = 一个工人一次把 4 个箱子推进打包机——效率翻 4 倍

但前提是：这 4 个箱子的打包方式必须**完全一样**——这就是 SIMD 的局限：只能做**数据并行**的操作，不能做不同的操作。

## 发展历史

### MMX（1997）

- 64 位寄存器（MM0-MM7）
- 同时处理 8 个字节 / 4 个 16 位整数
- 缺点：与 x87 浮点单元共用寄存器，切换开销大

### SSE（1999-2006）

- 128 位寄存器（XMM0-XMM15）
- 可同时处理：
  - 4 个 32 位浮点数
  - 2 个 64 位浮点数
  - 16 个字节 / 8 个 16 位整数 / 4 个 32 位整数

### AVX（2011）

- 256 位寄存器（YMM0-YMM15）
- 可同时处理：
  - 8 个 32 位浮点数
  - 4 个 64 位浮点数

### AVX-512（2016）

- 512 位寄存器（ZMM0-ZMM31）
- 可同时处理 16 个 32 位浮点数
- 用于服务器、HPC、AI 训练

```
寄存器大小演进：
┌──────────────┐
│  64 位 MMX   │  1997
├──────────────┤
│  128 位 XMM  │  1999 (SSE)
├──────────────┤
│  256 位 YMM  │  2011 (AVX)
├──────────────┤
│  512 位 ZMM  │  2016 (AVX-512)
└──────────────┘
```

> 💡 每一代都向下兼容——支持 AVX 的 CPU 也支持 SSE 和 MMX。

## SIMD 寄存器

以 SSE（128 位）为例，XMM 寄存器可以"拆分"成不同的数据类型视图：

```
XMM0 寄存器（128 位）：

作为 4 个 32 位整数：    [   int  ][   int  ][   int  ][   int  ]
                         XMM0[3]   XMM0[2]   XMM0[1]   XMM0[0]

作为 8 个 16 位整数：    [short][short][short][short][short][short][short][short]

作为 16 个字节：         [byte][byte][byte][byte]...[byte][byte][byte]

作为 4 个单精度浮点数：  [float][float][float][float]
```

**关键在于**：CPU 不知道寄存器里是什么类型——由指令决定如何解释这些位。

## 基本 SIMD 指令

### 数据加载和存储

```asm
; 加载 4 个 32 位整数到 XMM0
MOVDQU XMM0, [addr]        ; 从内存加载 128 位（不对齐也可以）

; 存储 XMM0 到内存
MOVDQU [addr], XMM0

; 加载标量（一个值）并广播到所有位置
; 把 [addr] 处的 32 位值复制到 XMM0 的 4 个位置
; 效果：XMM0 = {v, v, v, v}
```

### 算术运算

SSE 提供了多组算术指令——通过后缀区分处理的数据类型：

```
指令格式：  OP  DST, SRC
含义：     DST = DST OP SRC（逐元素）

PADDB   → 对 16 个字节做加法（Parallel ADD Bytes）
PADDW   → 对 8 个 16 位整数做加法（Words）
PADDD   → 对 4 个 32 位整数做加法（Doublewords）
PADDQ   → 对 2 个 64 位整数做加法（Quadwords）

ADDPS   → 对 4 个单精度浮点数做加法（Add Packed Single）
ADDPD   → 对 2 个双精度浮点数做加法（Add Packed Double）
```

```asm
; 例：向量加法 C[i] = A[i] + B[i]（4 个 32 位整数）
MOVDQU XMM0, [A_addr]      ; XMM0 = {A[3], A[2], A[1], A[0]}
MOVDQU XMM1, [B_addr]      ; XMM1 = {B[3], B[2], B[1], B[0]}
PADDD  XMM0, XMM1          ; XMM0 = {A[3]+B[3], A[2]+B[2], A[1]+B[1], A[0]+B[0]}
MOVDQU [C_addr], XMM0      ; 存结果
```

```
执行过程可视化：

XMM0: [ A3 ][ A2 ][ A1 ][ A0 ]
        +     +     +     +
XMM1: [ B3 ][ B2 ][ B1 ][ B0 ]
        =     =     =     =
结果: [C3=C3][C2][C1][C0=C0]
        ↑                    ↑
      一次 PADDD 完成了 4 个加法！
```

### 逐元素乘法

乘法和加法不同，需要注意数据类型：

```asm
; 32 位整数乘法
PMULLD XMM0, XMM1     ; 低 32 位相乘（每对 32 位乘 → 低 32 位结果）
PMULUDQ XMM0, XMM1    ; 无符号 32 位乘 → 64 位结果（只处理偶数位置）

; 浮点乘法
MULPS  XMM0, XMM1     ; 4 个单精度浮点数逐元素相乘
MULPD  XMM0, XMM1     ; 2 个双精度浮点数逐元素相乘
```

### 实战：点积（Dot Product）

点积是向量运算的核心——`A·B = A[0]*B[0] + A[1]*B[1] + A[2]*B[2] + A[3]*B[3]`：

```asm
; 计算 4 个浮点数的点积
; A = {a0, a1, a2, a3}, B = {b0, b1, b2, b3}
; 结果 = a0*b0 + a1*b1 + a2*b2 + a3*b3

MOVUPS XMM0, [A]       ; XMM0 = {a0, a1, a2, a3}
MOVUPS XMM1, [B]       ; XMM1 = {b0, b1, b2, b3}
MULPS  XMM0, XMM1      ; XMM0 = {a0*b0, a1*b1, a2*b2, a3*b3}

; 现在需要把 4 个乘积加起来——需要水平加法
HADDPS XMM0, XMM0      ; 水平加：XMM0 = {a0*b0+a1*b1, a2*b2+a3*b3, ...}
HADDPS XMM0, XMM0      ; 再水平加：XMM0[0] = 最终之和
```

`HADDPS`（水平加法）的执行过程：

```
第一步 HADDPS XMM0, XMM0:
XMM0 = {a0*b0, a1*b1, a2*b2, a3*b3}
                ↓ HADDPS
XMM0 = {a0*b0+a1*b1, a2*b2+a3*b3, a0*b0+a1*b1, a2*b2+a3*b3}

第二步 HADDPS XMM0, XMM0:
                ↓ HADDPS
XMM0 = {SUM, SUM, SUM, SUM}    ← XMM0[0] 就是最终结果
```

### 实战：图像像素处理

将 RGBA 图像每个像素的 RGB 分量乘以 1.2（亮度增强）：

```
每个像素 4 字节：R G B A（各 8 位）
128 位 XMM 寄存器 = 4 个像素
```

```c
// C 版本
for (int i = 0; i < num_pixels; i++) {
    pixels[i].r = min(255, pixels[i].r * 1.2);
    pixels[i].g = min(255, pixels[i].g * 1.2);
    pixels[i].b = min(255, pixels[i].b * 1.2);
    // A（透明度）保持不变
}
```

```asm
; SSE 版本——一次处理 4 个像素
; XMM0 = {pixel3, pixel2, pixel1, pixel0}（每个像素 32 位 RGBA）

; 拆分为字节 → 转换为浮点 → 乘以 1.2 → 截断 → 组合回去
; 实际代码会使用专门指令如 CVTDQ2PS 和 MINPS

; 简化示意：
.loop:
    MOVDQU XMM0, [pixels + i*16]   ; 加载 4 个像素
    ; ...转换、运算、截断...
    MOVDQU [pixels + i*16], XMM0   ; 存回 4 个像素
    ADD    i, 4
    CMP    i, num_pixels
    JL     .loop
```

> 💡 用 SIMD 优化后，处理 100 万像素的循环只需要 25 万次迭代（每次 4 个像素）。

## 数据洗牌（Shuffle）

SIMD 最强大的操作之一——重新排列寄存器内的数据：

```asm
; PSHUFD — 洗牌双字（32 位）
; PSHUFD XMM0, XMM1, imm8
; imm8 的每 2 位指定一个目标位置的来源

; 例：交换顺序 {D, C, B, A} → {A, B, C, D}
; imm8 = 00 01 10 11 (二进制) = 0x1B
; 位置 0 ← 元素 3 (11)
; 位置 1 ← 元素 2 (10)
; 位置 2 ← 元素 1 (01)
; 位置 3 ← 元素 0 (00)

MOVDQU  XMM0, [data]    ; XMM0 = {D, C, B, A}
PSHUFD  XMM0, XMM0, 0x1B  ; XMM0 = {A, B, C, D}
```

洗牌的应用：
- 转置矩阵
- 复制/广播值
- 数据类型转换时的重新排列
- 实现 Gather/Scatter 操作

## 编译器自动向量化

### 不需要手写 SIMD 的情况

现代编译器会自动把简单的循环转成 SIMD 指令——称为**自动向量化（Auto-vectorization）**：

```c
// 编译器会自动生成 SIMD 指令！
void add_arrays(int* a, int* b, int* c, int n) {
    for (int i = 0; i < n; i++) {
        c[i] = a[i] + b[i];
    }
}
```

```bash
gcc -O2 -ftree-vectorize -fopt-info-vec program.c
```

自动向量化的条件是：

| 条件 | 说明 |
|------|------|
| ✅ **连续内存** | 数组访问模式可预测 |
| ✅ **无数据依赖** | 第 i 次迭代不依赖第 i+1 次的结果 |
| ✅ **对齐的数据** | 16 字节对齐（SSE）或 32 字节对齐（AVX） |
| ❌ **指针别名** | 编译器不确定 a, b, c 是否指向同一块内存 |
| ❌ **间接访问** | a[b[i]] 这类 Gather 操作 |

### 帮助编译器向量化

```c
// ❌ 可能不向量化
void add(int* a, int* b, int* c) {
    for (int i = 0; i < 1024; i++) {
        c[i] = a[i] + b[i];
    }
}

// ✅ 用 restrict 告诉编译器没有别名问题
void add(int* restrict a, int* restrict b, int* restrict c) {
    for (int i = 0; i < 1024; i++) {
        c[i] = a[i] + b[i];
    }
}
```

## 使用 Intrinsics（C 层面写 SIMD）

手写 SIMD 汇编繁琐且易错。GCC/Clang 提供了 **Intrinsics（内联函数）**——在 C 中直接调用 SIMD 指令：

```c
#include <emmintrin.h>  // SSE2 intrinsics
#include <immintrin.h>  // AVX intrinsics

// 使用 SSE2 的向量加法
void add_float_sse(float* a, float* b, float* c) {
    __m128 va = _mm_loadu_ps(a);        // MOVUPS — 加载 4 个 float
    __m128 vb = _mm_loadu_ps(b);        // MOVUPS
    __m128 vc = _mm_add_ps(va, vb);     // ADDPS — 向量加法
    _mm_storeu_ps(c, vc);               // MOVUPS — 存回
}

// 一次处理 4 个元素，循环展开
void add_float_array(float* a, float* b, float* c, int n) {
    for (int i = 0; i < n; i += 4) {
        __m128 va = _mm_loadu_ps(&a[i]);
        __m128 vb = _mm_loadu_ps(&b[i]);
        __m128 vc = _mm_add_ps(va, vb);
        _mm_storeu_ps(&c[i], vc);
    }
}

// AVX 版本——一次处理 8 个 float
#include <immintrin.h>
void add_float_avx(float* a, float* b, float* c, int n) {
    for (int i = 0; i < n; i += 8) {
        __m256 va = _mm256_loadu_ps(&a[i]);
        __m256 vb = _mm256_loadu_ps(&b[i]);
        __m256 vc = _mm256_add_ps(va, vb);
        _mm256_storeu_ps(&c[i], vc);
    }
}
```

### Intrinsics 命名规则

```
_mm_add_ps
  │    │   │
  │    │   └── ps = packed single（打包单精度浮点）
  │    │       pd = packed double（打包双精度浮点）
  │    │       epi32 = 32 位整数
  │    │       si128 = 128 位整数
  │    └── 操作名
  └── 前缀：_mm_ = SSE, _mm256_ = AVX, _mm512_ = AVX-512
```

## SIMD 性能对比

| 操作 | 标量（SISD） | SSE（128 位） | AVX（256 位） | AVX-512 |
|------|-------------|--------------|--------------|---------|
| 32 位整数加法 | 1 个/次 | 4 个/次 | 8 个/次 | 16 个/次 |
| 单精度浮点乘法 | 1 个/次 | 4 个/次 | 8 个/次 | 16 个/次 |
| 理论加速比 | 1× | 4× | 8× | 16× |

**实际加速比**通常在 2×-6× 之间（SSE）和 4×-12× 之间（AVX）——不是理论倍数，因为还有内存访问开销、数据对齐等问题。

## 什么时候用 SIMD？

| 场景 | 适用性 |
|------|--------|
| 图像/视频处理 | ✅ 高度适合——像素数据天然并行 |
| 音频处理 | ✅ 多个采样点同时处理 |
| 科学计算/矩阵运算 | ✅ 矩阵乘法、向量运算的核心 |
| 加密算法 | ✅ AES、SHA 都有专用 SIMD 指令 |
| AI 推理 | ✅ 神经网络卷积的核心 |
| 字符串搜索 | ✅ 一次比较 16 个字符 |
| 分支密集的代码 | ❌ 不适合——每个数据元素要走不同的路径 |
| 链表/树遍历 | ❌ 不适合——内存不连续、结构不同 |

## 常见错误

### 错误 1：未对齐的内存访问

某些 SIMD 指令要求内存地址 16 字节对齐：

```asm
; 假设 buf 没有 16 字节对齐
MOVDQA XMM0, [buf]     ; ❌ 未对齐 → 一般保护错误（GP fault）！
MOVDQU XMM0, [buf]     ; ✅ MOVDQU 在不对齐时也正常工作（但稍慢）
```

### 错误 2：假设 SSE 寄存器被清零

```asm
; XMM0 的初始值是不确定的！
PADDD XMM0, XMM1      ; ❌ 如果忘了初始化 XMM0，结果不可预测
```

### 错误 3：数据类型混淆

```asm
; 加载了 4 个整数，却用了浮点加法
MOVDQU XMM0, [int_data]    ; 加载整数
ADDPS  XMM0, XMM1          ; ❌ 整数数据被解释为浮点数——结果完全错误！
PADDD  XMM0, XMM1          ; ✅ 应该用整数加法
```

### 错误 4：残留 XMM 状态导致性能下降

在 x86-64 上，频繁切换 SSE 和 AVX 指令会导致**状态转换惩罚**（频率降频）：

```c
// ❌ 混合使用导致 penalty
_mm_add_ps(a, b);       // SSE
_mm256_add_ps(c, d);    // AVX ← CPU 需要从 SSE 模式切换到 AVX 模式

// ✅ 尽量保持一致
_mm256_add_ps(a, b);    // 全用 AVX
_mm256_add_ps(c, d);    // 全用 AVX
```

## 编译器对 SIMD 的支持

要使用 SIMD intrinsics，需要包含对应的头文件：

| 指令集 | 头文件 | GCC 编译选项 |
|--------|--------|-------------|
| MMX | `mmintrin.h` | `-mmmx` |
| SSE | `xmmintrin.h` | `-msse` |
| SSE2 | `emmintrin.h` | `-msse2` |
| SSE3 | `pmmintrin.h` | `-msse3` |
| SSSE3 | `tmmintrin.h` | `-mssse3` |
| SSE4.1 | `smmintrin.h` | `-msse4.1` |
| SSE4.2 | `nmmintrin.h` | `-msse4.2` |
| AVX | `immintrin.h` | `-mavx` |
| AVX2 | `immintrin.h` | `-mavx2` |
| AVX-512 | `immintrin.h` | `-mavx512f` |

```bash
# 编译时开启 SSE4.2
gcc -msse4.2 -O2 -o program program.c
```

> 💡 最简单的做法：直接包含 `<immintrin.h>` 并加上 `-march=native`——编译器会自动启用当前 CPU 支持的所有 SIMD 指令集。

## 小结

SIMD 是 CPU 并行处理数据的重要武器：

| 概念 | 要点 |
|------|------|
| **SIMD 本质** | 一条指令处理多个数据元素 |
| **寄存器** | XMM（128 位）、YMM（256 位）、ZMM（512 位） |
| **发展** | MMX → SSE → AVX → AVX-512 |
| **适用场景** | 连续数据、相同操作、无数据依赖 |
| **编程方式** | 手写汇编 / Intrinsics / 编译器自动向量化 |
| **加速比** | 通常 2×-6×（SSE），4×-12×（AVX） |

**关键原则：**
- SIMD 适合**数据并行**——大量数据做同样的操作
- SIMD 不适合**控制并行**——每个数据走不同的分支
- 优先让编译器自动向量化，编译器做不好时再手写 Intrinsics
- 从 SSE 开始学，AVX 只是更宽的 SSE

**为什么这很重要？** SIMD 是现代 CPU 最重要的性能特性之一——它通过硬件并行实现了"一条指令当多条用"。从手机里的图像处理到服务器上的 AI 推理，SIMD 无处不在。

至此，你已经完成了汇编语言的全部基础知识！接下来，你将从底层硬件和汇编的世界"往上走一层"——进入操作系统的大门。操作系统是连接硬件和应用程序的桥梁，你将学到进程、线程、内存管理、文件系统等核心概念（此内容将在后续章节详细讲解）。
