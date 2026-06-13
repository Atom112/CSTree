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

```
database-overview (数据库系统概述) [beginner]
  id: database-overview | order: 1 | parent: 无
  prerequisites: file-system-interface
  ├── er-model (实体关系模型) [intermediate]
  │     id: er-model | order: 2 | parent: database-overview
  │     prerequisites: database-overview
  │     └── relational-model (关系模型与关系代数) [intermediate]
  │           id: relational-model | order: 3 | parent: er-model
  │           prerequisites: er-model
  │           └── sql-basics (SQL基础) [intermediate]
  │                 id: sql-basics | order: 4 | parent: relational-model
  │                 prerequisites: relational-model
  │                 ├── sql-joins (连接查询与子查询) [intermediate]
  │                 │     id: sql-joins | order: 5 | parent: sql-basics
  │                 │     prerequisites: sql-basics
  │                 └── sql-advanced (视图、索引与事务) [intermediate]
  │                       id: sql-advanced | order: 6 | parent: sql-basics
  │                       prerequisites: sql-basics
  │                       └── acid (ACID特性) [advanced]
  │                             id: acid | order: 13 | parent: sql-advanced
  │                             prerequisites: sql-advanced
  │                             ├── isolation-levels (事务隔离级别) [advanced]
  │                             │     id: isolation-levels | order: 14 | parent: acid
  │                             │     prerequisites: acid
  │                             ├── lock-concurrency (锁协议与并发控制) [advanced]
  │                             │     id: lock-concurrency | order: 15 | parent: acid
  │                             │     prerequisites: acid
  │                             └── logging-recovery (日志与恢复) [advanced]
  │                                   id: logging-recovery | order: 16 | parent: acid
  │                                   prerequisites: acid
  ├── functional-dependency (函数依赖) [advanced]
  │     id: functional-dependency | order: 7 | parent: database-overview
  │     prerequisites: database-overview
  │     └── normalization (范式 1NF ~ BCNF) [advanced]
  │           id: normalization | order: 8 | parent: functional-dependency
  │           prerequisites: functional-dependency
  │           └── denormalization (规范化与反规范化) [advanced]
  │                 id: denormalization | order: 9 | parent: normalization
  │                 prerequisites: normalization
  ├── b-plus-tree (B+树索引) [advanced]
  │     id: b-plus-tree | order: 10 | parent: database-overview
  │     prerequisites: database-overview
  ├── hash-index (哈希索引) [advanced]
  │     id: hash-index | order: 11 | parent: database-overview
  │     prerequisites: database-overview
  ├── query-optimization (查询执行与优化) [advanced]
  │     id: query-optimization | order: 12 | parent: database-overview
  │     prerequisites: sql-basics, b-plus-tree
  └── nosql-databases (NoSQL数据库概述) [intermediate]
        id: nosql-databases | order: 17 | parent: database-overview
        prerequisites: database-overview
```

### 06-algorithms — 算法与数据结构方向

```
array-linked-list (数组与链表) [beginner]
  id: array-linked-list | order: 1 | parent: 无
  prerequisites: 无
  ├── stack-queue (栈与队列) [beginner]
  │     id: stack-queue | order: 2 | parent: array-linked-list
  │     prerequisites: array-linked-list
  │     ├── hash-table (哈希表) [intermediate]
  │     │     id: hash-table | order: 3 | parent: stack-queue
  │     │     prerequisites: array-linked-list
  │     │     └── binary-tree (二叉树与遍历) [intermediate]
  │     │           id: binary-tree | order: 4 | parent: hash-table
  │     │           prerequisites: stack-queue
  │     │           ├── binary-search-tree (二叉搜索树) [intermediate]
  │     │           │     id: binary-search-tree | order: 5 | parent: binary-tree
  │     │           │     prerequisites: binary-tree
  │     │           │     ├── heap (堆与优先队列) [intermediate]
  │     │           │     │     id: heap | order: 6 | parent: binary-search-tree
  │     │           │     │     prerequisites: binary-tree
  │     │           │     │     └── advanced-sort (高级排序) [intermediate]
  │     │           │     │           id: advanced-sort | order: 13 | parent: heap
  │     │           │     │           prerequisites: heap
  │     │           │     └── balanced-tree (平衡树 AVL/红黑树) [advanced]
  │     │           │           id: balanced-tree | order: 7 | parent: binary-search-tree
  │     │           │           prerequisites: binary-search-tree
  │     │           └── graph-representation (图的表示) [intermediate]
  │     │                 id: graph-representation | order: 8 | parent: binary-tree
  │     │                 prerequisites: array-linked-list
  │     │                 └── dfs-bfs (DFS / BFS) [intermediate]
  │     │                       id: dfs-bfs | order: 9 | parent: graph-representation
  │     │                       prerequisites: stack-queue, graph-representation
  │     │                       ├── shortest-path (最短路径 Dijkstra/Floyd) [advanced]
  │     │                       │     id: shortest-path | order: 10 | parent: dfs-bfs
  │     │                       │     prerequisites: dfs-bfs
  │     │                       └── minimum-spanning-tree (最小生成树 Kruskal/Prim) [advanced]
  │     │                             id: minimum-spanning-tree | order: 11 | parent: dfs-bfs
  │     │                             prerequisites: dfs-bfs
  │     └── recursion-divide-conquer (递归与分治) [intermediate]
  │           id: recursion-divide-conquer | order: 15 | parent: stack-queue
  │           prerequisites: stack-queue
  │           ├── dynamic-programming (动态规划) [advanced]
  │           │     id: dynamic-programming | order: 16 | parent: recursion-divide-conquer
  │           │     prerequisites: recursion-divide-conquer
  │           ├── greedy (贪心算法) [advanced]
  │           │     id: greedy | order: 17 | parent: recursion-divide-conquer
  │           │     prerequisites: recursion-divide-conquer
  │           ├── backtracking (回溯与剪枝) [advanced]
  │           │     id: backtracking | order: 18 | parent: recursion-divide-conquer
  │           │     prerequisites: recursion-divide-conquer
  ├── basic-sort (基础排序 插入/选择/冒泡) [beginner]
  │     id: basic-sort | order: 12 | parent: array-linked-list
  │     prerequisites: array-linked-list
  ├── binary-search (二分搜索) [beginner]
  │     id: binary-search | order: 14 | parent: array-linked-list
  │     prerequisites: array-linked-list
  ├── big-o-notation (时间复杂度与大 O) [intermediate]
  │     id: big-o-notation | order: 19 | parent: recursion-divide-conquer
  │     prerequisites: recursion-divide-conquer
  │     └── p-vs-np (P vs NP 简述) [advanced]
  │           id: p-vs-np | order: 20 | parent: big-o-notation
  │           prerequisites: big-o-notation
```

