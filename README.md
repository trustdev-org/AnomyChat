# Whisperlink 匿名聊天室

一个极简、现代的匿名聊天室应用，支持多用户实时通信。使用 Vercel Serverless Functions 实现后端，一键部署即可使用。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/trustdev-org/AnomyChat)

---

## ✨ 特性
- **多用户实时聊天**：支持多人同时在同一房间聊天
- **Serverless 后端**：使用 Vercel Functions，无需管理服务器
- **匿名保护**：自动生成随机昵称和头像
- **房间系统**：通过房间ID加入特定聊天室
- **响应式设计**：完美适配手机和桌面
- **一键部署**：推送代码自动部署，零配置

---

## 🚀 快速部署

### 一键部署到 Vercel（推荐）

点击下方按钮即可一键部署完整的前后端：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/trustdev-org/AnomyChat)

部署完成后，Vercel 会自动：
- ✅ 构建前端（React + Vite）
- ✅ 部署后端 API（Serverless Functions）
- ✅ 提供全球 CDN 加速
- ✅ 提供免费 HTTPS 域名

### 其他平台
- **Netlify**：支持 Serverless Functions
- **Cloudflare Pages**：需要单独部署 Worker

---

## 💻 本地运行

**环境要求：** Node.js 16+

```bash
npm install
npm run dev
```

访问：http://localhost:3000

---

## 📦 目录结构

```
whisperlink/
├── api/                 # Vercel Serverless Functions（后端API）
│   ├── rooms.js        # 房间和消息管理
│   └── mnemonic.js     # 房间名生成
├── components/          # React 组件
├── services/           # 前端服务
│   ├── apiServer.ts    # API 客户端
│   └── geminiService.ts # 本地工具函数
├── public/             # 静态资源
└── vercel.json         # Vercel 配置
```

---

## 🏗️ 技术栈

**前端：**
- React 19
- TypeScript
- Vite
- Lucide Icons

**后端：**
- Vercel Serverless Functions
- 内存存储（热启动保持）

---

## 🔧 工作原理

1. **房间创建/加入**：用户输入房间ID，后端自动创建房间
2. **消息发送**：消息通过 `/api/rooms` 发送到服务端
3. **消息同步**：前端每3秒轮询获取最新消息
4. **用户识别**：浏览器 localStorage 保存用户信息

---

## 📝 贡献
欢迎 issue 和 PR！

---

## 📄 License
MIT
