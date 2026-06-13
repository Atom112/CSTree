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
updatedAt: 2026-06-13
---

## 🎨 让 AI 学会"凭空创造"

你给 AI 看 100 万张猫的照片——然后说"生成一张新猫的照片"。

AI 不是"记住"了哪一张照片，而是**学会了猫的"规律"**——有耳朵、有眼睛、毛茸茸的……然后按这个规律生成了一张以前不存在的照片。

这就是 **生成模型（Generative Model）**——学习训练数据的分布，生成新的、合理的样本。

---

## ⚔️ GAN——生成器和判别器的"猫鼠游戏"

GAN（Generative Adversarial Network）由两个网络组成：

```
生成器 G：从随机噪声 → 生成假图像（"造假者"）
判别器 D：区分真实图像和假图像（"鉴定专家"）

对抗训练：
G 想让 D 认为假图像是真的（"骗过鉴定者"）
D 想识破 G 的假图像（"不被骗"）
→ 双方互相"竞争"，共同进步
```

```python
# GAN 的训练循环
for epoch in range(epochs):
    # 训练判别器 D
    fake = G(noise)                          # 生成器造假
    d_loss = -log(D(real)) - log(1 - D(fake)) # D 要区分真假
    d_loss.backward()
    
    # 训练生成器 G
    fake = G(noise)                          # 再生成一次
    g_loss = -log(D(fake))                   # G 想骗过 D
    g_loss.backward()
```

---

## 🌫️ 扩散模型——从噪声中"去噪"出图像

Stable Diffusion、DALL·E、Midjourney 都使用扩散模型。

```
前向过程（训练时）：
清晰的猫图片 → 逐步加噪声 → 完全随机的噪声
                               ↑
               学习"去噪"——每一步预测怎么去掉噪声

反向过程（生成时）：
随机噪声 → 逐步去噪 → 生成清晰的猫图片
```

```python
# 扩散模型的生成过程（概念简化）
def generate(denoise_model, steps=50):
    x = torch.randn(3, 256, 256)  # 纯噪声
    
    for t in reversed(range(steps)):
        noise_pred = denoise_model(x, t)  # 预测噪声
        x = x - noise_pred                 # 去一步噪声
    
    return x  # 生成的图像
```

**为什么扩散模型火了？**
- GAN 训练不稳定（生成器和判别器难平衡）
- 扩散模型训练稳定，生成质量极好
- 支持"条件生成"——输入文字描述，生成对应图像

---

## 📝 小结

| 模型 | 核心思想 | 优点 | 缺点 |
|:----:|:--------:|:----:|:----:|
| **GAN** | 生成器 vs 判别器对抗 | 生成快 | 训练不稳定 |
| **VAE** | 编码→隐空间→解码 | 隐空间有数学性质 | 生成偏模糊 |
| **扩散模型** | 逐步去噪 | 质量最高、稳定 | 生成慢（逐步去噪）|

**为什么先学这个？** 生成模型关注"生成"。另一个方向是"决策"——[[reinforcement-learning|强化学习（Q-Learning, DQN）]]。
