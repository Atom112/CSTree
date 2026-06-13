---
id: acceleration-structures
title: 加速结构（BVH, KD-Tree）
summary: 加速结构让光线追踪不用逐一检查每个物体——BVH 用包围盒分层组织，KD-Tree 用空间划分。两者把求交计算从 O(n) 降到 O(log n)
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
updatedAt: 2026-06-13
---

## 💡 光线追踪为什么慢？——因为要"问所有物体"

一个场景有 100 万个三角形。光线追踪对每条光线都要找最近的交点——最直接的做法是：**光线和每个三角形求交一次**。

100 万次求交 × 每条光线 × 数百万条光线 = 天文数字。

**加速结构**把求交从"问所有物体"变成"只问可能相交的物体"——O(n) → O(log n)。

---

## 🌳 Bounding Volume Hierarchy (BVH)——用"包围盒"分层

### 核心思想

用简单的包围盒（Axis-Aligned Bounding Box, AABB）把物体分层包装：

```
场景
├── 左半：包围盒 A
│   ├── 包围盒 A1（包含物体 1, 2, 3）
│   └── 包围盒 A2（包含物体 4, 5）
└── 右半：包围盒 B
    ├── 包围盒 B1（包含物体 6, 7）
    └── 包围盒 B2（包含物体 8, 9, 10）
```

### 求交过程

```
从根节点开始：
1. 光线和包围盒 A 求交 → 相交？→ 检查子节点
2. 光线和包围盒 A1 求交 → 相交？→ 检查三角形
   → 光线和三角形 1, 2, 3 求交
3. 光线和包围盒 A2 求交 → 不相交 → 跳过整个 A2 子树！
   → 省去了和物体 4, 5 的求交计算
4. 光线和包围盒 B 求交 → 不相交 → 跳过整个右半场景！
```

```python
def intersect(ray, node):
    if not node.bbox.intersect(ray):
        return None  # 跳过整个子树！
    
    if node.is_leaf:
        return intersect_triangles(ray, node.triangles)
    
    hit_left = intersect(ray, node.left)
    hit_right = intersect(ray, node.right)
    return closer(hit_left, hit_right)
```

### BVH 的特点

- **物体细分**：每个叶子节点包含若干个三角形
- **构建一次，多次查询**：场景加载时建好 BVH，每次求交都用
- 适合动态场景的 BVH 重建（或 refit）

---

## 🆚 BVH vs KD-Tree

| 对比 | BVH | KD-Tree |
|:----:|:---:|:-------:|
| 划分方式 | 按物体分 | 按空间分 |
| 一个物体属于 | 一个叶子 | 可能多个叶子 |
| 构建速度 | 较快 | 较慢 |
| 求交性能 | 好 | 较好 |
| 动态场景 | 更易更新 | 重建成本高 |
| 现代 GPU RTX | ✅ 使用 BVH | ❌ |

现代 GPU（NVIDIA RTX 系列）内建 BVH 处理硬件——这就是"实时光线追踪"成为可能的原因。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **BVH** | 包围盒层次结构——按物体分层组织 |
| **AABB** | 轴对齐包围盒——求交计算极快 |
| **加速原理** | 跳过不相交的子树——"99% 的物体不用检查" |
| **KD-Tree** | 按空间切分——另一个加速结构 |
| **RTX** | NVIDIA GPU 的硬件加速 BVH 求交 |

**为什么先学这个？** 加速结构是 GPU 高效工作的基础。看看[[gpu-architecture|GPU 架构与着色器编程]]——GPU 怎么执行这些计算。
