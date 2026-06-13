---
id: stack-queue
title: 栈与队列
summary: 栈（Stack）是后进先出（LIFO），队列（Queue）是先进先出（FIFO）——它们是两种最基础的操作受限线性表
difficulty: beginner
order: 2
parent: array-linked-list
children:
  - hash-table
  - recursion-divide-conquer
related: []
prerequisites:
  - array-linked-list
tags:
  - algorithm
  - stack
  - queue
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🧦 两种秩序——叠衣服和排队

想想你生活中的两个场景：

**场景一：叠衣服**
你把洗好的 T 恤一件件叠好放进衣柜——最早叠好的放在最下面，最后叠好的放在最上面。当你要穿的时候，你会从最上面拿——最后放进去的那件最先被拿出来。

**场景二：食堂排队**
你中午去食堂打饭，排在队伍后面。先到的人先打到饭，后到的人后打到饭。

这两种看似平常的生活场景，对应了计算机中最基础也是最重要的两种数据结构：

- **栈（Stack）** ——后进先出（LIFO, Last In First Out），就像叠衣服
- **队列（Queue）** ——先进先出（FIFO, First In First Out），就像排队

> 💡 这两种结构的共同特点是"操作受限"：你不能随便从中间取数据——栈只能从顶端操作，队列只能从两端操作。正是这种"限制"，让它们在某些场景中特别高效。

---

## 📚 栈（Stack）——后进先出

### 什么是栈？

栈是一种只能在**一端**进行操作的线性表。这一端叫做**栈顶（Top）**，另一端叫做**栈底（Bottom）**。

```python
stack = []
stack.append(1)  # 入栈（push）
stack.append(2)
stack.append(3)
# stack = [1, 2, 3]   ← 栈顶在右边
top = stack.pop()      # 出栈（pop） → 3
top = stack.pop()      # → 2
top = stack.pop()      # → 1
```

```
操作过程：
空栈: []
push 1: [1]
push 2: [1, 2]
push 3: [1, 2, 3]
pop:    [1, 2]    返回 3
pop:    [1]       返回 2
```

### 两个核心操作

| 操作 | 描述 | 时间复杂度 |
|:----:|------|:----------:|
| **push(x)** | 把 x 放到栈顶 | O(1) |
| **pop()** | 移除并返回栈顶元素 | O(1) |
| **top()/peek()** | 查看栈顶元素（不移除） | O(1) |

栈的所有操作都是 O(1)——高效且简单。

### 🧩 生活中的栈

除了叠衣服，栈无处不在：
- **浏览器的"后退"按钮**——你访问的页面依次入栈，点击"后退"就是出栈
- **编辑器的"撤销"（Ctrl+Z）**——每次修改入栈，撤销出栈
- **手机 App 的返回**——从首页→详情页→设置页，每进一页入栈，返回就出栈

### 经典应用：括号匹配

这是栈最经典的面试题之一——检查代码中的括号是否成对匹配：

```python
def is_valid_brackets(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    
    for char in s:
        if char in '([{':        # 左括号 → 入栈
            stack.append(char)
        elif char in ')]}':       # 右括号 → 检查栈顶是否匹配
            if not stack or stack.pop() != pairs[char]:
                return False
    
    return not stack  # 栈空说明都匹配了

print(is_valid_brackets("({[]})"))  # True
print(is_valid_brackets("({[})"))   # False
print(is_valid_brackets("("))       # False
```

**为什么用栈？** 因为括号的"后开先闭"特性正好匹配栈的 LIFO——最后一个左括号必须第一个被右括号闭合。

---

## 🚶 队列（Queue）——先进先出

### 什么是队列？

队列是一种只能在**一端插入、另一端删除**的线性表。插入端叫**队尾（Rear/Back）**，删除端叫**队首（Front）**。

```python
from collections import deque

queue = deque()
queue.append(1)    # 入队（enqueue）→ 队尾
queue.append(2)
queue.append(3)
# queue = deque([1, 2, 3])   ← 队首在左边，队尾在右边

first = queue.popleft()  # 出队（dequeue）→ 1
first = queue.popleft()  # → 2
first = queue.popleft()  # → 3
```

