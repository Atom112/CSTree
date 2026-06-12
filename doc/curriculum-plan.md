# CSTree 知识体系规划

> 基于 ACM/IEEE CS2023、伯克利 EECS、CMU CS 等权威课程体系编写
> 更新日期：2026-06-12

---

## 第一部分：核心板块（自底向上主线）

### 00-hardware — 硬件 / 计算机组成

规划扩展至 20+ 个。

| 层级 | 知识点 | 难度 | 状态 |
|------|--------|------|------|
| **数字逻辑基础** | | | |
| 1 | 二进制（Binary Numbers） | beginner | ✅ 已完成 |
| 2 | 布尔代数（Boolean Algebra） | beginner | ✅ 已完成 |
| 3 | 逻辑门（Logic Gates） | beginner | ✅ 已完成 |
| 4 | 与门（AND Gate） | beginner | ✅ 已完成 |
| 5 | 或门（OR Gate） | beginner | ✅ 已完成 |
| 6 | 非门（NOT Gate） | beginner | ✅ 已完成 |
| **组合逻辑** | | | |
| 7 | 半加器（Half Adder） | intermediate | ✅ 已完成 |
| 8 | 全加器（Full Adder） | intermediate | ✅ 已完成 |
| 15 | 译码器 / 编码器（Decoder / Encoder） | intermediate | ✅ 已完成 |
| 16 | 多路选择器（Multiplexer / MUX） | intermediate | ✅ 已完成 |
| 18 | 比较器（Comparator） | intermediate | ✅ 已完成 |
| **时序逻辑** | | | |
| 9 | SR 锁存器（SR Latch） | intermediate | ✅ 已完成 |
| 10 | D 触发器（D Flip-Flop） | intermediate | ✅ 已完成 |
| 19 | JK 触发器 / T 触发器 | intermediate | ✅ 已完成 |
| 11 | 寄存器（Register） | intermediate | ✅ 已完成 |
| 12 | 计数器（Counter） | intermediate | ✅ 已完成 |
| 17 | 状态机（Finite State Machine） | advanced | ✅ 已完成 |
| **存储与运算** | | | |
| 13 | RAM（随机存取存储器） | intermediate | ✅ 已完成 |
| 14 | ALU（算术逻辑单元） | intermediate | ✅ 已完成 |
| 20 | ROM / Flash / 非易失存储 | intermediate | ✅ 已完成 |
| — | 缓存（Cache Memory） | advanced | ⬜ 待添加 |
| **处理器架构** | | | |
| — | CPU 数据通路（Datapath） | advanced | ⬜ 待添加 |
| — | 控制单元（Control Unit） | advanced | ⬜ 待添加 |
| — | 指令流水线（Instruction Pipeline） | advanced | ⬜ 待添加 |
| — | RISC vs CISC | advanced | ⬜ 待添加 |
| — | 中断与异常（Interrupts & Exceptions） | advanced | ⬜ 待添加 |
| — | I/O 接口（DMA, 内存映射 I/O） | advanced | ⬜ 待添加 |
| — | 现代 CPU 架构（多核、超线程） | advanced | ⬜ 待添加 |

**权威教材：** Patterson & Hennessy《Computer Organization and Design》、Bryant & O'Hallaron《Computer Systems: A Programmer's Perspective》（CS:APP）

---

### 01-assembly — 汇编语言

硬件之后的自然延续，约 12-15 个节点。

| 层级 | 知识点 | 难度 | 状态 |
|------|--------|------|------|
| **指令基础** | | | |
| 1 | 机器码与指令编码 | intermediate | ✅ 已完成 |
| 2 | 指令集架构（ISA）概述 | intermediate | ✅ 已完成 |
| 3 | 寻址方式（Addressing Modes） | intermediate | ✅ 已完成 |
| 4 | 数据传送指令（MOV / Load / Store） | intermediate | ✅ 已完成 |
| **运算与控制** | | | |
| 5 | 算术与逻辑指令 | intermediate | ✅ 已完成 |
| 6 | 分支与跳转指令 | intermediate | ✅ 已完成 |
| 7 | 标志位与条件码 | intermediate | ✅ 已完成 |
| **子程序与栈** | | | |
| 8 | 栈帧与函数调用约定 | advanced | ⬜ 待添加 |
| 9 | 参数传递（寄存器 vs 栈） | advanced | ⬜ 待添加 |
| 10 | 递归的汇编实现 | advanced | ⬜ 待添加 |
| **进阶** | | | |
| 11 | 内联汇编与 C 混合编程 | advanced | ⬜ 待添加 |
| 12 | 反汇编与调试 | advanced | ⬜ 待添加 |
| 13 | 缓冲区溢出与安全 | advanced | ⬜ 待添加 |
| 14 | SIMD / 向量指令 | advanced | ⬜ 待添加 |

