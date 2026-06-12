---
id: websocket
title: WebSocket 与实时通信
summary: WebSocket 让浏览器和服务器之间建立持久连接——服务器可以随时"推送"数据给客户端，不需要客户端反复请求。聊天、游戏、实时行情都靠它
difficulty: intermediate
order: 18
parent: network-layers
children: []
related:
  - http
prerequisites:
  - network-layers
  - http
tags:
  - network
  - websocket
  - realtime
createdAt: 2026-06-12
---

## HTTP 的局限性

HTTP 是"请求-响应"模式——**只有客户端能发起请求**，服务器不能主动发数据给客户端。

```
HTTP 轮询：                            WebSocket：
客户端 → 有数据吗？→ 没有              客户端 ←→ 服务器（连接保持）
客户端 → 有数据吗？→ 没有              双方随时可以发数据
客户端 → 有数据吗？→ 有！              （真正的实时通信）
客户端 → 有数据吗？→ 没有
```

> 🏫 **类比：广播 vs 点播**
> - **HTTP 轮询**：你每 10 秒问一次电台"到整点了没"——浪费精力
> - **WebSocket**：把你的收音机调到该频道——到整点电台自动报时

## WebSocket 握手

WebSocket 以 HTTP 请求开始（升级握手），然后切换到 WebSocket 协议：

```
客户端请求：
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

服务器响应：
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

> 💡 握手后，连接从 HTTP 升级为 WebSocket——之后的数据传输只有 2 字节头部开销（比 HTTP 头部的几百字节小得多）。

## WebSocket 编程

### 客户端（浏览器）

```javascript
// 建立连接
const ws = new WebSocket('wss://example.com/chat');

// 连接建立
ws.onopen = () => {
    console.log('连接已建立');
    ws.send('Hello, Server!');  // 发送消息
};

// 收到消息
ws.onmessage = (event) => {
    console.log('收到:', event.data);
};

// 连接关闭
ws.onclose = () => {
    console.log('连接已关闭');
};

// 错误处理
ws.onerror = (error) => {
    console.error('WebSocket 错误:', error);
};
```

### 服务器端（Node.js）

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('新客户端连接');
    
    ws.on('message', (message) => {
        console.log('收到:', message.toString());
        
        // 广播给所有客户端
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`广播: ${message}`);
            }
        });
    });
    
    ws.send('欢迎加入聊天室！');
});
```

## WebSocket 的应用

| 应用 | 场景 |
|------|------|
| **在线聊天** | 微信网页版、Discord |
| **实时游戏** | 多人在线、实时对战 |
| **协作编辑** | Google Docs、Notion 实时同步 |
| **金融行情** | 股票价格实时推送 |
| **通知推送** | 新消息提醒、系统通知 |

## 小结

| 概念 | 要点 |
|------|------|
| **WebSocket** | 浏览器和服务器之间的持久 TCP 连接 |
| **全双工** | 双方随时可以发送数据 |
| **低开销** | 握手后的小帧头部 |
| **升级机制** | 从 HTTP 升级到 WebSocket |
| **适用场景** | 实时性要求高的应用 |

**为什么先学这个？** WebSocket 是实时 Web 应用的基础。至此你已学完计算机网络的全部核心知识——从物理层到应用层。接下来可以进入数据库系统或算法板块继续学习。
