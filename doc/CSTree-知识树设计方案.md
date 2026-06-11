# CSTree 知识树网站 — 设计与实施方案

## 1. 背景与目标

建立一个公开的计算机科学知识学习网站，从硬件（逻辑门、寄存器）到软件（操作系统、汇编、编译器、高级语言），**自底向上**给初学者讲明白计算机原理。结构上以**树状知识体系**为主线、**知识点间交叉引用**为辅线，最终形成复杂的网状结构。

浏览体验：浏览整棵知识树 → 点击节点学习 → 学完后跳转上/下/同级节点 → 文中术语超链接可跳转到其他节点学习。

---

## 2. 技术选型总览

| 维度 | 选择 | 理由 |
|------|------|------|
| 架构模式 | **静态站点** | 知识内容不变，构建时生成全部页面，免费部署 |
| 框架 | **Astro v4+** | 内容优先；Content Collections（结构化Markdown+Schema校验）；Islands架构（交互部分用React组件，内容部分零JS）；支持MDX；极快构建速度 |
| 内容格式 | **Markdown + MDX** | 写作门槛低；MDX允许嵌入交互组件 |
| 树数据 | **YAML + Astro Content Collections** | 每个节点是一个集合条目，frontmatter 声明父子/关联关系 |
| 交叉引用 | **自定义 wiki-link 语法** | `[[node-id\|显示文字]]` → 构建时 remark 插件解析为真实链接 |
| 树可视化 | **D3.js (d3-hierarchy) + React** | Astro Island 模式加载交互式树图，PC 上为可缩放树图，移动端为可折叠列表 |
| 搜索 | **Pagefind** | 静态搜索，零后端，Astro 构建后自动索引 |
| 部署 | **Cloudflare Pages / GitHub Pages** | 免费，支持 Astro 构建，自动 HTTPS |
| 源码管理 | **Git + GitHub** | 免费，PR 协作 |

> **为什么不是 Docusaurus/VuePress/Next.js？**
> - Docusaurus sidebar 是线性/扁平结构，自定义树形导航需要深度 hack
> - Next.js 功能强大但对纯内容站点过于重型
> - Astro 的 Content Collections 原生支持结构化的知识节点，Islands 模式让交互组件（树图）和内容完美分离

---

## 3. 知识数据结构设计

### 3.1 知识节点 (Node) Schema

```yaml
---
id: boolean-algebra
title: 布尔代数
summary: 布尔代数是数字电路的基础，使用0和1进行逻辑运算
difficulty: beginner           # beginner | intermediate | advanced
order: 2                       # 同级学习顺序
parent: binary-numbers         # 父节点 ID（树结构）
children:                      # 子节点 ID
  - logic-gates
related:                       # 跨树关联节点
  - set-theory
prerequisites:                 # 前置知识
  - binary-numbers
tags:
  - math
  - hardware
---
```

### 3.2 关系图结构

```
         二进制数字 ←→ 集合论
            │
         布尔代数
            │
         逻辑门 ──→ 真值表
         /  |  \
      与门 或门 非门
        │
     半加器 ──→ 加法器
```

- **树结构**：`parent` + `children` 定义上下级
- **关联关系**：`related` 定义跨分支链接
- **前置依赖**：`prerequisites` 用于拓扑排序和学习路径建议
- **双向一致性**：构建脚本在构建时自动从子节点反推父节点的 `children`，确保数据不冗余

### 3.3 内容目录结构

```
src/content/node/
├── _schema.ts                 # Astro Content Collection 类型定义
├── 00-hardware/
│   ├── 01-binary-numbers.md
│   ├── 02-boolean-algebra.md
│   ├── 03-logic-gates.md
│   │   ├── 03-and-gate.md
│   │   ├── 03-or-gate.md
│   │   └── 03-not-gate.md
│   └── 04-adder.md
├── 01-assembly/
├── 02-os/
├── 03-compilers/
└── ...
```

---

## 4. 交叉引用系统

### 4.1 语法

在 Markdown 正文中使用 wiki-link 语法：

```markdown
最基本的逻辑门包括[[and-gate|与门]]、[[or-gate|或门]]和[[not-gate|非门]]。
```

三种语法：
- `[[node-id]]` — 用节点的 `title` 字段作为显示文字
- `[[node-id|显示文字]]` — 自定义显示文字
- `[@node-id]` — 简写，内联融入句子

### 4.2 构建时处理

1. 自定义 **remark-plugin** 解析 `[[...]]` 和 `[@...]` 语法
2. 在构建时根据 `id` 查找目标节点，生成真实链接
3. 校验有效性：
   - 无效链接 → 构建失败（代码 `1`），输出错误信息
   - 循环引用 → 构建警告
