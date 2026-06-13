---
id: binary-search
title: 二分搜索
summary: 二分搜索（Binary Search）每次把搜索范围缩小一半——在有序数组中查找目标值，时间复杂度 O(log n)
difficulty: beginner
order: 14
parent: array-linked-list
children: []
related: []
prerequisites:
  - array-linked-list
tags:
  - algorithm
  - search
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🎯 猜数字游戏——如果每次都猜中间

想一个 1 到 100 之间的数字，我来猜，你告诉我"大了"、"小了"或"对了"。

**最笨的方法**：从 1 开始逐个猜——1、2、3、4……最多要猜 100 次。

**聪明的方法**：每次都猜中间的数——
- 第一次猜 50 → 你说"小了"（范围变成 51-100）
- 第二次猜 75 → 你说"大了"（范围变成 51-74）
- 第三次猜 62 → 你说"小了"（范围变成 63-74）
- 第四次猜 68 → 你说"对了"！

**只猜了 4 次就找到了**。这就是二分搜索的核心思想——每猜一次，排除掉一半的可能性。

> 📖 **类比：翻字典**
>
> 你要在《现代汉语词典》里查"数据库"这个词。你不会从第一页开始翻——你会先翻到大概中间的位置，看到那页的字是"L"开头。"数据"的拼音是 shu……应该在"S"部分，比"L"晚。所以你往后翻，再翻到中间……
>
> 每次翻到当前范围的中间，根据看到的字决定往前还是往后。这就是二分搜索——和猜数字游戏的原理完全相同。

---

## 📐 二分搜索的原理

二分搜索（Binary Search）是在**有序数组**中查找目标值的高效算法：

```
在有序数组 [1, 3, 5, 7, 9, 11, 13, 15] 中找 7

[1, 3, 5, 7, 9, 11, 13, 15]
  ↑       ↑            ↑
 left    mid          right

arr[mid] = 7 → 找到了！ ✅
```

```
找 13 的过程：
1. left=0, right=7, mid=3, arr[3]=7 < 13 → left=mid+1
2. left=4, right=7, mid=5, arr[5]=11 < 13 → left=mid+1
3. left=6, right=7, mid=6, arr[6]=13 == 13 → 找到了！ ✅
```

**核心条件**：数组必须是**有序的**。如果数组无序，二分搜索就无效。

### 代码实现

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2  # 取中间位置
        
        if arr[mid] == target:
            return mid          # 找到了，返回下标
        elif arr[mid] < target:
            left = mid + 1      # 目标在右侧
        else:
            right = mid - 1     # 目标在左侧
    
    return -1  # 没找到
```

---

## ⚡ 为什么二分搜索这么快？——对数增长的本质

直观理解二分搜索的"快"：

| 数组大小 | 最多需要的比较次数 |
|:--------:|:----------------:|
| 10 | 4 |
| 100 | 7 |
| 1,000 | 10 |
| 10,000 | 14 |
| 100,000 | 17 |
| 1,000,000 | 20 |
| 1,000,000,000 | 30 |

**10 亿条数据，最多只需要比较 30 次。**

这是因为每次比较都把问题规模减半——从 n 到 n/2 到 n/4……直到 1。需要的次数就是 **log₂(n)**。

```python
# 线性搜索 vs 二分搜索的时间对比
# 在 100 万条数据中查找
# 线性搜索：最坏需要看 1,000,000 次
# 二分搜索：最坏需要看 20 次
```

> 💡 **对数刻度的直觉**：把数组大小翻一倍，二分搜索只增加一次比较。这就是 O(log n) 的威力——这也解释了为什么计算机科学中"对数"如此重要的原因。

---

## 🧩 二分搜索的变体

二分搜索的基本形式已经很有用，但在实际面试和工作中，你更常遇到的是它的几种变体：

### 变体 1：查找第一个等于 target 的位置（有重复元素）

```python
def find_first(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid       # 记录位置，继续在左边找第一个
            right = mid - 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result

# [1, 2, 3, 3, 3, 4, 5] 找 3 → 返回 2（第一个 3 的下标）
```

### 变体 2：查找最后一个等于 target 的位置

```python
def find_last(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    # 逻辑类似，找到 target 后继续在右边找
    # ...
```

### 变体 3：查找第一个大于等于 target 的元素

```python
def find_first_ge(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] >= target:
            right = mid - 1  # 即使相等，也在左边找更小的
        else:
            left = mid + 1
    return left  # left 就是第一个 >= target 的位置
```

### 变体 4：二分答案——在"值"上二分

有时候数组不是直接给你排好的，但"答案"的范围是单调的：

```python
# 例：求平方根（整数部分）
def sqrt_int(x):
    left, right = 0, x
    while left <= right:
        mid = (left + right) // 2
        if mid * mid <= x:
            left = mid + 1  # mid 可能是答案，但还要看看有没有更大的
        else:
            right = mid - 1
    return right  # right 就是满足 mid*mid <= x 的最大值

print(sqrt_int(16))  # 4
print(sqrt_int(8))   # 2
```

> 💡 **二分答案**是非常有用的技巧。当一个问题需要查找某个值，而这个值的"有效性"具有单调性时（比如 "高度越高越不可能"），就可以用二分搜索找到临界值。

---

## ⚠️ 二分搜索的常见错误

```python
# ❌ 错误 1：mid 计算溢出
mid = (left + right) // 2
# 当 left 和 right 很大时，left + right 可能溢出
# ✅ 正确写法：
mid = left + (right - left) // 2

# ❌ 错误 2：死循环
while left <= right:
    mid = (left + right) // 2
    if arr[mid] < target:
        left = mid  # ❌ 应该是 left = mid + 1
        # 当 left = mid 且 mid = left 时进入死循环
```

**二分搜索看似简单，但细节很容易出错**。一个著名的统计显示，80% 的程序员第一次写二分搜索都有 bug。常见陷阱：
- 循环条件用 `<` 还是 `<=`
- `left` 和 `right` 的更新是 `mid` 还是 `mid ± 1`
- `mid` 的计算是否会有整数溢出

建议不确定时，用**小规模数据**手动模拟一遍再写代码。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **二分搜索** | 在有序数组中每次缩小一半搜索范围 |
| **时间复杂度** | O(log n)——10 亿数据最多查 30 次 |
| **前提条件** | 数组必须有序 |
| **mid 计算** | `left + (right - left) // 2` 防溢出 |
| **二分答案** | 在"值的范围"上二分，解决单调性问题 |

> 🎯 **小练习**：给定一个已排序的旋转数组 `[4, 5, 6, 7, 0, 1, 2]`（原来有序的数组在某个未知点旋转了），设计一个 O(log n) 的算法查找目标值。提示：虽然整个数组不是全部有序，但**二分后有一半是有序的**。

**为什么先学这个？** 二分是分治思想的经典体现。接下来深入学习[[recursion-divide-conquer|递归与分治]]。
