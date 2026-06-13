---
id: websocket
title: WebSocket 与实时通信
summary: WebSocket 在 HTTP 之上建立全双工通信通道——服务器可以主动向客户端推送数据，而不需要客户端反复轮询。适合聊天、实时通知、在线游戏
difficulty: intermediate
order: 18
parent: ip-protocol
children: []
related:
  - http
prerequisites:
  - http
tags:
  - network
  - websocket
  - realtime
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🔄 HTTP 的局限——只能"一问一答"

HTTP 是"请求-响应"模式：客户端问，服务器答。服务器不能主动给客户端发消息。

```
HTTP 模式：
浏览器 ─→ 服务器   "有新消息吗？"
服务器 ─→ 浏览器   "没有"
浏览器 ─→ 服务器   "现在呢？"
服务器 ─→ 浏览器   "还是没有"   → 这叫"轮询"——浪费带宽
```

如果做聊天软件、实时通知、在线协作——HTTP 需要客户端**不停地问**（轮询），效率极低。

> 📐 **WebSocket** 在 HTTP 之上建立一个**全双工**的持久连接——建立后，双方可以随时互发消息，不需要反复建立连接。

---

## 🤝 WebSocket 握手

WebSocket 的建立从一个 HTTP 请求开始——这叫"升级握手"：

```
客户端 → 服务器（HTTP 请求）：
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket                ← 告诉服务器：我想升级到 WebSocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==  ← 安全验证密钥
Sec-WebSocket-Version: 13

服务器 → 客户端（HTTP 响应）：
HTTP/1.1 101 Switching Protocols   ← 同意升级
Upgrade: websocket
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=  ← 验证响应
```

```
握手成功后——连接从 HTTP 升级为 WebSocket：
┌────────┐          ┌────────┐
│ 客户端  │ ←────→ │ 服务器  │  全双工——双方随时发消息
└────────┘  持久连接 └────────┘
```

---

## 📨 WebSocket 的数据帧

WebSocket 的数据以"帧"为单位传输：

```python
# WebSocket 帧结构（简化的）
# FIN（1 位）：是否为最后一帧
# Opcode（4 位）：文本(1)、二进制(2)、关闭(8)、Ping(9)、Pong(10)
# Mask（1 位）：客户端发服务器要掩码（=1）
# Payload Length（7 位）：数据长度（超长用扩展长度）
# Masking Key（4 字节）：掩码密钥
# Payload Data：实际数据
```

```javascript
// 浏览器中创建 WebSocket 连接
const ws = new WebSocket('ws://example.com/chat');

// 连接建立后
ws.onopen = () => {
    ws.send('大家好！');              // 发消息（文本帧）
};

ws.onmessage = (event) => {
    console.log('收到：', event.data);  // 接收消息
};

ws.onclose = () => {
    console.log('连接关闭');
};

// 定期发送心跳（防止网关超时断开连接）
setInterval(() => {
    ws.send('ping');  // 或使用 ping/pong 帧
}, 30000);
```

---

## 🏢 WebSocket vs HTTP 轮询

| 对比 | HTTP 轮询 | WebSocket |
|:----:|:---------:|:---------:|
| **连接方式** | 每次请求新建 TCP 连接 | 一次握手，持久连接 |
| **通信方向** | 客户端发起（单向）| 双向（全双工）|
| **延迟** | 高（必须等客户端问）| 低（服务器随时发）|
| **头部开销** | 每次 HTTP 请求 ~800 字节 | 帧头 ~2-10 字节 |
| **适用场景** | 普通 Web 页面 | 实时应用 |

**典型应用**：在线聊天（微信网页版）、实时通知、协作编辑（Google Docs）、股票行情、在线游戏。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **WebSocket** | HTTP 升级的全双工持久连接——服务器能主动推数据 |
| **握手** | 通过 HTTP 101 Switching Protocols 升级协议 |
| **帧** | 最小的数据单位——文本、二进制、Ping/Pong |
| **vs 轮询** | WebSocket 延迟低、开销小——适合实时应用 |
| **心跳** | 定期 Ping/Pong 保持连接不被网关断开 |
