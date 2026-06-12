---
id: binary-tree
title: 二叉树与遍历
summary: 二叉树（Binary Tree）每个节点最多有两个子节点——前序、中序、后序、层序遍历是树操作的基础
difficulty: intermediate
order: 4
parent: hash-table
children:
  - binary-search-tree
  - graph-representation
related: []
prerequisites:
  - stack-queue
tags:
  - algorithm
  - tree
  - traversal
createdAt: 2026-06-12
---

## 二叉树的遍历

```python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

# 前序：根→左→右
def preorder(node):
    if not node: return
    print(node.val)      # 根
    preorder(node.left)  # 左
    preorder(node.right) # 右

# 中序：左→根→右
def inorder(node):
    if not node: return
    inorder(node.left)
    print(node.val)      # BST 中序 = 从小到大
    inorder(node.right)

# 后序：左→右→根
def postorder(node):
    if not node: return
    postorder(node.left)
    postorder(node.right)
    print(node.val)      # 用于删除、释放
```

## 小结

| 遍历 | 顺序 | 应用 |
|:----:|:----:|------|
| **前序** | 根→左→右 | 序列化树 |
| **中序** | 左→根→右 | BST 排序输出 |
| **后序** | 左→右→根 | 删除树，表达式求值 |

**为什么先学这个？** 二叉树是 BST、堆等高级树结构的基础。继续学习[[binary-search-tree|二叉搜索树（BST）]]。
