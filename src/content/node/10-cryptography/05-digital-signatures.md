---
id: digital-signatures
title: 数字签名与证书
summary: 数字签名用私钥签名、公钥验签——保证数据的完整性和来源可信。数字证书（X.509）把公钥和身份绑定起来，由 CA 签发
difficulty: advanced
order: 5
parent: public-key-crypto
children: []
related:
  - crypto-protocols
prerequisites:
  - public-key-crypto
tags:
  - crypto
  - signature
  - pki
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## ✍️ 现实中的签名——和数字签名

你在一份合同上签上自己的名字——这表示"我同意这份内容"、"是我本人的意愿"。

现实签名有三大作用：
1. **真实性**：签名是你写的，不是别人伪造的
2. **不可否认**：你签了就赖不掉
3. **完整性**：签完后合同内容不能改

**数字签名（Digital Signature）** 就是电子世界的"签名"——它用密码学的方式实现同样的三个目标。

> 📐 **数字签名的核心**：
> - **签名方**：用**私钥**对消息签名
> - **验证方**：用**公钥**验证签名是否有效
> - 只有私钥持有者能签名——但所有人都能用公钥验证

---

## 🔄 签名和加密——方向相反

```
加密：用公钥加密 → 只有私钥持有者能解密（保密）
签名：用私钥签名 → 所有人都能用公钥验证（认证）

加密：公钥锁 → 私钥开
签名：私钥锁 → 公钥开
```

### 签名过程

```python
# 数字签名的简化流程

import hashlib

def sign(message, private_key):
    # 1. 计算消息的哈希值
    h = hashlib.sha256(message.encode()).digest()
    
    # 2. 用私钥加密哈希值（这就是"签名"）
    signature = rsa_sign(h, private_key)
    
    return message + signature

def verify(message_with_sig, public_key):
    message = message_with_sig[:-256]  # 去掉签名
    signature = message_with_sig[-256:]  # 提取签名
    
    # 1. 重新计算消息的哈希值
    h = hashlib.sha256(message.encode()).digest()
    
    # 2. 用公钥解密签名，对比哈希值
    return rsa_verify(h, signature, public_key)
```

**关键点**：先哈希再签名——不是对整个消息签名（消息可能很大，RSA 也加密不了大数据），而是对消息的"指纹"签名。

### 为什么数字签名能保证三个目标？

```
1. 真实性： 
   签名是用私钥生成的——只有私钥持有者能产生有效签名
   用公钥验证通过 → 一定是私钥持有者签的

2. 不可否认： 
   只有你知道私钥——你不能说"这不是我签的"

3. 完整性：
   签名包含消息的哈希值
   消息改了 → 哈希值和签名不一致 → 验证失败
```

---

## 🏛️ PKI——谁来保证公钥是真的？

数字签名依赖公钥——但你怎么确定某个公钥确实是"张三"的，而不是攻击者的？

这就是**PKI（Public Key Infrastructure，公钥基础设施）** 解决的问题。

### CA（证书机构）

CA（Certificate Authority）是"公钥的公证处"——它验证申请人的身份，然后签发一个**数字证书（Digital Certificate）**：

```
数字证书（X.509 格式）包含：
├── 主体信息：谁（域名、组织名）
├── 公钥：这个主体的公钥
├── 签发者：哪个 CA 签发的
├── 有效期：从 X 到 Y
└── CA 的数字签名：证明上述信息是真实的
```

```python
# 证书验证链：
# 当你访问 https://example.com：
# 1. 服务器发给你它的证书（包含它的公钥，由 CA 签名）
# 2. 你的浏览器检查 CA 的签名是否有效
# 3. 如果有效——你信任这个公钥确实是 example.com 的
# 4. 用这个公钥建立加密连接
```

### 证书链

CA 自己也需要被验证——所以有**根 CA（Root CA）**：

```
Root CA（自签名——预装在操作系统中）
    ↓ 签发
中间 CA
    ↓ 签发
服务器证书（example.com）
```

操作系统和浏览器里预装了几十个根 CA 的证书——它们自己签自己（自签名），是世界公认的信任锚点。

> 🏪 **类比：身份证"
>
> 你拿出一张身份证给警察看——警察怎么知道身份证是真的？
>
> 因为：身份证由**公安局（CA）** 签发，公安局的印章（CA 签名）无法伪造，警察信任公安局。
>
> 如果警察不认识你所在的公安局——他可以追溯到"公安部（根 CA）"确认。

---

## 🔒 实际应用：HTTPS

当你访问 https://example.com：

```
1. 你在浏览器输入 https://example.com
2. 服务器把证书发给你
3. 浏览器检查证书：
   a. 是不是在有效期内？
   b. 是不是被吊销了？
   c. CA 的签名对不对？
   d. 域名是不是 example.com？
4. 验证通过 → 地址栏出现 🔒
5. 建立加密连接
```

```bash
# 用 OpenSSL 查看网站的证书
openssl s_client -connect example.com:443

# 输出包含：
# Certificate chain
#  0 s:/CN=example.com    ← 服务器证书
#  1 s:/CN=R3             ← 中间 CA
#  2 s:/CN=ISRG Root X1   ← 根 CA
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **数字签名** | 私钥签名 + 公钥验签——认证、不可否认、完整性 |
| **签名 = 对哈希签名** | 先哈希再签名——高效且无大小限制 |
| **数字证书** | 把公钥绑定到身份——由 CA 签发 |
| **CA（证书机构）** | 受信任的第三方——验证身份后签发证书 |
| **根 CA** | 预装在操作系统中的信任锚点 |
| **证书链** | Root CA → 中间 CA → 服务器证书——逐级验证 |

> 🎯 **思考题**：如果某个根 CA 被攻击者攻破了（私钥泄露了）——攻击者能做什么？这对整个互联网安全意味着什么？

**为什么先学这个？** 签名和证书是 SSL/TLS 的基础——[[crypto-protocols|密码协议（SSL/TLS）]]。
