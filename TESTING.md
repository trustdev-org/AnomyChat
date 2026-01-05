# 测试指南

## 本地测试

### 1. 启动开发服务器
```bash
npm install
npm run dev
```

访问：http://localhost:3000

### 2. 测试流程

**单用户测试：**
1. 点击「建立安全连接」创建房间
2. 发送消息测试
3. 刷新页面，消息应该保留（服务端存储）

**多用户测试：**
1. 在浏览器窗口A创建房间（记住房间ID）
2. 打开新的隐身窗口B
3. 在窗口B中选择「加入房间」，输入相同的房间ID
4. 在窗口A发送消息
5. 等待3秒（自动刷新间隔）
6. 窗口B应该能看到窗口A的消息
7. 在窗口B发送消息，窗口A也应该能收到

## Vercel 部署测试

### 1. 部署后检查
- 访问你的 Vercel 域名
- 打开浏览器开发者工具（F12）
- 查看 Network 标签页

### 2. 验证 API 端点
创建房间时，应该看到以下请求：
- `GET /api/rooms?roomId=xxx` - 获取房间信息
- `POST /api/rooms?roomId=xxx` - 加入房间
- `POST /api/rooms?roomId=xxx` - 发送消息

### 3. 常见问题

**问题：点击按钮无反应**
- 打开浏览器控制台查看错误
- 检查 Network 标签页是否有 API 请求失败
- 确认 Vercel 部署成功（/api 目录应该被识别为 Functions）

**问题：消息不同步**
- 确认两个窗口在同一个房间ID
- 等待3-5秒（自动刷新需要时间）
- 检查 Console 是否有网络错误

**问题：404 错误**
- 确认 Vercel 已正确部署 Serverless Functions
- 查看 Vercel 控制台的 Functions 标签页
- 应该能看到 `api/rooms.js` 和 `api/mnemonic.js`

## 功能清单

- [ ] 创建房间
- [ ] 加入房间
- [ ] 发送文本消息
- [ ] 接收其他用户消息
- [ ] 清空聊天记录
- [ ] 显示版本号（右下角 v1.0.0）
- [ ] 复制房间ID
- [ ] 离开房间

## API 端点

### GET /api/rooms?roomId={id}
获取房间信息和消息历史

### POST /api/rooms?roomId={id}
- `action: "join"` - 加入房间
- `action: "message"` - 发送消息

### DELETE /api/rooms?roomId={id}
清空房间消息

### GET /api/mnemonic
生成随机房间名
