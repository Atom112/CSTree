---
id: 2d-3d-transforms
title: 2D/3D 变换与齐次坐标
summary: 齐次坐标用 n+1 维向量表示 n 维点——让平移、旋转、缩放都可用矩阵乘法表示。3D 图形中的 MVP 变换（模型-视图-投影）就是矩阵连乘
difficulty: intermediate
order: 1
parent:
children:
  - graphics-pipeline
related: []
prerequisites: []
tags:
  - graphics
  - transform
  - math
createdAt: 2026-06-12
---

## 齐次坐标

2D 点 (x, y) → 齐次坐标 (x, y, 1)

```
平移矩阵：        缩放矩阵：
[1 0 tx]         [sx 0  0]
[0 1 ty]         [0  sy 0]
[0 0 1 ]         [0  0  1]

旋转矩阵（绕 Z 轴）：
[cosθ -sinθ 0]
[sinθ  cosθ 0]
[0     0    1]
```

## MVP 变换

```
模型矩阵（Model）→ 世界坐标
视图矩阵（View）→ 相机坐标
投影矩阵（Projection）→ 裁剪坐标
```

**为什么先学这个？** 变换是图形学的数学基础。学习[[graphics-pipeline|光栅化管线]]。