### 07-programming-languages — 程序语言理论方向

```
programming-paradigms (编程语言范式概述) [beginner]
  id: programming-paradigms | order: 1 | parent: 无
  prerequisites: 无
  ├── variable-scope (变量、作用域与绑定) [intermediate]
  │     id: variable-scope | order: 2 | parent: programming-paradigms
  │     prerequisites: programming-paradigms
  │     └── evaluation-strategies (求值策略) [intermediate]
  │           id: evaluation-strategies | order: 3 | parent: variable-scope
  │           prerequisites: variable-scope
  │           ├── lambda-calculus (Lambda演算基础) [advanced]
  │           │     id: lambda-calculus | order: 5 | parent: evaluation-strategies
  │           │     prerequisites: evaluation-strategies
  │           └── garbage-collection (垃圾回收机制) [advanced]
  │                 id: garbage-collection | order: 12 | parent: evaluation-strategies
  │                 prerequisites: evaluation-strategies
  │                 └── concurrency-models (并发编程模型) [advanced]
  │                       id: concurrency-models | order: 13 | parent: garbage-collection
  │                       prerequisites: garbage-collection
  ├── higher-order-functions (高阶函数与闭包) [intermediate]
  │     id: higher-order-functions | order: 4 | parent: programming-paradigms
  │     prerequisites: programming-paradigms
  │     └── algebraic-data-types (代数数据类型与模式匹配) [intermediate]
  │           id: algebraic-data-types | order: 6 | parent: higher-order-functions
  │           prerequisites: higher-order-functions
  │           └── lazy-evaluation (惰性求值与无穷数据结构) [advanced]
  │                 id: lazy-evaluation | order: 7 | parent: algebraic-data-types
  │                 prerequisites: algebraic-data-types
  ├── static-vs-dynamic (静态vs动态类型) [intermediate]
  │     id: static-vs-dynamic | order: 8 | parent: programming-paradigms
  │     prerequisites: programming-paradigms
  │     ├── type-inference (类型推导与多态) [advanced]
  │     │     id: type-inference | order: 9 | parent: static-vs-dynamic
  │     │     prerequisites: static-vs-dynamic
  │     └── subtyping (子类型与变型) [advanced]
  │           id: subtyping | order: 10 | parent: static-vs-dynamic
  │           prerequisites: static-vs-dynamic
  ├── operational-semantics (操作语义) [advanced]
  │     id: operational-semantics | order: 11 | parent: programming-paradigms
  │     prerequisites: programming-paradigms
  └── domain-specific-languages (领域特定语言) [advanced]
        id: domain-specific-languages | order: 14 | parent: programming-paradigms
        prerequisites: programming-paradigms
```

### 08-software-eng — 软件工程方向

