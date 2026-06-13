---
id: cnn
title: 卷积神经网络（CNN）
summary: CNN 用卷积核扫描图像——检测边缘、纹理、形状等特征。池化层压缩尺寸，多层堆叠从简单特征组合成复杂语义。LeNet、ResNet 是经典架构
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
  - vision
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 👁️ 看一张图片——眼睛不是"一次性看完"的

你看一张照片——不会逐个像素扫。你的眼睛先注意到轮廓（边缘），然后是纹理（毛发、皮肤），再然后才是整体形状（猫、狗）。

CNN（Convolutional Neural Network）模拟这个过程——从简单特征到复杂语义，逐层组合。

> 📐 **MLP 处理图像的缺陷**：一张 256×256 的彩色图片有 256×256×3 ≈ 20 万输入——全连接层要 20 万个权重，太多。而且 MLP 不考虑空间结构（像素的临近关系）。

---

## 🔧 CNN 的三个关键操作

### ① 卷积——扫描局部区域

用一个小的"卷积核"（3×3 或 5×5）扫描整个图像：

```
输入图像（5×5）：             卷积核（3×3）：
[1 1 0 0 1]                  [1 0 1]
[0 1 1 0 0]                  [0 1 0]
[1 0 1 1 1]                  [1 0 1]
[1 1 1 0 0]
[0 0 1 1 1]

卷积核扫描到 (0,0) 位置：1×1 + 1×0 + 0×1 + 0×0 + 1×1 + 1×0 + 1×1 + 0×0 + 1×1 = ?
```

每个卷积核学**一个特征**——比如一个核学会检测水平边缘，另一个学垂直边缘，另一个学纹理……

```python
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, 3)  # 输入1通道→32个卷积核
        self.pool = nn.MaxPool2d(2, 2)     # 池化：尺寸减半
        self.conv2 = nn.Conv2d(32, 64, 3) # 64个卷积核
        self.fc = nn.Linear(64 * 6 * 6, 10)
    
    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))  # conv → relu → pool
        x = self.pool(torch.relu(self.conv2(x)))
        x = x.view(-1, 64 * 6 * 6)  # 展平
        return self.fc(x)
```

### ② 池化——缩小尺寸

保留主要信息、减少计算量、防止过拟合：
```
最大池化（Max Pooling）：取 2×2 区域中的最大值
平均池化（Average Pooling）：取 2×2 区域的平均值
```

### ③ 全连接——组合高层特征

经过多层卷积+池化后，最后接几层全连接层做分类。

---

## 🏛️ 经典 CNN 架构

| 架构 | 年代 | 关键创新 | 意义 |
|:----:|:----:|:---------|:----:|
| **LeNet-5** | 1998 | 第一个 CNN | 手写数字识别（银行支票）|
| **AlexNet** | 2012 | 深度 CNN + GPU | ImageNet 竞赛冠军 → 深度学习时代开启 |
| **VGGNet** | 2014 | 小卷积核堆叠 | 规则简单：全用 3×3 |
| **ResNet** | 2015 | 残差连接（Skip Connection） | 可以训练 100+ 层的网络 |

```python
# ResNet 的残差块——让训练更深的网络成为可能
class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1)
    
    def forward(self, x):
        residual = x  # 保存输入
        out = torch.relu(self.conv1(x))
        out = self.conv2(out)
        out += residual  # 加上原始输入（残差连接）
        return torch.relu(out)
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **卷积** | 小核扫描图像——检测局部特征（边缘、纹理）|
| **池化** | 缩小尺寸——减少计算量 |
| **卷积核** | 每个核学一个特征模式——多个核组合 |
| **ResNet 残差连接** | 输入跨层相加——让训练更深网络成为可能 |

**为什么先学这个？** CNN 处理**空间**结构。另一种结构适合**序列**数据——[[rnn|循环神经网络（RNN / LSTM）]]。
