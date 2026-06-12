# CSTree — Claude Code 协作规范

## 项目概述

CSTree 是一个自底向上的计算机科学知识树网站。使用 **Astro v4+** 框架，内容以 Markdown 存储在 `src/content/node/` 中，通过树状结构和交叉引用（wiki-link）组织知识。

## 设计哲学

本知识库服务于**从零开始的初学者**——尤其是刚从高中应试教育步入大学、第一次接触计算机科学的学生。现有大学课程往往在认知规律上存在断层：学生听不懂、不知所学为何用。

因此，本知识库遵循以下设计原则：

### ① 生活化先于符号化
每个概念在给出定义之前，**先用学生日常生活中的场景或问题引出**。例如不直接说"二进制是一种以2为基数的记数系统"，而是先问"手机里的一张自拍怎么变成0和1？"。

### ② 类比是核心教学手段
每个抽象概念至少搭配一个来自日常生活的类比。把 CPU 时钟比作"阅兵方阵的鼓点"，把与门比作"既完成作业又整理房间才能玩游戏"——类比让抽象变得可触摸。

### ③ 脚手架式编排
知识节点的排列遵循从具体到抽象、从简单到复杂的认知规律。每个新概念明确依赖哪些前置知识，**杜绝前向引用**（绝不使用读者尚未学过的概念来解释当前内容）。无法避免时，必须标注"此内容将在后续章节详细讲解"。

### ④ 降低认知负荷
每个节点控制新概念数量（通常不超过 3-5 个），过密的内容拆分为多个节点。定义力求简洁，避免堆砌术语。术语首次出现时必须附中文+英文。

### ⑤ 文化亲近感
使用中国学生熟悉的场景和比喻（高考、微信支付、食堂选菜、春运抢票、健康码、宿舍生活等），降低认知距离。

### ⑥ 每个节点是一节"好课"
- **开头**：用问题或场景钩住注意力
- **中间**：概念 → 类比 → 示例 → 总结，循环递进
- **结尾（小结）**：总结要点 + 联系大图 + 解释为什么学下一个

### ⑦ 严谨但不枯燥
所有内容对标权威教材（CS:APP、龙书、OSTEP 等），确保技术准确。但表达方式上追求让读者"哦，原来是这样！"的顿悟感。通俗不是浅薄，而是**更难的精确**。

## 快速参考

| 项目 | 信息 |
|------|------|
| 技术栈 | Astro 4 + React 18 + TailwindCSS 3 + TypeScript 5 |
| 包管理器 | npm |
| 构建命令 | `npm run dev`（开发）/ `npm run build`（生产）/ `npm run preview`（预览） |
| 部署平台 | Cloudflare Pages（静态导出） |
| 内容格式 | Markdown + frontmatter |
| 交互部分 | React Island（D3.js、Pagefind） |
| 设计文档 | `doc/CSTree-知识树设计方案.md` |
| 知识节点撰写计划 | `doc/curriculum-plan.md` |

## 目录结构

```
cstree/
├── astro.config.ts              # Astro 配置
├── src/
│   ├── content/
│   │   ├── config.ts            # Content Collection schema（Zod 定义）
│   │   └── node/                # 知识节点 Markdown 文件
│   │       ├── _schema.ts       # Node frontmatter 类型引用
│   │       ├── 00-hardware/     # 硬件主题（自底向上按编号排列）
│   │       └── ...
│   ├── components/
│   │   ├── KnowledgeTree.astro  # 树容器（PC D3 树 / 移动端折叠列表）
│   │   ├── KnowledgeTreeReact.tsx # [Phase 4] React D3 交互树
│   │   ├── MobileTreeList.astro # 移动端折叠列表
│   │   ├── NodeNavigation.astro # 上下/同级/关联导航
│   │   ├── WikiLink.astro       # [Phase 3] 交叉引用组件
│   │   └── SearchBar.astro      # [Phase 5] 搜索组件
│   ├── layouts/
│   │   └── BaseLayout.astro     # 全局布局
│   ├── pages/
│   │   ├── index.astro          # 首页（知识树全览）
│   │   ├── node/[id].astro      # 知识节点详情页
│   │   └── search.astro         # 搜索页
│   ├── plugins/
│   │   └── remark-wiki-link.ts  # [Phase 3] wiki-link remark 插件
│   ├── scripts/
│   │   └── validate-graph.ts    # [Phase 2] 图校验脚本
│   └── styles/
│       └── global.css           # 全局样式（Tailwind + 知识内容样式）
├── public/                      # 静态资源
└── doc/CSTree-知识树设计方案.md   # 设计文档
```

## 核心规范

### 1. 知识节点编写

每个节点是 `src/content/node/` 下的 `.md` 文件，frontmatter 必须包含：

```yaml
---
id: kebab-case-id
title: 中文标题
summary: 一句话摘要
difficulty: beginner  # beginner | intermediate | advanced
order: 1
parent: parent-id     # 根节点不填
children: []          # 子节点 ID
related: []           # 关联节点 ID
prerequisites: []     # 前置知识 ID
tags: []              # 标签
---
```

**关键规则**：
- `parent`/`children`/`related`/`prerequisites` 中引用的 ID 必须在其他节点中存在
- 正文引用其他节点用 `[[node-id|显示文字]]` 或 `[[node-id]]`，如果要引用的节点暂未创建，先创建一个空文件避免构建报错，同时检查前序节点有没有遗漏的引用
- 每个节点末尾应有小结和指向下一个内容的链接
- 其他内容编写规则见 `./AGENTS.md`
- **写完一个节点后，同步更新 `doc/curriculum-plan.md`：将该知识点在对应板块表格中的状态从「⬜ 待添加」改为「✅ 已完成」**

### 2. 交叉引用（Wiki-Link）

```
[[logic-gates|逻辑门]]     → 链接到 logic-gates 节点，显示"逻辑门"
[[binary-numbers]]         → 链接到 binary-numbers 节点，显示其 title
[@boolean-algebra]         → 简写，内联融入句子
```

### 3. 实施阶段（当前状态）

项目已进入知识节点编写的长期更新阶段

### 4. 通用规则

- **只修改指定内容**：不要擅自修改未要求的文件
- **构建必须通过**：修改后运行 `npm run build` 确认无错误
- **知识准确**：涉及技术细节时验证信息准确性
- **中文命名**：内容使用中文，代码标识符使用英文
- **中英文排版**：中英文间加空格，术语首次出现标注英文
- **样式约定**：使用 TailwindCSS，暗色模式用 `dark:` 前缀
- **重要：添加新节点时同步更新 `doc/node-structure.md`**：该文档记录完整的节点树结构，供 Agent 确定新节点位置

### 5. 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建（务必在提交前运行）
npm run preview      # 预览生产构建
```
