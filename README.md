# 徒步俱乐部 - 现代化户外徒步应用

一个现代化的徒步俱乐部前端应用，帮助户外爱好者发现、组织和参与徒步活动。

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **样式框架**: Tailwind CSS
- **部署平台**: Vercel

## 项目结构

```
hiking-club/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   │   └── css/          # 样式文件
│   ├── components/        # Vue组件
│   ├── composables/       # 组合式函数
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia状态管理
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.js           # 应用入口
├── package.json          # 项目配置
├── vite.config.js        # Vite配置
├── tailwind.config.js    # Tailwind配置
├── postcss.config.js     # PostCSS配置
└── index.html            # HTML入口
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

访问 http://localhost:3000

### 构建项目

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 功能特性

- 🏔️ 活动浏览与搜索
- 📱 响应式设计
- 🎯 活动筛选与分类
- 🗺️ 路线展示
- 👥 团队介绍
- 📞 联系方式

## 开发规范

- 使用Vue 3 Composition API
- 遵循Tailwind CSS设计系统
- 组件化开发
- 类型安全的JavaScript

## 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

## 许可证

MIT License
