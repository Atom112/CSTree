---
id: acceleration-structures
title: 加速结构（BVH, KD-Tree）
summary: 光线追踪需要判断光线与场景中大量三角形的求交——暴力遍历 O(n) 太慢。BVH 和 KD-Tree 用空间划分把求交降低到 O(log n)
difficulty: advanced
order: 8
parent: ray-tracing
children:
  - gpu-architecture
related: []
prerequisites:
  - ray-tracing
tags:
  - graphics
  - acceleration
  - bvh
createdAt: 2026-06-12
---

## BVH（包围盒层次结构）

```
对场景构建包围盒树：

                   [Root]
                 /        \
           [Left]          [Right]
          /      \         /      \
        [A]     [B]      [C]     [D]
        / \     / \      / \     / \
       t1 t2  t3 t4    t5 t6  t7 t8
```

## 遍历

```
// 光线与 BVH 求交
function intersect(ray, node):
    if not ray.intersects(node.bbox):
        return None              // 跳过整个子树
    if node.is_leaf:
        return intersect_triangles(ray, node.triangles)
    hit_left = intersect(ray, node.left)
    hit_right = intersect(ray, node.right)
    return closer(hit_left, hit_right)
```

## 小结

| 结构 | 划分方式 | 特点 |
|:----:|:--------:|:----:|
| **BVH** | 按物体划分 | 动态场景友好 |
| **KD-Tree** | 按空间划分 | 静态场景更快 |
| **Grid** | 均匀网格 | 实现简单 |

**为什么先学这个？** 了解加速后，看看[[gpu-architecture|GPU 架构与着色器编程]]。
