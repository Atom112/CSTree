---
id: ci-cd
title: CI/CD 与 DevOps
summary: CI（持续集成）频繁把代码合并到主分支并自动构建测试，CD（持续部署/交付）自动化部署到生产环境——DevOps 是开发（Dev）和运维（Ops）的文化融合
difficulty: intermediate
order: 9
parent: software-testing
children: []
related: []
prerequisites:
  - software-testing
  - version-control
tags:
  - software-eng
  - devops
  - cicd
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🏭 手动"打包→测试→部署"——又慢又容易出错

传统的软件发布流程是这样的：

```python
# 某团队上线的真实场景
1. 开发写完代码 → 提交到 Git
2. 手动告诉测试"代码写好了"
3. 测试手动拉代码 → 手动构建 → 手动测试
4. 发现问题 → 通知开发修改
5. 改完 → 重新走一遍手动流程
6. 测试通过 → 运维手动部署到服务器
7. 部署完 → 发现线上有问题 → 回滚
```

整个过程可能花几天到几周。而且**手动操作越多，越容易出错**（忘了执行某个步骤、部署错了配置……）。

**CI/CD** 就是把这个过程**自动化**——代码提交后，自动构建、自动测试、自动部署。

> 🚗 **类比：食堂打饭流水线**
>
> **没有 CI/CD** = 食堂师傅自己做菜、自己打饭、自己收钱——一个人做所有事，慢且容易出错。
>
> **有 CI/CD** = 自动化的食堂流水线——米饭从自动煮饭机出来（自动构建）、自动装盘（自动打包）、传送到窗口（自动部署）。只有菜需要厨师来做（核心开发工作）。
>
> 人的作用是处理异常（某台机器坏了），而不是重复做机械化操作。

---

## 🔄 CI——持续集成

**持续集成（Continuous Integration, CI）**：开发者频繁（每天至少一次）把代码合并到主分支，每次合并**自动触发构建和测试**。

```yaml
# .github/workflows/ci.yml —— GitHub Actions CI 配置
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: 安装依赖
        run: npm install
      - name: 运行测试
        run: npm test
      - name: 检查代码风格
        run: npm run lint
```

**每次代码提交 → 自动：**
1. 拉取最新代码
2. 安装依赖
3. 运行所有测试
4. 运行代码风格检查
5. 报告结果（通过/失败）

**CI 的核心收益**：
- **问题早发现**——提交后就发现问题，而不是几周后才发现
- **主分支始终健康**——每次合并到 main 都经过自动验证
- **减少"我机器上能跑啊"**——CI 在标准环境运行，消除"环境差异"

---

## 🚀 CD——持续交付/持续部署

**持续交付（Continuous Delivery）**：代码通过所有测试后，自动部署到**类生产环境（Staging）**，人工确认后部署到生产。

**持续部署（Continuous Deployment）**：代码通过所有测试后，**自动部署到生产环境**——不需要人工确认。

```yaml
# CD 流水线（以 GitHub Actions 为例）
deploy:
  runs-on: ubuntu-latest
  needs: test  # 测试通过了才部署
  steps:
    - name: 构建 Docker 镜像
      run: docker build -t myapp:${{ github.sha }} .
    
    - name: 推送到镜像仓库
      run: docker push myapp:${{ github.sha }}
    
    - name: 部署到生产
      run: kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
```

**完整的 CI/CD 流水线**：

```
代码提交 → 自动构建 → 自动测试 → 自动部署到 Staging → 自动测试 → 部署到生产
   ↑                                                                  │
   └──────────── 发现问题 → 修复 → 重新提交 ────────────────────────────┘
```

---

## 🛠️ DevOps——打破"开发"和"运维"的墙

**DevOps** 不是工具，也不是职位——它是一种**文化和实践**，核心是打破开发团队和运维团队之间的隔阂。

### DevOps 之前

```
开发（Dev）：              运维（Ops）：
"我代码写完了"  → 扔过墙 → "你部署一下"
                              ↓
                        "部署不了，环境有问题"
                              ↓
"我机器上能跑啊" ← 扔回去 ← "你来看看"
```

**问题**：开发和运维的目标不同——开发要"加功能"（变化），运维要"保稳定"（不变）。目标冲突导致互相推诿。

### DevOps 之后

开发也负责运维（或者部署同一个团队），"谁写代码谁负责上线"：

```
同一个团队全权负责：
设计 → 编码 → 测试 → 部署 → 监控 → 修复 → 迭代
（没有"扔过墙"——都是自己团队的事）
```

**DevOps 的三大核心实践**：

| 实践 | 说明 |
|:----:|------|
| **自动化** | CI/CD、基础设施即代码（IaC）、自动化测试 |
| **监控** | 线上系统状态可视化（Prometheus + Grafana）|
| **文化** | 开发团队也承担运维责任——"你构建它，你运行它" |

---

## 🧰 常用工具

| 环节 | 代表工具 |
|:----:|:--------:|
| **版本控制** | Git + GitHub/GitLab |
| **CI 服务器** | GitHub Actions、GitLab CI、Jenkins |
| **容器化** | Docker（打包）、Kubernetes（编排）|
| **配置管理** | Ansible、Terraform（基础设施即代码）|
| **监控** | Prometheus（采集）、Grafana（可视化）|
| **日志** | ELK Stack（Elasticsearch, Logstash, Kibana）|

> 💡 **Docker 的核心作用**：把应用和所有依赖打包成一个"镜像"——"在我机器上能跑"变成"在任何机器上都能跑"。
>
> ```bash
> # 一次构建，到处运行
> docker build -t myapp .
> docker run -d -p 8080:80 myapp
> ```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **CI（持续集成）** | 每次提交都自动构建和测试——问题早发现 |
| **CD（持续部署）** | 测试通过后自动部署到生产——一键上线 |
| **DevOps** | 开发+运维一家——谁写代码谁负责上线 |
| **CI/CD 流水线** | 提交→构建→测试→部署→监控 |
| **Docker** | 打包应用和依赖——"在我机器上能跑"终结者 |
| **基础设施即代码（IaC）** | 用代码管理服务器配置，而不是手动 SSH |

> 🎯 **小练习**：你的团队有一个 Web 应用（Python + Flask + PostgreSQL）。画一条完整的 CI/CD 流水线——从代码提交到生产环境部署，包括每个阶段用什么工具、做什么检查。

**为什么先学这个？** 自动化保证了流程的规范和速度，但代码质量还需要"人"的把关——[[code-review|代码审查与重构]]。
