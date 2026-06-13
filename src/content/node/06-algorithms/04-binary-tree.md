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
updatedAt: 2026-06-13
---

## 🌳 为什么需要"非线性的"数据结构？

到目前为止，我们学过的所有数据结构（数组、链表、栈、队列、哈希表）都是**线性**的——数据排成一排，一个接一个。

但现实世界中的很多关系不是线性的：

- 公司的**组织架构**——CEO 下面有各部门总监，总监下有经理，经理下有员工
- 你的**家谱**——祖父母下有父母，父母下有你和兄弟姐妹
- 计算机的**文件系统**——根目录下有子目录，子目录下还有子目录

这些结构都是**树（Tree）**——一种"一对多"的分层结构。

> 🌿 **类比：大学组织架构**
>
> 校长（根节点）下有各个学院（子节点），学院下有各个系（子子节点），系下有各个教研室（子子子节点）。
>
> 校长→信息学院→计算机系→算法实验室
>                   → 系统实验室
>            → 电子系
>       → 数学学院→应用数学系
>
> 这就是一棵树。每个节点都可以有多个"下属"，形成天然的层次关系。

---

## 🌲 二叉树——最简单的树

**二叉树（Binary Tree）** 是每个节点最多有两个子节点的树——"最多两个"的限制让它既简单又强大。

```
      1          ← 根节点（Root）
     / \
    2   3        ← 左右子节点
   / \   \
  4   5   6      ← 叶子节点（Leaf，没有子节点的节点）
```

### 基本术语

| 术语 | 含义 | 例子（上图中）|
|:----:|------|:------------:|
| **根节点（Root）** | 树的最顶层节点，没有父节点 | 1 |
| **叶子节点（Leaf）** | 没有子节点的节点 | 4, 5, 6 |
| **父节点（Parent）** | 某节点的上层节点 | 1 是 2 的父节点 |
| **子节点（Child）** | 某节点的下层节点 | 2 和 3 是 1 的子节点 |
| **深度（Depth）** | 从根到该节点的层数 | 节点 4 的深度为 3 |
| **高度（Height）** | 从该节点到最远叶子的层数 | 节点 2 的高度为 2 |

### 代码定义

```python
class TreeNode:
    def __init__(self, val):
        self.val = val      # 节点的值
        self.left = None    # 左子节点
        self.right = None   # 右子节点

# 构建上面那棵树
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
root.right.right = TreeNode(6)
```

---

## 🔄 二叉树的四种遍历方式

"遍历一棵树"就是把树中所有节点访问一遍。不同的遍历顺序适合不同的场景。

### ① 前序遍历（Preorder）——根 → 左 → 右

```python
def preorder(node):
    if not node:
        return
    print(node.val)        # 先访问根
    preorder(node.left)    # 再遍历左子树
    preorder(node.right)   # 最后遍历右子树

# 输出：1, 2, 4, 5, 3, 6
```

**应用场景**：**复制/序列化一棵树**——先有根才能递归构建子树。比如你要把一棵树的结构保存到文件，前序遍历是最自然的。

### ② 中序遍历（Inorder）——左 → 根 → 右

```python
def inorder(node):
    if not node:
        return
    inorder(node.left)     # 先遍历左子树
    print(node.val)        # 再访问根
    inorder(node.right)    # 最后遍历右子树

# 输出：4, 2, 5, 1, 3, 6
```

**应用场景**：在[[binary-search-tree|二叉搜索树（BST）]]中，中序遍历的结果是**从小到大**的排序——这是 BST 最重要的特性。

### ③ 后序遍历（Postorder）——左 → 右 → 根

```python
def postorder(node):
    if not node:
        return
    postorder(node.left)   # 先遍历左子树
    postorder(node.right)  # 再遍历右子树
    print(node.val)        # 最后访问根

# 输出：4, 5, 2, 6, 3, 1
```

**应用场景**：**删除一棵树**——你必须先删除子节点，才能删除父节点（不能先删了父节点再找子节点）。计算目录大小也是后序——先算子目录的大小再加总。

### ④ 层序遍历（Level Order）——逐层从左到右

```python
from collections import deque

def level_order(root):
    if not root:
        return
    queue = deque([root])
    while queue:
        node = queue.popleft()   # 出队
        print(node.val)          # 访问节点
        if node.left:
            queue.append(node.left)   # 左子入队
        if node.right:
            queue.append(node.right)  # 右子入队

# 输出：1, 2, 3, 4, 5, 6
```

**应用场景**：求树的"宽度"、最短路径（在无权图中）、打印二叉树逐层结构。

---

## 🧩 四种遍历方式对比

| 遍历 | 顺序 | 数据结构 | 应用 |
|:----:|:----:|:--------:|------|
| **前序** | 根→左→右 | 递归/栈 | 序列化树、表达式树求值 |
| **中序** | 左→根→右 | 递归/栈 | BST 排序输出（从小到大）|
| **后序** | 左→右→根 | 递归/栈 | 删除树、计算目录大小 |
| **层序** | 逐层顺序 | 队列 | BFS、最短路径、逐层打印 |

> 💡 **记忆技巧**："前中后"指的是**根节点被访问的时机**：
> - 前序 = 根最先（在左右子树之前）
> - 中序 = 根在中间（左之后、右之前）
> - 后序 = 根在最后（在左右子树之后）

---

## 🏗️ 二叉树的实现：递归 vs 迭代

上面的遍历都用了递归——代码最简洁。但递归有栈溢出风险（树很深时），也可以用**迭代**实现：

```python
# 前序遍历的迭代版本（用栈模拟递归）
def preorder_iterative(root):
    if not root:
        return
    stack = [root]
    while stack:
        node = stack.pop()
        print(node.val)
        # 注意：先右后左入栈，才能按左→右出栈
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
```

递归 vs 迭代的选择：

```
树的高度 < 1000 → 递归（简洁、易读）
树的高度 > 1000 → 迭代（防栈溢出）
性能敏感的场景  → 迭代（无函数调用开销）
```

---

## 🎯 二叉树的两个经典问题

### 问题 1：求二叉树的最大深度

```python
def max_depth(root):
    if not root:
        return 0
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    return max(left_depth, right_depth) + 1
```

经典的后序应用——先知道子树的高度，才能算出整棵树的高度。

### 问题 2：判断一棵树是否是平衡二叉树

```python
def is_balanced(root):
    def check(node):
        if not node:
            return 0, True
        left_h, left_ok = check(node.left)
        right_h, right_ok = check(node.right)
        if not left_ok or not right_ok:
            return 0, False
        if abs(left_h - right_h) > 1:
            return 0, False
        return max(left_h, right_h) + 1, True
    
    _, balanced = check(root)
    return balanced
```

这也是后序——从下往上检查，同时返回高度和是否平衡。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **二叉树** | 每个节点最多有两个子节点的分层结构 |
| **前序遍历** | 根→左→右，用于序列化 |
| **中序遍历** | 左→根→右，BST 排序输出 |
| **后序遍历** | 左→右→根，删除树、计算高度 |
| **层序遍历** | 逐层 BFS，使用队列 |
| **递归实现** | 简洁但有栈溢出风险 |
| **迭代实现** | 用栈/队列模拟，更安全 |

> 🎯 **小练习**：给定二叉树的前序和中序遍历结果，你能还原出这棵树的形状吗？试试前序 `[1,2,4,5,3,6]` 和中序 `[4,2,5,1,3,6]`，还原这棵二叉树。

**为什么先学这个？** 二叉树是最基础的树结构。下一步学习它的一个特殊应用——[[binary-search-tree|二叉搜索树（BST）]]，把二分查找的思想用树结构实现。
