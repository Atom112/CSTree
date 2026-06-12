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
---

## 常见复杂度

```
O(1)   常数时间     → 数组随机访问
O(log n) 对数时间   → 二分搜索
O(n)   线性时间     → 数组遍历
O(n log n)         → 归并排序、快排平均
O(n²)  平方时间     → 冒泡排序、嵌套循环
O(2^n) 指数时间     → 穷举搜索
O(n!)  阶乘时间     → 排列生成
```

## 如何分析

```python
def example(arr):
    print(arr[0])           # O(1)
    
    for x in arr:           # O(n)
        print(x)
    
    for i in range(len(arr)):   # O(n²)
        for j in range(len(arr)):
            print(arr[i], arr[j])
    
    # 总复杂度：O(1) + O(n) + O(n²) = O(n²)
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **大 O** | 算法效率的上界，描述增长趋势 |
| **常数可忽略** | O(2n) = O(n)，O(n²+n) = O(n²) |
| **空间复杂度** | 同样用大 O 表示额外内存使用 |

**为什么先学这个？** 理解复杂度后，了解算法理论的上限——[[p-vs-np|P vs NP 简述]]。
