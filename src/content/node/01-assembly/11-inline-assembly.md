---
id: inline-assembly
title: 内联汇编与 C 混合编程
summary: 在 C 代码中直接嵌入汇编指令，既能享受高级语言的开发效率，又能在关键处发挥汇编的性能优势——这是操作系统内核、嵌入式系统和游戏引擎的常用技巧
difficulty: advanced
order: 11
parent: recursion-assembly
children:
  - disassembly-debugging
related:
  - recursion-assembly
  - stack-frames
  - parameter-passing
prerequisites:
  - recursion-assembly
tags:
  - assembly
  - c
  - inline-asm
createdAt: 2026-06-12
---

## 为什么要混合编程？

高级语言（C、C++）写起来快、可读性强、可移植——但有时候你必须"插手"到底层：

- **访问特殊指令**：C 语言没有对应的操作（比如 CPU 的关中断、内存屏障）
- **极致性能**：某些热点代码手写汇编比编译器生成的快 2-10 倍
- **直接操作硬件**：操作系统的上下文切换、设备驱动
- **调用约定不兼容**：某些底层函数只能用汇编实现

### 类比：开车 vs 步行

- **纯 C 编程** = 开车去目的地——快、省力，但有些小巷子开不进去
- **纯汇编编程** = 步行——哪里都能去，但走得慢、累
- **C + 汇编混合** = 开车到巷口，下车走几步——**既有速度又有灵活性**

## GCC 内联汇编基础

GCC 编译器支持在 C 代码中嵌入汇编，使用 `__asm__` 关键字（或简写 `asm`）：

```c
// 最基本的用法
__asm__("nop");  // 插入一条空操作指令
```

### 为什么用 `__asm__` 而不是 `asm`？

ANSI C 标准把 `asm` 保留给了其他用途，`__asm__` 是 GCC 的安全扩展名——在任何编译模式下都能用。GCC 也支持 `asm`，但如果用了 `-ansi` 或 `-std=c99` 等严格模式，`asm` 会报错。

> 💡 建议始终使用 `__asm__`，需要兼容 C 标准的场景下不会出问题。

### 多个指令

```c
__asm__(
    "movl %eax, %ebx\n\t"
    "pushl %ecx\n\t"
    "popl %edx"
);
```

每条指令后加 `\n\t` 是为了让 GCC 生成的汇编代码保持格式整齐——如果省略，多条指令可能挤在一行导致汇编器报错。

## 扩展内联汇编（Extended Asm）

### 基本语法

```c
__asm__ volatile(
    "指令模板"
    : 输出操作数    /* 可选 */
    : 输入操作数    /* 可选 */
    : 破坏列表      /* 可选 */
);
```

| 部分 | 含义 | 是否必须 |
|------|------|---------|
| `指令模板` | 汇编指令字符串 | ✅ 必须 |
| `输出操作数` | C 变量名 ← 汇编结果 | ❌ 可选 |
| `输入操作数` | C 变量名 → 汇编使用 | ❌ 可选 |
| `破坏列表` | 告诉编译器哪些寄存器/内存被修改了 | ❌ 可选 |
| `volatile` | 禁止编译器优化掉这段汇编 | ❌ 可选 |

### 操作数约束（Operand Constraints）

汇编和 C 之间传递数据，使用 `%0`, `%1`, `%2`……引用操作数：

```c
int a = 10, b = 20, result;

__asm__(
    "addl %2, %1\n\t"   /* %1 = %1 + %2 */
    "movl %1, %0"       /* %0 = %1 */
    : "=r" (result)     /* 输出：result 绑定到某个寄存器 */
    : "r" (a), "r" (b)  /* 输入：a → %1, b → %2 */
    :                   /* 没有破坏的寄存器 */
);
// result = a + b = 30
```

这里 `%0` = 输出（result），`%1` = 输入（a），`%2` = 输入（b）。

> ⚠️ 注意编号规则：**输出最先**——`%0` 永远是最左边的输出操作数，然后从左到右依次是输入操作数。

### 常用约束

| 约束 | 含义 |
|------|------|
| `"r"` | 通用寄存器 |
| `"m"` | 内存地址 |
| `"i"` | 立即数（常量） |
| `"g"` | 任意：寄存器、内存、立即数 |
| `"=r"` | 输出到寄存器（`=` 表示只写） |
| `"+r"` | 既可读又可写（`+` 表示读写） |

### 实践：加法

用 `"+r"` 约束简化上面的加法：

```c
int a = 10, b = 20;
__asm__(
    "addl %1, %0"       /* %0 += %1 */
    : "+r" (a)          /* a 既是输入又是输出 */
    : "r" (b)           /* b 是输入 */
);
// a = 30
```

