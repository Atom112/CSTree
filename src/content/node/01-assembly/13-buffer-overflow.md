---
id: buffer-overflow
title: 缓冲区溢出与安全
summary: 缓冲区溢出（Buffer Overflow）是向固定大小的缓冲区写入超出容量的数据——看似简单的错误，却是几十年来最致命的软件安全漏洞之一，也是理解栈布局和保护机制的绝佳窗口
difficulty: advanced
order: 13
parent: disassembly-debugging
children:
  - simd-instructions
related:
  - disassembly-debugging
  - stack-frames
  - parameter-passing
prerequisites:
  - disassembly-debugging
  - stack-frames
tags:
  - assembly
  - security
  - stack
  - exploit
createdAt: 2026-06-12
---

## 装不下了还装？

你有一个只能装 4 个字符的盒子，硬要塞 10 个进去——多出来的 6 个会溢出来，撒到旁边的东西上。

**缓冲区溢出（Buffer Overflow）** 就是这个道理：程序在栈上分配了一个固定大小的缓冲区，却往里写入了超过容量的数据——多出来的数据会覆盖栈上相邻的内容。

### 类比：宿舍衣柜

宿舍的衣柜有 4 层隔板，你硬塞了 10 件衣服：
- 放不下的衣服会掉到隔壁室友的柜子里（覆盖别人的数据）
- 如果室友的柜子里正好放了重要文件（返回地址），就被你的衣服盖住了
- 室友回来找不到文件，程序就迷路了（崩溃，或被恶意利用）

## 栈的布局——攻击者的地图

回顾 [[stack-frames|栈帧]] 的结构：

```
    高地址
    ┌──────────────────┐
    │   调用者的数据     │
    ├──────────────────┤
    │   参数 N          │
    │   ...            │
    │   参数 1          │
    ├──────────────────┤
    │   返回地址        │  ← CALL 压入的
    ├──────────────────┤
    │   旧 BP           │  ← PUSH BP
    ├──────────────────┤  ← BP
    │   缓冲区（局部变量）│
    │   buffer[0]      │
    │   buffer[1]      │
    │   ...            │
    │   buffer[N]      │  ← 通常从这里开始写入
    └──────────────────┘  ← SP
    低地址
```

缓冲区 `buffer` 在 BP 的**下方**（低地址），而返回地址在 BP 的**上方**（高地址）。如果向 buffer 写入超过容量的数据——数据会向**高地址方向**溢出，覆盖 BP，最终覆盖**返回地址**。

```
正常状态：                         溢出后：
┌──────────────────┐              ┌──────────────────┐
│  调用者帧         │              │  调用者帧         │
├──────────────────┤              ├──────────────────┤
│  返回地址 = 0x1234│              │  返回地址 = 恶意代码│ ← 被覆盖！
├──────────────────┤              ├──────────────────┤
│  旧 BP            │              │  旧 BP = 垃圾值   │ ← 被覆盖
├──────────────────┤              ├──────────────────┤
│  buffer[7]       │              │  buffer[7]       │
│  buffer[6]       │              │  buffer[6]       │
│  buffer[5]       │              │  buffer[5]       │
│  buffer[4]       │  ← 溢出！    │  恶意代码指令      │
│  buffer[3]       │              │  恶意代码指令      │
│  buffer[2]       │              │  恶意代码指令      │
│  buffer[1]       │              │  恶意代码指令      │
│  buffer[0]       │              │  恶意代码指令      │
└──────────────────┘              └──────────────────┘
```

## 经典漏洞代码

```c
#include <stdio.h>
#include <string.h>

void vulnerable(char* input) {
    char buffer[8];          // 只有 8 字节的缓冲区
    strcpy(buffer, input);   // ❌ 没有长度检查！
    printf("Hello, %s\n", buffer);
}

int main(int argc, char* argv[]) {
    if (argc > 1) {
        vulnerable(argv[1]);
    }
    return 0;
}
```

编译并测试：

