# 🌟 Whisperlink 部署指南

> 一个匿名聊天室应用，支持多平台部署的静态网站

## 🚀 快速部署（推荐平台）

### 1. Vercel（最简单）
1. 前往 [Vercel](https://vercel.com)
2. 连接 GitHub 仓库
3. 自动检测为 React 项目并部署
4. 完成！访问提供的域名

### 2. Netlify（拖拽部署）
1. 构建项目：`npm run build`
2. 前往 [Netlify](https://netlify.com)
3. 拖拽 `dist` 文件夹到部署区域
4. 完成！

### 3. Cloudflare Pages（全球CDN）
1. 前往 [Cloudflare Pages](https://pages.cloudflare.com)
2. 连接 GitHub 仓库
3. 构建设置：
   - **构建命令**：`npm run build`
   - **输出目录**：`dist`
   - **Node.js 版本**：18+
4. 完成！

## 🛠 本地开发

```bash
# 克隆项目
git clone <your-repo-url>
cd whisperlink

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问：http://localhost:3000

## 📦 手动构建

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 预览构建结果（可选）
npm run preview
```

构建完成后，`dist` 文件夹包含所有静态文件，可上传到任何 Web 服务器。

## 🌐 其他部署平台

### GitHub Pages
1. 启用 Actions，添加工作流文件 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 任意静态服务器
上传 `dist` 文件夹内容到你的服务器根目录即可。

## ⚡ 性能优化

项目已包含以下优化：
- ✅ **代码分割**：自动按路由分割
- ✅ **Tree Shaking**：移除未使用代码
- ✅ **资源压缩**：CSS/JS 自动压缩
- ✅ **现代构建**：ES6+ 语法优化

## 🔧 自定义配置

### 修改端口
编辑 `vite.config.ts`：
```typescript
server: {
  port: 3000, // 改为你想要的端口
}
```

### 修改构建输出
```typescript
build: {
  outDir: 'build', // 改为你想要的输出目录
}
```

## 📱 PWA 支持

要将应用转换为 PWA，可以安装 `vite-plugin-pwa`：

```bash
npm install -D vite-plugin-pwa
```

然后在 `vite.config.ts` 中添加：
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Whisperlink',
        short_name: 'Whisperlink',
        description: '匿名聊天室',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 🔍 故障排除

### 构建失败
- 确保 Node.js 版本 ≥ 16
- 删除 `node_modules` 和 `package-lock.json`，重新 `npm install`

### 404 错误
确保静态服务器配置了 SPA 回退。大多数现代托管平台自动处理。

### 路由问题
项目使用客户端路由，需要服务器将所有路径重定向到 `index.html`。

## 🎯 项目特性

- ✅ **纯静态**：无需服务器或数据库
- ✅ **响应式**：适配移动端和桌面端
- ✅ **现代化**：React 19 + TypeScript + Vite
- ✅ **轻量级**：构建后约 230KB
- ✅ **零配置**：开箱即用

## 📈 部署清单

- [ ] 代码推送到 Git 仓库
- [ ] 选择部署平台
- [ ] 配置构建设置（如需要）
- [ ] 测试部署结果
- [ ] 设置自定义域名（可选）

## 🆘 需要帮助？

- **构建问题**：检查 Node.js 版本和依赖
- **部署问题**：查看平台特定文档
- **功能问题**：查看项目 README.md

---

🎉 **恭喜！** 你的匿名聊天室现在可以在全球访问了！