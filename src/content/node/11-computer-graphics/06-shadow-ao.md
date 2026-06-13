---
id: shadow-ao
title: 阴影与环境光遮蔽
summary: 阴影（Shadow Mapping）判断点是否被光源照到——从光源视角渲染深度图再比对。环境光遮蔽（SSAO）模拟角落因多次遮挡而变暗的效果
difficulty: advanced
order: 6
parent: graphics-pipeline
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
updatedAt: 2026-06-13
---

## 🌓 影子——让场景"落地"

一个 3D 场景——没有阴影时，物体像"悬浮"在空中。有了阴影，你才知道"桌子在地面上、球在桌子上"。

但光栅化管线中，每个像素只知道自己——不知道"有没有其他物体挡住了从光源到我的路径"。

**阴影映射（Shadow Mapping）** 解决这个问题。

---

## 🗺️ Shadow Mapping——从光源的视角看世界

两趟渲染：

```
第 1 趟：从光源位置渲染场景——只记录深度（深度图）
第 2 趟：从相机位置正常渲染——每个像素判断"是否在阴影中"
```

```
光源                    ← 从光源位置看
   │      物体 A         阴影贴图（深度图）：
   │      ┌──┐          ┌──────────┐
   │      │  │          │ 物体A的深度:0.5│
   │      └──┘          │ 物体B的深度:0.8│
   │         ┌──┐       └──────────┘
   │         │B │
   │         └──┘
   地面 ──────────

第 2 趟判断像素 P（地面上）：
1. 从光源到 P 的深度 = 1.0
2. 查阴影贴图——这个方向上最近物体深度 = 0.5（物体 A）
3. 1.0 > 0.5 → P 被挡住了 → 像素在阴影中 → 变暗
```

```glsl
// 判断阴影
float shadow = 0.0;
vec3 lightDir = normalize(lightPos - fragPos);
float currentDepth = texture(shadowMap, projCoords).r;
float bias = 0.005;
if (currentDepth + bias < projCoords.z) {
    shadow = 0.3;  // 在阴影中 → 降低亮度
}
FragColor = (ambient + (1.0 - shadow) * (diffuse + specular)) * color;
```

**阴影贴图的问题**：分辨率有限导致锯齿边缘。用 Percentage-Closer Filtering (PCF) 在阴影边缘多次采样并平均——柔化阴影。

---

## 🏠 环境光遮蔽——角落为什么更暗？

现实世界中，两个墙角的交汇处比开放区域更暗——因为墙角接收到的环境光反射更少。

**环境光遮蔽（Ambient Occlusion, AO）** 模拟这种"角落变暗"的效果——但实时渲染不可能追所有光线。

### SSAO——屏幕空间近似

```python
# SSAO 思路：
# 对每个像素，在法线方向半球的周围随机采样深度
# 如果周围采样点中有很多被遮挡（在几何体内部）
# → 环境光遮蔽强 → 变暗

# 看起来像"把咖啡洒在白纸上，纸变脏了"的感觉
# 但边缘和角落的"脏"恰恰产生了立体感
```

SSAO 在屏幕空间（已经光栅化后的 2D 图像上）做——所以是实时渲染中最常用的 AO 方案。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **Shadow Mapping** | 从光源渲染深度图——判断像素是否被遮挡 |
| **PCF** | 多次采样柔化阴影边缘 |
| **环境光遮蔽（AO）** | 角落因遮挡而变暗——增强立体感 |
| **SSAO** | 屏幕空间的 AO 近似——实时渲染常用 |

**为什么先学这个？** 光栅化能处理的阴影和间接光照有限。要更真实的效果，需要[[ray-tracing|光线追踪基础]]。
