---
id: container-orchestration
title: 容器与编排（Docker, K8s）
summary: Docker 打包应用和依赖成"镜像"——一次构建到处运行。Kubernetes 自动管理容器——调度、伸缩、服务发现、滚动更新
difficulty: advanced
order: 7
parent: microservices
children:
  - distributed-transactions
related: []
prerequisites:
  - microservices
tags:
  - distributed
  - docker
  - kubernetes
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 📦 "在我机器上能跑啊"——容器的诞生

开发者："在我机器上能跑！"
运维："但在我服务器上跑不了……"

原因：开发者的环境（Python 3.11 + 依赖库 v2.0）和服务器（Python 3.8 + 依赖库 v1.0）不一样。

**Docker 容器**的解决方案：**把应用和它需要的所有依赖打包成一个"镜像"——在任何机器上都能跑，不管底层环境是什么。**

> 🏪 **类比：打包行季"
>
> 你出去旅游，不确定目的地有没有牙刷、洗发水、拖鞋——你把所有东西装进行李箱（Docker 镜像）。到哪都能打开箱子直接用——不依赖"酒店提供什么"。
>
> 虚拟机 = 你带了一个"移动房间"（包括空调、床、卫浴）→ 太重
> 容器 = 只带随身行李（应用 + 必要依赖）→ 轻便

---

## 🐳 Docker——打包和运行容器

```dockerfile
# Dockerfile——定义应用的"打包方式"
FROM python:3.11-slim         # 基础镜像：轻量 Python 3.11
WORKDIR /app
COPY requirements.txt .        # 复制依赖文件
RUN pip install -r requirements.txt  # 安装依赖
COPY . .                       # 复制代码
CMD ["python", "app.py"]       # 启动命令
```

```bash
# 构建镜像
docker build -t myapp:v1 .

# 运行容器
docker run -d -p 8080:80 myapp:v1

# 查看运行的容器
docker ps

# 停止容器
docker stop myapp
```

**Docker 镜像的层级结构**：

```
Dockerfile 每行指令创建一个"层"：
FROM python:3.11-slim    → 层 1：基础 OS + Python
RUN pip install ...       → 层 2：依赖库
COPY .                    → 层 3：代码

层被缓存——改代码只需重新构建第 3 层，前两层用缓存。
```

---

## ☸️ Kubernetes——容器的"管家"

你有了 10 个微服务——每个服务在 Docker 容器里跑。但现在的问题变成了：

- 这 10 个容器怎么管理？
- 服务器挂了——容器自动重启吗？
- 流量大了——自动加容器副本吗？
- 新版本——怎么不中断服务地更新？

**Kubernetes（K8s）** 就是管理容器的"管家"——自动调度、伸缩、更新。

```
Kubernetes 集群：
┌──────────────┐
│  Control Plane   │  主节点——管理整个集群
│  (API Server)    │
│  (调度器)        │
│  (控制器)        │
└──────────────┘
    │     │     │
    ▼     ▼     ▼
┌────┐ ┌────┐ ┌────┐
│Node1│ │Node2│ │Node3│  工作节点——跑实际容器
│ Pod │ │ Pod │ │ Pod │  Pod = 最小部署单元
│ Pod │ │ Pod │ │ Pod │  （一个Pod里可以有一或多个容器）
└────┘ └────┘ └────┘
```

```yaml
# Kubernetes 部署配置（deployment.yaml）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3              # 3 个副本——高可用
  selector:
    matchLabels:
      app: myapp
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:v1    # Docker 镜像
        ports:
        - containerPort: 8080
---
# 对外暴露服务
apiVersion: v1
kind: Service
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
```

### K8s 的核心能力

| 能力 | 说明 |
|:----:|------|
| **自动调度** | 自动把容器分配到合适的服务器 |
| **自动伸缩** | CPU 高了自动加副本、低了自动减少 |
| **滚动更新** | 逐个更新——旧版先下线、新版上线、保持服务不中断 |
| **自愈** | 容器挂了自动重启、节点挂了把容器调度到其他节点 |
| **服务发现** | 自动 DNS——service-name 就能访问到其他服务 |

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **Docker** | 打包应用 + 依赖——"一次构建，到处运行" |
| **镜像（Image）** | 打包好的"模板"——只读 |
| **容器（Container）** | 镜像的运行实例——可读写 |
| **Kubernetes（K8s）** | 容器的集群管理——调度、伸缩、更新 |
| **Pod** | K8s 最小部署单元——一个或多个容器 |
| **滚动更新** | "逐个替换"式更新——服务不中断 |

**为什么先学这个？** 容器和编排是微服务的基础设施。最后一个分布式系统的话题——[[distributed-transactions|分布式事务（2PC, Saga）]]。
