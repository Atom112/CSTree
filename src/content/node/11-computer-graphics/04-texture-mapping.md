---
id: texture-mapping
title: 纹理映射与滤波
summary: 纹理映射把 2D 图像贴到 3D 模型表面——用 UV 坐标关联模型和纹理。Mipmap 是多级纹理，解决远处纹理闪烁问题
difficulty: advanced
order: 4
parent: graphics-pipeline
children:
  - ray-tracing
related: []
prerequisites:
  - graphics-pipeline
tags:
  - graphics
  - texture
  - mipmap
createdAt: 2026-06-12
---

## UV 坐标

```
每个顶点有 UV 坐标（0-1）：
(0,0)───(1,0)         纹理图像
  │       │
  │       │            模型顶点指定 UV，
(0,1)───(1,1)          光栅化时插值出每个像素的 UV
```

## Mipmap

```
原始纹理 (256²) → 1/2 (128²) → 1/4 (64²) → ... → 1×1
                              ↑
                   预先生成的多级纹理

远处物体采样小 Mipmap 级别——减少闪烁，提升性能
```

## 小结

| 技术 | 解决 | 方法 |
|:----:|:----:|:----:|
| **UV 映射** | 如何贴纹理 | 顶点 UV+插值 |
| **Mipmap** | 远处闪烁 | 多级纹理 |
| **各向异性滤波** | 倾斜面模糊 | 非方形采样区域 |

**为什么先学这个？** 纹理后，学习[[lighting-shading|光照与着色模型]]。
