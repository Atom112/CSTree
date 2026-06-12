---
id: nlp
title: 自然语言处理（NLP）
summary: NLP 让计算机理解和生成人类语言——从词嵌入（Word2Vec）到预训练模型（BERT, GPT），LLM 在文本生成、翻译、问答等任务上达到接近人类水平
difficulty: advanced
order: 16
parent: transformer
children:
  - computer-vision
related: []
prerequisites:
  - transformer
tags:
  - dl
  - nlp
  - llm
createdAt: 2026-06-12
---

## NLP 任务

| 任务 | 说明 |
|:----:|------|
| **文本分类** | 情感分析、垃圾检测 |
| **命名实体识别** | 识别人名、地名 |
| **机器翻译** | 一种语言→另一种 |
| **文本生成** | LLM 生成文章、代码 |
| **问答系统** | 基于上下文回答问题 |

## 预训练模型

```
BERT：双向编码器 → 理解文本
GPT：自回归解码器 → 生成文本
BERT + GPT = T5 / BART → 理解+生成
```

## 小结

| 模型 | 特点 |
|:----:|------|
| **Word2Vec** | 静态词向量 |
| **BERT** | 上下文相关词表示 |
| **GPT** | 大规模文本生成 |
| **ChatGPT** | RLHF 对齐人类偏好 |

**为什么先学这个？** NLP 后，学习[[computer-vision|计算机视觉]]。
