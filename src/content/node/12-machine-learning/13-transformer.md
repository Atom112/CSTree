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
updatedAt: 2026-06-13
---

## 🚀 "Attention Is All You Need"——2017 年的革命

2017 年，Google 发表了一篇论文——《Attention Is All You Need》。它提出的 **Transformer** 架构只用"注意力机制"处理序列——彻底取代了 RNN。

为什么 Transformer 比 RNN 强？
```
RNN：串行处理——必须等上一步算完才能算下一步
     → 不能并行 → 训练慢
     → 长距离依赖弱

Transformer：并行处理——同时计算所有位置
            → 训练快（10-100 倍）
            → 每个位置都能直接"关注"所有位置
```

---

## 🎯 自注意力——核心公式

**自注意力** 让每个词"看"所有其他词：

```
Attention(Q, K, V) = softmax(QKᵀ / √d) · V

Q = 查询——"我在找什么？"  
K = 键——"我有什么？"  
V = 值——"我的内容是什么？"

QKᵀ = 相似度矩阵——每个词对所有词的"关联度"
softmax → 概率分布——"关注谁、关注多少"
÷√d → 缩放——防止内积太大导致梯度消失
```

```python
# 简化的单头自注意力
def self_attention(Q, K, V):
    # Q, K, V: (batch, seq_len, d_model)
    scores = Q @ K.transpose(-2, -1)  # (batch, seq_len, seq_len)
    scores = scores / (d_model ** 0.5) # 缩放
    weights = softmax(scores, dim=-1)  # 概率化
    output = weights @ V                # 加权求和
    return output
```

**多头注意力**：不只用一组 QKV——用多组并行的 QKV，每组学不同的"关注模式"（语法关系、语义关系、距离关系……）。

```
多头 = 多组 QKV 并行运算，结果拼接
比如 8 个头→每个头学不同的"关系"
头 1：关注语法依赖（主语→动词）
头 2：关注位置临近
头 3：关注语义相似
```

---

## 🏗️ Transformer 的整体架构

```
编码器（BERT 风格）：              解码器（GPT 风格）：
输入文本                          输入序列（已生成的部分）
    ↓                                  ↓
位置编码（给每个位置加上位置信息）   位置编码
    ↓                                  ↓
多头自注意力（词看所有词）          多头自注意力（只看已生成的词）
    ↓                                  ↓
残差连接 + 层归一化                 残差连接 + 层归一化
    ↓                                  ↓
前馈神经网络（FFN）                  交叉注意力（看编码器输出）
    ↓                                  ↓
残差连接 + 层归一化                 残差连接 + 层归一化
    ↓                                  ↓
                                     前馈神经网络
                                      ↓
                                    残差连接 + 层归一化
                                      ↓
                                     输出概率（预测下一个词）
```

### 位置编码

Transformer 不像 RNN 有"顺序"概念——所有词同时输入。**位置编码**给每个词加上位置信息：

```python
position_encoding(pos, 2i) = sin(pos / 10000^(2i/d))
position_encoding(pos, 2i+1) = cos(pos / 10000^(2i/d))
```

不同的"位置"得到不同的编码向量——Transformer 能区分"第 1 个词"和"第 5 个词"。

---

## 🏛️ 两大代表——BERT vs GPT

| 对比 | BERT | GPT |
|:----:|:----:|:----:|
| 架构 | 只有编码器 | 只有解码器 |
| 训练方式 | Masked LM（完形填空）| 自回归（预测下一个词）|
| 擅长 | 理解（分类、QA、NER）| 生成（写作、对话、代码）|
| 代表 | BERT, RoBERTa, ALBERT | GPT-3, GPT-4, LLaMA |

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **自注意力** | 每个词关注所有词——计算关联度加权求和 |
| **多头注意力** | 多组并行的 QKV——学不同关系模式 |
| **位置编码** | 给 Transformer 提供位置信息 |
| **BERT** | 编码器——擅长理解 |
| **GPT** | 解码器——擅长生成 |
| **O(n²) 复杂度** | 自注意力对所有位置对计算——序列长了计算量大 |

**为什么先学这个？** Transformer 是当代 AI 的基石。看看它催生的两大领域——[[generative-models|生成模型]]和[[nlp|自然语言处理]]。
