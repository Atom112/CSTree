---
id: rasterization-depth
title: 三角形光栅化与深度缓冲
summary: 光栅化把三角形转换为像素——判断哪些像素在三角形内部。Z-buffer 记录每个像素的深度值，解决遮挡顺序问题
difficulty: advanced
order: 3
parent: graphics-pipeline
children: []
related: []
prerequisites:
  - graphics-pipeline
tags:
  - graphics
  - rasterization
  - z-buffer
createdAt: 2026-06-12
---

## 光栅化

```
// 对每个三角形：
// 1. 计算三角形的包围盒
// 2. 对包围盒内每个像素
// 3. 判断是否在三角形内（重心坐标法）
// 4. 如果在，插值属性（颜色、深度、纹理坐标）
```

## Z-buffer

```
// 对每个片元：
// if (fragment.depth < depthBuffer[x][y]) {
//     depthBuffer[x][y] = fragment.depth
//     colorBuffer[x][y] = fragment.color
// }
```

> 💡 Z-buffer 是解决遮挡问题的标准方法——O(1) 复杂度，无需排序。

## 小结

| 技术 | 作用 |
|:----:|------|
| **重心坐标** | 判断点是否在三角形内+属性插值 |
| **Z-buffer** | 逐像素深度比较解决遮挡 |
| **背面剔除** | 法线朝向相机的面才渲染 |

**为什么先学这个？** 光栅化后，学习[[texture-mapping|纹理映射与滤波]]。