4. 生成的 HTML 链接自动添加属性：`data-knowledge-node="node-id"` 用于样式/统计

### 4.3 悬停预览（可选增强）

链接 hover 时显示目标节点的摘要卡片（通过 `data-knowledge-node` + 全局 JS 查询摘要数据实现）。

---

## 5. 树可视化方案

### 5.1 两种视图

| 视图 | 技术 | 适用场景 |
|------|------|----------|
| **交互式树图** | D3.js (d3-hierarchy + d3-zoom) + React Island | PC/平板 — 缩放、拖动、点击跳转 |
| **面包屑 + 可折叠列表** | 纯 CSS + Astro 组件 | 移动端 — 触屏友好，无 JS 开销 |

### 5.2 交互式树图功能

- 根节点居中，子节点向下展开
- 鼠标滚轮缩放，拖拽平移
- 点击节点 → 跳转到知识页面
- 当前阅读的节点自动高亮
- 关联节点（`related`）显示为虚线连接（optional）
- 搜索框 → 定位到匹配节点并居中

### 5.3 节点导航（页面内）

每篇文章底部显示：

```
◀ 前置：二进制数字
▼ 下一篇：与门
≡ 同级：或门 | 非门
↗ 关联：真值表 | 加法器
```

---

## 6. 分阶段实施路线

### Phase 1：项目骨架搭建
- [ ] 初始化 Astro 项目
- [ ] 配置 TypeScript、TailwindCSS
- [ ] 配置 Content Collections，定义 `node` schema
- [ ] 创建基础布局（Header、Footer、Sidebar）
- [ ] 配置 Cloudflare Pages 自动部署（GitHub 集成）

### Phase 2：知识树数据层
- [ ] 编写 5-10 个示例知识节点
- [ ] 实现 parent/children/related/prerequisites 数据关系管理
- [ ] 编写构建时脚本，自动校验关系完整性
- [ ] 实现节点列表页 + 详情页路由

### Phase 3：交叉引用系统
- [ ] 编写 remark 插件 `remark-wiki-link`
- [ ] 构建时校验：无效链接导致构建失败
- [ ] 交叉引用链接样式
- [ ] 可选：hover 摘要卡片

### Phase 4：树可视化组件
- [ ] 集成 D3.js + React Island 交互式树图
- [ ] 缩放/拖拽/点击跳转
- [ ] 当前页面高亮
- [ ] 移动端纯 CSS 折叠列表导航
- [ ] 页面内导航条

### Phase 5：搜索与增强功能
- [ ] 集成 Pagefind 搜索
- [ ] 移动端响应式适配
- [ ] 暗色模式
- [ ] SEO 优化（meta description, og:title）
- [ ] Sitemap 生成

### Phase 6：内容写作（长期）
- [ ] 自底向上逐层填充知识节点
- [ ] 每写一篇更新交叉引用

### Phase 7：进阶优化（可选）
- [ ] 学习路径推荐（拓扑排序）
- [ ] 进度追踪（localStorage）
- [ ] 知识点高亮/笔记功能
- [ ] 社区贡献指南

---

## 7. 免费部署方案

```
用户编写 Markdown → Astro 构建 → 静态 HTML/CSS/JS
                                    ↓
                         Cloudflare Pages 或 GitHub Pages
                                    ↓
                            用户通过域名（可选）访问
```

- **Cloudflare Pages**（推荐）：免费套餐支持 Astro 构建、自动 HTTPS、全球 CDN、无限带宽
- **GitHub Pages**：同等免费，CI 通过 GitHub Actions

---

## 8. 关键文件清单

```
cstree/
├── astro.config.ts              # Astro 配置
├── src/
│   ├── content/
│   │   ├── config.ts            # Content Collection schema
│   │   └── node/                # 所有知识节点
│   ├── components/
│   │   ├── KnowledgeTree.astro
│   │   ├── KnowledgeTreeReact.tsx
│   │   ├── MobileTreeList.tsx
│   │   ├── NodeNavigation.astro
│   │   ├── WikiLink.astro
│   │   └── SearchBar.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── node/[id].astro
│   │   └── search.astro
│   ├── plugins/
│   │   └── remark-wiki-link.ts
│   ├── scripts/
│   │   └── validate-graph.ts
│   └── styles/
│       └── global.css
├── public/
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 9. 验证方案

1. **本地构建与预览**：`npm run dev` → `npm run build` → `npm run preview`
2. **构建时校验**：所有引用在构建时验证，无效引用导致构建失败
3. **部署验证**：Cloudflare Pages 自动部署，检查所有页面正常访问
4. **内容验证**：沿树结构遍历，每个节点正常渲染；交叉引用链接跳转正确
