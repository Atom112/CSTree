---
id: curves-surfaces
title: 曲线与曲面（Bézier, B-Spline）
summary: Bézier 曲线用控制点定义光滑曲线——B-Spline 和 NURBS 是更通用的曲线曲面表示，广泛用于 CAD 和建模
difficulty: advanced
order: 10
parent: gpu-architecture
children:
  - animation
related: []
prerequisites:
  - gpu-architecture
tags:
  - graphics
  - curves
  - bezier
createdAt: 2026-06-12
---

## Bézier 曲线

```
3 个控制点：二次 Bézier：B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
4 个控制点：三次 Bézier：B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3
```

**德卡斯特里奥算法**：递归插值求曲线上任意点。

## 小结

| 曲线 | 特点 |
|:----:|:----:|
| **Bézier** | 全局控制，改一个点影响整条曲线 |
| **B-Spline** | 局部控制，C2 连续 |
| **NURBS** | 带权重的 B-Spline，精确表示圆锥曲线 |

**为什么先学这个？** 曲线曲面后，学习[[animation|计算机动画]]。
