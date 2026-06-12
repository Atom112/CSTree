# CSTree 知识节点结构树

> 本文档记录了所有知识节点的树状层级结构，供 Agent 添加新节点时确定位置。
> **添加新节点后必须同步更新本文档。**

---

## 目录概览

```
src/content/node/
├── 00-hardware/        # 硬件方向（已有 20 个节点）
├── 01-assembly/        # 汇编方向（待添加）
├── 02-os/              # 操作系统方向（待添加）
├── 03-compilers/       # 编译器方向（待添加）
├── 04-networking/      # 网络方向（待添加）
└── 05-databases/       # 数据库方向（待添加）
```

---

## 完整树结构

### 00-hardware — 硬件方向

```
binary-numbers (二进制数字) [beginner]
  id: binary-numbers | order: 1 | parent: 无
  └── boolean-algebra (布尔代数) [beginner]
        id: boolean-algebra | order: 2 | parent: binary-numbers
        prerequisites: binary-numbers
        └── logic-gates (逻辑门) [beginner]
              id: logic-gates | order: 3 | parent: boolean-algebra
              prerequisites: boolean-algebra
              ├── and-gate (与门) [beginner]
              │     id: and-gate | order: 1 | parent: logic-gates
              │     prerequisites: logic-gates
              ├── or-gate (或门) [beginner]
              │     id: or-gate | order: 2 | parent: logic-gates
              │     prerequisites: logic-gates
              ├── not-gate (非门) [beginner]
              │     id: not-gate | order: 3 | parent: logic-gates
              │     prerequisites: logic-gates
              ├── half-adder (半加器) [intermediate]
              │     id: half-adder | order: 4 | parent: logic-gates
              │     prerequisites: and-gate, or-gate
              ├── full-adder (全加器) [intermediate]
              │     id: full-adder | order: 5 | parent: logic-gates
              │     prerequisites: half-adder
              ├── sr-latch (SR锁存器) [intermediate]
              │     id: sr-latch | order: 6 | parent: logic-gates
              │     prerequisites: not-gate
              ├── d-flipflop (D触发器) [intermediate]
              │     id: d-flipflop | order: 7 | parent: logic-gates
              │     prerequisites: sr-latch
              ├── register (寄存器) [intermediate]
              │     id: register | order: 8 | parent: logic-gates
              │     prerequisites: d-flipflop
              ├── counter (计数器) [intermediate]
              │     id: counter | order: 9 | parent: logic-gates
              │     prerequisites: d-flipflop
              ├── ram (随机存取存储器) [intermediate]
              │     id: ram | order: 10 | parent: logic-gates
              │     prerequisites: register
              ├── alu (算术逻辑单元) [intermediate]
              │     id: alu | order: 11 | parent: logic-gates
              │     prerequisites: full-adder, logic-gates
              ├── decoder-encoder (译码器与编码器) [intermediate]
              │     id: decoder-encoder | order: 12 | parent: logic-gates
              │     prerequisites: and-gate, or-gate, not-gate
              ├── multiplexer (多路选择器) [intermediate]
              │     id: multiplexer | order: 13 | parent: logic-gates
              │     prerequisites: and-gate, or-gate, not-gate
              ├── finite-state-machine (有限状态机) [advanced]
              │     id: finite-state-machine | order: 14 | parent: logic-gates
              │     prerequisites: d-flipflop, decoder-encoder
              ├── comparator (比较器) [intermediate]
              │     id: comparator | order: 15 | parent: logic-gates
              │     prerequisites: and-gate, or-gate, not-gate
              ├── jk-t-flipflop (JK触发器与T触发器) [intermediate]
              │     id: jk-t-flipflop | order: 16 | parent: logic-gates
              │     prerequisites: sr-latch, d-flipflop
              └── rom-flash (只读存储器与闪存) [intermediate]
                    id: rom-flash | order: 17 | parent: logic-gates
                    prerequisites: ram
```

### 01-assembly — 汇编方向

> ⬜ 暂无节点，等待添加

### 02-os — 操作系统方向

> ⬜ 暂无节点，等待添加

### 03-compilers — 编译器方向

> ⬜ 暂无节点，等待添加

### 04-networking — 网络方向

> ⬜ 暂无节点，等待添加

### 05-databases — 数据库方向

> ⬜ 暂无节点，等待添加

---

## 节点详细列表

| # | ID | 标题 | 难度 | 父节点 | 子节点数 | 前置知识 |
|---|-----|------|------|--------|----------|----------|
| 1 | `binary-numbers` | 二进制数字 | beginner | — | 1 | — |
| 2 | `boolean-algebra` | 布尔代数 | beginner | binary-numbers | 1 | binary-numbers |
| 3 | `logic-gates` | 逻辑门 | beginner | boolean-algebra | 17 | boolean-algebra |
| 4 | `and-gate` | 与门 | beginner | logic-gates | 0 | logic-gates |
| 5 | `or-gate` | 或门 | beginner | logic-gates | 0 | logic-gates |
| 6 | `not-gate` | 非门 | beginner | logic-gates | 0 | logic-gates |
| 7 | `half-adder` | 半加器 | intermediate | logic-gates | 0 | and-gate, or-gate |
| 8 | `full-adder` | 全加器 | intermediate | logic-gates | 0 | half-adder |
| 9 | `sr-latch` | SR锁存器 | intermediate | logic-gates | 0 | not-gate |
| 10 | `d-flipflop` | D触发器 | intermediate | logic-gates | 0 | sr-latch |
| 11 | `register` | 寄存器 | intermediate | logic-gates | 0 | d-flipflop |
| 12 | `counter` | 计数器 | intermediate | logic-gates | 0 | d-flipflop |
| 13 | `ram` | 随机存取存储器 | intermediate | logic-gates | 0 | register |
| 14 | `alu` | 算术逻辑单元 | intermediate | logic-gates | 0 | full-adder, logic-gates |
| 15 | `decoder-encoder` | 译码器与编码器 | intermediate | logic-gates | 0 | and-gate, or-gate, not-gate |
| 16 | `multiplexer` | 多路选择器 | intermediate | logic-gates | 0 | and-gate, or-gate, not-gate |
| 17 | `finite-state-machine` | 有限状态机 | advanced | logic-gates | 0 | d-flipflop, decoder-encoder |
| 18 | `comparator` | 比较器 | intermediate | logic-gates | 0 | and-gate, or-gate, not-gate |
| 19 | `jk-t-flipflop` | JK触发器与T触发器 | intermediate | logic-gates | 0 | sr-latch, d-flipflop |
| 20 | `rom-flash` | 只读存储器与闪存 | intermediate | logic-gates | 0 | ram |

---

## 添加新节点规则

1. **确定所属方向**：根据主题放入 `00-hardware/` 至 `05-databases/` 对应目录
2. **文件命名**：使用 `NN-kebab-case-id.md` 格式，`NN` 为两位数字序号
3. **填写 frontmatter**：参考现有节点，确保 `parent`/`children`/`prerequisites`/`related` 中引用的 ID 都存在
4. **更新本文档**：在对应方向下添加新节点到树结构中
5. **保持一致性**：文件编号按 `order` 字段排序，与树中位置一致
