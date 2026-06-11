# CSTree — Claude Code 协作规范

## 项目概述

CSTree 是一个自底向上的计算机科学知识树网站。使用 **Astro v4+** 框架，内容以 Markdown 存储在 `src/content/node/` 中，通过树状结构和交叉引用（wiki-link）组织知识。

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
- 正文引用其他节点用 `[[node-id|显示文字]]` 或 `[[node-id]]`
- 每个节点末尾应有小结和指向下一个内容的链接

### 2. 交叉引用（Wiki-Link）

```
[[logic-gates|逻辑门]]     → 链接到 logic-gates 节点，显示"逻辑门"
[[binary-numbers]]         → 链接到 binary-numbers 节点，显示其 title
[@boolean-algebra]         → 简写，内联融入句子
```

### 3. 实施阶段（当前状态）

| 阶段 | 状态 | 内容 |
|------|------|------|
| Phase 1 | ✅ 完成 | 项目骨架搭建、基础文件、示例节点 |
| Phase 2 | ⏳ 待开始 | 数据层、关系校验、节点路由 |
| Phase 3 | ⏳ 待开始 | 交叉引用 remark 插件 |
| Phase 4 | ⏳ 待开始 | D3.js 交互式树图 |
| Phase 5 | ⏳ 待开始 | Pagefind 搜索、暗色模式、SEO |

### 4. 通用规则

- **只修改指定内容**：不要擅自修改未要求的文件
- **构建必须通过**：修改后运行 `npm run build` 确认无错误
- **知识准确**：涉及技术细节时验证信息准确性
- **中文命名**：内容使用中文，代码标识符使用英文
- **中英文排版**：中英文间加空格，术语首次出现标注英文
- **样式约定**：使用 TailwindCSS，暗色模式用 `dark:` 前缀

### 5. 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建（务必在提交前运行）
npm run preview      # 预览生产构建
```

### 6. 设计参考

详细架构设计见 `doc/CSTree-知识树设计方案.md`，包含：
- 知识数据结构和关系图
- 交叉引用系统设计
- 树可视化方案（两种视图）
- 分阶段实施路线
- 免费部署方案