### 实践：自定义系统调用（x86 Linux）

Linux 通过 `int 0x80` 或 `syscall` 指令进行系统调用。C 标准库封装了这些调用，但你可以直接使用内联汇编：

```c
#include <unistd.h>

void my_exit(int status) {
    // Linux exit 系统调用
    // eax = 1 (系统调用号), ebx = status (参数)
    __asm__ volatile(
        "movl $1, %%eax\n\t"   /* 系统调用号：exit = 1 */
        "movl %0, %%ebx\n\t"   /* 退出码 */
        "int $0x80"            /* 触发系统调用 */
        :
        : "r" (status)
        : "eax", "ebx"
    );
}

void my_write(int fd, const char* buf, int len) {
    // write 系统调用号 = 4
    // eax = 4, ebx = fd, ecx = buf, edx = len
    __asm__ volatile(
        "movl $4, %%eax\n\t"
        "movl %0, %%ebx\n\t"
        "movl %1, %%ecx\n\t"
        "movl %2, %%edx\n\t"
        "int $0x80"
        :
        : "r" (fd), "r" (buf), "r" (len)
        : "eax", "ebx", "ecx", "edx"
    );
}
```

> 🔑 注意在 GCC 内联汇编中，引用寄存器要用 `%%eax`（两个百分号）——单 `%` 被保留给操作数引用。

## 实际运用：什么时候真的需要内联汇编？

```c
// 场景一：CPU 指令不支持直接用 C 实现
// 读取 CPU 时间戳计数器（性能分析用）
static inline unsigned long long read_tsc() {
    unsigned long long tsc;
    __asm__ volatile("rdtsc" : "=A" (tsc));
    return tsc;
}

// 场景二：原子操作（多线程无锁编程）
// 原子地做 "比较并交换"——实现锁的底层
static inline int atomic_cas(int* ptr, int old, int new) {
    int prev;
    __asm__ volatile(
        "lock cmpxchg %2, %1"
        : "=a" (prev), "+m" (*ptr)
        : "r" (new), "0" (old)
        : "memory"
    );
    return prev;
}

// 场景三：关中断（操作系统内核用）
static inline void disable_interrupts() {
    __asm__ volatile("cli");  // 关闭 CPU 中断
}
static inline void enable_interrupts() {
    __asm__ volatile("sti");  // 开启 CPU 中断
}
```

这三个场景（硬件交互、原子操作、系统控制）都是 C 语言无法直接表达的——必须用内联汇编。

### GCC 内联汇编的常用寄存器约束

x86 平台的具体约束字母：

| 约束 | 寄存器 |
|------|--------|
| `"a"` | %eax / %rax |
| `"b"` | %ebx / %rbx |
| `"c"` | %ecx / %rcx |
| `"d"` | %edx / %rdx |
| `"S"` | %esi / %rsi |
| `"D"` | %edi / %rdi |

指定具体寄存器，而不是让编译器任意分配：

```c
int result;
__asm__(
    "movl $42, %0"
    : "=a" (result)    /* 结果强制放在 %eax 中 */
);
// result = 42
```

## 替代的约束语法：操作数名称

当操作数很多时，`%0`、`%1` 难以阅读。GCC 支持给操作数起名字：

```c
int a = 3, b = 4, result;
__asm__(
    "addl %[val_b], %[val_a]\n\t"
    "movl %[val_a], %[res]"
    : [res] "=r" (result)
    : [val_a] "r" (a), [val_b] "r" (b)
);
```

这样比数 `%0`、`%1`、`%2` 清晰多了，尤其是有 5 个以上操作数的复杂内联汇编。

## 破坏列表（Clobber List）

破坏列表告诉编译器："我在这段汇编里修改了这些寄存器，你之前的假设可能不成立了。"

```c
__asm__(
    "movl $0, %%eax\n\t"
    "movl $1, %%ebx"
    :
    :
    : "eax", "ebx"    /* ← 通知编译器 eax 和 ebx 被修改了 */
);
```

### "memory" 破坏

如果汇编修改了内存（不只是寄存器），添加 `"memory"`：

```c
void atomic_increment(int* counter) {
    __asm__ volatile(
        "lock incl %0"         /* lock 前缀保证原子性 */
        : "+m" (*counter)
        :
        : "memory"             /* 通知编译器内存可能被修改 */
    );
}
```

> ⚠️ 如果忘了声明破坏列表，编译器可能会在汇编之后继续使用旧的寄存器值——导致难以追踪的数据错误。

## volatile 的作用