**权威教材：** CS:APP（Bryant & O'Hallaron）第 3 章、 Irvine《Assembly Language for x86 Processors》

---

### 02-os — 操作系统

约 18-22 个节点。

| 层级 | 知识点 | 难度 | 状态 |
|------|--------|------|------|
| **操作系统概述** | | | |
| 1 | 操作系统的作用与历史 | beginner | ⬜ 待添加 |
| 2 | 系统调用与内核态/用户态 | intermediate | ⬜ 待添加 |
| **进程与线程** | | | |
| 3 | 进程的概念与状态转换 | intermediate | ⬜ 待添加 |
| 4 | 进程调度算法 | intermediate | ⬜ 待添加 |
| 5 | 线程（Thread）与多线程 | intermediate | ⬜ 待添加 |
| 6 | 上下文切换 | intermediate | ⬜ 待添加 |
| **并发与同步** | | | |
| 7 | 竞争条件与临界区 | intermediate | ⬜ 待添加 |
| 8 | 互斥锁与信号量 | advanced | ⬜ 待添加 |
| 9 | 经典同步问题（生产者消费者等） | advanced | ⬜ 待添加 |
| 10 | 死锁（Deadlock） | advanced | ⬜ 待添加 |
| **内存管理** | | | |
| 11 | 内存地址空间（逻辑 vs 物理） | intermediate | ⬜ 待添加 |
| 12 | 分页与页表 | advanced | ⬜ 待添加 |
| 13 | 虚拟内存与页面置换 | advanced | ⬜ 待添加 |
| 14 | TLB 与内存映射 | advanced | ⬜ 待添加 |
| **文件系统** | | | |
| 15 | 文件系统接口与实现 | intermediate | ⬜ 待添加 |
| 16 | 目录结构与文件分配 | intermediate | ⬜ 待添加 |
| 17 | 磁盘调度 | advanced | ⬜ 待添加 |
| **I/O 与设备** | | | |
| 18 | I/O 硬件与驱动模型 | intermediate | ⬜ 待添加 |
| 19 | 中断处理 | advanced | ⬜ 待添加 |
| 20 | DMA（直接存储器访问） | advanced | ⬜ 待添加 |

**权威教材：** Arpaci-Dusseau《Operating Systems: Three Easy Pieces》、Silberschatz《Operating System Concepts》

---

### 03-compilers — 编译原理

约 14-18 个节点。

| 层级 | 知识点 | 难度 | 状态 |
|------|--------|------|------|
| **前端** | | | |
| 1 | 编译器概述与整体结构 | intermediate | ⬜ 待添加 |
| 2 | 词法分析与正则表达式 | intermediate | ⬜ 待添加 |
| 3 | 有限自动机（DFA / NFA） | intermediate | ⬜ 待添加 |
| 4 | 语法分析与上下文无关文法 | intermediate | ⬜ 待添加 |
| 5 | 自顶向下分析（LL） | advanced | ⬜ 待添加 |
| 6 | 自底向上分析（LR, LALR） | advanced | ⬜ 待添加 |
| 7 | 抽象语法树（AST） | intermediate | ⬜ 待添加 |
| **中间表示** | | | |
| 8 | 语义分析与符号表 | advanced | ⬜ 待添加 |
| 9 | 类型检查与类型推导 | advanced | ⬜ 待添加 |
| 10 | 中间表示（IR, 三地址码） | advanced | ⬜ 待添加 |
| **后端** | | | |
| 11 | 代码生成 | advanced | ⬜ 待添加 |
| 12 | 寄存器分配（图着色） | advanced | ⬜ 待添加 |
| 13 | 基本优化（常量折叠、死代码消除） | advanced | ⬜ 待添加 |
| 14 | 循环优化与数据流分析 | advanced | ⬜ 待添加 |
| 15 | 指令调度 | advanced | ⬜ 待添加 |
| — | JIT（即时编译） | advanced | ⬜ 待添加 |

**权威教材：** Aho, Lam, Sethi, Ullman《Compilers: Principles, Techniques, and Tools》（龙书）、Appel《Modern Compiler Implementation》

