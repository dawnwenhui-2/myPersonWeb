# 🚀 dawnwenhui - 个人技术网站

> AI + 前端全栈开发者的技术展示平台

## ✨ 功能模块

| 模块 | 说明 | 状态 |
|------|------|------|
| 🏠 首页 | 个人介绍 + 技术展示 | ✅ |
| 🤖 AI Agent | 智能对话 / 模拟面试 / 在线笔试（智谱 GLM API） | ✅ |
| 📝 博客 | 技术博客系统 | ✅ |
| 💼 简历 | 在线简历展示 | ✅ |
| 🎯 面试 | 59道 React 面试题（懒加载） | ✅ |
| 🎨 低代码编辑器 | Page Builder + 5种主题预设 | ✅ |
| 🔐 登录 | 登录/注册页面 | ✅ |
| ⚙️ 管理后台 | Admin Dashboard | 🚧 |

## 🛠️ 技术栈

- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript
- **样式**：TailwindCSS + Framer Motion
- **AI**：智谱 GLM API（SSE 流式对话）
- **组件**：Lucide React + 自定义 UI 组件

## 📁 项目结构

```
personal-website/
├── app/
│   ├── ai-agent/        # AI 对话 / 面试 / 笔试
│   ├── api/             # 后端 API 路由
│   │   └── ai-agent/    #   chat / interview / exam
│   ├── blog/            # 博客系统
│   ├── interview/       # 面试题库
│   ├── resume/          # 简历页
│   ├── login/           # 登录页
│   ├── admin/           # 管理后台
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 首页
├── components/
│   ├── LowCodeEditor.tsx       # 低代码编辑器
│   ├── DynamicPageRenderer.tsx # 动态页面渲染
│   ├── AnimatedBorder.tsx      # 流动边框特效
│   └── ...
├── lib/
│   ├── ai-provider/     # AI 服务封装
│   ├── lowcode/         # 低代码配置
│   └── context/         # 上下文管理
├── public/              # 静态资源
└── tailwind.config.js   # 主题配置
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build && npm start
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站

## 🎨 主题系统

内置 5 种主题预设，当前使用深海蓝配色：

| 主题 | 主色调 |
|------|--------|
| 🌊 深海蓝 | #0a1929 → #38bdf8 |
| 🌙 暗夜紫 | #1a0033 → #a855f7 |
| 🌲 森林绿 | #0a1f0a → #4ade80 |
| ☁️ 极简白 | #f8fafc → #0f172a |
| 🌅 日落橙 | #1a0a00 → #fb923c |

## 📝 开发计划

- [x] AI Agent 对话 / 面试 / 笔试 API
- [x] 低代码编辑器 (Page Builder)
- [x] 主题系统
- [x] GitHub 仓库部署
- [ ] Vercel 线上部署
- [ ] 博客低代码集成
- [ ] Admin 后台功能完善
- [ ] 域名绑定

## 👤 作者

**dawnwenhui** — AI + 前端全栈开发者

- GitHub: [dawnwenhui-2](https://github.com/dawnwenhui-2)

## 📄 License

MIT
