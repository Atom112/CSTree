---
id: computer-vision
title: 计算机视觉
summary: 计算机视觉让计算机"看懂"图像和视频——图像分类、目标检测（YOLO）、语义分割是三大基本任务。视觉 Transformer（ViT）正在取代 CNN
difficulty: advanced
order: 17
parent: nlp
children:
  - mlops
related: []
prerequisites:
  - cnn
  - transformer
tags:
  - dl
  - cv
  - detection
createdAt: 2026-06-12
---

## 三大任务

```
分类：这是什么？      一只猫
检测：东西在哪？      框出猫的位置 [x,y,w,h]
分割：哪些像素是猫？  每个像素标类别
```

## YOLO——实时目标检测

```
将图像分成 S×S 网格
每个网格预测 B 个边界框和类别概率
一次前向传播完成检测——极快！
YOLOv8 达到 100+ FPS
```

## 小结

| 任务 | 输出 | 典型模型 |
|:----:|:----:|:--------:|
| **分类** | 类别标签 | ResNet, ViT |
| **检测** | 边界框 | YOLO, Faster R-CNN |
| **分割** | 像素掩码 | U-Net, Mask R-CNN |

**为什么先学这个？** CV 后，学习[[mlops|MLOps 与模型部署]]。