---

### 04-networking — 计算机网络

约 16-20 个节点。

| 层级 | 知识点 | 难度 | 状态 |
|------|--------|------|------|
| **网络基础** | | | |
| 1 | 网络分层模型（OSI / TCP/IP） | beginner | ⬜ 待添加 |
| 2 | 物理层基础（信号、编码、复用） | beginner | ⬜ 待添加 |
| **数据链路层** | | | |
| 3 | 帧封装与差错检测（CRC） | intermediate | ⬜ 待添加 |
| 4 | MAC 协议与以太网（CSMA/CD） | intermediate | ⬜ 待添加 |
| 5 | 交换机与自学习 | intermediate | ⬜ 待添加 |
| 6 | ARP 协议 | intermediate | ⬜ 待添加 |
| **网络层** | | | |
| 7 | IP 协议与 IPv4 地址 | intermediate | ⬜ 待添加 |
| 8 | 子网划分与 CIDR | intermediate | ⬜ 待添加 |
| 9 | 路由算法（距离向量、链路状态） | advanced | ⬜ 待添加 |
| 10 | IPv6 与 ICMP | intermediate | ⬜ 待添加 |
| 11 | NAT 与 DHCP | intermediate | ⬜ 待添加 |
| **传输层** | | | |
| 12 | UDP 协议 | intermediate | ⬜ 待添加 |
| 13 | TCP 三次握手与可靠传输 | advanced | ⬜ 待添加 |
| 14 | TCP 流量控制与拥塞控制 | advanced | ⬜ 待添加 |
| **应用层** | | | |
| 15 | DNS 域名系统 | intermediate | ⬜ 待添加 |
| 16 | HTTP / HTTPS | intermediate | ⬜ 待添加 |
| 17 | SMTP / POP / IMAP（邮件） | intermediate | ⬜ 待添加 |
| 18 | WebSocket 与实时通信 | intermediate | ⬜ 待添加 |

**权威教材：** Kurose & Ross《Computer Networking: A Top-Down Approach》、Tanenbaum《Computer Networks》

---

### 05-databases — 数据库系统

约 16-20 个节点。

| 层级 | 知识点 | 难度 | 状态 |
|------|--------|------|------|
| **数据建模** | | | |
| 1 | 数据库系统概述 | beginner | ⬜ 待添加 |
| 2 | 实体关系模型（ER） | intermediate | ⬜ 待添加 |
| 3 | 关系模型与关系代数 | intermediate | ⬜ 待添加 |
| **SQL 语言** | | | |
| 4 | SQL 基础（DDL, DML） | intermediate | ⬜ 待添加 |
| 5 | 连接查询与子查询 | intermediate | ⬜ 待添加 |
| 6 | 视图、索引与事务 | intermediate | ⬜ 待添加 |
| **数据库设计** | | | |
| 7 | 函数依赖 | advanced | ⬜ 待添加 |
| 8 | 范式（1NF ~ BCNF） | advanced | ⬜ 待添加 |
| 9 | 规范化与反规范化 | advanced | ⬜ 待添加 |
| **存储与索引** | | | |
| 10 | B+ 树索引 | advanced | ⬜ 待添加 |
| 11 | 哈希索引 | advanced | ⬜ 待添加 |
| 12 | 查询执行与优化 | advanced | ⬜ 待添加 |
| **事务与并发** | | | |
| 13 | ACID 特性 | advanced | ⬜ 待添加 |
| 14 | 事务隔离级别 | advanced | ⬜ 待添加 |
| 15 | 锁协议与并发控制 | advanced | ⬜ 待添加 |
| 16 | 日志与恢复（Undo / Redo） | advanced | ⬜ 待添加 |
| — | NoSQL 数据库概述 | intermediate | ⬜ 待添加 |

**权威教材：** Garcia-Molina, Ullman, Widom《Database Systems: The Complete Book》、Ramakrishnan & Gehrke《Database Management Systems》

---

### 06-algorithms — 算法与数据结构

约 20-25 个节点，穿插在其他板块的学习过程中。

