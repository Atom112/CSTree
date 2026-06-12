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
---

## GPU vs CPU

```
CPU： 4-16 核，每个核极强，适合串行任务
GPU：数千个小核心，适合大规模并行

逻辑：GPU 是"很多小学生做简单算术"，
      CPU 是"一个博士解复杂方程"
```

## 着色器编程

```glsl
// 计算着色器——GPU 通用计算
#version 430 core
layout (local_size_x = 16, local_size_y = 16) in;
layout (rgba32f, binding = 0) uniform image2D outputImage;

void main() {
    ivec2 pixel = ivec2(gl_GlobalInvocationID.xy);
    vec2 uv = vec2(pixel) / vec2(imageSize(outputImage));
    vec3 color = vec3(uv.x, uv.y, 0.5);
    
    // 每个像素一个线程——并行执行！
    imageStore(outputImage, pixel, vec4(color, 1.0));
}
```

## 小结

| 技术 | 说明 |
|:----:|------|
| **SIMT** | 单指令多线程——GPU 的执行模型 |
| **Warp/Wavefront** | 32/64 个线程为一组同步执行 |
| **CUDA** | NVIDIA 的通用 GPU 编程框架 |

**为什么先学这个？** GPU 后，学习[[curves-surfaces|曲线与曲面（Bézier, B-Spline）]]。
