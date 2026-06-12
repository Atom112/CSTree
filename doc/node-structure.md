# CSTree 知识节点结构树

> 本文档记录了所有知识节点的树状层级结构，供 Agent 添加新节点时确定位置。
> **添加新节点后必须同步更新本文档。**

---

## 目录概览

```
src/content/node/
├── 00-hardware/        # 硬件方向（已有 28 个节点）
├── 01-assembly/        # 汇编方向（已有 14 个节点）
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
              ├── cache-memory (缓存) [advanced]
              │     id: cache-memory | order: 18 | parent: logic-gates
              │     prerequisites: ram
              └── cpu-datapath (CPU数据通路) [advanced]
                    id: cpu-datapath | order: 19 | parent: logic-gates
                    prerequisites: alu, register, counter
                    └── control-unit (控制单元) [advanced]
                          id: control-unit | order: 20 | parent: cpu-datapath
                          prerequisites: cpu-datapath
                          ├── instruction-pipeline (指令流水线) [advanced]
                          │     id: instruction-pipeline | order: 21 | parent: control-unit
                          │     prerequisites: control-unit
                          │     └── modern-cpu-architecture (现代CPU架构) [advanced]
                          │           id: modern-cpu-architecture | order: 25 | parent: instruction-pipeline
                          │           prerequisites: instruction-pipeline, cache-memory, risc-vs-cisc
                          ├── risc-vs-cisc (RISC vs CISC) [advanced]
                          │     id: risc-vs-cisc | order: 22 | parent: control-unit
                          │     prerequisites: isa-overview, control-unit
                          └── interrupts-exceptions (中断与异常) [advanced]
                                id: interrupts-exceptions | order: 23 | parent: control-unit
                                prerequisites: control-unit, stack-frames
                                └── io-interface (I/O接口) [advanced]
                                      id: io-interface | order: 24 | parent: interrupts-exceptions
                                      prerequisites: interrupts-exceptions
```

### 01-assembly — 汇编方向

```
machine-code (机器码与指令编码) [intermediate]
  id: machine-code | order: 1 | parent: 无
  prerequisites: binary-numbers, logic-gates
  └── isa-overview (指令集架构概述) [intermediate]
        id: isa-overview | order: 2 | parent: machine-code
        prerequisites: machine-code
        └── addressing-modes (寻址方式) [intermediate]
              id: addressing-modes | order: 3 | parent: isa-overview
              prerequisites: isa-overview
              └── data-transfer-instructions (数据传送指令) [intermediate]
                    id: data-transfer-instructions | order: 4 | parent: addressing-modes
                    prerequisites: addressing-modes
                    ├── arithmetic-logic-instructions (算术与逻辑指令) [intermediate]
                          id: arithmetic-logic-instructions | order: 5 | parent: data-transfer-instructions
                          prerequisites: data-transfer-instructions
                          ├── flags-condition-codes (标志位与条件码) [intermediate]
                          │     id: flags-condition-codes | order: 6 | parent: arithmetic-logic-instructions
                          │     prerequisites: arithmetic-logic-instructions
                          │     └── branch-jump-instructions (分支与跳转指令) [intermediate]
                          │           id: branch-jump-instructions | order: 7 | parent: flags-condition-codes
                          │           prerequisites: flags-condition-codes
                          │           └── stack-frames (栈帧与函数调用约定) [advanced]
                          │                 id: stack-frames | order: 8 | parent: branch-jump-instructions
                          │                 prerequisites: branch-jump-instructions
                          │                 └── parameter-passing (参数传递) [advanced]
                          │                       id: parameter-passing | order: 9 | parent: stack-frames
                          │                       prerequisites: stack-frames
                          │                       └── recursion-assembly (递归的汇编实现) [advanced]
                          │                             id: recursion-assembly | order: 10 | parent: parameter-passing
                          │                             prerequisites: parameter-passing
                          │                             └── inline-assembly (内联汇编与C混合编程) [advanced]
                          │                                   id: inline-assembly | order: 11 | parent: recursion-assembly
                          │                                   prerequisites: recursion-assembly
                          │                                   └── disassembly-debugging (反汇编与调试) [advanced]
                          │                                         id: disassembly-debugging | order: 12 | parent: inline-assembly
                          │                                         prerequisites: inline-assembly
                          │                                         └── buffer-overflow (缓冲区溢出与安全) [advanced]
                          │                                               id: buffer-overflow | order: 13 | parent: disassembly-debugging
                          │                                               prerequisites: disassembly-debugging, stack-frames
                          └── simd-instructions (SIMD / 向量指令) [advanced]
                                id: simd-instructions | order: 14 | parent: arithmetic-logic-instructions
                                prerequisites: arithmetic-logic-instructions
```