```
software-lifecycle (软件生命周期与过程模型) [beginner]
  id: software-lifecycle | order: 1 | parent: 无
  prerequisites: 无
  ├── agile-scrum (敏捷开发与Scrum) [beginner]
  │     id: agile-scrum | order: 2 | parent: software-lifecycle
  │     prerequisites: software-lifecycle
  │     └── version-control (版本控制 Git) [beginner]
  │           id: version-control | order: 3 | parent: agile-scrum
  │           prerequisites: agile-scrum
  ├── requirements-analysis (需求获取与分析) [intermediate]
  │     id: requirements-analysis | order: 4 | parent: software-lifecycle
  │     prerequisites: software-lifecycle
  │     └── software-architecture (软件架构与设计模式) [advanced]
  │           id: software-architecture | order: 5 | parent: requirements-analysis
  │           prerequisites: requirements-analysis
  │           ├── uml-modeling (UML建模) [intermediate]
  │           │     id: uml-modeling | order: 6 | parent: software-architecture
  │           │     prerequisites: software-architecture
  │           └── solid-principles (SOLID原则) [intermediate]
  │                 id: solid-principles | order: 7 | parent: software-architecture
  │                 prerequisites: software-architecture
  │                 └── software-testing (软件测试) [intermediate]
  │                       id: software-testing | order: 8 | parent: solid-principles
  │                       prerequisites: solid-principles
  │                       └── ci-cd (CI/CD与DevOps) [intermediate]
  │                             id: ci-cd | order: 9 | parent: software-testing
  │                             prerequisites: software-testing, version-control
  │                             └── code-review (代码审查与重构) [intermediate]
  │                                   id: code-review | order: 10 | parent: ci-cd
  │                                   prerequisites: ci-cd
  ├── api-design (API设计与REST) [intermediate]
  │     id: api-design | order: 11 | parent: software-lifecycle
  │     prerequisites: software-lifecycle
  │     └── database-orm (数据库设计与ORM) [intermediate]
  │           id: database-orm | order: 12 | parent: api-design
  │           prerequisites: api-design
  ├── security-coding (安全编程实践) [advanced]
  │     id: security-coding | order: 13 | parent: software-lifecycle
  │     prerequisites: software-lifecycle
  │     └── performance-tuning (性能分析与调优) [advanced]
  │           id: performance-tuning | order: 14 | parent: security-coding
  │           prerequisites: security-coding
```

### 10-cryptography — 密码学方向

```
classical-ciphers (古典密码 凯撒、维吉尼亚) [intermediate]
  id: classical-ciphers | order: 1 | parent: 无
  prerequisites: 无
  └── symmetric-crypto (对称加密 AES/DES) [advanced]
        id: symmetric-crypto | order: 2 | parent: classical-ciphers
        prerequisites: classical-ciphers
        └── public-key-crypto (公钥密码 RSA/ECC) [advanced]
              id: public-key-crypto | order: 3 | parent: symmetric-crypto
              prerequisites: symmetric-crypto
              ├── hash-functions (哈希函数 SHA/MD) [advanced]
              │     id: hash-functions | order: 4 | parent: public-key-crypto
              │     prerequisites: public-key-crypto
              ├── digital-signatures (数字签名与证书) [advanced]
              │     id: digital-signatures | order: 5 | parent: public-key-crypto
              │     prerequisites: public-key-crypto
              ├── crypto-protocols (密码协议 SSL/TLS) [advanced]
              │     id: crypto-protocols | order: 6 | parent: public-key-crypto
              │     prerequisites: public-key-crypto
              ├── zero-knowledge-proofs (零知识证明) [advanced]
              │     id: zero-knowledge-proofs | order: 7 | parent: public-key-crypto
              │     prerequisites: public-key-crypto
              ├── quantum-cryptography (量子密码学) [advanced]
              │     id: quantum-cryptography | order: 8 | parent: public-key-crypto
              │     prerequisites: public-key-crypto
              └── cryptanalysis (密码分析) [advanced]
                    id: cryptanalysis | order: 9 | parent: quantum-cryptography
                    prerequisites: classical-ciphers, symmetric-crypto
```

### 11-computer-graphics — 计算机图形学方向

```
2d-3d-transforms (2D/3D变换与齐次坐标) [intermediate]
  id: 2d-3d-transforms | order: 1 | parent: 无
  prerequisites: 无
  └── graphics-pipeline (光栅化管线) [advanced]
        id: graphics-pipeline | order: 2 | parent: 2d-3d-transforms
        prerequisites: 2d-3d-transforms
        ├── rasterization-depth (三角形光栅化与深度缓冲) [advanced]
        │     id: rasterization-depth | order: 3 | parent: graphics-pipeline
        │     prerequisites: graphics-pipeline
        ├── texture-mapping (纹理映射与滤波) [advanced]
        │     id: texture-mapping | order: 4 | parent: graphics-pipeline
        │     prerequisites: graphics-pipeline
        ├── lighting-shading (光照与着色模型) [advanced]
        │     id: lighting-shading | order: 5 | parent: graphics-pipeline
        │     prerequisites: graphics-pipeline
        │     └── shadow-ao (阴影与环境光遮蔽) [advanced]
        │           id: shadow-ao | order: 6 | parent: lighting-shading
        │           prerequisites: lighting-shading
        │           └── ray-tracing (光线追踪基础) [advanced]
        │                 id: ray-tracing | order: 7 | parent: shadow-ao
        │                 prerequisites: lighting-shading
        │                 └── acceleration-structures (加速结构 BVH/KD-Tree) [advanced]
        │                       id: acceleration-structures | order: 8 | parent: ray-tracing
        │                       prerequisites: ray-tracing
        │                       └── gpu-architecture (GPU架构与着色器编程) [advanced]
        │                             id: gpu-architecture | order: 9 | parent: acceleration-structures
        │                             prerequisites: graphics-pipeline
        │                             └── curves-surfaces (曲线与曲面) [advanced]
        │                                   id: curves-surfaces | order: 10 | parent: gpu-architecture
        │                                   prerequisites: gpu-architecture
        │                                   └── animation (计算机动画) [advanced]
        │                                         id: animation | order: 11 | parent: curves-surfaces
        │                                         prerequisites: curves-surfaces
        │                                         └── modern-rendering (现代渲染技术 PBR) [advanced]
        │                                               id: modern-rendering | order: 12 | parent: animation
        │                                               prerequisites: animation
```
### 12-machine-learning — 机器学习 / 人工智能方向

