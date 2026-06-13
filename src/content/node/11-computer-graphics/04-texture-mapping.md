---
id: texture-mapping
title: 纹理映射与滤波
summary: 纹理映射（Texture Mapping）把 2D 图像"贴"到 3D 模型表面——让模型有颜色和细节而不需要增加三角形。Mipmap 和滤波解决缩放时的锯齿和模糊问题
difficulty: advanced
order: 4
parent: graphics-pipeline
children: []
related: []
prerequisites:
  - graphics-pipeline
tags:
  - graphics
  - texture
  - filtering
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🖼️ 给 3D 模型"贴"上图案

一个 3D 立方体——六个面都是灰色的。怎么让它看起来像一盒真实的巧克力？不加几何细节（每个凹痕都加三角形）——太浪费了。

**纹理映射（Texture Mapping）**：把一张 2D 图像"贴"到 3D 模型表面——用 2D 图像决定 3D 表面的颜色。

---

## 🗺️ UV 坐标——"贴"在哪

每个 3D 顶点有一个 UV 坐标——告诉纹理图像的哪个位置对应这个顶点：

```
纹理图像：
┌─────┬─────┐
│(0,1)│(1,1)│
├─────┼─────┤
│(0,0)│(1,0)│
└─────┴─────┘

3D 三角形：
顶点 A → UV(0,0)   纹理左下角
顶点 B → UV(1,0)   纹理右下角
顶点 C → UV(0.5,1) 纹理上边中间

→ 三角形内部的像素：根据重心坐标插值 UV → 从纹理取颜色
```

```glsl
uniform sampler2D texture1;
in vec2 texCoord;

void main() {
    vec4 color = texture(texture1, texCoord);
    FragColor = color;
}
```

---

## 🔍 纹理缩放问题——近了模糊，远了锯齿

像素和纹理尺寸不匹配时出问题：

```
近处：像素覆盖小纹理区域 → 纹理被放大 → 模糊
远处：像素覆盖大纹理区域 → 纹理被缩小 → 锯齿闪烁
```

**Mipmap**：预先生成一系列逐渐缩小的纹理版本。

```
512×512 → 256×256 → 128×128 → 64×64 → … → 1×1

硬件自动选择合适的级别：
远处像素用小 Mipmap（防止锯齿）
近处像素用大 Mipmap（保留细节）

Mipmap 额外空间 ≈ 原始纹理的 33%
```

**双线性插值**：采样时取周围 4 个纹理像素加权平均——防止边缘块状感。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **纹理映射** | 2D 图像贴到 3D 表面 |
| **UV 坐标** | 顶点和纹理的对应关系 |
| **Mipmap** | 多级缩小纹理——防远处锯齿 |
| **双线性插值** | 4 像素加权平均——防放大模糊 |

**为什么先学这个？** 纹理决定表面颜色——有了颜色才能算光照。[[lighting-shading|光照与着色模型]]。
