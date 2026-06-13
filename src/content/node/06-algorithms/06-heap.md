---
id: heap
title: 堆（Heap）与优先队列
summary: 堆是完全二叉树——最大堆的父节点 >= 子节点，最小堆相反。插入和删除堆顶 O(log n)，常用于优先队列和堆排序
difficulty: intermediate
order: 6
parent: binary-search-tree
children:
  - advanced-sort
related: []
prerequisites:
  - binary-tree
tags:
  - algorithm
  - heap
  - priority-queue
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🏥 急诊室的优先级——先到的未必先治

你因为发烧去了医院急诊。你挂号是第 15 号，前面有 14 个人排队。

但突然进来一个心跳骤停的病人——医生立刻把他推进了抢救室。你前面的 14 个人都没意见，因为你（和所有人）都知道：**急诊是按病情严重程度排序的，不是按先来后到。**

这就是 **优先队列（Priority Queue）** 的思想——和普通队列不同，优先级高的**先出队**，和入队顺序无关。

而堆（Heap）就是实现优先队列最高效的数据结构。

> 🏪 **类比：医院急诊分诊**
>
> - 普通队列 = 食堂排队——先来的先服务（FIFO）
> - 优先队列 = 急诊——病情最严重的人先治（优先级最高）
>
> "病情严重程度"就是"优先级"——护士分诊时给你一个"优先级分数"，分数最高的先进抢救室。这和堆的"最大元素优先出队"完全一致。

---

## 🌳 堆是什么？

**堆（Heap）** 是一种特殊的完全二叉树：

- **最大堆（Max Heap）**：每个父节点的值 **>=** 子节点的值（堆顶是最大值）
- **最小堆（Min Heap）**：每个父节点的值 **<=** 子节点的值（堆顶是最小值）

```
最大堆示例：
        90
       /  \
      72   68
     / \   / \
    40  55 45  30
   / \
  35 20

每个父节点 >= 它的子节点 → 堆顶 90 是整个堆的最大值
```

**注意**：堆只保证父节点和子节点之间的大小关系，**不保证兄弟节点之间的大小关系**——40 和 55 的顺序不重要，35 比 40 小也正确。

> 💡 **这和 BST 的区别很大**：
> - BST 要求左子 < 父 < 右子（严格有序）
> - 堆只要求父 >= 子（或父 <= 子），不要求左右子的大小关系
> - 所以堆是"部分有序"的——它只保证堆顶是最大（或最小）的

### 堆的存储——用数组

堆虽然逻辑上是二叉树，但实际用数组存储——因为堆是完全二叉树，可以紧凑排列：

```
数组： [90, 72, 68, 40, 55, 45, 30, 35, 20]
下标：  0   1   2   3   4   5   6   7   8

关系：
- 下标 i 的父节点： (i-1) // 2
- 下标 i 的左子节点： 2*i + 1
- 下标 i 的右子节点： 2*i + 2
```

```python
# 验证：下标 1（值 72）
# 父节点：(1-1)//2 = 0 → 90 ✅
# 左子节点：2*1+1 = 3 → 40 ✅
# 右子节点：2*1+2 = 4 → 55 ✅
```

---

## 🔧 堆的核心操作

### 插入（push）——把新元素放在最后，然后"上浮"

```python
def heap_push(heap, val):
    heap.append(val)            # 先放到末尾
    _sift_up(heap, len(heap)-1)  # 然后上浮

def _sift_up(heap, i):
    # 当子节点大于父节点时，交换（以最大堆为例）
    while i > 0:
        parent = (i - 1) // 2
        if heap[i] <= heap[parent]:
            break
        heap[i], heap[parent] = heap[parent], heap[i]
        i = parent
```

```
插入 85 到 [90, 72, 68, 40, 55]：
1. 放到末尾 → [90, 72, 68, 40, 55, 85]
2. 85 和父节点 68 比 → 85 > 68 → 交换
3. [90, 72, 85, 40, 55, 68]
4. 85 和新父节点 90 比 → 85 < 90 → 停止 ✅
```

### 删除堆顶（pop）——把最后一个元素移到堆顶，然后"下沉"

```python
def heap_pop(heap):
    if not heap:
        return None
    max_val = heap[0]              # 堆顶（最大值）
    last = heap.pop()              # 取出最后一个元素
    if heap:
        heap[0] = last             # 移到堆顶
        _sift_down(heap, 0)        # 然后下沉
    return max_val

def _sift_down(heap, i):
    n = len(heap)
    while True:
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        if left < n and heap[left] > heap[largest]:
            largest = left
        if right < n and heap[right] > heap[largest]:
            largest = right
        if largest == i:
            break
        heap[i], heap[largest] = heap[largest], heap[i]
        i = largest
```

