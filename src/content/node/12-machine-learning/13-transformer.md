---
id: transformer
title: Transformer 与注意力机制
summary: Transformer 用自注意力（Self-Attention）代替 RNN 处理序列——每个位置关注所有位置，并行计算效率远高于 RNN。是 GPT、BERT、LLM 的基础架构
difficulty: advanced
order: 13
parent: rnn
children:
  - generative-models
  - reinforcement-learning
  - nlp
related: []
prerequisites:
  - rnn
tags:
  - dl
  - transformer
  - attention
createdAt: 2026-06-12
---

## 自注意力

```
对每个 token，计算它与所有 token 的关联：

Attention(Q, K, V) = softmax(QKᵀ / √d) · V

Q = 查询（当前 token）
K = 键（所有 token）
V = 值（所有 token 的内容）
```

## Transformer 架构

```
输入 → 位置编码 → 多头自注意力 → 残差连接 → 层归一 → FFN → 输出
                           ↕
                    多头 = 多组 QKV 并行
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **Self-Attention** | O(n²) 计算所有位置对 |
| **多头** | 多组注意力捕捉不同关系 |
| **位置编码** | 给序列提供位置信息 |
| **BERT/GPT** | 编码器/解码器架构的代表 |

**为什么先学这个？** Transformer 是当代 AI 的核心。继续学习[[generative-models|生成模型]]。