```c
// 不写 volatile，编译器可能优化掉"无用"的汇编
__asm__("nop");  // 如果编译器觉得 nop 没必要，可能直接删掉

// 加了 volatile，编译器必须保留
__asm__ volatile("nop");  // ✅ 强制插入
```

需要 `volatile` 的场景：
- 有副作用但不产生输出的汇编（如延迟循环、内存屏障）
- 多次执行相同的汇编但每次都需要运行（如读取时间戳计数器）

## 从 C 调用汇编函数

更常见的混合编程方式是：**用 C 写大部分代码，用汇编写个别函数**。

### 步骤 1：编写汇编函数（遵守 cdecl 约定）

```asm
; sum.asm — 计算数组元素之和
; int sum_array(int* arr, int count)
; 按照 cdecl 约定：
;   [BP + 8]  = arr（指针）
;   [BP + 12] = count
;   返回值在 AX 中

global _sum_array        ; 导出符号，让链接器能找到

_sum_array:
    PUSH BP
    MOV  BP, SP
    MOV  SI, [BP + 8]    ; SI = arr 指针
    MOV  CX, [BP + 12]   ; CX = count
    XOR  AX, AX          ; AX = 0（累加器）

.loop:
    ADD  AX, [SI]        ; AX += *arr
    ADD  SI, 2           ; arr++（假设是 16 位整数）
    DEC  CX              ; count--
    JNZ  .loop           ; 没数完就继续

    POP  BP
    RET
```

### 步骤 2：在 C 中声明外部函数

```c
// main.c
#include <stdio.h>

// 声明外部汇编函数
extern int sum_array(int* arr, int count);

int main() {
    int numbers[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    int total = sum_array(numbers, 10);
    printf("Sum = %d\n", total);  // 输出：Sum = 55
    return 0;
}
```

### 步骤 3：编译和链接

```bash
# 编译汇编文件
nasm -f elf sum.asm -o sum.o

# 编译 C 文件
gcc -c main.c -o main.o

# 链接
gcc main.o sum.o -o program

# 运行
./program
```

### 调用约定必须一致

C 函数默认使用 cdecl 调用约定，汇编函数也必须遵守：

| 规则 | cdecl 要求 |
|------|-----------|
| 参数传递 | 从右向左压入栈 |
| 栈清理 | 调用者清理 |
| 返回值 | EAX / RAX |
| 保存的寄存器 | EBP, EBX, ESI, EDI（被调用者保存） |

```asm
; 错误的汇编函数——破坏了 EBP 但没有恢复
_bad_func:
    MOV  BP, SP    ; ❌ 忘了 PUSH BP
    ; ...函数体...
    POP  BP        ; ❌ 这实际 POP 的是返回地址！
    RET
```

## 从汇编调用 C 函数

反过来，汇编代码也可以调用 C 函数：

```asm
; 在汇编中调用 C 函数 printf
; 需要遵守 cdecl 约定

extern _printf         ; 声明外部 C 函数

section .data
    msg db "Hello from assembly! %d", 10, 0
    val dd 42

section .text
    global _start

_start:
    ; 调用 printf("Hello from assembly! %d\n", 42)
    PUSH dword [val]   ; 第二个参数（从右向左压入）
    PUSH msg           ; 第一个参数
    CALL _printf
    ADD  SP, #8        ; 调用者清理栈（2 个参数 × 4 字节）

    ; 退出
    MOV  EAX, 1        ; exit 系统调用号
    XOR  EBX, EBX      ; 退出码 0
    INT  0x80
```

### C 函数名修饰（Name Mangling）

在不同的平台和编译器下，C 函数名在汇编中的写法不同：

| 平台 | C 函数 `foo` | 汇编符号名 |
|------|-------------|-----------|
| Linux (GCC) | `foo` | `foo` |
| Windows (MSVC) | `__stdcall foo` | `_foo@N` |
| Windows (GCC/MinGW) | `foo` | `_foo` |
| macOS | `foo` | `_foo` |

Linux 上最简单——C 函数名直接加下划线前缀。但为了跨平台，可以用编译器宏处理：

```c
// C 端
#ifdef _WIN32
    #define ASM_FUNC(name) _##name
#else
    #define ASM_FUNC(name) name
#endif

extern int ASM_FUNC(sum_array)(int*, int);
```

## 实战：内存屏障（Memory Barrier）

多核 CPU 中，指令重排可能导致数据不一致。内联汇编可以实现内存屏障：