```bash
gcc -fno-stack-protector -o vuln vuln.c  # 关闭栈保护

# 正常输入
./vuln "Alice"
Hello, Alice
✅ 正常工作

# 超过缓冲区
./vuln "AAAAAAAAAAAAAAAAAAAA"
Hello, AAAAAAAAAAAAAAAAAAAA
*** stack smashing detected ***   # 如果开启了栈保护会有这个提示
Segmentation fault                # 或者直接段错误
```

### 反汇编看看发生了什么

```asm
_vulnerable:
    push   rbp
    mov    rbp, rsp
    sub    rsp, 0x18          ; 分配 24 字节（8 字节 buffer + 对齐）
    mov    rax, QWORD PTR [rbp+0x10]  ; rax = input 指针
    mov    rdi, rax
    lea    rsi, [rbp-0x10]    ; rsi = buffer 地址
    call   _strcpy
    ; ...
    leave
    ret
```

栈布局（调用 `strcpy` 之前）：

```
    地址         内容
    rbp+0x10:   input 指针（参数）
    rbp+0x08:   返回地址
    rbp:        旧 BP
    rbp-0x08:   buffer[0..7]    ← 8 字节缓冲区
    rbp-0x10:   对齐填充
    rbp-0x18:   更多局部变量
```

输入 16 个 'A' 后：

```
    rbp+0x08:   0x4141414141414141  ← "AAAAAAAA" 覆盖了返回地址！
    rbp:        0x4141414141414141  ← 旧 BP 也被覆盖
    rbp-0x08:   0x4141414141414141  ← buffer 区域
```

CPU 执行 RET 时，会从栈上弹出 0x4141414141414141 作为返回地址——这个地址不存在，CPU 跳转到非法地址 → **段错误**。

## 利用溢出——控制程序流程

### 理论攻击步骤

1. **找到溢出点**：确定缓冲区大小和到返回地址的偏移
2. **构造 payload**：把 shellcode（恶意代码）放在缓冲区中
3. **覆盖返回地址**：让返回地址指向缓冲区中的 shellcode

### 攻击示意图

```
缓冲区 [shellcode...padding...][伪造返回地址 → 指向 shellcode]
       ↑                                        ↑
       恶意代码放在这里                返回地址覆盖为这里的地址
```

当函数返回时，CPU 跳转到 shellcode，开始执行攻击者注入的代码。

### 示例：确定偏移量

使用 GDB 确定 buffer 到返回地址的偏移：

```bash
gdb ./vuln
(gdb) run AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHIIIIJJJJ
(gdb) info registers rip
rip  0x46464646          # 0x46 = 'F'，说明返回地址被 FFFF 覆盖了
                        # 偏移量 = 16 (A*4 + B*4 + C*4 + D*4 = 16 字节到 E)
                        # 实际上是 20 字节（A-D = 16 + E = 20）
```

> 💡 这种确定偏移的方法叫**模式串（pattern）**——现代利用框架如 `pwntools` 能自动计算偏移。

## 栈保护机制——操作系统如何防御

### 栈金丝雀（Stack Canary / Stack Guard）

编译器在缓冲区和 BP 之间插入一个**随机值**（canary），函数返回前检查它是否被修改：

```asm
_vulnerable:
    push   rbp
    mov    rbp, rsp
    sub    rsp, 0x18
    ; 从线程本地存储加载 canary 值
    mov    rax, QWORD PTR [fs:0x28]    ; Linux 的 canary 来源
    mov    QWORD PTR [rbp-0x08], rax   ; 存在栈上
    
    ; ...函数体...
    
    ; 返回前检查 canary
    mov    rax, QWORD PTR [rbp-0x08]
    xor    rax, QWORD PTR [fs:0x28]
    je     .no_smash
    call   __stack_chk_fail            ; ❌ canary 被破坏了！

.no_smash:
    leave
    ret
```

加上 canary 后的栈布局：

```
    ┌──────────────────┐
    │  返回地址         │
    ├──────────────────┤
    │  旧 BP            │
    ├──────────────────┤
    │  CANARY（随机值） │  ← 攻击者要覆盖返回地址，必须先过这一关
    ├──────────────────┤
    │  buffer[0..7]    │  ← 输入从这里开始写
    └──────────────────┘
```