### 02-os — 操作系统方向

```
os-history (操作系统的作用与历史) [beginner]
  id: os-history | order: 1 | parent: 无
  prerequisites: 无
  └── system-calls (系统调用与内核态/用户态) [intermediate]
        id: system-calls | order: 2 | parent: os-history
        prerequisites: os-history
        ├── process-concept (进程的概念与状态转换) [intermediate]
        │     id: process-concept | order: 3 | parent: system-calls
        │     prerequisites: system-calls
        │     ├── process-scheduling (进程调度算法) [intermediate]
        │     │     id: process-scheduling | order: 4 | parent: process-concept
        │     │     prerequisites: process-concept
        │     ├── threads (线程与多线程) [intermediate]
        │     │     id: threads | order: 5 | parent: process-concept
        │     │     prerequisites: process-concept
        │     │     └── race-condition (竞争条件与临界区) [intermediate]
        │     │           id: race-condition | order: 7 | parent: threads
        │     │           prerequisites: threads
        │     │           └── mutex-semaphore (互斥锁与信号量) [advanced]
        │     │                 id: mutex-semaphore | order: 8 | parent: race-condition
        │     │                 prerequisites: race-condition
        │     │                 ├── classic-sync-problems (经典同步问题) [advanced]
        │     │                 │     id: classic-sync-problems | order: 9 | parent: mutex-semaphore
        │     │                 │     prerequisites: mutex-semaphore
        │     │                 └── deadlock (死锁) [advanced]
        │     │                       id: deadlock | order: 10 | parent: mutex-semaphore
        │     │                       prerequisites: mutex-semaphore
        │     └── context-switch (上下文切换) [intermediate]
        │           id: context-switch | order: 6 | parent: process-concept
        │           prerequisites: process-concept
        ├── memory-address-space (内存地址空间) [intermediate]
        │     id: memory-address-space | order: 11 | parent: system-calls
        │     prerequisites: system-calls
        │     └── paging (分页与页表) [advanced]
        │           id: paging | order: 12 | parent: memory-address-space
        │           prerequisites: memory-address-space
        │           ├── virtual-memory (虚拟内存与页面置换) [advanced]
        │           │     id: virtual-memory | order: 13 | parent: paging
        │           │     prerequisites: paging
        │           └── tlb (TLB 与内存映射) [advanced]
        │                 id: tlb | order: 14 | parent: paging
        │                 prerequisites: paging
        └── file-system-interface (文件系统接口与实现) [intermediate]
              id: file-system-interface | order: 15 | parent: system-calls
              prerequisites: system-calls
              └── directory-structure (目录结构与文件分配) [intermediate]
                    id: directory-structure | order: 16 | parent: file-system-interface
                    prerequisites: file-system-interface
                    └── disk-scheduling (磁盘调度) [advanced]
                          id: disk-scheduling | order: 17 | parent: directory-structure
                          prerequisites: directory-structure

interrupts-exceptions (中断与异常，来自硬件)
  └── io-drivers (I/O 硬件与驱动模型) [intermediate]
        id: io-drivers | order: 18 | parent: interrupts-exceptions
        prerequisites: interrupts-exceptions
        └── interrupt-handling (中断处理) [advanced]
              id: interrupt-handling | order: 19 | parent: io-drivers
              prerequisites: io-drivers
              └── dma (DMA 直接存储器访问) [advanced]
                    id: dma | order: 20 | parent: interrupt-handling
                    prerequisites: interrupt-handling
```

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
| 21 | `cache-memory` | 缓存 | advanced | logic-gates | 0 | ram |
| 22 | `cpu-datapath` | CPU数据通路 | advanced | logic-gates | 1 | alu, register, counter |
| 23 | `control-unit` | 控制单元 | advanced | cpu-datapath | 3 | cpu-datapath |
| 24 | `instruction-pipeline` | 指令流水线 | advanced | control-unit | 1 | control-unit |
| 25 | `risc-vs-cisc` | RISC vs CISC | advanced | control-unit | 0 | isa-overview, control-unit |
| 26 | `interrupts-exceptions` | 中断与异常 | advanced | control-unit | 1 | control-unit, stack-frames |
| 27 | `io-interface` | I/O接口 | advanced | interrupts-exceptions | 0 | interrupts-exceptions |
| 28 | `modern-cpu-architecture` | 现代CPU架构 | advanced | instruction-pipeline | 0 | instruction-pipeline, cache-memory, risc-vs-cisc |
| 29 | `machine-code` | 机器码与指令编码 | intermediate | — | 0 | binary-numbers, logic-gates |
| 30 | `isa-overview` | 指令集架构概述 | intermediate | machine-code | 0 | machine-code |
| 31 | `addressing-modes` | 寻址方式 | intermediate | isa-overview | 0 | isa-overview |
| 32 | `data-transfer-instructions` | 数据传送指令 | intermediate | addressing-modes | 0 | addressing-modes |
| 33 | `arithmetic-logic-instructions` | 算术与逻辑指令 | intermediate | data-transfer-instructions | 1 | data-transfer-instructions |
| 34 | `flags-condition-codes` | 标志位与条件码 | intermediate | arithmetic-logic-instructions | 0 | arithmetic-logic-instructions |
| 35 | `branch-jump-instructions` | 分支与跳转指令 | intermediate | flags-condition-codes | 1 | flags-condition-codes |
| 36 | `stack-frames` | 栈帧与函数调用约定 | advanced | branch-jump-instructions | 1 | branch-jump-instructions |
| 37 | `parameter-passing` | 参数传递 | advanced | stack-frames | 1 | stack-frames |
| 38 | `recursion-assembly` | 递归的汇编实现 | advanced | parameter-passing | 1 | parameter-passing |
| 39 | `inline-assembly` | 内联汇编与C混合编程 | advanced | recursion-assembly | 1 | recursion-assembly |
| 40 | `disassembly-debugging` | 反汇编与调试 | advanced | inline-assembly | 1 | inline-assembly |
| 41 | `buffer-overflow` | 缓冲区溢出与安全 | advanced | disassembly-debugging | 0 | disassembly-debugging, stack-frames |
| 42 | `simd-instructions` | SIMD/向量指令 | advanced | arithmetic-logic-instructions | 0 | arithmetic-logic-instructions |
| 43 | `os-history` | 操作系统的作用与历史 | beginner | — | 1 | — |
| 44 | `system-calls` | 系统调用与内核态/用户态 | intermediate | os-history | 3 | os-history |
| 45 | `process-concept` | 进程的概念与状态转换 | intermediate | system-calls | 3 | system-calls |
| 46 | `process-scheduling` | 进程调度算法 | intermediate | process-concept | 0 | process-concept |
| 47 | `threads` | 线程与多线程 | intermediate | process-concept | 1 | process-concept |
| 48 | `context-switch` | 上下文切换 | intermediate | process-concept | 0 | process-concept |
| 49 | `race-condition` | 竞争条件与临界区 | intermediate | threads | 1 | threads |
| 50 | `mutex-semaphore` | 互斥锁与信号量 | advanced | race-condition | 2 | race-condition |
| 51 | `classic-sync-problems` | 经典同步问题 | advanced | mutex-semaphore | 0 | mutex-semaphore |
| 52 | `deadlock` | 死锁 | advanced | mutex-semaphore | 0 | mutex-semaphore |
| 53 | `memory-address-space` | 内存地址空间（逻辑 vs 物理） | intermediate | system-calls | 1 | system-calls |
| 54 | `paging` | 分页与页表 | advanced | memory-address-space | 2 | memory-address-space |
| 55 | `virtual-memory` | 虚拟内存与页面置换 | advanced | paging | 0 | paging |
| 56 | `tlb` | TLB 与内存映射 | advanced | paging | 0 | paging |
| 57 | `file-system-interface` | 文件系统接口与实现 | intermediate | system-calls | 1 | system-calls |
| 58 | `directory-structure` | 目录结构与文件分配 | intermediate | file-system-interface | 1 | file-system-interface |
| 59 | `disk-scheduling` | 磁盘调度 | advanced | directory-structure | 0 | directory-structure |
| 60 | `io-drivers` | I/O 硬件与驱动模型 | intermediate | interrupts-exceptions | 1 | interrupts-exceptions |
| 61 | `interrupt-handling` | 中断处理 | advanced | io-drivers | 1 | io-drivers |
| 62 | `dma` | DMA（直接存储器访问） | advanced | interrupt-handling | 0 | interrupt-handling |

---

## 添加新节点规则

1. **确定所属方向**：根据主题放入 `00-hardware/` 至 `05-databases/` 对应目录
2. **文件命名**：使用 `NN-kebab-case-id.md` 格式，`NN` 为两位数字序号
3. **填写 frontmatter**：参考现有节点，确保 `parent`/`children`/`prerequisites`/`related` 中引用的 ID 都存在
4. **更新本文档**：在对应方向下添加新节点到树结构中
5. **保持一致性**：文件编号按 `order` 字段排序，与树中位置一致