```
删除堆顶 90：
1. 取出 90，把最后一个 20 移到堆顶
2. [20, 72, 68, 40, 55, 45, 30, 35]
3. 20 和较大的子节点 72 交换 → [72, 20, 68, 40, 55, 45, 30, 35]
4. 20 和较大的子节点 55 交换 → [72, 55, 68, 40, 20, 45, 30, 35]
5. 20 和子节点 35 交换 → [72, 55, 68, 40, 35, 45, 30, 20] ✅
```

### 建堆（heapify）——把无序数组变成堆

```python
def heapify(arr):
    # 从最后一个非叶子节点开始下沉
    for i in range(len(arr) // 2 - 1, -1, -1):
        _sift_down(arr, i)
    return arr
```

**时间复杂度**：O(n)——看起来是 O(n log n)，但数学证明是 O(n)。每个节点下沉的高度不同，底层节点最多下沉 1 层，顶层节点下沉 log n 层，总和是 O(n)。

---

## ⏱️ 堆的操作复杂度

| 操作 | 时间复杂度 | 说明 |
|:----:|:----------:|------|
| 查看堆顶（peek） | O(1) | 直接取 `heap[0]` |
| 插入（push） | O(log n) | 上浮最多 log n 层 |
| 删除堆顶（pop） | O(log n) | 下沉最多 log n 层 |
| 建堆（heapify） | O(n) | 从 n/2 个节点开始下沉 |

---

## 🏢 堆的经典应用

### 应用 1：优先队列

Python 的 `heapq` 模块实现了最小堆：

```python
import heapq

# 创建堆
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 3)
heapq.heappush(heap, 7)
heapq.heappush(heap, 1)

print(heapq.heappop(heap))  # 1（最小值先出）
print(heapq.heappop(heap))  # 3
print(heapq.heappop(heap))  # 5

# 直接列表转堆
nums = [5, 3, 7, 1]
heapq.heapify(nums)
print(nums)  # [1, 3, 7, 5]（堆结构）
```

### 应用 2：堆排序

堆排序的思路很简单：
1. 建堆（O(n)）
2. 重复取堆顶（n 次 O(log n)）
3. 总复杂度：O(n log n)

```python
def heap_sort(arr):
    heapq.heapify(arr)            # O(n)
    return [heapq.heappop(arr) for _ in range(len(arr))]  # O(n log n)
```

堆排序的特别之处：**不需要额外空间**（原地排序），且最坏情况也是 O(n log n)。

### 应用 3：Top K 问题

"从 1 亿个数中找出最大的 100 个"——这是堆最经典的应用场景。

```python
def find_top_k(nums, k):
    # 维护一个大小为 k 的最小堆
    heap = []
    for num in nums:
        if len(heap) < k:
            heapq.heappush(heap, num)         # 堆未满，直接入堆
        elif num > heap[0]:
            heapq.heappop(heap)               # 弹出最小值
            heapq.heappush(heap, num)         # 加入更大的数
    return heap  # 堆中的 k 个数就是最大的 k 个
```

**为什么是 O(n log k) 而不是 O(n log n)？** 因为我们维护的是大小为 k 的堆——k 远小于 n。当 k = 100, n = 1 亿时，n log k ≈ 1 亿 × 7，而 n log n ≈ 1 亿 × 27——差了约 4 倍。

---

## 🎯 堆 vs 其他数据结构

| 操作 | 堆 | BST | 有序数组 | 链表 |
|:----:|:--:|:---:|:--------:|:----:|
| 插入 | O(log n) | O(log n) | O(n) | O(1) |
| 取最大值 | O(log n) | O(log n) | O(1) | O(n) |
| 查看最大值 | O(1) | O(log n)* | O(1) | O(n) |
| 空间 | O(n) | O(n) | O(n) | O(n) |

> *BST 的最右节点是最大值，查找需要 O(log n)。

**堆的独特优势**：插入和取最大值都在 O(log n) 级别，而且**最坏情况**也是 O(log n)——不像 BST 会退化。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **堆（Heap）** | 完全二叉树，父节点 >= 子节点（最大堆）|
| **堆顶** | 最大值（最大堆）或最小值（最小堆）|
| **上浮（sift up）** | 新元素从底部上浮到正确位置 |
| **下沉（sift down）** | 堆顶元素下沉到正确位置 |
| **建堆（heapify）** | 从 n/2 到 0 依次下沉——O(n) |
| **优先队列** | 堆是实现优先队列的标准方式 |
| **Top K** | 用大小为 k 的堆在 O(n log k) 内解决 |

> 🎯 **小练习**：给定一个不断涌入的数据流，你需要随时能获取当前所有数据的中位数。如何用两个堆（一个最大堆、一个最小堆）来实现？（提示：最大堆放较小的半数，最小堆放较大的半数）

**为什么先学这个？** 堆是[[advanced-sort|堆排序]]的基础。理解了堆，你就可以用堆来实现 O(n log n) 的排序。下一步看看更平衡的树结构——[[balanced-tree|平衡树（AVL/红黑树）]]。
