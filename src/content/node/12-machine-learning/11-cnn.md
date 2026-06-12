---
id: cnn
title: 卷积神经网络（CNN）
summary: CNN 用卷积核在图像上滑动提取特征——浅层检测边缘，深层检测物体。LeNet 开创 CNN，ResNet 用残差连接训练百层网络
difficulty: advanced
order: 11
parent: neural-network
children:
  - rnn
related: []
prerequisites:
  - neural-network
tags:
  - dl
  - cnn
  - computer-vision
createdAt: 2026-06-12
---

## 卷积操作

```
输入图像 (H, W, C) ✕ 卷积核 (K, K, C) → 特征图

卷积核在图像上滑动——每个位置做点积
步长（stride）控制滑动间距
填充（padding）控制输出尺寸
```

## 经典 CNN 架构

| 网络 | 创新 | 年代 |
|:----:|:----:|:----:|
| **LeNet** | 第一个 CNN | 1998 |
| **AlexNet** | ImageNet 冠军，ReLU | 2012 |
| **VGG** | 小卷积核堆叠 | 2014 |
| **ResNet** | 残差连接，152 层 | 2015 |
| **EfficientNet** | 神经架构搜索 | 2019 |

## 小结

| 层 | 作用 |
|:---:|------|
| **卷积** | 提取局部特征 |
| **池化** | 降采样，减少参数 |
| **全连接** | 最终分类 |

**为什么先学这个？** CNN 后，学习[[rnn|循环神经网络（RNN / LSTM）]]。
