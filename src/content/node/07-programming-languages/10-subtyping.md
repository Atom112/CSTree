---
id: subtyping
title: 子类型与变型（协变/逆变）
summary: 子类型（Subtyping）是类型之间的"is-a"关系——Cat 是 Animal 的子类型。变型（Variance）描述容器类型在子类型关系下的行为
difficulty: advanced
order: 10
parent: static-vs-dynamic
children: []
related: []
prerequisites:
  - static-vs-dynamic
tags:
  - pl
  - subtyping
  - variance
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🧬 "猫是动物"——在类型系统中意味着什么？

"猫是动物"——这是我们日常生活中再自然不过的一句话。在面向对象语言中，它意味着：**Cat 是 Animal 的子类型（Subtype）**。

```java
class Animal { void eat() { ... } }
class Cat extends Animal { void meow() { ... } }

// 子类型关系：Cat 是 Animal 的子类型
// 所有用 Animal 的地方都可以用 Cat 替代
```

但问题来了——当你把类型放到"容器"里时，情况变得复杂了：

> 如果 `Cat` 是 `Animal` 的子类型——那么 `List<Cat>` 是 `List<Animal>` 的子类型吗？

这个问题的答案比你想象的要复杂。**变型（Variance）** 就是用来回答这类问题的。

> 🥤 **类比：杯子和液体**
>
> 假设：橙汁是饮料的子类型。
>
> **协变**：一杯橙汁是可以当作"一杯饮料"的 → ✅ `List<Cat>` 是 `List<Animal>` 的子类型（只读时）
>
> **逆变**：一个"饮料处理器"（能处理任何饮料）可以处理橙汁 → `Function<Animal>` 是 `Function<Cat>` 的子类型（写入参数时）
>
> **不变**：一杯橙汁就是一杯橙汁，不能当作"一杯饮料"用 → `List<Cat>` 和 `List<Animal>` 没有子类型关系（读写都有时）

---

## 📜 里氏替换原则（Liskov Substitution Principle）

子类型的理论基础：**如果 S 是 T 的子类型，那么任何使用 T 的地方都可以用 S 替换，不会破坏程序的正确性。**

```java
void feed(Animal a) {
    a.eat();
}

// 替换：用 Cat 代替 Animal ✅
feed(new Cat());  // 完全正确——Cat 也有 eat 方法
```

这个原则看起来简单，但很多设计问题都是违反里氏替换原则导致的：

```java
// ❌ 违反里氏替换原则的经典例子
class Rectangle {
    private int width, height;
    void setWidth(int w) { this.width = w; }
    void setHeight(int h) { this.height = h; }
    int area() { return width * height; }
}

class Square extends Rectangle {
    void setWidth(int w) { super.setWidth(w); super.setHeight(w); }
    void setHeight(int h) { super.setWidth(h); super.setHeight(h); }
}

// 使用者按 Rectangle 的逻辑使用
void resize(Rectangle r) {
    r.setWidth(5);
    r.setHeight(10);
    assert r.area() == 50;  // Rectangle: ✅ 50, Square: ❌ 100
}
```

正方形"is-a"矩形在数学上是正确的，但在可变对象中——因为赋值行为不同——违反了里氏替换原则。

---

## 🔄 三种变型（Variance）

现在回到核心问题：一个泛型类型 `Container<T>`，当 T 变化时，Container 本身怎么变化？

### ① 协变（Covariance）——T 的变化方向相同

`Cat` 是 `Animal` 的子类型 → `Producer<Cat>` 是 `Producer<Animal>` 的子类型。

```java
// Java 中的协变——只读（生产者）
// ? extends T 表示"T 或 T 的子类型"
List<? extends Animal> animals = new ArrayList<Cat>();
// 只能读，不能写
Animal a = animals.get(0);  // ✅ 读——安全
animals.add(new Cat());     // ❌ 写——不安全！
```

**为什么不能写？** 如果你能写，就可能把一个 `Dog` 放进去（因为 `animals` 声明为 `List<? extends Animal>`），但实际上它指向的是 `List<Cat>`。

```java
// 如果允许写入会怎样：
List<? extends Animal> animals = new ArrayList<Cat>();
animals.add(new Dog());  // ❌ 编译器阻止——因为底层是 List<Cat>
```

### ② 逆变（Contravariance）——T 的变化方向相反

`Animal` 是 `Cat` 的父类型 → `Consumer<Animal>` 是 `Consumer<Cat>` 的子类型。

