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
updatedAt: 2026-06-13
---

## 📓 写论文时的"版本"灾难

你写过课程论文吗？可能经历过这样的场景：

```
论文_初稿.docx
论文_改1.docx
论文_改2.docx
论文_最终版.docx
论文_真最终版.docx
论文_绝对不改了.docx
```

听起来可笑——但很多团队在没用版本控制之前，就是这么"管理代码"的。两个同学同时改同一段代码，一个人改了另一个人的内容——完全不知道发生了什么。

**版本控制（Version Control）** 就是解决这个问题的系统：它记录文件的每一次修改，让你可以随时回到任何一个历史版本，让多人协作互不干扰。

> 📖 **类比：实验记录本**
>
> 你在实验室做实验——每次操作、每个数据都记在实验记录本上，标注日期和签名。哪天出错了，翻记录本就知道"哪天、谁、做了什么操作"——可以精确回退到出错前的状态。
>
> Git 就是电子版的"实验记录本"——每条记录（提交）都记录了"时间、谁、改了什么、为什么改"。

---

## 🎯 Git 的核心概念

### 1️⃣ 提交（Commit）——快照

每次 `git commit` 就像**拍一张所有文件的快照**。

```
时刻 1：文件 A(1) 文件 B(1)  ← 第 1 次提交
时刻 2：文件 A(2) 文件 B(1)  ← 第 2 次提交（只改了 A）
时刻 3：文件 A(2) 文件 B(2)  ← 第 3 次提交（改了 B）
```

每次提交都有一个唯一的 **SHA-1 哈希值** 作为 ID——`a1b2c3d4...`。

```bash
# 基本流程
git init                          # 初始化仓库
git add main.py utils.py          # 暂存（告诉 Git 要跟踪这些文件）
git commit -m "完成用户登录功能"   # 提交（拍一张快照）
```

```python
# 两层"暂存"的设计——add + commit
# git add = 把文件放进"购物车"
# git commit = "购物车"里的东西一次性结账
```

### 2️⃣ 分支（Branch）——平行宇宙

分支让多个开发者在**互不干扰的"平行空间"**中工作：

```
main:   A ── B ── C ──────── E  ← 合并后
                      ↙
feature-login:       D1 ── D2 ── D3  ← 独立开发登录功能
feature-pay:              P1 ── P2  ← 同时开发支付功能
```

```bash
git branch feature-x       # 创建分支
git checkout feature-x     # 切换到该分支
# 或一步到位：
git switch -c feature-x

# 在 feature-x 上修改提交后——合并回主分支
git checkout main
git merge feature-x
```

> 🧩 **类比：写论文的不同章节**
>
> 你和同学一起写论文。你在 `chapter-3` 分支上写第三章，他在 `chapter-4` 分支上写第四章——互不影响。你们都写完后，把各自的分支合并到 `main`（主文档）。
>
> 如果没有分支——你们必须排队改同一个文件，或者互相覆盖。

### 3️⃣ 远程仓库（Remote）——团队协作

Git 是**分布式**的——每个开发者电脑上都有完整的代码历史。

```
GitHub/GitLab（中央服务器）
      ↑ push / ↓ pull
 你的电脑 ← → 同事的电脑
```

```bash
git clone https://github.com/xxx/project.git  # 克隆到本地
git pull                                        # 拉取同事的修改
git push                                        # 推送自己的修改
```

---

## 🔄 Git 工作流——常见的团队协作方式

### 方式 1：GitHub Flow（最简单）

```bash
# 1. 从 main 创建功能分支
git switch -c feature-login

# 2. 在分支上开发、提交
git add .
git commit -m "实现登录表单"
git push origin feature-login

# 3. 在 GitHub 上创建 Pull Request
# 4. 同事审查代码，讨论修改
# 5. 审查通过后合并到 main
```

```
main: ────── A ──────────── D (合并 PR)
                \         ↗
feature-login:   B ── C ──      (Pull Request)
```

### 方式 2：PR 的三条黄金规则

```
1. 一个 PR 只做一个功能——不要混在一起
2. PR 描述要清晰——"做了什么"和"为什么"
3. 先 rebase 再合并——保持历史线性
```

---

## 💡 常用命令速查

| 场景 | 命令 |
|:----:|:----:|
| 查看状态 | `git status` |
| 查看历史 | `git log --oneline --graph` |
| 撤销暂存 | `git reset HEAD file.txt` |
| 放弃修改 | `git checkout -- file.txt` |
| 合并分支 | `git merge branch-name` |
| 变基（线性化） | `git rebase main` |
| 解决冲突后 | `git add . && git commit` |
| 暂存当前工作 | `git stash` → `git stash pop` |

### 冲突解决

当两个人改了同一文件的同一部分：

```python
# Git 会在文件中标记冲突
<<<<<<< HEAD
print("你好")
=======
print("Hello")
>>>>>>> feature-english
```

你需要手动决定保留哪个版本（或都保留），然后提交。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **版本控制** | 记录每次修改，可随时回退 |
| **Commit（提交）** | 一次文件快照 |
| **Branch（分支）** | 独立开发线——平行宇宙 |
| **Merge（合并）** | 把分支的修改合并到一起 |
| **Pull Request** | 代码审查和合并的请求 |
| **Remote（远程）** | 多人协作的共享仓库 |

> 🎯 **小练习**：你和同学用 Git 做小组项目。你想在主分支上开发，但同学说"应该在分支上开发"。为什么？如果你们在同一个分支上同时修改了同一个文件的同一行，会发生什么？

**为什么先学这个？** 有了工具，需要知道"做什么"——[[requirements-analysis|需求获取与分析]]。