> 💡 canary 名字灵感来自煤矿中的金丝雀——矿工带金丝雀下井，如果瓦斯泄漏金丝雀先死，人就赶紧撤。栈金丝雀也一样——缓冲区溢出先破坏 canary，程序在崩溃前就能检测到。

**在现代编译器中的默认设置：**
- GCC：`-fstack-protector` 或 `-fstack-protector-strong`（**默认开启**）
- MSVC：`/GS`（默认开启）
- 要关闭需显式：`-fno-stack-protector`

### 不可执行栈（NX Bit / DEP）

现代 CPU 支持**页级权限控制**——标记栈为**不可执行**：

```
传统架构：                          现代架构：
栈 = 可读 + 可写 + 可执行 ❌        栈 = 可读 + 可写 ✅
                                              不可执行 ❌
```

即使攻击者把 shellcode 注入到了缓冲区中，CPU 执行到栈上的代码时会直接触发异常——因为栈页被标记为不可执行。

检查程序的 NX 状态：

```bash
gcc -o prog prog.c
readelf -l prog | grep GNU_STACK
GNU_STACK      0x000000 0x00000000 0x00000000 0x00000 0x00000 RW  # 没有 X！
```

`RW` 表示栈可读可写，但没有**可执行**权限。如果看到 `RWE`（有 E），说明栈是可执行的。

### 地址空间布局随机化（ASLR）

每次程序运行时，**栈的基地址随机化**：

```bash
# 第一次运行
./vuln "AAAA"
buffer address: 0x7fffffffe500

# 第二次运行
./vuln "AAAA"
buffer address: 0x7fffffffe310  # 不同了！
```

ASLR 让攻击者无法硬编码 shellcode 的地址——即使找到了漏洞，也不知道往哪跳。

检查 ASLR 状态：

```bash
cat /proc/sys/kernel/randomize_va_space
2    # 0=关闭, 1=部分随机化, 2=完全随机化（大多数 Linux 默认）
```

## 三层防御体系

现代系统对栈溢出攻击有多层防御：

| 防御层 | 作用 | 绕过难度 |
|-------|------|---------|
| **栈金丝雀** | 检测缓冲区是否溢出 | ⭐⭐ 需要泄漏 canary 值 |
| **NX / DEP** | 栈上代码不可执行 | ⭐⭐⭐ 需要 ROP 等技术 |
| **ASLR** | 地址随机化 | ⭐⭐⭐⭐ 需要信息泄漏 |
| **CFI（控制流完整性）** | 限制间接跳转目标 | ⭐⭐⭐⭐⭐ 最新防御 |

> 💡 单一漏洞在今天几乎不可能被利用——攻击者通常需要同时绕过多层防御，找到**信息泄漏 + 栈溢出**的组合漏洞。

## 实际案例：历史上的著名缓冲区溢出

### Morris 蠕虫（1988）

第一个互联网蠕虫。利用 UNIX `fingerd` 服务的 `gets()` 函数缓冲区溢出——`gets()` 不检查输入长度，允许任意长的输入。

**影响**：感染约 6000 台计算机（当时互联网的 10%），导致宕机和经济损失。

### Code Red（2001）

利用 Microsoft IIS 服务器的缓冲区溢出漏洞。蠕虫在受感染的服务器上植入代码，用于 DDoS 攻击白宫网站。

**影响**：超过 35 万台服务器被感染。

### Heartbleed（2014，CVE-2014-0160）

严格来说不是缓冲区溢出而是**越界读取**——OpenSSL 的心跳扩展没有检查请求长度，可能泄露服务器内存中的私钥和密码。

**影响**：影响约 50% 的 HTTPS 网站，是有史以来最严重的加密漏洞之一。

## 安全编程实践

### 永远使用安全的字符串函数