```c
// 完全内存屏障——阻止所有指令重排
#define barrier() __asm__ volatile("" ::: "memory")

// x86 的 Store Barrier——确保之前的所有写入都完成
#define wmb() __asm__ volatile("sfence" ::: "memory")

// x86 的 Read Barrier——确保之前的所有读取都完成
#define rmb() __asm__ volatile("lfence" ::: "memory")

// 读写屏障
#define mb() __asm__ volatile("mfence" ::: "memory")

// 使用示例
void producer(int* buffer, int* ready) {
    buffer[0] = 42;
    buffer[1] = 100;
    wmb();              // 确保 buffer 写入完成后再设置 ready
    *ready = 1;         // 消费者看到 ready = 1 时，buffer 数据一定就绪了
}

int consumer(int* buffer, int* ready) {
    while (!*ready) {
        rmb();          // 确保每次读取 ready 都是最新的
    }
    rmb();              // 确保看到 ready = 1 后，buffer 数据是最新的
    return buffer[0] + buffer[1];
}
```

> 💡 C11 标准引入了 `stdatomic.h` 提供了跨平台的原子操作和内存顺序，尽量优先使用标准库而不是手写汇编屏障。

## 实战：读取 CPU 时间戳

x86 的 `RDTSC`（Read Time-Stamp Counter）指令读取 CPU 自启动以来的时钟周期数——用于极精确的性能测量：

```c
static inline unsigned long long read_tsc() {
    unsigned int lo, hi;
    __asm__ volatile(
        "rdtsc"
        : "=a" (lo), "=d" (hi)   // RDTSC 把低 32 位放入 EAX，高 32 位放入 EDX
    );
    return ((unsigned long long)hi << 32) | lo;
}

// 测量某段代码的耗时
unsigned long long start = read_tsc();
// ...要测量的代码...
unsigned long long end = read_tsc();
printf("Took %llu cycles\n", end - start);
```

## 常见错误

### 错误 1：忘记声明破坏列表

```c
int foo() {
    int x = 10;
    __asm__(
        "movl $42, %0\n\t"
        "movl $100, %%eax"    /* 偷偷改了 eax */
        : "=r" (x)
        // ❌ 忘了写 : "eax"
    );
    // 编译器假设 eax 还是原来的值——可能已经变了！
    return x;
}
```

### 错误 2：在 `"r"` 输入中修改寄存器

```c
int a = 5;
__asm__(
    "addl $10, %0"          /* %0 被修改了 */
    :
    : "r" (a)               /* ❌ "r" 是只读输入，不能修改 */
);
// 正确做法：用 "+r" (a)
```

### 错误 3：64 位和 32 位混淆

```c
// x86-64 下，寄存器是 64 位的
long long x = 10, y = 20;
__asm__(
    "addq %1, %0"           /* x86-64 用 addq 不是 addl */
    : "+r" (x)
    : "r" (y)
);
```

### 错误 4：编译器优化导致内联汇编被移动

```c
int flag = 0;

void unlock() {
    flag = 0;
}

void lock() {
    while (flag) {}
    // 编译器可能把下面的汇编提到循环之前！
    __asm__ volatile("mfence");  // 必须加 volatile 禁止重排
}
```

> 🔍 **GCC 内联汇编的调试技巧**：用 `-S` 选项编译（`gcc -S -O2 file.c`）查看生成的汇编代码，确认你的内联汇编被正确放置。

## 什么时候应该用内联汇编？什么时候不该？

| 应该用 ✅ | 不应该用 ❌ |
|-----------|------------|
| 访问特殊 CPU 指令（RDTSC, CPUID） | 普通算术运算（编译器优化的更好） |
| 操作系统底层（中断、上下文切换） | 为了"看起来更优化" |
| 锁和原子操作（无标准库时） | 为了避开 C 语言的学习 |
| 性能关键且编译器优化的不好 | 为了炫技 |
| 硬件驱动 | 95% 以上的场景都不需要 |

## 小结

C 和汇编混合编程是系统编程的"中级技能"——在需要底层控制时不必放弃高级语言的便利：

| 技术 | 适用场景 |
|------|---------|
| **内联汇编（Inline Asm）** | 短小精悍的指令，直接嵌入 C 代码 |
| **独立汇编函数** | 较大的汇编代码，用单独的 .asm 文件 |
| **从 C 调用汇编** | 性能关键函数手写优化 |
| **从汇编调用 C** | 汇编中需要使用 C 库函数 |

**三条铁律：**
1. ✅ **必须声明破坏列表**——否则编译器生成错误代码
2. ✅ **必须加 volatile（有副作用的场景）**——防止优化移除
3. ✅ **调用约定必须一致**——否则栈崩溃

**为什么这很重要？** 理解 C 和汇编的互操作，让你能够"跨层"思考——你既可以用高级语言快速开发，又能在需要时深入底层获取极致性能或硬件控制。

接下来，你将学习如何反过来——把编译好的程序"拆开"看：[[disassembly-debugging|反汇编与调试]]。