```
ai-overview (人工智能概述与历史) [intermediate]
  id: ai-overview | order: 1 | parent: 无
  prerequisites: 无
  ├── search-algorithms (搜索算法 BFS/DFS/A\*) [intermediate]
  │     id: search-algorithms | order: 2 | parent: ai-overview
  │     prerequisites: ai-overview
  │     └── minimax (博弈与对抗搜索) [advanced]
  │           id: minimax | order: 3 | parent: search-algorithms
  │           prerequisites: search-algorithms
  ├── linear-regression (线性回归与逻辑回归) [intermediate]
  │     id: linear-regression | order: 4 | parent: ai-overview
  │     prerequisites: ai-overview
  │     ├── decision-tree (决策树与随机森林) [intermediate]
  │     │     id: decision-tree | order: 5 | parent: linear-regression
  │     │     prerequisites: linear-regression
  │     │     └── svm (支持向量机) [advanced]
  │     │           id: svm | order: 6 | parent: decision-tree
  │     │           prerequisites: linear-regression
  │     │           └── knn (k近邻与朴素贝叶斯) [intermediate]
  │     │                 id: knn | order: 7 | parent: svm
  │     │                 prerequisites: linear-regression
  │     │                 └── clustering (聚类 k-Means/DBSCAN) [intermediate]
  │     │                       id: clustering | order: 8 | parent: knn
  │     │                       prerequisites: knn
  │     │                       └── pca (主成分分析) [advanced]
  │     │                             id: pca | order: 9 | parent: clustering
  │     │                             prerequisites: linear-regression
  │     │                             └── neural-network (神经网络与反向传播) [advanced]
  │     │                                   id: neural-network | order: 10 | parent: pca
  │     │                                   prerequisites: linear-regression
  │     │                                   ├── cnn (卷积神经网络) [advanced]
  │     │                                   │     id: cnn | order: 11 | parent: neural-network
  │     │                                   │     prerequisites: neural-network
  │     │                                   │     └── rnn (循环神经网络 LSTM) [advanced]
  │     │                                   │           id: rnn | order: 12 | parent: cnn
  │     │                                   │           prerequisites: neural-network
  │     │                                   │           └── transformer (Transformer与注意力) [advanced]
  │     │                                   │                 id: transformer | order: 13 | parent: rnn
  │     │                                   │                 prerequisites: rnn
  │     │                                   │                 ├── generative-models (生成模型) [advanced]
  │     │                                   │                 │     id: generative-models | order: 14 | parent: transformer
  │     │                                   │                 │     prerequisites: neural-network
  │     │                                   │                 ├── reinforcement-learning (强化学习) [advanced]
  │     │                                   │                 │     id: reinforcement-learning | order: 15 | parent: transformer
  │     │                                   │                 │     prerequisites: neural-network
  │     │                                   │                 └── nlp (自然语言处理) [advanced]
  │     │                                   │                       id: nlp | order: 16 | parent: transformer
  │     │                                   │                       prerequisites: transformer
  │     │                                   ├── mlops (MLOps与模型部署) [advanced]
  │     │                                   │     id: mlops | order: 18 | parent: computer-vision
  │     │                                   │     prerequisites: linear-regression
  │     │                                   │     └── ai-ethics (AI伦理与公平性) [advanced]
  │     │                                   │           id: ai-ethics | order: 19 | parent: mlops
  │     │                                   │           prerequisites: mlops
  │     └── computer-vision (计算机视觉) [advanced]
  │           id: computer-vision | order: 17 | parent: transformer
  │           prerequisites: cnn
```

### 13-cybersecurity — 网络安全方向

