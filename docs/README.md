# Lexee 文档

这是 Lexee 项目的文档系统，基于 React + TypeScript 构建。

## 功能特性

- 📚 响应式文档界面
- 🎨 现代化的设计风格
- 📱 移动端适配
- ⚡ 基于 Vite 的快速构建
- 🔍 清晰的导航结构

## 开发指南

### 启动文档开发服务器

```bash
npm run docs:dev
```

文档将在 http://localhost:5174 启动

### 构建文档

```bash
npm run docs:build
```

构建产物将输出到 `docs/dist` 目录

### 预览构建结果

```bash
npm run docs:preview
```

## 文档结构

```
docs/
├── index.html          # 文档入口页面
├── src/
│   ├── App.tsx         # 主应用组件
│   ├── App.css         # 应用样式
│   ├── main.tsx        # 应用入口
│   └── index.css       # 全局样式
├── dist/               # 构建输出目录
└── README.md           # 文档说明
```

## 添加新的文档页面

1. 在 `docs/src/App.tsx` 的 `docSections` 数组中添加新的文档节
2. 定义页面的 `id`、`title` 和 `content`
3. 内容可以是 JSX 组件或 Markdown 渲染的内容

## 自定义样式

- 修改 `docs/src/App.css` 来调整文档的整体样式
- 修改 `docs/src/index.css` 来调整全局样式

## 部署

文档可以部署到任何静态文件服务器：

1. 运行 `npm run docs:build` 构建文档
2. 将 `docs/dist` 目录的内容上传到服务器
3. 确保服务器配置正确的 base path（如果需要）

## 配置

文档的构建配置在 `vite.doc.config.ts` 中，你可以根据需要调整：

- `base`: 部署的基础路径
- `server.port`: 开发服务器端口
- `build.outDir`: 构建输出目录
- 其他 Vite 配置选项