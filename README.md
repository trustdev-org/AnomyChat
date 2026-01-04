# Whisperlink 匿名聊天室

一个极简、现代、纯前端的匿名聊天室应用，支持多平台静态部署，无需后端、无需 API 密钥。

---

## ✨ 特性
- 纯前端实现，支持任意静态托管（Vercel、Netlify、Cloudflare Pages、GitHub Pages 等）
- 房间号/昵称本地生成，安全隐私
- 响应式设计，适配手机和桌面
- 零依赖后端，部署极快

---

## 🚀 本地运行

**环境要求：** Node.js 16+

```bash
npm install
npm run dev
```

访问：http://localhost:3000

---

## 🛠️ 构建与部署

```bash
npm run build
```

构建后会生成 `dist` 文件夹，上传到任意静态服务器即可。

推荐平台：
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [GitHub Pages](https://pages.github.com)

---

## 📦 目录结构

```
whisperlink/
├── components/          # React 组件
├── services/            # 本地服务（词汇生成）
├── public/              # 静态资源
├── dist/                # 构建输出（自动生成）
└── package.json         # 项目配置
```

---

## 📝 贡献
欢迎 issue 和 PR！

---

## 📄 License
MIT