```
cybersecurity-basics (安全基础概念 CIA三元组) [intermediate]
  id: cybersecurity-basics | order: 1 | parent: 无
  prerequisites: 无
  └── authentication-access-control (身份认证与访问控制) [intermediate]
        id: authentication-access-control | order: 2 | parent: cybersecurity-basics
        prerequisites: cybersecurity-basics
        └── network-attacks (网络攻击与防御 DDoS/MITM) [intermediate]
              id: network-attacks | order: 3 | parent: authentication-access-control
              prerequisites: authentication-access-control
              ├── web-security (Web安全 XSS/SQL注入/CSRF) [intermediate]
              │     id: web-security | order: 4 | parent: network-attacks
              │     prerequisites: network-attacks
              │     └── malware-analysis (恶意软件分析) [advanced]
              │           id: malware-analysis | order: 5 | parent: web-security
              │           prerequisites: web-security
              │           └── firewall-ids (防火墙与入侵检测) [intermediate]
              │                 id: firewall-ids | order: 6 | parent: malware-analysis
              │                 prerequisites: network-attacks
              │                 └── ssdlc (安全开发生命周期 SSDLC) [advanced]
              │                       id: ssdlc | order: 7 | parent: firewall-ids
              │                       prerequisites: firewall-ids
              │                       └── digital-forensics (数字取证) [advanced]
              │                             id: digital-forensics | order: 8 | parent: ssdlc
              │                             prerequisites: malware-analysis
```

### 14-distributed-systems — 分布式系统方向

```
distributed-system-models (分布式系统模型与CAP定理) [advanced]
  id: distributed-system-models | order: 1 | parent: 无
  prerequisites: 无
  └── consensus-protocols (一致性协议 Paxos/Raft) [advanced]
        id: consensus-protocols | order: 2 | parent: distributed-system-models
        prerequisites: distributed-system-models
        ├── distributed-storage (分布式存储 GFS/HDFS) [advanced]
        │     id: distributed-storage | order: 3 | parent: consensus-protocols
        │     prerequisites: distributed-system-models
        ├── distributed-computing (分布式计算 MapReduce) [advanced]
        │     id: distributed-computing | order: 4 | parent: consensus-protocols
        │     prerequisites: distributed-system-models
        │     └── message-queues (消息队列 Kafka) [advanced]
        │           id: message-queues | order: 5 | parent: distributed-computing
        │           prerequisites: distributed-system-models
        │           └── microservices (微服务架构) [advanced]
        │                 id: microservices | order: 6 | parent: message-queues
        │                 prerequisites: distributed-system-models
        │                 └── container-orchestration (容器与编排 Docker/K8s) [advanced]
        │                       id: container-orchestration | order: 7 | parent: microservices
        │                       prerequisites: microservices
        │                       └── distributed-transactions (分布式事务 2PC/Saga) [advanced]
        │                             id: distributed-transactions | order: 8 | parent: container-orchestration
        │                             prerequisites: distributed-system-models
```

### 15-quantum-computing — 量子计算方向

```
qubit-gates (量子比特与量子门) [advanced]
  id: qubit-gates | order: 1 | parent: 无
  prerequisites: 无
  └── entanglement-bell (量子纠缠与贝尔不等式) [advanced]
        id: entanglement-bell | order: 2 | parent: qubit-gates
        prerequisites: qubit-gates
        └── quantum-algorithms (量子算法 Grover/Shor) [advanced]
              id: quantum-algorithms | order: 3 | parent: entanglement-bell
              prerequisites: qubit-gates
              ├── quantum-error-correction (量子纠错 表面码) [advanced]
              │     id: quantum-error-correction | order: 4 | parent: quantum-algorithms
              │     prerequisites: qubit-gates
              │     └── quantum-hardware (量子硬件概述) [advanced]
              │           id: quantum-hardware | order: 5 | parent: quantum-error-correction
              │           prerequisites: qubit-gates
```

### 16-web3-blockchain — 区块链 / Web3 方向

```
blockchain-data-structure (区块链数据结构 Merkle Tree) [advanced]
  id: blockchain-data-structure | order: 1 | parent: 无
  prerequisites: 无
  └── pow-consensus (工作量证明与共识 PoW/PoS) [advanced]
        id: pow-consensus | order: 2 | parent: blockchain-data-structure
        prerequisites: blockchain-data-structure
        └── smart-contracts (智能合约 Solidity) [advanced]
              id: smart-contracts | order: 3 | parent: pow-consensus
              prerequisites: blockchain-data-structure
              ├── dapp (去中心化应用 DApp) [advanced]
              │     id: dapp | order: 4 | parent: smart-contracts
              │     prerequisites: smart-contracts
              │     └── layer2-scaling (Layer2与扩容 Rollup) [advanced]
              │           id: layer2-scaling | order: 5 | parent: dapp
              │           prerequisites: pow-consensus
```

### 17-formal-methods — 形式化方法方向

