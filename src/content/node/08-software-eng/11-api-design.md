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
---

## RESTful API

| 方法 | 操作 | URL | 含义 |
|:----:|:----:|:---:|:----:|
| GET | 查询 | /users | 获取用户列表 |
| GET | 查询 | /users/1 | 获取用户 1 |
| POST | 创建 | /users | 新建用户 |
| PUT | 替换 | /users/1 | 替换用户 1 |
| PATCH | 部分修改 | /users/1 | 修改用户部分字段 |
| DELETE | 删除 | /users/1 | 删除用户 1 |

## 设计原则

```
- 用名词（/users）不用动词（/getUsers）
- 版本化（/v1/users）
- 状态码正确使用
- 分页（?page=1&limit=20）
- 一致的错误格式
```

**为什么先学这个？** API 连接前后端。关于数据——[[database-orm|数据库设计与 ORM]]。