```java
// Java 中的逆变——只写（消费者）
// ? super T 表示"T 或 T 的父类型"
List<? super Cat> list = new ArrayList<Animal>();
list.add(new Cat());  // ✅ 写——安全
Object obj = list.get(0);  // ❌ 读——只能读到 Object
```

**逆变在函数参数中很常见**：

```java
// 一个能处理任意「动物」的函数也可以处理「猫」
// Consumer<Animal> 是 Consumer<Cat> 的子类型
Consumer<Animal> feedAnimal = a -> a.feed();
Consumer<Cat> feedCat = feedAnimal;  // ✅ 逆变
```

### ③ 不变（Invariance）——T 和 Container 无关

`Container<Cat>` 和 `Container<Animal>`**没有子类型关系**——即使 `Cat` 是 `Animal` 的子类型。

```java
// Java 中默认是不变的
List<Cat> cats = new ArrayList<>();
List<Animal> animals = cats;  // ❌ 编译错误

// 为什么？因为如果允许，会出现：
List<Animal> animals = cats;  // 假设允许
animals.add(new Dog());       // 向 List<Cat> 里加了 Dog！灾难
cats.get(0).meow();           // 实际拿到的是 Dog——没有 meow() 方法
```

---

## 📋 变型的实际规则

| 场景 | 变型 | 关键字 | 例子 |
|:----:|:----:|:------:|------|
| **生产者（只读）** | 协变 | `? extends T` | Iterator、Getter |
| **消费者（只写）** | 逆变 | `? super T` | Setter、Writer |
| **读写都有** | 不变 | 无 | 可变容器（List、Array）|

### 函数类型的变型

```scala
// Scala 中的函数类型变型
// 函数是"参数逆变，返回值协变"的

trait Function1[-T, +R] {
    def apply(x: T): R  // 参数逆变（-），返回值协变（+）
}

// 例子：
class Animal
class Cat extends Animal
class Dog extends Animal

// Function1[Cat, Animal] 是 Function1[Animal, Dog] 的子类型？
// 参数逆变（方向相反）：Animal 是 Cat 的父类型 → 参数方向成立
// 返回值协变（方向相同）：Dog 是 Animal 的子类型 → 返回值方向成立
// 所以：✅ Function1[Cat, Animal] <: Function1[Animal, Dog]
```

> 💡 **"PECS" 法则**：**P**roducer **E**xtends, **C**onsumer **S**uper（生产者使用 extends，消费者使用 super）。这是 Java 泛型中记忆协变/逆变的口诀。

---

## 🏢 实际应用

### Java 中的数组 vs 泛型

```java
// Java 数组是协变的——这是设计上的"错误"
// （为了兼容性，Java 从 1.0 开始就这样了）
String[] strings = new String[10];
Object[] objects = strings;  // ✅ 编译通过！数组是协变的
objects[0] = 42;             // ⚡ 运行时 ArrayStoreException！

// Java 泛型是不变的——这是"正确"的设计
List<String> strList = new ArrayList<>();
List<Object> objList = strList;  // ❌ 编译错误——泛型是不变的
```

### TypeScript 中的变型

```typescript
// TypeScript 默认是协变的（结构类型系统）
class Animal { feed() {} }
class Cat extends Animal { meow() {} }

let cats: Cat[] = [new Cat()];
let animals: Animal[] = cats;  // ✅ TypeScript 允许（协变）
// 但运行时不检查——TS 只是编译时检查
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **子类型（Subtype）** | S 是 T 的子类型——用 T 的地方可以用 S 替换 |
| **里氏替换原则** | 子类应该能完全替换父类，不改变程序的正确性 |
| **协变（Covariance）** | 只读容器——Cat → Animal，List<Cat> 也是 List<Animal> |
| **逆变（Contravariance）** | 只写容器——Animal → Cat，Consumer<Animal> 是 Consumer<Cat> |
| **不变（Invariance）** | 读写都有时——List<Cat> 和 List<Animal> 无关 |
| **PECS** | Producer Extends, Consumer Super |

> 🎯 **思考题**：为什么 Java 的 `Comparator<T>` 接口中的 `compare(T o1, T o2)` 方法参数适合用 `? super T` 而不是 `? extends T`？（提示：想想"比较器"是生产者还是消费者？）

**为什么先学这个？** 理解类型系统后，接下来看看程序语义的形式化描述——[[operational-semantics|操作语义（小步/大步）]]。