```
propositional-logic (命题逻辑与谓词逻辑) [advanced]
  id: propositional-logic | order: 1 | parent: 无
  prerequisites: 无
  └── model-checking (模型检验 Model Checking) [advanced]
        id: model-checking | order: 2 | parent: propositional-logic
        prerequisites: propositional-logic
        └── theorem-proving (定理证明 Coq/Lean) [advanced]
              id: theorem-proving | order: 3 | parent: model-checking
              prerequisites: propositional-logic
              └── hoare-logic (程序验证 Hoare Logic) [advanced]
                    id: hoare-logic | order: 4 | parent: theorem-proving
                    prerequisites: propositional-logic
```

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
| 63 | `array-linked-list` | 数组与链表 | beginner | — | 1 | — |
| 64 | `stack-queue` | 栈与队列 | beginner | array-linked-list | 2 | array-linked-list |
| 65 | `hash-table` | 哈希表 | intermediate | stack-queue | 1 | array-linked-list |
| 66 | `binary-tree` | 二叉树与遍历 | intermediate | hash-table | 2 | stack-queue |
| 67 | `binary-search-tree` | 二叉搜索树 | intermediate | binary-tree | 2 | binary-tree |
| 68 | `heap` | 堆与优先队列 | intermediate | binary-search-tree | 1 | binary-tree |
| 69 | `balanced-tree` | 平衡树（AVL/红黑树） | advanced | binary-search-tree | 0 | binary-search-tree |
| 70 | `graph-representation` | 图的表示 | intermediate | binary-tree | 1 | array-linked-list |
| 71 | `dfs-bfs` | DFS / BFS | intermediate | graph-representation | 2 | stack-queue, graph-representation |
| 72 | `shortest-path` | 最短路径（Dijkstra, Floyd） | advanced | dfs-bfs | 0 | dfs-bfs |
| 73 | `minimum-spanning-tree` | 最小生成树（Kruskal, Prim） | advanced | dfs-bfs | 0 | dfs-bfs |
| 74 | `basic-sort` | 基础排序（插入、选择、冒泡） | beginner | array-linked-list | 0 | array-linked-list |
| 75 | `advanced-sort` | 高级排序（归并、快排、堆排） | intermediate | heap | 0 | heap |
| 76 | `binary-search` | 二分搜索 | beginner | array-linked-list | 0 | array-linked-list |
| 77 | `recursion-divide-conquer` | 递归与分治 | intermediate | stack-queue | 3 | stack-queue |
| 78 | `dynamic-programming` | 动态规划 | advanced | recursion-divide-conquer | 0 | recursion-divide-conquer |
| 79 | `greedy` | 贪心算法 | advanced | recursion-divide-conquer | 0 | recursion-divide-conquer |
| 80 | `backtracking` | 回溯与剪枝 | advanced | recursion-divide-conquer | 0 | recursion-divide-conquer |
| 81 | `big-o-notation` | 时间复杂度与大O | intermediate | recursion-divide-conquer | 1 | recursion-divide-conquer |
| 82 | `p-vs-np` | P vs NP简述 | advanced | big-o-notation | 0 | big-o-notation |
| 83 | `programming-paradigms` | 编程语言范式概述 | beginner | — | 3 | — |
| 84 | `variable-scope` | 变量、作用域与绑定 | intermediate | programming-paradigms | 1 | programming-paradigms |
| 85 | `evaluation-strategies` | 求值策略 | intermediate | variable-scope | 2 | variable-scope |
| 86 | `higher-order-functions` | 高阶函数与闭包 | intermediate | programming-paradigms | 1 | programming-paradigms |
| 87 | `lambda-calculus` | Lambda演算基础 | advanced | evaluation-strategies | 0 | evaluation-strategies |
| 88 | `algebraic-data-types` | 代数数据类型与模式匹配 | intermediate | higher-order-functions | 1 | higher-order-functions |
| 89 | `lazy-evaluation` | 惰性求值与无穷数据结构 | advanced | algebraic-data-types | 0 | algebraic-data-types |
| 90 | `static-vs-dynamic` | 静态vs动态类型 | intermediate | programming-paradigms | 2 | programming-paradigms |
| 91 | `type-inference` | 类型推导与多态 | advanced | static-vs-dynamic | 0 | static-vs-dynamic |
| 92 | `subtyping` | 子类型与变型 | advanced | static-vs-dynamic | 0 | static-vs-dynamic |
| 93 | `operational-semantics` | 操作语义 | advanced | programming-paradigms | 0 | programming-paradigms |
| 94 | `garbage-collection` | 垃圾回收机制 | advanced | evaluation-strategies | 1 | evaluation-strategies |
| 95 | `concurrency-models` | 并发编程模型 | advanced | garbage-collection | 0 | garbage-collection |
| 96 | `domain-specific-languages` | 领域特定语言 | advanced | programming-paradigms | 0 | programming-paradigms |
| 97 | `software-lifecycle` | 软件生命周期与过程模型 | beginner | — | 4 | — |
| 98 | `agile-scrum` | 敏捷开发与Scrum | beginner | software-lifecycle | 1 | software-lifecycle |
| 99 | `version-control` | 版本控制（Git） | beginner | agile-scrum | 0 | agile-scrum |
| 100 | `requirements-analysis` | 需求获取与分析 | intermediate | software-lifecycle | 1 | software-lifecycle |
| 101 | `software-architecture` | 软件架构与设计模式 | advanced | requirements-analysis | 2 | requirements-analysis |
| 102 | `uml-modeling` | UML建模 | intermediate | software-architecture | 0 | software-architecture |
| 103 | `solid-principles` | SOLID原则 | intermediate | software-architecture | 1 | software-architecture |
| 104 | `software-testing` | 软件测试（单元/集成/E2E） | intermediate | solid-principles | 1 | solid-principles |
| 105 | `ci-cd` | CI/CD与DevOps | intermediate | software-testing | 1 | software-testing, version-control |
| 106 | `code-review` | 代码审查与重构 | intermediate | ci-cd | 0 | ci-cd |
| 107 | `api-design` | API设计与REST | intermediate | software-lifecycle | 1 | software-lifecycle |
| 108 | `database-orm` | 数据库设计与ORM | intermediate | api-design | 0 | api-design |
| 109 | `security-coding` | 安全编程实践 | advanced | software-lifecycle | 1 | software-lifecycle |
| 110 | `performance-tuning` | 性能分析与调优 | advanced | security-coding | 0 | security-coding |
| 111 | `classical-ciphers` | 古典密码（凯撒、维吉尼亚） | intermediate | — | 1 | — |
| 112 | `symmetric-crypto` | 对称加密（AES, DES） | advanced | classical-ciphers | 1 | classical-ciphers |
| 113 | `public-key-crypto` | 公钥密码（RSA, ECC） | advanced | symmetric-crypto | 6 | symmetric-crypto |
| 114 | `hash-functions` | 哈希函数（SHA, MD） | advanced | public-key-crypto | 0 | public-key-crypto |
| 115 | `digital-signatures` | 数字签名与证书 | advanced | public-key-crypto | 0 | public-key-crypto |
| 116 | `crypto-protocols` | 密码协议（SSL/TLS） | advanced | public-key-crypto | 0 | public-key-crypto |
| 117 | `zero-knowledge-proofs` | 零知识证明 | advanced | public-key-crypto | 0 | public-key-crypto |
| 118 | `quantum-cryptography` | 量子密码学 | advanced | public-key-crypto | 1 | public-key-crypto |
| 119 | `cryptanalysis` | 密码分析 | advanced | quantum-cryptography | 0 | classical-ciphers, symmetric-crypto |
| 120 | `2d-3d-transforms` | 2D/3D变换与齐次坐标 | intermediate | — | 1 | — |
| 121 | `graphics-pipeline` | 光栅化管线 | advanced | 2d-3d-transforms | 5 | 2d-3d-transforms |
| 122 | `rasterization-depth` | 三角形光栅化与深度缓冲 | advanced | graphics-pipeline | 0 | graphics-pipeline |
| 123 | `texture-mapping` | 纹理映射与滤波 | advanced | graphics-pipeline | 0 | graphics-pipeline |
| 124 | `lighting-shading` | 光照与着色模型 | advanced | graphics-pipeline | 1 | graphics-pipeline |
| 125 | `shadow-ao` | 阴影与环境光遮蔽 | advanced | lighting-shading | 1 | lighting-shading |
| 126 | `ray-tracing` | 光线追踪基础 | advanced | shadow-ao | 1 | lighting-shading |
| 127 | `acceleration-structures` | 加速结构（BVH, KD-Tree） | advanced | ray-tracing | 1 | ray-tracing |
| 128 | `gpu-architecture` | GPU架构与着色器编程 | advanced | acceleration-structures | 1 | graphics-pipeline |
| 129 | `curves-surfaces` | 曲线与曲面（Bézier, B-Spline） | advanced | gpu-architecture | 1 | gpu-architecture |
| 130 | `animation` | 计算机动画 | advanced | curves-surfaces | 1 | curves-surfaces |
| 131 | `modern-rendering` | 现代渲染技术（PBR, 实时全局光照） | advanced | animation | 0 | animation |
| 132 | `ai-overview` | 人工智能概述与历史 | intermediate | — | 2 | — |
| 133 | `search-algorithms` | 搜索算法（BFS, DFS, A\*） | intermediate | ai-overview | 1 | ai-overview |
| 134 | `minimax` | 博弈与对抗搜索（Minimax） | advanced | search-algorithms | 0 | search-algorithms |
| 135 | `linear-regression` | 线性回归与逻辑回归 | intermediate | ai-overview | 5 | ai-overview |
| 136 | `decision-tree` | 决策树与随机森林 | intermediate | linear-regression | 1 | linear-regression |
| 137 | `svm` | 支持向量机（SVM） | advanced | decision-tree | 1 | linear-regression |
| 138 | `knn` | k近邻与朴素贝叶斯 | intermediate | svm | 1 | linear-regression |
| 139 | `clustering` | 聚类（k-Means, DBSCAN） | intermediate | knn | 1 | knn |
| 140 | `pca` | 主成分分析（PCA） | advanced | clustering | 1 | linear-regression |
| 141 | `neural-network` | 神经网络与反向传播 | advanced | pca | 3 | linear-regression |
| 142 | `cnn` | 卷积神经网络（CNN） | advanced | neural-network | 1 | neural-network |
| 143 | `rnn` | 循环神经网络（RNN / LSTM） | advanced | cnn | 1 | neural-network |
| 144 | `transformer` | Transformer与注意力机制 | advanced | rnn | 3 | rnn |
| 145 | `generative-models` | 生成模型（GAN, VAE, 扩散模型） | advanced | transformer | 0 | neural-network |
| 146 | `reinforcement-learning` | 强化学习（Q-Learning, DQN） | advanced | transformer | 0 | neural-network |
| 147 | `nlp` | 自然语言处理（NLP） | advanced | transformer | 0 | transformer |
| 148 | `computer-vision` | 计算机视觉 | advanced | transformer | 0 | cnn |
| 149 | `mlops` | MLOps与模型部署 | advanced | computer-vision | 1 | linear-regression |
| 150 | `ai-ethics` | AI伦理与公平性 | advanced | mlops | 0 | mlops |
| 151 | `cybersecurity-basics` | 安全基础概念（CIA三元组） | intermediate | — | 1 | — |
| 152 | `authentication-access-control` | 身份认证与访问控制 | intermediate | cybersecurity-basics | 1 | cybersecurity-basics |
| 153 | `network-attacks` | 网络攻击与防御（DDoS, MITM） | intermediate | authentication-access-control | 2 | authentication-access-control |
| 154 | `web-security` | Web安全（XSS, SQL注入, CSRF） | intermediate | network-attacks | 1 | network-attacks |
| 155 | `malware-analysis` | 恶意软件分析 | advanced | web-security | 1 | web-security |
| 156 | `firewall-ids` | 防火墙与入侵检测 | intermediate | malware-analysis | 1 | network-attacks |
| 157 | `ssdlc` | 安全开发生命周期（SSDLC） | advanced | firewall-ids | 1 | firewall-ids |
| 158 | `digital-forensics` | 数字取证 | advanced | ssdlc | 0 | malware-analysis |
| 159 | `distributed-system-models` | 分布式系统模型与CAP定理 | advanced | — | 1 | — |
| 160 | `consensus-protocols` | 一致性协议（Paxos, Raft） | advanced | distributed-system-models | 2 | distributed-system-models |
| 161 | `distributed-storage` | 分布式存储（GFS, HDFS） | advanced | consensus-protocols | 0 | distributed-system-models |
| 162 | `distributed-computing` | 分布式计算（MapReduce） | advanced | consensus-protocols | 1 | distributed-system-models |
| 163 | `message-queues` | 消息队列（Kafka） | advanced | distributed-computing | 1 | distributed-system-models |
| 164 | `microservices` | 微服务架构 | advanced | message-queues | 1 | distributed-system-models |
| 165 | `container-orchestration` | 容器与编排（Docker, K8s） | advanced | microservices | 1 | microservices |
| 166 | `distributed-transactions` | 分布式事务（2PC, Saga） | advanced | container-orchestration | 0 | distributed-system-models |
| 167 | `qubit-gates` | 量子比特与量子门 | advanced | — | 1 | — |
| 168 | `entanglement-bell` | 量子纠缠与贝尔不等式 | advanced | qubit-gates | 1 | qubit-gates |
| 169 | `quantum-algorithms` | 量子算法（Grover, Shor） | advanced | entanglement-bell | 1 | qubit-gates |
| 170 | `quantum-error-correction` | 量子纠错（表面码） | advanced | quantum-algorithms | 1 | qubit-gates |
| 171 | `quantum-hardware` | 量子硬件概述 | advanced | quantum-error-correction | 0 | qubit-gates |
| 172 | `blockchain-data-structure` | 区块链数据结构（Merkle Tree） | advanced | — | 1 | — |
| 173 | `pow-consensus` | 工作量证明与共识（PoW/PoS） | advanced | blockchain-data-structure | 1 | blockchain-data-structure |
| 174 | `smart-contracts` | 智能合约（Solidity） | advanced | pow-consensus | 1 | blockchain-data-structure |
| 175 | `dapp` | 去中心化应用（DApp） | advanced | smart-contracts | 1 | smart-contracts |
| 176 | `layer2-scaling` | Layer2与扩容方案（Rollup） | advanced | dapp | 0 | pow-consensus |
| 177 | `propositional-logic` | 命题逻辑与谓词逻辑 | advanced | — | 1 | — |
| 178 | `model-checking` | 模型检验（Model Checking） | advanced | propositional-logic | 1 | propositional-logic |
| 179 | `theorem-proving` | 定理证明（Coq, Lean） | advanced | model-checking | 1 | propositional-logic |
| 180 | `hoare-logic` | 程序验证（Hoare Logic, 分离逻辑） | advanced | theorem-proving | 0 | propositional-logic |

---

## 添加新节点规则

1. **确定所属方向**：根据主题放入 `00-hardware/` 至 `05-databases/` 对应目录
2. **文件命名**：使用 `NN-kebab-case-id.md` 格式，`NN` 为两位数字序号
3. **填写 frontmatter**：参考现有节点，确保 `parent`/`children`/`prerequisites`/`related` 中引用的 ID 都存在
4. **更新本文档**：在对应方向下添加新节点到树结构中
5. **保持一致性**：文件编号按 `order` 字段排序，与树中位置一致
