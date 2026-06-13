---
id: classical-ciphers
title: 古典密码（凯撒、维吉尼亚）
summary: 古典密码是早期加密方法——凯撒密码把字母按固定位移替换，维吉尼亚密码用关键词决定每位位移。它们已被现代密码学取代，但核心思想（替换+置换）沿用至今
difficulty: intermediate
order: 1
parent:
children:
  - symmetric-crypto
related: []
prerequisites: []
tags:
  - crypto
  - classical
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## ✉️ 2000 年前的"加密"——一个将军和一条皮带的故事

古罗马将军凯撒在战场上要给部下传令。信使可能被敌人截获——如果敌军知道了作战计划，仗就没法打了。

凯撒的一个简单但有效的办法：**把信中每个字母按字母表向后移动 3 位**。敌军截获了信也是一堆乱码；部下知道"每位移 3 位"的规则，能轻松还原。

这就是最早的加密算法之一——**凯撒密码（Caesar Cipher）**。

> 📐 **三个核心概念**（贯穿整个密码学）：
> - **明文（Plaintext）**：原始消息——"明天凌晨进攻"
> - **密文（Ciphertext）**：加密后的消息——"OMMF...（乱码）"
> - **密钥（Key）**：加密和解密的规则——"每位后移 3"

---

## 🔄 凯撒密码——位移替换

### 加密规则

每个字母按固定位数在字母表中前移（或后移）：

```
明文：  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
密钥3：D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
```

```python
def caesar_encrypt(text, shift=3):
    result = ""
    for char in text.upper():
        if char.isalpha():
            shifted = chr((ord(char) - ord('A') + shift) % 26 + ord('A'))
            result += shifted
        else:
            result += char
    return result

def caesar_decrypt(text, shift=3):
    return caesar_encrypt(text, -shift)

print(caesar_encrypt("HELLO"))   # KHOOR
print(caesar_decrypt("KHOOR"))   # HELLO
```

### 破解——太容易了

凯撒密码的问题在于**密钥空间太小**——一共只有 25 种可能的位移（因为位移 26 等于没动）。

```python
# 暴力破解：试所有 25 种位移
cipher = "KHOOR"
for shift in range(26):
    print(f"位移 {shift}: {caesar_decrypt(cipher, shift)}")

# 输出中一定有一个是"HELLO"
```

用现代计算机破解凯撒密码——**零耗时**。这也说明了为什么古典密码无法保护任何有价值的信息。

> 🏪 **类比：自习室储物柜的"简易锁"**
>
> 凯撒密码就像自习室的储物柜——上面有个三位数的密码锁，每个人都知道密码（000），只是防君子不防小人。

---

## 🔑 维吉尼亚密码——同一个字母可以变成不同的字母

凯撒密码的问题：**同一个字母永远变成同一个字母**——比如 A 永远变成 D。这给了攻击者利用**频率分析**破解的机会（英文中最常见的字母是 E——如果密文中出现最多的字母是 H，那大概率是 E→H 的位移）。

**维吉尼亚密码（Vigenère Cipher）** 的改进：用**关键词**来决定每个字母的位移量——同一个明文中的 A，在不同位置可能变成不同的字母。

### 加密规则

```
明文： HELLO
密钥： KEYKE    → 关键词重复到和明文一样长
加密： H(7)+K(10)=R(17)
       E(4)+E(4)=I(8)
       L(11)+Y(24)=J(35→9)
       L(11)+K(10)=V(21)
       O(14)+E(4)=S(18)
密文： RIJVS
```

```python
def vigenere_encrypt(text, key):
    result = ""
    key = key.upper()
    key_idx = 0
    for char in text.upper():
        if char.isalpha():
            shift = ord(key[key_idx % len(key)]) - ord('A')
            shifted = chr((ord(char) - ord('A') + shift) % 26 + ord('A'))
            result += shifted
            key_idx += 1
        else:
            result += char
    return result

print(vigenere_encrypt("HELLO", "KEY"))  # RIJVS
```

```
维吉尼亚加密表（部分）：
    明文字母 →
     A B C D E F G H I J K L M
密钥  A A B C D E F G H I J K L M
      B B C D E F G H I J K L M N
      C C D E F G H I J K L M N O
    ↓ ...（每一列用不同位移）
```

明文中的第一个 L（位置 2）用密钥 Y（位移 24）加密→ J，第二个 L（位置 3）用密钥 K（位移 10）加密→ V——同一个字母 L 变成了不同的密文字母。频率分析法失效了。

### 破解维吉尼亚密码

这个方法曾经被认为是"不可破解的"——但在 19 世纪被 Kasiski 攻破：

```
破解思路：
1. 用 Kasiski 测试找密钥长度——在密文中找重复的字母串
2. 把密文按密钥长度拆成"组"——每组其实就是凯撒密码
3. 对每组做频率分析——破解凯撒
```

这说明了一个永恒的真理：**没有绝对安全的加密——只有当前还没有被攻破的加密。**

---

## 🧩 古典密码的启示

古典密码虽然已经没有任何实用性，但它们奠定了现代密码学的两个基础操作：

| 操作 | 含义 | 现代例子 |
|:----:|:----:|:---------|
| **替换（Substitution）** | 把一个东西换成另一个 | S 盒（AES 中替换字节）|
| **置换（Permutation）** | 重新排列顺序 | 行移位（AES 中移行）|

现代加密算法（AES、DES）本质上就是**反复做替换和置换**——只是用更复杂的数学和更大的密钥空间来抵抗攻击。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **凯撒密码** | 每个字母固定位移——只有 25 种可能性 |
| **维吉尼亚密码** | 关键词决定每位位移——同一个字母可以变不同密文 |
| **频率分析** | 利用字母出现频率的统计特征破解替换密码 |
| **暴力破解** | 尝试所有可能的密钥——密钥空间决定可行性 |
| **替换 + 置换** | 古典密码留给现代密码学的两个最基础操作 |

> 🎯 **思考题**：如果凯撒密码的密钥空间只有 25，维吉尼亚密码的密钥空间是 26^k（k 是关键词长度）——试计算关键词长度为 5 时，维吉尼亚密码有多少种可能的密钥。为什么这样还不够安全？

**为什么先学这个？** 古典密码是密码学思想的起点——理解"怎么藏信息"和"怎么找信息"。接下来学习真正能保护数据的现代加密——[[symmetric-crypto|对称加密（AES, DES）]]。
