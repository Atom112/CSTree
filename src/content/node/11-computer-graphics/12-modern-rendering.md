---
id: modern-rendering
title: 现代渲染技术（PBR, 实时全局光照）
summary: PBR（基于物理的渲染）用微表面模型和能量守恒的 BRDF 模拟真实材质。实时全局光照（如屏幕空间 GI、光照贴图）让游戏中也有间接光照效果
difficulty: advanced
order: 12
parent: animation
children: []
related: []
prerequisites:
  - lighting-shading
tags:
  - graphics
  - pbr
  - rendering
createdAt: 2026-06-12
---

## PBR

| 传统 | PBR |
|:----:|:----:|
| 手工调色 | 物理参数（粗糙度、金属度） |
| 经验模型 | 微表面 BRDF（Cook-Torrance） |
| 不保证能量守恒 | 能量守恒 |

## 实时全局光照

```
- 光照贴图：预计算静态场景的间接光照
- 屏幕空间 GI（SSGI）：从屏幕像素反推间接光
- 反射探针：预捕捉环境反射
- 光线追踪（RTX）：NVIDIA 实时光追
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **PBR** | 物理参数驱动的材质系统 |
| **IBL** | 基于图像的光照（环境贴图） |
| **实时 GI** | 预计算+屏幕空间+光线追踪 |

**为什么先学这个？** 图形学板块完。进入[[ai-overview|机器学习/人工智能]]板块。