```c
// ❌ 不安全
char buf[8];
strcpy(buf, input);        // 不检查长度
gets(buf);                 // 最危险——没有长度参数
sprintf(buf, "%s", input); // 不检查长度

// ✅ 安全
char buf[8];
strncpy(buf, input, sizeof(buf) - 1);  // 限制拷贝长度
buf[sizeof(buf) - 1] = '\0';           // 确保以 null 结尾
snprintf(buf, sizeof(buf), "%s", input); // 安全的格式化版本
```

### 推荐的安全函数对比

| 不安全函数 | 替代安全函数 | 说明 |
|-----------|------------|------|
| `gets()` | `fgets(buf, size, stdin)` | gets 没有任何长度控制 |
| `strcpy()` | `strncpy()` / `strlcpy()` | 限制拷贝字节数 |
| `strcat()` | `strncat()` | 限制追加字节数 |
| `sprintf()` | `snprintf()` | 指定输出缓冲区大小 |
| `scanf("%s")` | `scanf("%Ns")` | 指定最大长度 N |

### 编译时启用保护

```bash
gcc -fstack-protector-strong -o prog prog.c    # 栈保护（默认已开启）
gcc -z execstack -o prog prog.c                # 让栈可执行（⚠️ 危险，只在特殊场景使用）
gcc -z noexecstack -o prog prog.c              # 栈不可执行（推荐）
gcc -pie -fPIE -o prog prog.c                  # 启用 ASLR 支持
```

## 其他类型的溢出

### 堆溢出（Heap Overflow）

栈溢出覆盖返回地址，**堆溢出**覆盖的是堆上相邻的内存块——比如覆盖下一个内存块的元数据：

```c
void heap_vuln() {
    char* a = malloc(8);   // 在堆上分配
    char* b = malloc(8);
    strcpy(a, very_long_input);  // ❌ 溢出到 b 的区域
}
```

### 整数溢出导致缓冲区溢出

```c
void copy_data(size_t len) {
    // 如果 len 很大（如 0xFFFFFFFF），加 1 后变成 0——分配了 0 字节！
    char* buf = malloc(len + 1);  // ❌ 整数溢出！
    read(0, buf, len);           // 写入远超分配大小的数据
}
```

## 缓冲区溢出检测调试

用 GDB 分析崩溃：

```bash
gdb ./vuln
(gdb) run $(python3 -c "print('A'*24)")
Program received signal SIGSEGV

(gdb) info registers rip
rip  0x4141414141414141    # RIP 全被 'A' 覆盖了

(gdb) x/8gx $rsp           # 看栈顶数据
0x7fffffffe510: 0x4141414141414141 0x4141414141414141
0x7fffffffe520: 0x4141414141414141 0x4141414141414141
# 全是 A！

(gdb) bt
#0  0x0000000000401156 in vulnerable ()
#1  0x4141414141414141 in ?? ()     # 返回地址被覆盖了
```

## 小结

缓冲区溢出是最经典的软件安全漏洞——它的原理简单，但影响深远：

| 概念 | 要点 |
|------|------|
| **本质** | 写入超出缓冲区容量的数据，覆盖相邻栈内容 |
| **攻击目标** | 覆盖返回地址，劫持控制流 |
| **栈金丝雀** | 在缓冲区和返回地址间插入随机值，溢出检测 |
| **NX/DEP** | 栈页不可执行，阻止注入的代码运行 |
| **ASLR** | 每次运行的地址不同，阻止预测跳转目标 |
| **三层防御** | 现代系统需要绕过多层防护才能成功利用 |

**安全编程铁律：**
1. ✅ 永远检查输入长度
2. ✅ 使用安全的字符串函数（`strncpy`、`snprintf`）
3. ✅ 不要使用 `gets()`
4. ✅ 默认开启编译器保护（`-fstack-protector-strong`）
5. ✅ 启用 NX 和 ASLR

**为什么这很重要？** 缓冲区溢出不只是一个安全漏洞——它让你**从攻击者的视角理解计算机**：栈上的每一字节都有它的作用，超出边界的写入可能改变程序的控制流。理解了溢出，你才算真正理解了栈。

接下来，你将学习最后一个汇编进阶主题——如何用一条指令处理多个数据：[[simd-instructions|SIMD / 向量指令]]。
