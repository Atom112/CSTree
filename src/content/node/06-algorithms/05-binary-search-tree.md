---
id: binary-search-tree
title: 二叉搜索树（BST）
summary: 二叉搜索树（Binary Search Tree, BST）对每个节点，左子树所有值 < 节点值 < 右子树所有值——查找、插入、删除平均 O(log n)
difficulty: intermediate
order: 5
parent: binary-tree
children:
  - heap
  - balanced-tree
related: []
prerequisites:
  - binary-tree
tags:
  - algorithm
  - bst
  - tree
createdAt: 2026-06-12
---

## BST 的性质

```
      8
     / \
    3   10
   / \    \
  1   6    14
     / \   /
    4   7 13
```

对任意节点：左子树所有值 < 节点值 < 右子树所有值。中序遍历得到升序序列。

```python
def search(node, target):
    if not node or node.val == target:
        return node
    if target < node.val:
        return search(node.left, target)
    else:
        return search(node.right, target)
```

## 小结

| 操作 | 平均 | 最坏（退化为链表） |
|:----:|:----:|:-----------------:|
| 查找 | O(log n) | O(n) |
| 插入 | O(log n) | O(n) |
| 删除 | O(log n) | O(n) |

**为什么先学这个？** BST 的退化问题需要[[balanced-tree|平衡树（AVL/红黑树）]]来解决。