```
操作过程：
空队: []
入队 1: [1]
入队 2: [1, 2]
入队 3: [1, 2, 3]
出队:   [2, 3]    返回 1
出队:   [3]       返回 2
```

### 两个核心操作

| 操作 | 描述 | 时间复杂度 |
|:----:|------|:----------:|
| **enqueue(x)** | 把 x 放到队尾 | O(1) |
| **dequeue()** | 移除并返回队首元素 | O(1) |
| **front()** | 查看队首元素（不移除） | O(1) |

### 🧩 生活中的队列

除了食堂排队，队列也到处都是：
- **打印机任务队列**——先提交的文档先打印
- **外卖订单**——先下的单先做
- **客服排队**——先接入的用户先被服务

### 经典应用：BFS 广度优先搜索

队列最著名的算法应用是 **广度优先搜索（BFS）**——逐层遍历树或图：

```python
from collections import deque

def bfs_tree(root):
    """按层遍历二叉树"""
    if not root:
        return
    queue = deque([root])
    while queue:
        node = queue.popleft()  # 出队
        print(node.val)         # 访问节点
        if node.left:
            queue.append(node.left)   # 左子入队
        if node.right:
            queue.append(node.right)  # 右子入队
```

**为什么 BFS 要用队列？** BFS 是"逐层扩散"的——先访问到的节点，它的子节点也先被访问。这正是 "先进先出"（FIFO）的特性。

> 💡 对比 DFS 深度优先搜索用的是栈（或递归，本质也是栈）——因为它要"先深入到底再回头"。

---

## 🔄 栈 vs 队列——对比总结

| 维度 | 栈 | 队列 |
|:----:|:----:|:----:|
| **原则** | 后进先出（LIFO） | 先进先出（FIFO） |
| **操作端** | 只在栈顶操作 | 队尾入、队首出 |
| **核心操作** | push, pop, peek | enqueue, dequeue, front |
| **实现** | 数组（更常见）或链表 | 链表（更常见）或数组 |
| **应用** | 函数调用、括号匹配、撤销 | BFS、任务调度、消息队列 |

### 在 Python 中用什么实现？

```python
# 栈——用 list 就够了
stack = []
stack.append(1)     # push
stack.pop()          # pop

# 队列——用 collections.deque（双端队列）
from collections import deque
queue = deque()
queue.append(1)      # 入队
queue.popleft()      # 出队

# deque 也可以当栈用（从同侧操作）
stack = deque()
stack.append(1)      # push
stack.pop()          # pop
```

> 💡 **为什么队列不用 list？** 因为 `list.pop(0)` 是 O(n) 的——删除第一个元素后，后面所有元素要往前移。而 `deque.popleft()` 是 O(1) 的。

---

## 🎯 思考题

```python
# 用两个栈实现一个队列
# 提示：一个栈负责入队，一个栈负责出队
class MyQueue:
    def __init__(self):
        self.stack_in = []    # 入队栈
        self.stack_out = []   # 出队栈
    
    def push(self, x):
        self.stack_in.append(x)
    
    def pop(self):
        if not self.stack_out:
            while self.stack_in:
                self.stack_out.append(self.stack_in.pop())
        return self.stack_out.pop()
```

这个题的思路是：入队时把元素压入 stack_in；出队时，如果 stack_out 为空，就把 stack_in 的所有元素倒到 stack_out 中——这样先进来的元素就在 stack_out 的顶端，实现了 FIFO。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **栈（Stack）** | 后进先出（LIFO）——叠衣服、浏览器后退 |
| **队列（Queue）** | 先进先出（FIFO）——食堂排队、打印机 |
| **push / append** | 放入元素 |
| **pop** | 取出元素 |
| **栈的应用** | 括号匹配、函数调用栈、撤销操作 |
| **队列的应用** | BFS、轮询调度、消息队列 |

> 🎯 **小练习**：设计一个"浏览器的前进/后退"功能——需要两个栈。当访问新页面时，page_stack 入栈，同时清空 forward_stack。后退时 page_stack 出栈压入 forward_stack。试试看用栈实现这个逻辑！

**为什么先学这个？** 栈和队列是算法中最基础的构建块。接下来学一种更强大的查找结构——[[hash-table|哈希表]]。
