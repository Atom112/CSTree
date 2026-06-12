---
id: generative-models
title: 生成模型（GAN, VAE, 扩散模型）
summary: 生成模型学习数据分布并生成新样本——GAN 用生成器和判别器对抗训练，VAE 用编码器-解码器学习隐空间，扩散模型逐步去噪生成图像
difficulty: advanced
order: 14
parent: transformer
children: []
related: []
prerequisites:
  - neural-network
tags:
  - dl
  - generative
  - gan
  - diffusion
createdAt: 2026-06-12
---

## GAN

```
生成器 G：从随机噪声生成假图像
判别器 D：区分真假图像

对抗训练：G 想骗过 D，D 想识破 G → 双方共同进步
```

## 扩散模型（Stable Diffusion）

```
前向：逐步加噪声 → 图像变成纯噪声
反向：学习去噪 → 从纯噪声生成图像
```

## 小结

| 模型 | 原理 | 代表 |
|:----:|:----:|:----:|
| **GAN** | 对抗训练 | StyleGAN |
| **VAE** | 变分推断 | VQ-VAE |
| **扩散** | 去噪 | Stable Diffusion, DALL·E |

**为什么先学这个？** 生成模型后，学习[[reinforcement-learning|强化学习]]。
