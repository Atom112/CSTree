---
id: shadow-ao
title: 阴影与环境光遮蔽
summary: 阴影映射（Shadow Mapping）从光源视角渲染深度图判断像素是否在阴影中。环境光遮蔽（SSAO）近似模拟环境光被几何遮挡的效果
difficulty: advanced
order: 6
parent: lighting-shading
children:
  - ray-tracing
related: []
prerequisites:
  - lighting-shading
tags:
  - graphics
  - shadow
  - ao
createdAt: 2026-06-12
---

## Shadow Mapping

```
Pass 1：从光源渲染场景 → 存深度图
Pass 2：从相机渲染场景 → 对每个像素，
         计算它在光源空间的深度 → 对比深度图
         深度更大 → 在阴影中
```

## SSAO

屏幕空间环境光遮蔽——对每个像素，采样其周围像素的深度：

```
像素 P 在屏幕上
→ 采样 P 周围 N 个像素的深度
→ 周围深度 > P 的深度越多 → 遮蔽越强（越暗）
```

## 小结

| 技术 | 实现 | 优点 |
|:----:|:----:|:----:|
| **Shadow Map** | 光源视角深度图 | 通用阴影 |
| **SSAO** | 屏幕空间深度采样 | 性能好 |
| **PCF** | 多次采样软阴影 | 边缘柔和 |

**为什么先学这个？** 光栅化技术后，进入[[ray-tracing|光线追踪基础]]。
