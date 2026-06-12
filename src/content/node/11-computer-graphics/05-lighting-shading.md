---
id: lighting-shading
title: 光照与着色模型
summary: 着色（Shading）计算每个像素的最终颜色——Phong 模型分解为环境光+漫反射+高光，Blinn-Phong 是更高效的变体。BRDF 描述材质对光的反射特性
difficulty: advanced
order: 5
parent: graphics-pipeline
children:
  - shadow-ao
related: []
prerequisites:
  - graphics-pipeline
tags:
  - graphics
  - lighting
  - shading
createdAt: 2026-06-12
---

## Phong 光照模型

```
最终颜色 = 环境 + 漫反射 + 高光

环境：Ka * Ia
漫反射：Kd * I * max(0, n·l)     （兰伯特余弦定律）
高光：Ks * I * max(0, r·v)^p
```

## 着色频率

```
Flat shading：         每三角形一个颜色（低多边形风）
Gouraud shading：     每顶点计算颜色，插值到像素
Phong shading：       每像素插值法线，计算光照（最精细）
```

## 小结

| 模型 | 原理 |
|:----:|------|
| **Phong** | 环境+漫反射+高光 |
| **Blinn-Phong** | 半程向量代替反射向量 |
| **BRDF** | 材质反射属性的数学描述 |

**为什么先学这个？** 光照后，学习[[shadow-ao|阴影与环境光遮蔽]]。