| 层级 | 知识点 | 难度 | 状态 |
|------|--------|------|------|
| **基础数据结构** | | | |
| 1 | 数组与链表 | beginner | ⬜ 待添加 |
| 2 | 栈与队列 | beginner | ⬜ 待添加 |
| 3 | 哈希表（Hash Table） | intermediate | ⬜ 待添加 |
| **树结构** | | | |
| 4 | 二叉树与遍历 | intermediate | ⬜ 待添加 |
| 5 | 二叉搜索树（BST） | intermediate | ⬜ 待添加 |
| 6 | 堆（Heap）与优先队列 | intermediate | ⬜ 待添加 |
| 7 | 平衡树（AVL / 红黑树） | advanced | ⬜ 待添加 |
| **图** | | | |
| 8 | 图的表示（邻接矩阵/表） | intermediate | ⬜ 待添加 |
| 9 | DFS / BFS | intermediate | ⬜ 待添加 |
| 10 | 最短路径（Dijkstra, Floyd） | advanced | ⬜ 待添加 |
| 11 | 最小生成树（Kruskal, Prim） | advanced | ⬜ 待添加 |
| **排序与搜索** | | | |
| 12 | 基础排序（插入、选择、冒泡） | beginner | ⬜ 待添加 |
| 13 | 高级排序（归并、快排、堆排） | intermediate | ⬜ 待添加 |
| 14 | 二分搜索 | beginner | ⬜ 待添加 |
| **算法设计** | | | |
| 15 | 递归与分治 | intermediate | ⬜ 待添加 |
| 16 | 动态规划 | advanced | ⬜ 待添加 |
| 17 | 贪心算法 | advanced | ⬜ 待添加 |
| 18 | 回溯与剪枝 | advanced | ⬜ 待添加 |
| **计算理论** | | | |
| 19 | 时间复杂度与大 O | intermediate | ⬜ 待添加 |
| 20 | P vs NP 简述 | advanced | ⬜ 待添加 |

**权威教材：** CLRS《Introduction to Algorithms》、Sedgewick《Algorithms》

---

### 07-programming-languages — 程序语言理论

约 12-16 个节点。

| 层级 | 知识点 | 难度 | 状态 |
|------|--------|------|------|
| **语言基础** | | | |
| 1 | 编程语言范式概述 | beginner | ⬜ 待添加 |
| 2 | 变量、作用域与绑定 | intermediate | ⬜ 待添加 |
| 3 | 求值策略（传值、传引用、惰性求值） | intermediate | ⬜ 待添加 |
| **函数式编程** | | | |
| 4 | 高阶函数与闭包 | intermediate | ⬜ 待添加 |
| 5 | Lambda 演算基础 | advanced | ⬜ 待添加 |
| 6 | 代数数据类型与模式匹配 | intermediate | ⬜ 待添加 |
| 7 | 惰性求值与无穷数据结构 | advanced | ⬜ 待添加 |
| **类型系统** | | | |
| 8 | 静态 vs 动态类型 | intermediate | ⬜ 待添加 |
| 9 | 类型推导与多态 | advanced | ⬜ 待添加 |
| 10 | 子类型与变型（协变/逆变） | advanced | ⬜ 待添加 |
| **语义与实现** | | | |
| 11 | 操作语义（小步/大步） | advanced | ⬜ 待添加 |
| 12 | 垃圾回收机制 | advanced | ⬜ 待添加 |
| 13 | 并发编程模型（Actor, CSP） | advanced | ⬜ 待添加 |
| 14 | 领域特定语言（DSL） | advanced | ⬜ 待添加 |

**权威教材：** Pierce《Types and Programming Languages》、Friedman《Essentials of Programming Languages》

---

### 08-software-eng — 软件工程

约 12-15 个节点。

| 层级 | 知识点 | 难度 | 状态 |
|------|--------|------|------|
| **开发流程** | | | |
| 1 | 软件生命周期与过程模型 | beginner | ⬜ 待添加 |
| 2 | 敏捷开发与 Scrum | beginner | ⬜ 待添加 |
| 3 | 版本控制（Git） | beginner | ⬜ 待添加 |
| **需求与设计** | | | |
| 4 | 需求获取与分析 | intermediate | ⬜ 待添加 |
| 5 | 软件架构与设计模式 | advanced | ⬜ 待添加 |
| 6 | UML 建模 | intermediate | ⬜ 待添加 |
| 7 | SOLID 原则 | intermediate | ⬜ 待添加 |
| **质量** | | | |
| 8 | 软件测试基础（单元/集成/E2E） | intermediate | ⬜ 待添加 |
| 9 | CI/CD 与 DevOps | intermediate | ⬜ 待添加 |
| 10 | 代码审查与重构 | intermediate | ⬜ 待添加 |
| **工程实践** | | | |
| 11 | API 设计与 REST | intermediate | ⬜ 待添加 |
| 12 | 数据库设计与 ORM | intermediate | ⬜ 待添加 |
| 13 | 安全编程实践 | advanced | ⬜ 待添加 |
| 14 | 性能分析与调优 | advanced | ⬜ 待添加 |

