# Vue 聊天应用

一个基于 Vue 2 和 Vant UI 的实时聊天应用，支持多语言翻译、消息通知及 WebSocket 实时通信。项目使用 Axios 处理 HTTP 请求，并通过 Laravel Echo 与 Pusher.js 建立实时连接。

## 安装

```bash
# 安装依赖
npm install

# 复制环境变量示例并按需修改
cp .env.example .env
```

## 运行与构建

```bash
# 启动开发服务器
npm run dev

# 构建生产包
npm run build
```

## 目录结构

```
├── public/               # 静态资源
├── src/
│   ├── api/              # API 接口配置
│   ├── assets/           # 样式与图片资源
│   ├── components/       # 业务组件
│   ├── plugins/          # 第三方插件配置（如 Vant）
│   ├── router/           # 路由配置
│   ├── store/            # Vuex 状态管理
│   └── utils/            # 工具方法
├── manifest.json         # PWA 配置
├── webpack.config.js     # Webpack 配置
└── package.json          # 项目依赖
```

## 核心依赖

- [Vue 2](https://v2.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vuex](https://vuex.vuejs.org/)
- [Vant UI](https://vant-ui.github.io/)
- [Axios](https://axios-http.com/)
- [Laravel Echo](https://laravel.com/docs/broadcasting#installing-laravel-echo) & [Pusher.js](https://pusher.com/)
- [Webpack](https://webpack.js.org/)

## 环境变量示例

`.env.example` 中提供了完整示例，常用变量如下：

```ini
# API 配置
VUE_APP_API_BASE_URL=http://localhost:8000/api
VUE_APP_API_TIMEOUT=10000

# OAuth 配置
VUE_APP_CLIENT_ID=2
VUE_APP_CLIENT_SECRET=your-client-secret-here

# Pusher/WebSocket 配置
VUE_APP_PUSHER_APP_KEY=your-pusher-app-key
VUE_APP_PUSHER_APP_CLUSTER=ap3
VUE_APP_PUSHER_FORCE_TLS=false
VUE_APP_WEBSOCKET_HOST=localhost
VUE_APP_WEBSOCKET_PORT=6001
```

`VUE_APP_API_BASE_URL` 用于配置后端 API 地址，未设置时默认指向 `http://localhost:8000/api`。

## 部署

执行 `npm run build` 后，会在 `dist/` 目录生成静态文件，可使用任意静态服务器（如 Nginx、Node `serve`）部署。确保后端 API 与 WebSocket 服务已正确配置并且环境变量一致。

