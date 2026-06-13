---
id: mlops
title: MLOps 与模型部署
summary: MLOps 把机器学习模型从"实验"变成"产品"——数据管理、实验追踪、模型部署、监控、持续迭代。和 DevOps 类似但增加了数据、模型版本管理等 ML 特有挑战
difficulty: advanced
order: 18
parent: computer-vision
children:
  - ai-ethics
related: []
prerequisites:
  - linear-regression
tags:
  - ml
  - mlops
  - deployment
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🧪 在笔记本里跑的模型——和线上不是一回事

你在 Jupyter Notebook 里调了一个模型——准确率 95%。你很高兴，把 notebook 发给同事——"部署一下"。

然后问题来了：
- 训练环境（Python 3.10 + PyTorch 2.0）线上没有
- 训练数据在那个 CSV 文件里，线上数据从 API 来——格式不同
- 模型推理速度太慢——线上需要 10ms 以内
- 线上数据分布变了——模型准确率降到 70%

**MLOps** 就是解决这些问题的方法论——把 ML 模型从"实验"变成"可靠的产品"。

> 💡 **MLOps = DevOps + ML 特有挑战**
> 
> DevOps 已有的：CI/CD、容器化、监控
> ML 特有的：数据版本管理、模型版本管理、实验追踪、特征存储、模型漂移检测

---

## 🔧 MLOps 的核心组件

| 环节 | 工具 | 解决的问题 |
|:----:|:----:|:----------:|
| **实验追踪** | MLflow、Weights & Biases | "之前那个 95% 的模型用了什么参数？" |
| **数据版本管理** | DVC（Data Version Control）| "训练数据是哪一版的？" |
| **模型注册** | MLflow Model Registry | 管理模型版本、审批流程 |
| **特征存储** | Feast、Tecton | 训练和线上用同一套特征 |
| **模型部署** | TensorFlow Serving、TorchServe | 模型→API 服务 |
| **监控** | Prometheus + Grafana、Evidently | 模型准确率下降报警 |

```python
# MLflow——实验追踪
import mlflow

mlflow.set_experiment("房价预测")

with mlflow.start_run():
    # 记录参数
    mlflow.log_param("learning_rate", 0.01)
    mlflow.log_param("model_type", "random_forest")
    mlflow.log_param("n_estimators", 100)
    
    # 训练模型
    model = train_model()
    
    # 记录指标
    mlflow.log_metric("val_mae", 5.2)
    mlflow.log_metric("val_rmse", 7.8)
    
    # 保存模型
    mlflow.sklearn.log_model(model, "model")
```

---

## 📦 模型部署方式

| 方式 | 适用场景 | 延迟 | 例子 |
|:----:|:--------:|:----:|:----:|
| **在线推理（REST API）** | 实时预测（推荐、检测）| 低 | TensorFlow Serving |
| **批量推理（Batch）** | 大规模离线预测 | 高 | Spark 批处理 |
| **边缘设备** | 手机、IoT | 极低 | TensorFlow Lite |
| **浏览器端** | Web 应用 | 本地 | TensorFlow.js |

```python
# 用 FastAPI 部署模型
from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load("model.pkl")  # 加载模型

@app.post("/predict")
async def predict(features: dict):
    X = preprocess(features)
    pred = model.predict(X)
    return {"prediction": pred.tolist()}
```

---

## 🔄 模型漂移——部署后不是终点

模型部署后最大的问题：**数据分布会变**。

```python
# 概念漂移（Concept Drift）：
# 2023 年训练的用户行为模型——2024 年用户习惯变了
# → 模型准确率从 90% 降到 70%

# 应对：持续监控 → 触发重新训练 → 自动部署新模型
```

MLOps 的最终目标是 **ML 的 CI/CD**——数据变了→自动重新训练→自动验证→自动部署。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **MLOps** | 把 ML 从实验变成可靠产品的工程实践 |
| **实验追踪** | 记录每次训练的参数、指标、代码版本 |
| **模型部署** | 在线 API、批量推理、边缘设备 |
| **模型漂移** | 线上数据分布变化导致性能下降——需重新训练 |
| **特征存储** | 统一线上线下特征——保证训练和推理一致 |

**为什么先学这个？** 有了 MLOps，模型才能真正落地。最后看 ML 的社会影响——[[ai-ethics|AI 伦理与公平性]]。