**权威教材：** Sommerville《Software Engineering》、Martin《Clean Architecture》

---

## 第二部分：未来拓展板块

以下板块为知识树的"枝叶"方向，建议在核心板块（硬件→OS/网络/数据库）完成后再展开。

### 10-cryptography — 密码学

约 10-14 个节点。

| 知识点 | 说明 |
|--------|------|
| 古典密码（凯撒、维吉尼亚） | 替换密码、换位密码 |
| 对称加密（AES, DES） | 分组密码、Feistel 结构 |
| 公钥密码（RSA, ECC） | 数论基础、椭圆曲线 |
| 哈希函数（SHA, MD） | 碰撞阻力、应用 |
| 数字签名与证书 | PKI、CA 体系 |
| 密码协议（SSL/TLS） | 握手协议、证书链 |
| 零知识证明 | 交互式证明系统 |
| 量子密码学 | Shor 算法对 RSA 的威胁 |
| 密码分析 | 攻击方法与侧信道 |

**权威教材：** Katz & Lindell《Introduction to Modern Cryptography》

---

### 11-computer-graphics — 计算机图形学

约 12-16 个节点。

| 知识点 | 说明 |
|--------|------|
| 2D/3D 变换与齐次坐标 | 缩放、旋转、投影 |
| 光栅化管线 | 顶点处理→光栅化→片元处理 |
| 三角形光栅化与深度缓冲 | Z-buffer、背面剔除 |
| 纹理映射与滤波 | Mipmap、双线性插值 |
| 光照与着色模型 | Phong、Blinn-Phong、BRDF |
| 阴影与环境光遮蔽 | Shadow mapping、SSAO |
| 光线追踪基础 | Whitted 风格光线追踪 |
| 加速结构（BVH, KD-Tree） | 光线与物体求交 |
| GPU 架构与着色器编程 | GLSL / HLSL |
| 曲线与曲面 | Bézier、B-Spline、NURBS |
| 计算机动画 | 关键帧、骨骼动画 |
| 现代渲染技术（PBR, 实时全局光照） | 基于物理的渲染 |

**权威教材：** Foley et al.《Computer Graphics: Principles and Practice》、Shirley《Fundamentals of Computer Graphics》

---

### 12-machine-learning — 机器学习 / 人工智能

约 18-24 个节点。

| 层级 | 知识点 | 说明 |
|------|--------|------|
| **AI 基础** | | |
| 1 | 人工智能概述与历史 | 图灵测试、AI 流派 |
| 2 | 搜索算法（BFS, DFS, A\*) | 无信息/有信息搜索 |
| 3 | 博弈与对抗搜索（Minimax） | Alpha-beta 剪枝 |
| **经典机器学习** | | |
| 4 | 线性回归与逻辑回归 | 梯度下降、损失函数 |
| 5 | 决策树与随机森林 | 信息增益、剪枝 |
| 6 | 支持向量机（SVM） | 核技巧、软间隔 |
| 7 | k 近邻与朴素贝叶斯 | 非参数方法 |
| 8 | 聚类（k-Means, DBSCAN） | 无监督学习 |
| 9 | 主成分分析（PCA） | 降维与可视化 |
| **深度学习** | | |
| 10 | 神经网络与反向传播 | MLP、激活函数 |
| 11 | 卷积神经网络（CNN） | LeNet, ResNet |
| 12 | 循环神经网络（RNN / LSTM） | 序列建模 |
| 13 | Transformer 与注意力机制 | Self-attention |
| **进阶** | | |
| 14 | 生成模型（GAN, VAE, 扩散模型） | 图像生成 |
| 15 | 强化学习（Q-Learning, DQN） | MDP、策略梯度 |
| 16 | 自然语言处理（NLP） | 词嵌入、BERT、LLM |
| 17 | 计算机视觉 | 目标检测（YOLO）、分割 |
| 18 | MLOps 与模型部署 | 实验管理、模型服务 |
| — | AI 伦理与公平性 | 偏见、可解释性 |

