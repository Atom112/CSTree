# CSTree — AI Agent 开发规范

## 概述

本文档定义 CSTree 项目中 AI 辅助开发的行为准则。所有 AI Agent（Claude Code、GitHub Copilot 等）应遵循此规范以保证代码质量和项目一致性。

---

## 1. 核心原则

### 1.1 内容优先
- 本项目本质是内容网站，代码服务于内容呈现
- 优先保证内容的准确性、可读性和结构完整性
- 交互效果（树图、动画）是增强手段，不是核心

### 1.2 知识完整性
- 每创建/修改一个知识节点，必须确保其 `parent`/`children`/`related`/`prerequisites` 关系正确
- 引用其他节点时使用 `[[node-id]]` 语法
- 必须验证所有引用指向存在的节点

### 1.3 自底向上
- 知识组织结构遵循从底层到上层的顺序：硬件 → 汇编 → 操作系统 → 编译器 → 高级语言 → 网络 → 数据库
- 前置知识必须在前，进阶知识在后

---

## 2. 开发流程

### 2.1 一个典型的工作会话

1. **理解任务**：明确要做什么（添加节点、修改内容、实现功能）
2. **参考设计**：阅读 `doc/CSTree-知识树设计方案.md` 了解架构
3. **检查现有内容**：查看相关节点是否已有内容
4. **执行修改**：按规范修改代码或内容
5. **验证**：`npm run build` 确认构建通过，无死链接

### 2.2 修改步骤要求

- 修改内容或代码前先归档方案/计划
- 修改后验证构建通过
- 提交信息格式：`type(scope): description`（如 `feat(node): add logic-gates node`）

---

## 3. 知识节点编写规范

### 3.1 Frontmatter 规范

每个知识节点的 `.md` 文件必须包含完整的 frontmatter：

```yaml
---
id: unique-node-id          # 全局唯一，kebab-case
title: 节点标题             # 中文标题
summary: 一句话摘要         # 用于卡片显示和 SEO
difficulty: beginner        # beginner | intermediate | advanced
order: 1                    # 同级节点的学习顺序
parent: parent-node-id      # 父节点 ID，根节点为 null 或不填
children: []               # 子节点 ID 列表
related: []                # 关联节点 ID 列表（跨分支）
prerequisites: []          # 前置知识节点 ID 列表
tags: []                   # 标签，用于分类和搜索
createdAt: 2026-06-11      # 创建日期
updatedAt: 2026-06-11      # 更新日期
---
```

### 3.2 内容规范

- 使用 Markdown 格式
- 一级标题 `#` 由 Astro 自动生成，正文从 `##` 开始
- 引用其他节点时使用 `[[node-id|显示文字]]`
- 代码块标注语言：` ```python` / ` ```c` / ` ```assembly`
- 图片放入 `public/images/`，使用 `![描述](/images/xxx.png)` 引用
- 尽量用表格、列表、代码示例等结构化方式呈现知识

### 3.3 难度分级

| 级别 | 标签 | 适用内容 |
|------|------|----------|
| `beginner` | 入门 | 基本概念、无需前置知识 |
| `intermediate` | 进阶 | 需要1-2个前置知识节点 |
| `advanced` | 高级 | 需要多个前置知识节点，涉及复杂主题 |

---

## 4. 代码修改规范

### 4.1 Astro 组件

- 使用 `export interface Props` 定义组件属性
- 尽量用纯 HTML/CSS 实现功能
- 只有交互需求（树图、搜索）才使用 React Island
- 组件文件名使用 PascalCase

### 4.2 样式

- 使用 TailwindCSS 原子类
- 全局样式在 `src/styles/global.css` 中定义
- 暗色模式使用 `dark:` 前缀
- 知识点内容样式使用 `.knowledge-content` 作用域类

### 4.3 内容集合

- 所有知识节点在 `src/content/node/` 目录下
- 子目录按主题分组（`00-hardware/`、`01-assembly/` 等）
- 文件命名：`序号-节点id.md`（如 `01-binary-numbers.md`）
- 修改 `src/content/config.ts` 中的 schema 需同步更新所有节点的 frontmatter

### 4.4 Remark 插件

- 插件放在 `src/plugins/` 目录下
- 每个插件必须有完整的 TypeScript 类型定义
- 构建时错误必须让构建失败（throw / exit code 1）

---

## 5. 质量要求

### 5.1 构建必须通过

- `npm run build` 必须成功
- 任何死链接（无效的 `[[node-id]]`）导致构建失败
- 任何无效的 `parent`/`children`/`related` 引用导致构建失败

### 5.2 知识准确性

- Agent 必须对自己创建的内容负责
- 涉及具体技术细节时，应验证信息的准确性
- 有歧义的内容应添加注释或备注

### 5.3 代理行为限制

- 不自动修改未指定的内容
- 不删除已有节点（除非明确要求）
- 不修改 `content/config.ts` 中的 schema 除非与其他修改配套

---

## 6. Git 规范

### 6.1 分支策略

- `master`：稳定版本，可直接部署
- `dev`：开发分支
- `feature/*`：功能分支
- `content/*`：内容分支

### 6.2 提交信息

```
feat(node): add boolean-algebra node
feat(plugin): implement wiki-link remark plugin
fix(style): correct dark mode contrast
docs(readme): update project description
chore(deps): update astro to v4.16
```

---

## 7. 内容写作指南

### 7.1 目标读者

- "小白"：零基础或几乎没有计算机专业知识
- 但具备基本的数学和逻辑思维能力
- 高中生或大学低年级水平

### 7.2 写作风格

- 用通俗语言解释概念，避免不必要的学术术语
- 用类比帮助理解（如：运算器就像算盘，存储器就像便签纸）
- 每个概念都从"为什么需要这个"开始
- 每个节点末尾有"小结"，概括核心要点
- 控制在 5-10 分钟能读完的量

### 7.3 中文技术写作约定

- 中英文之间加空格（如"使用 CPU 进行计算"）
- 数字与单位之间加空格（如"8 bit"）
- 技术术语首次出现时标注英文原名（如"中央处理器（CPU）"）
- 代码/变量名使用等宽字体
