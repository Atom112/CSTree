---
id: theorem-proving
title: 定理证明（Coq, Lean）
summary: 定理证明器把数学证明写成代码——计算机检查每一步逻辑推导是否严格正确。Curry-Howard 同构揭示"证明即程序，命题即类型"
difficulty: advanced
order: 3
parent: model-checking
children:
  - hoare-logic
related: []
prerequisites:
  - propositional-logic
tags:
  - formal
  - theorem-proving
  - coq
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## ✍️ 让计算机帮你"检查证明"

数学证明——你写完一个证明，你觉得是对的——但你真的确定每一步都没问题吗？

**定理证明器（Theorem Prover）** 是一种"证明检查器"——你把证明写成代码，计算机检查每一步逻辑推导——**如果通过了，100% 正确，没有漏洞。**

> 🏪 **类比：围棋中的"终局数子""
>
> 你下完棋，说"我赢了"——但你需要**数子确认**（定理证明器）来严格验证胜负。数子的人不是"觉得你赢了"——而是一颗一颗清楚地数。
>
> 定理证明器也是这个作用——不靠"感觉"，靠**机械化的每一步检查**。

---

## 🔗 Curry-Howard 同构——一个深刻的发现

Curry-Howard 同构（1960s）揭示了一个令人震惊的对应关系：

```
命题（Proposition） = 类型（Type）
证明（Proof）      = 程序（Program）
蕴含（Implication） = 函数类型

P → Q = 函数类型 P → Q：
  证明"如果 P 则 Q" = 写一个函数，输入 P 类型的值，输出 Q 类型的值
```

```coq
(* Coq 中的 Curry-Howard——命题即类型，证明即程序 *)

(* 定义命题：True 是真的 *)
Theorem true_is_true : True.
Proof.
  trivial.
Qed.

(* 证明 "P → P"（一个命题蕴含它自己） *)
Theorem p_implies_p : forall P : Prop, P -> P.
Proof.
  intros P H.
  exact H.
Qed.
(* 这个证明本质上就是一个恒等函数：输入 P，返回 P *)
```

---

## 🧩 定理证明器在做什么

```coq
(* Coq 示例——证明自然数加法交换律 *)
(* 这不是 trivial 的——需要数学归纳法 *)

Theorem add_comm : forall n m : nat, n + m = m + n.
Proof.
  intros n m; induction n as [| n IH].
  - (* n = 0 的情况：0 + m = m + 0 *)
    simpl. rewrite -> add_0_r. reflexivity.
  - (* n = S n 的情况：S n + m = m + S n *)
    simpl. rewrite -> IH. rewrite <- plus_n_Sm. reflexivity.
Qed.

(* Coq 会严格检查每个 rewrite、每个 simpl、每个 reflexivity
   是否都符合逻辑规则——不会遗漏任何推理漏洞 *)
```

**交互式证明**：

```
定理证明不是"全自动"的——你需要指导证明方向：
1. 你告诉 Coq："对这个变量做归纳法"
2. Coq 生成需要证明的子目标
3. 你继续告诉下一步做什么
4. 直到所有子目标都被证明
```

---

## 🏢 著名应用

| 项目 | 工具 | 成就 |
|:----:|:----:|:------|
| **CompCert** | Coq | 完整的 C 编译器——编译后的代码和源语言语义一致 |
| **seL4** | Isabelle | 操作系统微内核——形式化验证没有缓冲区溢出、权限提升等漏洞 |
| **F* / HACL\*** | F* (类似 Coq) | 密码学库——经过形式化验证的加密实现 |
| **四色定理** | Coq | 首个用计算机证明的数学定理 |
| **奇完全数** | 分布式 | 验证了没有小于 10¹⁵⁰⁰ 的奇完全数 |

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **定理证明器** | 计算机检查证明的每一步——100% 严格 |
| **Curry-Howard** | 证明 = 程序，命题 = 类型——深刻对应 |
| **交互式证明** | 用户指导方向，工具检查细节 |
| **Coq/Lean/Isabelle** | 三大主流定理证明器 |
| **CompCert/seL4** | 形式化验证的操作系统和编译器——安全关键系统 |

**为什么先学这个？** 定理证明器可以验证程序——[[hoare-logic|程序验证（Hoare Logic, 分离逻辑）]]。