**权威教材：** Russell & Norvig《Artificial Intelligence: A Modern Approach》、Goodfellow《Deep Learning》

---

### 13-cybersecurity — 网络安全

约 10-14 个节点。

| 知识点 | 说明 |
|--------|------|
| 安全基础概念（CIA 三元组） | 机密性、完整性、可用性 |
| 身份认证与访问控制 | 密码、MFA、OAuth |
| 网络攻击与防御（DDoS, MITM） | 常见攻击模式 |
| Web 安全（XSS, SQL 注入, CSRF） | OWASP Top 10 |
| 恶意软件分析 | 病毒、蠕虫、木马、勒索软件 |
| 防火墙与入侵检测 | 规则匹配、异常检测 |
| 安全开发生命周期（SSDLC） | 安全编码、威胁建模 |
| 数字取证 | 证据收集与分析 |

---

### 14-distributed-systems — 分布式系统

约 10-14 个节点。

| 知识点 | 说明 |
|--------|------|
| 分布式系统模型 | CAP 定理、FLP 不可能 |
| 一致性协议（Paxos, Raft） | 共识算法 |
| 分布式存储（GFS, HDFS） | 分片与复制 |
| 分布式计算（MapReduce） | 数据并行 |
| 消息队列（Kafka, RabbitMQ） | 异步通信 |
| 微服务架构 | 服务发现、网关 |
| 容器与编排（Docker, K8s） | 容器化部署 |
| 分布式事务（2PC, Saga） | 最终一致性 |

**权威教材：** Kleppmann《Designing Data-Intensive Applications》

---

### 15-quantum-computing — 量子计算（远期）

约 8-10 个节点。

| 知识点 | 说明 |
|--------|------|
| 量子比特与量子门 | 叠加态、测量 |
| 量子纠缠与贝尔不等式 | EPR 悖论 |
| 量子算法（Grover, Shor） | 搜索与质因数分解 |
| 量子纠错 | 表面码 |
| 量子硬件概述 | 超导、离子阱 |

---

### 16-web3-blockchain — 区块链（远期）

约 8-10 个节点。

| 知识点 | 说明 |
|--------|------|
| 区块链数据结构（Merkle Tree） | 哈希链 |
| 工作量证明与共识 | PoW, PoS, PBFT |
| 智能合约 | Ethereum, Solidity |
| 去中心化应用（DApp） | 前端 + 合约 |
| Layer2 与扩容方案 | Rollup, 侧链 |

---

### 17-formal-methods — 形式化方法（专题）

约 6-8 个节点。

| 知识点 | 说明 |
|--------|------|
| 命题逻辑与谓词逻辑 | 合式公式、自然演绎 |
| 模型检验（Model Checking） | TLA+, NuSMV |
| 定理证明（Coq, Lean） | Curry-Howard 同构 |
| 程序验证（Hoare Logic, 分离逻辑） | 前置/后置条件 |

---

## 附录：板块间依赖关系

```
硬件 ──────────────────────────────────────────┐
  │                                            │
  ├── 汇编 ──→ C 语言 ──→ OS ─────────────────┤
  │                              │             │
  │                   ┌──────────┴──────────┐  │
  │                   ↓                     ↓  │
  │                网络 ←── OS ──→ 数据库 ───┤
  │                                            │
  ├── 数据结构 ←── 算法 ←── 计算理论 ────────┤
  │                                            │
  └── 编译器 ────────────────────────────────┘
                                                   
  ┌──── 以上为核心板块（建议顺序）─────────┐
  ↓                                            ↓
图形学 ←── ML/AI ←── 密码学 ←── 分布式系统
                                  │
                                  ↓
                              区块链 / Web3
                                  │
                                  ↓
                              量子计算
```

## 附录：推荐学习路径

### 路径 A：计算机系统方向（与 CSTree 当前路线一致）
硬件 → 汇编 → C 语言 → 操作系统 → 网络 → 数据库 → 分布式系统

### 路径 B：程序语言 / 编译器方向
硬件 → 汇编 → 数据结构 → 算法 → 编译原理 → 程序语言理论 → 形式化方法

### 路径 C：AI / 数据科学方向
硬件 → 数据结构 → 算法 → 概率统计 → ML → 深度学习 → NLP/CV

### 路径 D：全栈 / 软件工程方向
硬件 → 网络 → 数据库 → 软件工程 → 分布式系统 → 安全

---

*本文档将持续更新，随知识节点写作进度同步维护。*
