---
id: curves-surfaces
title: 曲线与曲面（Bézier, B-Spline）
summary: Bézier 曲线用控制点定义平滑曲线——每个控制点"拉"曲线向自己。B-Spline 和 NURBS 是更通用的曲线曲面表示，广泛用于 CAD 和建模
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
updatedAt: 2026-06-13
---

## ✏️ 在计算机里"画一条平滑曲线"

你在纸上画一条流畅的曲线——手一滑就过去了。但在计算机中，你需要**精确的数字定义**：这条线经过哪些点？形状怎么控制？

最简单的办法：
- 给一堆点，用直线连起来 → 折线，不平滑
- 给一堆点，用一个数学公式生成平滑路径 → **曲线**

**Bézier 曲线**是计算机图形学中最常用的曲线定义方式——Photoshop 的钢笔工具、字体（TrueType/PostScript）都基于它。

> 📐 **"控制点"的思想**：你不直接修改曲线上的每个点——你拖动几个"控制点"，曲线自动变平滑。
> 
> 就像用磁铁控制一根铁链——你移动磁铁（控制点），铁链（曲线）平滑地跟着移动。

---

## 🎯 Bézier 曲线——用控制点"拉"曲线

### 定义

一条三次 Bézier 曲线由 **4 个控制点**定义：

```
P0──────P1
  \    /
   \  /
    P3──────P2

曲线从 P0 开始，到 P3 结束
P1 和 P2 决定曲线的"走向"——不经过曲线本身
```

### De Casteljau 算法——直观的画法

```
给定 4 个控制点 P0, P1, P2, P3，在 t=0.5 处的点：

1. 在 P0-P1、P1-P2、P2-P3 上取中点（t=0.5）
2. 得到 3 个点，再取相邻中点
3. 得到 2 个点，再取中点 → 这就是曲线在 t=0.5 处的点

t 从 0 到 1 变化 → 得到整条曲线
```

```python
def bezier_point(points, t):
    """De Casteljau 算法求 Bézier 曲线上 t 处的点"""
    while len(points) > 1:
        new_points = []
        for i in range(len(points) - 1):
            x = (1-t) * points[i][0] + t * points[i+1][0]
            y = (1-t) * points[i][1] + t * points[i+1][1]
            new_points.append((x, y))
        points = new_points
    return points[0]
```

---

## 🔗 B-Spline 和 NURBS——更通用的曲线

### Bézier 的局限

| 局限 | 说明 |
|:----:|------|
| 控制点越多，曲线越复杂 | 20 个控制点的 Bézier 曲线计算量指数级增长 |
| 移动一个控制点影响整条曲线 | 局部修改困难 |
| 不能表示精确的圆 | 只能近似 |

### B-Spline 改进

B-Spline 把曲线分成**多段**，每段由多个控制点控制——移动一个控制点**只影响局部**。

### NURBS——工业标准

**NURBS（Non-Uniform Rational B-Spline，非均匀有理 B 样条）** 是 B-Spline 的推广：

```
NURBS = B-Spline + 权重

权重让每个控制点的"拉力"可调——可以精确表示圆锥曲线（圆、椭圆）

应用：CAD（SolidWorks、AutoCAD）、汽车设计、动画建模
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **Bézier 曲线** | 控制点定义平滑曲线——"磁铁拉铁链" |
| **De Casteljau** | 递归取中点求 Bézier 曲线上任意点 |
| **B-Spline** | 分段控制——移动一个点只影响局部 |
| **NURBS** | 工业标准曲线曲面——CAD、汽车设计 |

**为什么先学这个？** 曲线曲面是建模基础。看看怎么让静止的模型动起来——[[animation|计算机动画]]。
