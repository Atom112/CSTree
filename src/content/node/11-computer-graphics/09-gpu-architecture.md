---
id: gpu-architecture
title: GPU 架构与着色器编程
summary: GPU 是专为并行图形计算设计的处理器——数千个核心同时处理像素和顶点。CUDA/GLSL 让通用计算也能利用 GPU 的并行能力
difficulty: advanced
order: 9
parent: acceleration-structures
children:
  - curves-surfaces
related: []
prerequisites:
  - graphics-pipeline
tags:
  - graphics
  - gpu
  - shader
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🏭 很多小学生 vs 一个博士

CPU 有 4-16 个非常强大的核心——每个核心能处理复杂任务（分支预测、乱序执行、大缓存）。

GPU 有几千个较小的核心——每个核心只能做简单的算术，但数量众多，适合**大规模并行**。

> 🏪 **类比：小学数学考试**
>
> **CPU** = 一个博士做 1000 道小学数学题——因为太简单，大部分时间在等题目。
>
> **GPU** = 1000 个小学生每人做 1 道题——同时开工，瞬间完成。
>
> 图形渲染就是"很多简单算术"（每个像素的计算独立、每个顶点的计算独立）——非常适合 GPU。

---

## ⚙️ GPU 的关键架构特点

### SIMT（单指令多线程）

GPU 的执行模型：**32 个线程（一组 warp/wavefront）同时执行同一条指令**。

```
if (uv.x > 0.5) {
    color = red;       // 有些线程执行这个
} else {
    color = blue;      // 有些线程执行这个（但被阻塞了！）
}

// 如果 warp 中有分歧——两个分支都会执行，浪费一半核心
// 所以 GPU 程序要尽量避免分支分歧！
```

### 内存层次

| 内存 | 大小 | 速度 | 作用域 |
|:----:|:----:|:----:|:------:|
| 全局内存 | GB | 慢（~200 周期）| 所有线程 |
| 共享内存 | KB-MB | 快（~5 周期）| 同一 block 的线程 |
| 寄存器 | 有限 | 最快 | 单个线程 |

**性能关键**：尽量减少全局内存访问，多用共享内存和寄存器。

---

## 🖥️ 着色器编程

可编程管线阶段用**着色器（Shader）** 写：

```glsl
// 顶点着色器——每个顶点执行一次
#version 330 core
layout (location = 0) in vec3 aPos;
uniform mat4 mvp;
void main() {
    gl_Position = mvp * vec4(aPos, 1.0);
}
```

```glsl
// 片元着色器——每个像素执行一次
#version 330 core
out vec4 FragColor;
uniform vec3 color;
void main() {
    FragColor = vec4(color, 1.0);
}
```

---

## 🔬 GPU 通用计算（GPGPU）

不只能画图——GPU 也适合大规模并行计算：

```
适用 GPU 的场景：          不适合 GPU 的场景：
图像处理（滤镜、模糊）    串行依赖的任务
矩阵乘法（深度学习）      频繁分支分歧
物理模拟（粒子系统）      递归/链表遍历
排序（大数据量）          小数据量
```

```cuda
// CUDA——用 GPU 做数组求和
__global__ void vector_add(float* A, float* B, float* C, int N) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < N) {
        C[i] = A[i] + B[i];  // 每个线程处理一个元素
    }
}

// 启动 256 个线程块，每块 256 线程 → 65536 线程并行工作
vector_add<<<256, 256>>>(A, B, C, N);
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **GPU vs CPU** | 很多小核并行 vs 几个大核串行 |
| **SIMT** | 32 个线程同时执行同一条指令 |
| **Warp/Wavefront** | GPU 线程的基本执行单元 |
| **着色器** | 顶点着色器（每个顶点）+ 片元着色器（每个像素）|
| **CUDA** | 用 GPU 做通用计算——不只用于渲染 |

**为什么先学这个？** 了解 GPU 后，看看[[curves-surfaces|曲线与曲面（Bézier, B-Spline）]]。
