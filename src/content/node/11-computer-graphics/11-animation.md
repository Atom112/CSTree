---
id: animation
title: 计算机动画
summary: 计算机动画让物体随时间运动——关键帧插值在两个关键姿态之间平滑过渡，骨骼动画用骨架驱动顶点蒙皮。物理模拟让运动更真实
difficulty: advanced
order: 11
parent: curves-surfaces
children:
  - modern-rendering
related: []
prerequisites:
  - 2d-3d-transforms
tags:
  - graphics
  - animation
createdAt: 2026-06-12
---

## 关键帧插值

```
时间 t₀ → 姿态 A
时间 t₁ → 姿态 B

中间帧：插值 A → B（线性或样条插值）
```

## 骨骼动画

```
骨架（骨骼层次树）→ 蒙皮（顶点绑定到骨骼）→ 动画（骨骼变换）
                           ↑
                  每个顶点受多个骨骼影响（带权重）
```

## 小结

| 技术 | 原理 |
|:----:|:----:|
| **关键帧** | 插值关键姿态 |
| **骨架动画** | 骨骼变换驱动顶点 |
| **物理模拟** | 刚体/柔体模拟 |

**为什么先学这个？** 动画后，学习[[modern-rendering|现代渲染技术（PBR, 实时全局光照）]]。
