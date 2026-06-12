---
id: version-control
title: 版本控制（Git）
summary: Git 是分布式版本控制系统——记录每次修改，支持分支协作，是软件开发的基础设施
difficulty: beginner
order: 3
parent: agile-scrum
children: []
related: []
prerequisites:
  - agile-scrum
tags:
  - software-eng
  - git
createdAt: 2026-06-12
---

## 基本操作

```bash
git init                    # 初始化仓库
git add file.txt            # 暂存修改
git commit -m "msg"         # 提交
git push origin main        # 推送到远程
git pull                    # 拉取远程更新
```

## 分支

```bash
git branch feature-x        # 创建分支
git checkout feature-x      # 切换分支
git merge feature-x         # 合并分支
git rebase main             # 变基——线性化历史
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **提交** | 每次修改的快照 |
| **分支** | 独立开发线 |
| **远程** | 协作的共享仓库 |

**为什么先学这个？** 版本控制是协作基础。接下来学习[[requirements-analysis|需求获取与分析]]。
