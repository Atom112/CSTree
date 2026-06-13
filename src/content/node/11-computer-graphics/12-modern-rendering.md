---
id: modern-rendering
title: 现代渲染技术（PBR, 实时全局光照）
summary: PBR（基于物理的渲染）用物理参数（粗糙度、金属度）代替"调参数"——让材质在不同光照下始终真实。实时全局光照（RTX、Lumen）让间接光照和反射在游戏中成为可能
difficulty: advanced
order: 12
parent: animation
children: []
related: []
prerequisites:
  - animation
tags:
  - graphics
  - pbr
  - rendering
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## ✨ 游戏画面是怎么从"塑料感"变成"电影感"的？

对比 2010 年和 2024 年的 3A 游戏画面：

```
2010 年：材质看起来像塑料——"调参数"调出来的
2024 年：材质看起来和真的没区别——基于物理的材质
```

这个进步的根源：**PBR（Physically Based Rendering，基于物理的渲染）** 和**实时全局光照**。

---

## 🔬 PBR——基于物理的材质

### 传统方式 vs PBR

```
传统方式：凭感觉调颜色、调高光
  问题：换个光照环境，材质看起来就不对了
  一个问题："这个金属感是用什么参数调出来的？"没人知道

PBR：用物理参数描述材质
  好处：在任何光照下材质都真实
  一个问题："这个金属度的值是多少？"0.8 → 有标准
```

### PBR 的核心参数

```
PBR = BaseColor + Metallic + Roughness + Normal + AO

BaseColor（基础色）：材质的底色
Metallic（金属度）：0 = 非金属（木头/塑料），1 = 金属（铁/金）
Roughness（粗糙度）：0 = 抛光表面（镜面），1 = 粗糙表面（砂纸）
Normal（法线贴图）：模拟表面凹凸细节
AO（环境光遮蔽）：角落变暗

例子：
锈蚀的铁：BaseColor=红褐, Metallic=0.8, Roughness=0.9
抛光银器：BaseColor=银白, Metallic=1.0, Roughness=0.05
塑料椅子：BaseColor=蓝色, Metallic=0.0, Roughness=0.5
```

```glsl
// PBR 片元着色器的核心
uniform float metallic;
uniform float roughness;
uniform sampler2D albedoMap;

void main() {
    vec3 albedo = pow(texture(albedoMap, uv).rgb, 2.2);  // Gamma 校正
    
    float ao = texture(aoMap, uv).r;
    vec3 N = normalize(texture(normalMap, uv).xyz);
    
    vec3 color = calculatePBR(albedo, metallic, roughness, ao, N, ...);
    FragColor = vec4(color, 1.0);
}
```

---

## 🌍 实时全局光照——光栅化的"圣杯"

传统光栅化只能处理直接光照（光源直接照到的部分）。但现实中：
- 墙壁反射红光 → 旁边白墙变成粉红色（间接光照）
- 窗户透进来的阳光在地板上产生彩色光斑（焦散）

**实时全局光照**让这些效果在游戏中以实时帧率运行：

| 技术 | 实现 | 适用 |
|:----:|:----:|:----:|
| **RTX（硬件光线追踪）** | NVIDIA GPU 的 RT Core 加速射线求交 | 高端显卡 |
| **Lumen（Unreal Engine 5）** | 软件光线追踪 + 硬件加速 | 跨平台 |
| **IBL（基于图像的照明）** | 用环境贴图近似间接光照 | 移动端 |

```
Lumen 是 Epic Games 在 Unreal Engine 5 中的实时全局光照方案：
- 不依赖专用的 RT 硬件
- 通过软件追踪 + 场景距离场计算间接光照
- 动态场景中实时更新反射和间接光
```

---

## ⚡ 渲染技术的未来趋势

```
                 2024                2030（预测）
─────────────  ─────────────        ─────────────
分辨率：        2K-4K               8K-16K
帧率：          30-60fps            60-240fps
光照：          混合光栅化+光线追踪  全光线追踪
AI 辅助：      DLSS/FSR 超分辨率    神经渲染（全 AI 生成）
硬件：         专用 RT 核心         光线追踪全覆盖
```

> 💡 **DLSS（Deep Learning Super Sampling）**：用 AI 把低分辨率渲染的图像"脑补"成高分辨率——让 GPU 在更低的内部分辨率运行，然后用 AI 提升画质。是"用 AI 换性能"的典型例子。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **PBR** | 用物理参数（金属度、粗糙度）代替调参——材质更真实 |
| **Metallic + Roughness** | PBR 的两个核心参数——定义所有材质 |
| **实时全局光照** | RTX/Lumen——间接光照和反射在游戏中实时计算 |
| **DLSS** | AI 超分——低分辨率渲染，AI 放大到高分辨率 |
| **未来** | 全光线追踪 + AI 神经渲染 |

> 🎯 **思考题**：PBR 的"金属度=1"意味着什么？如果是纯铁（金属度=1），它的 BaseColor 是灰色——但金色也是金属度=1。金属度相同时，金色和银色的区别是什么参数控制的？

**为什么先学这个？** 计算机图形学板块到此全部完成！这是关于"怎么把 3D 世界变成 2D 图像"的故事——从数学变换开始，到光栅化、光照、光线追踪、直到现代实时渲染。接下来可以进入机器学习板块继续学习。
