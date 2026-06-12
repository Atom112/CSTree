---
id: rnn
title: 循环神经网络（RNN / LSTM）
summary: RNN 处理序列数据——每个时间步的隐藏状态传递到下一步。LSTM 用门控机制解决长期依赖问题，是处理文本、语音、时间序列的主流方法
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
---

## RNN

```
h_t = tanh(W_hh · h_{t-1} + W_xh · x_t + b_h)
y_t = W_hy · h_t + b_y

问题：长序列梯度消失/爆炸
```

## LSTM

LSTM 引入三个门和细胞状态：

```
遗忘门：f_t = σ(W_f · [h_{t-1}, x_t] + b_f)
输入门：i_t = σ(W_i · [h_{t-1}, x_t] + b_i)
输出门：o_t = σ(W_o · [h_{t-1}, x_t] + b_o)
细胞状态：C_t = f_t * C_{t-1} + i_t * tanh(W_c · [h_{t-1}, x_t] + b_c)
```

## 小结

| 模型 | 核心 | 适用 |
|:----:|:----:|:----:|
| **RNN** | 循环隐藏状态 | 短序列 |
| **LSTM** | 门控+细胞状态 | 长序列 |
| **GRU** | 简化 LSTM | 性能与 LSTM 接近 |

**为什么先学这个？** 序列建模后，学习[[transformer|Transformer 与注意力机制]]。
