---
id: big-o-notation
title: 时间复杂度与大 O
summary: 大 O 表示法（Big O Notation）描述算法效率随输入规模增长的"趋势"——它忽略常数和低阶项，只关注增长最快的部分
difficulty: intermediate
order: 19
parent: recursion-divide-conquer
children:
  - p-vs-np
related: []
prerequisites:
  - recursion-divide-conquer
tags:
  - algorithm
  - complexity
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🐢 为什么有的程序"越跑越慢"？

你写了一个程序，对自己说"跑一下试试"。输入 10 条数据——瞬间出结果。输入 100 条——也很快。输入 10000 条——有点慢了。输入 100 万条——几个小时还没跑完。

**这个程序到底有多快？**

评价算法效率不能只看"跑 10 条数据花了 0.1 秒"——因为数据量一变，结果就完全不一样了。

我们需要一个**和数据量无关**的衡量方式——**大 O 表示法（Big O Notation）**。它描述的是**当输入规模 n 增长时，算法的运行时间（或内存）增长的"趋势"**。

> 🧭 **类比：三种找失物的方式**
>
> 你的钥匙掉在了学校礼堂里，礼堂有 N 个座位。
>
> **O(1) —— 常数时间**：你记得钥匙就掉在第一排第一个座位下面。直接走过去拿。不管礼堂有 100 个还是 10000 个座位，你的时间都一样。
>
> **O(n) —— 线性时间**：你从第一排开始，一排一排地找。礼堂越大，花的时间越长——座位数和时间成正比。
>
> **O(n²) —— 平方时间**：你让管理员把所有学生的学号和座位号都列出来，一个个比对。管理员给的数据量是 N²——因为每个学生可能和多个座位关联。
>
> 大 O 就是用来量化"当 n 变大时，时间会怎样变"的。

---

## 📊 常见复杂度速览

```
复杂度      名称         例子                       n=1000 时的操作数
──────     ──────       ──────                    ───────────────────
O(1)       常数时间     数组随机访问、哈希表查找    1
O(log n)   对数时间     二分搜索                   ~10
O(n)       线性时间     遍历数组                  1,000
O(n log n) 线性对数     归并排序、快排平均          ~10,000
O(n²)      平方时间     冒泡排序、嵌套循环         1,000,000
O(n³)      立方时间     三重循环、Floyd 算法       1,000,000,000
O(2ⁿ)      指数时间     穷举搜索、子集生成         天文数字
O(n!)      阶乘时间     全排列生成                 天文数字
```

### 直观理解增长差异

假设你的电脑每秒能执行 100 万次操作：

| 数据量 | O(n) | O(n log n) | O(n²) | O(2ⁿ) |
|:-----:|:----:|:----------:|:-----:|:-----:|
| 10 | 0.00001 秒 | 0.00003 秒 | 0.0001 秒 | 0.001 秒 |
| 100 | 0.0001 秒 | 0.0007 秒 | 0.01 秒 | **4 × 10¹⁶ 年** |
| 1000 | 0.001 秒 | 0.01 秒 | 1 秒 | — |
| 10000 | 0.01 秒 | 0.13 秒 | 1.7 分钟 | — |
| 10⁶ | 1 秒 | 20 秒 | 11.6 天 | — |
| 10⁸ | 1.7 分钟 | 44 分钟 | 317 年 | — |

> 💡 注意看 O(2ⁿ) 那列——n=100 时，宇宙的年龄都不够它跑完。这就是为什么"指数爆炸"这么可怕。

---

## 📐 如何分析一段代码的时间复杂度

### 规则 1：只关注增长最快的项

```python
def example(arr):
    print(arr[0])                # O(1)
    
    for x in arr:                # O(n)
        print(x)
    
    for i in range(len(arr)):    # O(n²)
        for j in range(len(arr)):
            print(arr[i], arr[j])
    
    # 总时间 = O(1) + O(n) + O(n²)
    # 只保留增长最快的 → O(n²)
```

**大 O 看的是"当 n → ∞ 时的趋势"**——常数项、低阶项在大 n 面前都不重要。

### 规则 2：常数系数不关心

