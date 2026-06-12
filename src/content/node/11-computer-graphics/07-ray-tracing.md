---
id: ray-tracing
title: 光线追踪基础
summary: 光线追踪（Ray Tracing）模拟光线的传播路径——从相机发射光线，弹射到场景中，计算光照贡献。相比光栅化，它能更真实地处理反射、折射和全局光照
difficulty: advanced
order: 7
parent: shadow-ao
children:
  - acceleration-structures
related: []
prerequisites:
  - lighting-shading
tags:
  - graphics
  - ray-tracing
createdAt: 2026-06-12
---

## Whitted 风格光线追踪

```
对每个像素：
  1. 从相机发射光线
  2. 光线与场景求交 → 找到最近交点
  3. 在交点计算直接光照
  4. 递归发射反射/折射光线
  5. 累加所有光照贡献
```

## 光线与物体求交

```python
# 光线与球体求交
def ray_intersect_sphere(ray_origin, ray_dir, sphere):
    oc = ray_origin - sphere.center
    a = dot(ray_dir, ray_dir)
    b = 2 * dot(oc, ray_dir)
    c = dot(oc, oc) - sphere.radius ** 2
    discriminant = b*b - 4*a*c
    if discriminant < 0: return None
    t = (-b - sqrt(discriminant)) / (2*a)
    return t if t > 0 else None
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **Whitted 风格** | 递归反射/折射 |
| **渲染方程** | 全局光照的物理模型 |
| **路径追踪** | 蒙特卡洛方法求解渲染方程 |

**为什么先学这个？** 光线追踪需要[[acceleration-structures|加速结构（BVH, KD-Tree）]]。
