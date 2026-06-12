---
id: graphics-pipeline
title: 光栅化管线
summary: 图形管线（Graphics Pipeline）把 3D 模型变成屏幕上的像素——顶点处理→光栅化→片元处理→输出合并。GPU 就是专门加速这条管线的硬件
difficulty: advanced
order: 2
parent: 2d-3d-transforms
children:
  - rasterization-depth
  - texture-mapping
  - lighting-shading
  - shadow-ao
related: []
prerequisites:
  - 2d-3d-transforms
tags:
  - graphics
  - pipeline
  - gpu
createdAt: 2026-06-12
---

## 管线阶段

```
顶点数据 → 顶点着色器 → 光栅化 → 片元着色器 → 帧缓冲
  ↓           ↓            ↓          ↓          ↓
  3D坐标    MVP变换    生成像素    计算颜色    输出到屏幕
```

## 可编程管线

现代 GPU 的管线是可编程的——开发者编写着色器（Shader）：

```glsl
// 顶点着色器 (GLSL)
#version 330 core
layout (location = 0) in vec3 aPos;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
void main() {
    gl_Position = projection * view * model * vec4(aPos, 1.0);
}

// 片元着色器
#version 330 core
out vec4 FragColor;
void main() {
    FragColor = vec4(1.0, 0.5, 0.2, 1.0);  // 橙色
}
```

## 小结

| 阶段 | 输入→输出 | 可编程？ |
|:----:|:---------:|:--------:|
| 顶点着色器 | 3D 顶点→裁剪坐标 | ✅ |
| 光栅化 | 三角形→片元 | ❌ 固定 |
| 片元着色器 | 片元→颜色 | ✅ |
| 测试与混合 | 深度/模板测试 | 部分可配 |

**为什么先学这个？** 了解管线后，深入[[rasterization-depth|三角形光栅化与深度缓冲]]。