```python
# 这两个都是 O(n) —— 常数系数 100 不影响增长趋势
def linear1(arr):
    for x in arr:
        print(x)

def linear100(arr):
    for x in arr:
        for _ in range(100):  # 每次迭代做 100 次操作
            print(x)
```

O(100n) = O(n)，O(n/2) = O(n)——常数系数不重要。

### 规则 3：多个输入要分别考虑

```python
def compare(arr1, arr2):
    for x in arr1:       # O(n)
        print(x)
    for y in arr2:       # O(m)
        print(y)
    # 总复杂度：O(n + m)——不能简化成 O(n)
```

### 规则 4：递归的时间复杂度

```python
# 二分递归：T(n) = T(n/2) + O(1) → O(log n)
def binary_search(arr, target, l, r):
    if l > r:
        return -1
    mid = (l + r) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search(arr, target, mid+1, r)
    else:
        return binary_search(arr, target, l, mid-1)

# 双重递归：T(n) = 2T(n/2) + O(n) → O(n log n)
def merge_sort(arr):
    # ...每层 O(n)，一共 log n 层...
```

---

## 🏢 实战分析

```python
def find_duplicates(arr):
    """
    找出数组中的重复元素
    """
    # 方法 1：暴力法 O(n²)
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                print(f"重复: {arr[i]}")
    
    # 方法 2：哈希表法 O(n)
    seen = set()
    for x in arr:
        if x in seen:
            print(f"重复: {x}")
        seen.add(x)
    
    # 方法 3：排序法 O(n log n)
    arr.sort()
    for i in range(len(arr) - 1):
        if arr[i] == arr[i + 1]:
            print(f"重复: {arr[i]}")
```

```python
# n=10000 时的时间：
# 暴力法：10000² = 1 亿次    → 可能几秒
# 哈希表：10000 次           → 毫秒
# 排序法：10000 log 10000 ≈ 10000×13 = 13 万次 → 毫秒

# n=1000000 时：
# 暴力法：10¹² 次            → 几天到几周
# 哈希表：100 万次            → 毫秒
# 排序法：100万 × 20 = 2000 万次 → 可能零点几秒
```

---

## 💾 空间复杂度

和"时间"一样，也关心"内存"的增长趋势：

```python
# O(1) 空间——无论数组多大，只用固定几个变量
def constant_space(arr):
    total = 0
    for x in arr:
        total += x
    return total

# O(n) 空间——需要和输入一样大的额外数组
def linear_space(arr):
    result = [x * 2 for x in arr]  # 新数组和原数组一样大
    return result

# O(n²) 空间——需要二维矩阵
def quadratic_space(n):
    matrix = [[0] * n for _ in range(n)]  # n×n 矩阵
    return matrix
```

---

## 🧠 时间复杂度分析的直觉

```
看到"单层循环"         → 通常是 O(n)
看到"双层嵌套循环"     → 通常是 O(n²)
看到"三层嵌套循环"     → 通常是 O(n³)
看到"每次规模减半"     → 通常是 O(log n)（二分）
看到"每次规模减半 + 单层遍历" → O(n log n)（归并/快排）
看到"分叉递归"         → 小心！可能是 O(2ⁿ)
看到"问题包含子集"     → 可能是 O(2ⁿ)
看到"问题包含排列"     → 可能是 O(n!)
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **大 O（Big O）** | 算法效率的"上界"——描述增长趋势 |
| **O(1)** | 常数时间 —— 和数据量无关 |
| **O(log n)** | 对数时间 —— 每次规模减半 |
| **O(n)** | 线性时间 —— 数据量和时间成正比 |
| **O(n log n)** | 线性对数 —— 大多数排序的速度 |
| **O(n²)** | 平方时间 —— 双重循环 |
| **O(2ⁿ)** | 指数时间 —— n 稍微一大就跑不动 |
| **空间复杂度** | 同样用大 O 描述额外内存使用 |

> 🎯 **小练习**：分析下面这段代码的时间复杂度：
> ```python
> for i in range(n):
>     for j in range(i, n):
>         print(i, j)
> ```
> （提示：外层 n 次，内层平均 n/2 次——但记住常数不重要。）

**为什么先学这个？** 理解了大 O 之后，最后来了解计算机科学最大的未解之谜——[[p-vs-np|P vs NP 简述]]。
