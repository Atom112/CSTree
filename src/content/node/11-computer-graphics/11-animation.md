---
id: animation
title: 计算机动画
summary: 计算机动画让 3D 模型"动"起来——关键帧动画插值姿态，骨骼动画驱动角色变形，蒙皮把骨骼运动和网格绑定。物理模拟让运动更真实
difficulty: advanced
order: 11
parent: curves-surfaces
children:
  - modern-rendering
related: []
prerequisites:
  - curves-surfaces
tags:
  - graphics
  - animation
  - skeleton
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🏃 "三张图片循环"——和"动画"的本质是一样的

动画的原理很简单：**快速展示一系列静态画面**，利用人眼的视觉暂留产生"动"的感觉。

但在 3D 计算机动画中，问题变成了：**怎么让 3D 角色的手臂平滑地从 A 位置移到 B 位置？**

---

## 🎯 关键帧动画（Keyframe Animation）

**原理**：只定义关键姿态（关键帧），计算机自动生成中间帧（插值）。

```
关键帧 1（t=0）：      关键帧 2（t=1）：
手在肩膀位置          手举过头顶

计算机自动插值：
t=0.0: 手在肩膀        ← 关键帧 1
t=0.2: 手抬到下巴
t=0.5: 手到头顶         ← 计算机算的中间帧
t=0.7: 手在头顶上方
t=1.0: 手举过头顶      ← 关键帧 2
```

```python
def lerp(a, b, t):
    """线性插值"""
    return a + (b - a) * t

# 位置插值
position = lerp(start_pos, end_pos, t)
# 旋转插值（用四元数）
rotation = slerp(start_rot, end_rot, t)
```

**插值类型**：
- **线性插值**：匀速运动——机械感
- **缓入缓出**：动画曲线（ease-in, ease-out）——更自然

---

## 🦴 骨骼动画（Skeletal Animation）

关键帧动画直接"动模型"太麻烦——角色有上万个顶点。更高效的方式：**只控制"骨骼"，计算机自动算网格变形**。

```
骨骼（Skeleton）：
      头部
        │
肩膀───脊椎───肩膀
 │      │      │
手臂    腰    手臂
 │             │
手掌←───→手掌

蒙皮（Skinning）：
每个顶点绑定到 1-4 根骨骼的加权组合

移动骨骼 → 蒙皮变形 → 角色动起来

好处：移动一根"前臂骨骼"→ 整只手的所有顶点自动跟随
```

```glsl
// 顶点着色器中的蒙皮计算
uniform mat4 boneMatrices[100];  // 所有骨骼的变换矩阵

void main() {
    vec4 skinnedPos = vec4(0.0);
    for (int i = 0; i < 4; i++) {
        int boneIdx = int(boneIndices[i]);
        float weight = boneWeights[i];
        skinnedPos += weight * boneMatrices[boneIdx] * vec4(aPos, 1.0);
    }
    gl_Position = projection * view * model * skinnedPos;
}
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **关键帧动画** | 定义关键姿态，插值中间帧 |
| **插值** | 线性（匀速）、缓入缓出（自然）|
| **骨骼动画** | 控制骨骼 → 蒙皮自动变形网格 |
| **蒙皮** | 顶点绑定到骨骼 — 每顶点最多 4 根骨骼加权 |
| **四元数（Quaternion）** | 旋转的平滑插值——避免万向锁 |

**为什么先学这个？** 动画是图形学的应用方向。最后看看[[modern-rendering|现代渲染技术（PBR, 实时全局光照）]]。
