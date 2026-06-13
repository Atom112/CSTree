---
id: api-design
title: API 设计与 REST
summary: API（应用程序接口）是软件系统之间的通信契约。REST 是最流行的 API 设计风格——以资源为中心，用 HTTP 方法操作资源
difficulty: intermediate
order: 11
parent: software-lifecycle
children: []
related: []
prerequisites:
  - software-lifecycle
tags:
  - software-eng
  - api
  - rest
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## ☎️ "喂，你好"——系统之间的对话

你的手机 App 要显示"用户张三的订单列表"。App 自己没有这些数据——它必须"打电话"给服务器，说"给我张三的订单数据"，服务器把数据返回，App 展示出来。

这个"打电话"的方式——规定**怎么拨号（请求格式）、对方怎么应答（响应格式）**——就是 **API（Application Programming Interface，应用程序接口）**。

> 📖 **类比：餐厅点餐**
>
> **API** = 餐厅的菜单和点餐流程：
> - 你（客户端）说"我要一份鱼香肉丝"（请求）
> - 服务员（API）传给厨房（服务器）
> - 厨房做好后端上来（响应）
>
> 菜单的**格式**是固定的——你不能说"我要那个红红的、辣辣的菜"（不规范）。你必须说菜单上有的菜名（标准化的请求格式）。
>
> 餐厅换了菜单（API 版本更新）——旧菜单上的菜就点不了了。

---

## 🧩 RESTful API——当前最流行的 API 风格

**REST（Representational State Transfer，表现层状态转换）** 不是一种技术，而是一种**设计风格**。它由 Roy Fielding 在 2000 年的博士论文中提出。

### 核心原则：以"资源"为中心

把系统中的一切都是为**资源（Resource）**——每个资源有一个唯一的 URL，你通过 HTTP 方法来操作它。

```python
# RESTful API 设计——以"用户"资源为例

# 资源：用户（User）
# URL：/api/users

# 遵循"名词"而不是"动词"
# ❌ /api/getUser    /api/createUser    /api/deleteUser
# ✅ /api/users      /api/users         /api/users/1
```

### HTTP 方法 vs 数据库操作

| HTTP 方法 | 操作 | 数据库 CRUD | URL 示例 |
|:--------:|:----:|:----------:|:---------:|
| **GET** | 查询（读取） | SELECT | `GET /api/users` — 获取所有用户 |
| **GET** | 查询单个 | SELECT | `GET /api/users/1` — 获取用户 1 |
| **POST** | 创建 | INSERT | `POST /api/users` — 新建用户 |
| **PUT** | 替换 | UPDATE | `PUT /api/users/1` — 替换用户 1 |
| **PATCH** | 部分修改 | UPDATE | `PATCH /api/users/1` — 改用户姓名 |
| **DELETE** | 删除 | DELETE | `DELETE /api/users/1` — 删除用户 1 |

### 示例：完整的 RESTful API 调用

```python
# 请求：创建用户
POST /api/users
Content-Type: application/json

{
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 20
}

# 响应：
HTTP 201 Created
Location: /api/users/42

{
    "id": 42,
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 20,
    "created_at": "2026-06-13T10:30:00Z"
}
```

```python
# 请求：查询用户 42
GET /api/users/42

# 响应：
HTTP 200 OK
{
    "id": 42,
    "name": "张三",
    ...
}
```

---

## 📐 RESTful API 设计原则

### ① 用名词，不用动词

```
❌ /getUserProfile
❌ /createNewOrder
❌ /deleteProductById

✅ GET    /users          — 获取用户列表
✅ POST   /users          — 创建用户
✅ DELETE /users/42       — 删除用户
```

### ② 版本化

API 会变化——旧版本的客户端可能还没升级。所以要**版本化**：

```
/v1/users       — 第 1 版
/v2/users       — 第 2 版（不兼容的改动）

# 或者用请求头
Accept: application/vnd.myapp.v1+json
```

### ③ 正确使用 HTTP 状态码

```python
# 成功
200 OK          — GET 成功
201 Created     — POST 成功创建
204 No Content  — DELETE 成功（无返回体）

# 客户端错误
400 Bad Request    — 请求格式错误
401 Unauthorized   — 未登录
403 Forbidden      — 没权限
404 Not Found      — 资源不存在
422 Unprocessable  — 验证失败

# 服务器错误
500 Internal Server Error  — 服务器挂了
503 Service Unavailable    — 服务暂时不可用
```

### ④ 分页

```python
# 大量数据时——需要分页
GET /api/users?page=1&limit=20

# 响应中返回分页信息
{
    "data": [ ... ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 156,
        "total_pages": 8
    }
}
```

### ⑤ 一致的错误格式

```python
# ❌ 不统一的错误返回
{ "error": "用户不存在" }          # 一种格式
{ "code": 404, "msg": "not found" }  # 另一种格式

# ✅ 统一的错误格式
{
    "error": {
        "code": "USER_NOT_FOUND",
        "message": "用户不存在",
        "details": { "user_id": 999 }
    }
}
```

---

## 🆚 REST vs GraphQL vs gRPC

| 特性 | REST | GraphQL | gRPC |
|:----:|:----:|:-------:|:----:|
| **数据获取** | 固定格式 | 客户端指定字段 | 固定格式 |
| **过获取** | ✅ 可能拿到不需要的字段 | ❌ 不获取多余数据 | ✅ 由 proto 定义 |
| **版本管理** | URL 版本 | 无需版本（可扩展） | proto 文件管理 |
| **工具链** | 最成熟（过 20 年） | 成熟 | 需要 proto 编译器 |
| **适用场景** | 通用 Web API | 复杂数据需求 | 微服务内部通信 |

```python
# GraphQL——客户端指定要什么字段
query {
    user(id: 42) {
        name
        email
        # 不取 age——服务器不会返回
    }
}
```

> 💡 **实际建议**：对外公开的 API 用 REST（最通用、工具最多）；移动端用 GraphQL（避免过获取）；微服务内部用 gRPC（性能好）。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **API** | 系统间通信的"契约"——怎么请求、怎么响应 |
| **REST** | 以资源为中心的 API 设计风格 |
| **HTTP 方法** | GET(查)、POST(增)、PUT(替换)、DELETE(删) |
| **状态码** | 200(成功)、201(创建)、400(参数错)、404(不存在)、500(服务端错)|
| **设计原则** | 名词路径、版本化、正确状态码、分页、一致错误格式 |
| **REST vs GraphQL** | REST 固定格式，GraphQL 客户端自定义字段 |

> 🎯 **小练习**：为"图书馆借书系统"设计一套 RESTful API（至少包括：图书查询、借书、还书、用户历史查询）。列出每个 API 的 URL、HTTP 方法、请求体、响应体和状态码。

**为什么先学这个？** API 是系统的"对外窗口"。窗口设计好了，后台怎么处理数据？——[[database-orm|数据库设计与 ORM]]。
