---
id: rnn
title: 循环神经网络（RNN / LSTM）
summary: RNN 通过"记忆"处理序列数据——每个时间步的输出依赖于当前输入和上一步的"隐藏状态"。LSTM 用门控机制解决长序列中的梯度消失问题
difficulty: advanced
order: 12
parent: cnn
children:
  - transformer
related: []
prerequisites:
  - neural-network
tags:
  - dl
  - rnn
  - lstm
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 📝 "这句话的最后一个词——取决于前面所有词"

"我今天去超市买了苹果、香蕉和___"——你猜得出来下一个词是"橘子"或者"梨"。

你能猜出来是因为"记住了"前面出现的词。但对传统的神经网络——每次输入都是独立的——没有"前面发生了什么"的记忆。

**RNN（Recurrent Neural Network，循环神经网络）** 解决了这个问题：**每步的输入包含当前数据和上一步的"记忆"。**

---

## 🔄 RNN 的核心——循环

```
输出：      y₀        y₁        y₂        y₃
           ↑         ↑         ↑         ↑
隐藏状态： h₀ ←─── h₁ ←─── h₂ ←─── h₃ ←─── ...
           ↑         ↑         ↑         ↑
输入：      x₀        x₁        x₂        x₃

hₜ = tanh(W_h · hₜ₋₁ + W_x · xₜ + b)
yₜ = W_y · hₜ + b_y
```

```python
import torch.nn as nn

rnn = nn.RNN(input_size=100, hidden_size=128, num_layers=2)
# input_size=100：每个词的嵌入维度
# hidden_size=128：隐藏状态大小（"记忆"容量）
# num_layers=2：堆叠两层 RNN

output, hidden = rnn(input_sequence)
```

**RNN 的问题**：如果序列很长（如一篇 1000 词的文档）——反向传播的梯度要传播 1000 步，前面的词**梯度消失**（"记不住太早的信息"）。

---

## 🧠 LSTM——长短期记忆

LSTM（Long Short-Term Memory，长短期记忆）用**门控机制**决定"记住什么、忘记什么"：

```
遗忘门：这步应该忘记哪些旧信息？
输入门：新信息中哪些该记住？
输出门：当前状态该输出什么？

LSTM 每步更新：
1. f = σ(遗忘门) → 决定忘记多少旧记忆
2. i = σ(输入门) → 决定记住多少新信息
3. 更新细胞状态（长期记忆）
4. 输出当前步的结果
```

```python
lstm = nn.LSTM(input_size=100, hidden_size=128, num_layers=2)
# 和 RNN 一样的接口——但内部更复杂，能处理长序列
```

```python
# 实际应用：用 LSTM 做文本生成
def generate_text(model, start_text, length=100):
    model.eval()
    input = tokenize(start_text)
    output_text = start_text
    
    for _ in range(length):
        with torch.no_grad():
            logits = model(input)
            next_token = sample(logits)  # 按概率采样
            output_text += detokenize(next_token)
            input = append_token(input, next_token)
    
    return output_text
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **RNN 的循环** | 隐藏状态传递"记忆"——每步依赖上一步 |
| **梯度消失** | 长序列中早期信息被"遗忘"——RNN 的致命弱点 |
| **LSTM** | 门控机制——选择性记住/忘记——解决长序列问题 |
| **GRU** | LSTM 的简化版——更少的参数，效果接近 |

**为什么先学这个？** RNN/LSTM 曾是序列建模的主力，但已经被[[transformer|Transformer 与注意力机制]]取代。
