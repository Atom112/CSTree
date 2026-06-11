<div align="center">

<img src="./logo.svg" alt="CSTree Logo" width="100" height="100" />

# CSTree

**计算机科学知识树 — 从晶体管到操作系统，自底向上系统化学习**

[![Astro](https://img.shields.io/badge/Astro-4.x-BC52EE?logo=astro&logoColor=fff)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=fff)](https://react.dev/)
[![D3.js](https://img.shields.io/badge/D3.js-7.x-F9A03C?logo=d3.js&logoColor=fff)](https://d3js.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?logo=cloudflarepages&logoColor=fff)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📖 介绍

CSTree 是一个**自底向上**的计算机科学知识学习网站。以**树状知识结构**为主体、**知识点交叉引用**为辅助，将所有计算机知识组织成一张可探索的网状图谱。

无论你是刚接触计算机的初学者，还是想系统补全知识根基的开发者，都能在这里找到一条清晰的学习路径。

### ✨ 核心特性

- **🌲 知识树结构** — 从硬件到软件，层次化组织知识点，总览全局
- **🕸️ 交叉引用** — 文章中所有专业术语都链接到对应的知识节点，随学随跳
- **🎯 难度分级** — 入门 / 进阶 / 高级，循序渐进的路线规划
- **🔍 全文搜索** — 基于 Pagefind 的静态搜索，零后端依赖
- **📱 响应式设计** — 桌面端 D3.js 交互式知识树，移动端折叠列表导航
- **🌙 暗色模式** — 跟随系统 / 手动切换，FOUC 预防
- **📐 LaTeX 公式** — KaTeX 渲染，数学表达式清晰美观
- **🔗 结构化 SEO** — JSON-LD、OG/Twitter Card、Sitemap 全齐全

---

## 🗺️ 知识体系

```
计算机科学知识树
├── 🔌 硬件基础          — 二进制 · 布尔代数 · 逻辑门 · 加法器 · 触发器 · 寄存器
├── ⚙️ 汇编语言          — 指令集 · 寻址模式 · 调用约定  
├── 🖥️ 操作系统          — 进程管理 · 内存管理 · 文件系统
├── 🔧 编译器            — 词法分析 · 语法分析 · 代码生成
├── 🌐 计算机网络        — TCP/IP · HTTP · 路由协议
└── 🗄️ 数据库            — SQL · 索引 · 事务 · B+树
```

> 📍 当前已构建 **硬件基础** 分支（11 个知识节点），其他领域逐步建设中。

---

## 🚀 在线体验

[https://cstree.locx-loch.top/](https://cstree.locx-loch.top/)

---

## 🧱 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| 框架 | [Astro 4](https://astro.build/) | 静态站点生成，Content Collections |
| 样式 | [TailwindCSS 3](https://tailwindcss.com/) | 全局样式，暗色模式 |
| 交互 | [React 18](https://react.dev/) + [D3.js 7](https://d3js.org/) | 知识树可视化（Island 架构） |
| 内容 | Markdown + Frontmatter | 知识节点写作格式 |
| 搜索 | [Pagefind](https://pagefind.app/) | 静态全文搜索索引 |
| 公式 | [KaTeX](https://katex.org/) | $\LaTeX$ 数学公式渲染 |
| 部署 | [Cloudflare Pages](https://pages.cloudflare.com/) | 免费托管，自动 CI/CD |

---

## 📦 本地开发

```bash
# 克隆仓库
git clone https://github.com/Atom112/CSTree.git
cd CSTree

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览构建结果
npm run preview
```

### 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热更新） |
| `npm run build` | 完整构建：校验 → Astro 构建 → Pagefind 索引 → Sitemap |
| `npm run validate` | 单独运行图结构校验 |
| `npm run pagefind` | 仅生成搜索索引 |
| `npm run sitemap` | 仅生成站点地图 |

---

## ✍️ 内容写作

知识节点是 `src/content/node/` 下的 Markdown 文件。每个文件包含 Frontmatter 元数据和正文：

```yaml
---
id: boolean-algebra
title: 布尔代数
summary: 布尔代数是数字电路的理论基础
difficulty: beginner          # beginner | intermediate | advanced
order: 2
parent: binary-numbers
children:
  - logic-gates
prerequisites:
  - binary-numbers
tags:
  - math
  - hardware
---
```

正文中可使用 `[[node-id|显示文字]]` 语法交叉引用其他知识节点。

---

## 🏗️ 项目结构

```
src/
├── content/
│   ├── config.ts            # Content Collection 类型定义 (Zod)
│   └── node/                # 🌟 知识节点 Markdown 文件
├── components/
│   ├── KnowledgeTree.astro  # 知识树容器（响应式切换）
│   ├── KnowledgeTreeReact.tsx # D3.js 交互树 (React Island)
│   ├── MobileTreeList.astro # 移动端折叠列表
│   ├── NodeNavigation.astro # 上/下节导航
│   ├── TreeNodeBranch.astro # 递归树节点
│   └── Logo.astro           # SVG Logo
├── layouts/
│   └── BaseLayout.astro     # 全局布局（SEO / 暗色 / KaTeX）
├── pages/
│   ├── index.astro          # 首页（知识树）
│   ├── node/[id].astro      # 知识节点详情页
│   ├── nodes.astro          # 节点目录页
│   └── search.astro         # 搜索页
├── plugins/
│   ├── remark-wiki-link.ts  # [[node-id]] → 链接 插件
│   └── rehype-knowledge-node.ts # data-* 属性注入
├── scripts/
│   ├── validate-graph.ts    # 构建时图结构校验
│   └── generate-sitemap.ts  # 站点地图生成
├── styles/
│   └── global.css           # 全局样式 + 自定义滚动条
└── utils/
    ├── graph.ts             # 图数据核心工具
    └── types.ts             # 类型定义
```

---

## 🤝 贡献指南

请参阅 [AGENTS.md](./AGENTS.md)（AI Agent 开发规范）和 [CLAUDE.md](./CLAUDE.md)（Claude Code 协作规范）。

欢迎通过 Issue 和 PR 参与内容写作、功能开发和问题反馈。

---

## 📄 许可证

[MIT](./LICENSE) © 2026 Atom112
