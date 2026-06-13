---
id: ray-tracing
title: 光线追踪基础
summary: 光线追踪（Ray Tracing）模拟光线的传播路径——从相机发射光线，弹射到场景中，计算光照贡献。相比光栅化，它能更真实地处理反射、折射和全局光照
difficulty: advanced
order: 7
parent: shadow-ao
children:
  - acceleration-structures
related: []
prerequisites:
  - lighting-shading
tags:
  - graphics
  - ray-tracing
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🔦 逆向思考——不是"光从光源出发"，而是"光线从相机出发"

现实中，光线从光源发出，在物体之间反射，最终进入人眼。模拟这个过程——但 99.9% 的光线永远到不了人眼，计算浪费了。

**光线追踪（Ray Tracing）** 反过来：从相机（人眼）通过每个像素发射光线——只在需要时追踪。

```
传统光栅化：          光线追踪：
"这个三角形在哪个像素"  "这个像素看到的是什么"
逐个三角形处理         逐个像素追踪光线
```

---

## 🎯 Whitted 风格光线追踪

对屏幕上的**每个像素**：

```
1. 从相机经过像素发射一条光线
2. 光线和场景中所有物体求交 → 找到最近的交点
3. 在交点计算直接光照（光源→交点→相机）
4. 如果交点是光滑表面 → 递归发射反射光线
5. 如果交点是透明物体 → 递归发射折射光线
6. 累加所有光照贡献 → 像素颜色
```

```python
def trace(ray, scene, depth=0):
    if depth > max_depth:
        return black
    
    hit = scene.intersect(ray)
    if not hit:
        return background_color
    
    # 直接光照
    color = direct_light(hit.point, hit.normal, scene)
    
    # 反射
    reflect_ray = reflect(ray.direction, hit.normal)
    color += 0.5 * trace(reflect_ray, scene, depth+1)
    
    # 折射（如果是透明物体）
    if hit.material.transparent:
        refract_ray = refract(ray.direction, hit.normal)
        color += 0.5 * trace(refract_ray, scene, depth+1)
    
    return color
```

**为什么光线追踪比光栅化更真实？**

```
光栅化：直接光照 + 静态阴影
光线追踪：反射 + 折射 + 间接光照 + 软阴影 + ...

一个镜面球体反射出周围环境——光栅化很难做到，光线追踪自然支持。
```

---

## 📐 光线与物体求交

最简单的形状——球体：

```
P(t) = O + t·D    — 光线的参数方程（O=起点，D=方向）

球体：|P - C|² = r²    — 所有到球心距离为 r 的点

代入求解 t：二次方程 at² + bt + c = 0
解 → t > 0 的最小值 → 最近的交点
```

```python
def ray_intersect_sphere(ray_origin, ray_dir, sphere):
    oc = ray_origin - sphere.center
    a = dot(ray_dir, ray_dir)
    b = 2 * dot(oc, ray_dir)
    c = dot(oc, oc) - sphere.radius ** 2
    discriminant = b*b - 4*a*c
    if discriminant < 0:
        return None  # 不相交
    t = (-b - sqrt(discriminant)) / (2*a)
    return t if t > 0 else None
```

复杂形状（三角形网格）的求交需要加速结构——下一节讲。

---

## 🌍 路径追踪——渲染方程的求解

Whitted 风格只追踪反射/折射——但现实世界的光线更复杂：
- 磨砂表面：光线向**所有方向**反射
- 间接光照：光照到红色墙壁 → 墙壁反射红光 → 照亮附近白色物体 → 白色物体带了红色

**路径追踪（Path Tracing）** 用蒙特卡洛方法——每条光线在交点随机选择一个方向继续追踪，大量光线取平均：

```
每个像素发射 N 条光线：
  每条光线在每次弹射时随机选择方向
  最终累加所有弹射的贡献


取平均 → 近似真实光照

N 越大 → 噪声越少 → 结果越真实（但需要更多计算）
这就是为什么电影渲染一帧要几小时——而游戏追求实时必须用光栅化
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **光线追踪** | 从相机发射光线模拟光路——反射/折射/间接光照 |
| **Whitted 风格** | 递归追踪反射和折射光线 |
| **路径追踪** | 随机方向追踪——蒙特卡洛方法求解渲染方程 |
| **vs 光栅化** | 光线追踪更真实，光栅化更快（实时）|

**为什么先学这个？** 光线追踪需要大量求交计算——需要[[acceleration-structures|加速结构（BVH, KD-Tree）]]。
