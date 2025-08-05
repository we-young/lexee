# 快速开始

本指南将帮助你快速设置和运行 Lexee 项目。

## 📋 前置要求

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js** >= 20.12.0
- **npm** >= 9.0.0 或 **yarn** >= 1.22.0
- **Git** (用于版本控制)

### 检查环境

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version
```

## 🚀 安装和启动

### 1. 克隆项目

```bash
git clone <repository-url>
cd lexee
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
# 启动主应用
npm run dev

# 启动文档系统
npm run docs:dev
```

## 🔧 可用命令

### 主应用命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 (http://localhost:5173) |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |
| `npm run lint` | 运行代码检查 |

### 文档系统命令

| 命令 | 描述 |
|------|------|
| `npm run docs:dev` | 启动文档开发服务器 (http://localhost:5174) |
| `npm run docs:build` | 构建文档 |
| `npm run docs:preview` | 预览文档构建结果 |

## 📁 项目结构详解

```
lexee/
├── src/                    # 主应用源码
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 应用入口
│   ├── components/        # 可复用组件
│   ├── assets/            # 静态资源
│   └── ...
├── docs/                   # 文档系统
│   ├── content/           # Markdown 文档内容
│   │   ├── introduction.md
│   │   ├── getting-started.md
│   │   └── ...
│   ├── src/               # 文档应用源码
│   │   ├── App.tsx        # 文档应用组件
│   │   └── ...
│   └── index.html         # 文档入口页面
├── public/                 # 公共静态资源
├── package.json           # 项目配置和依赖
├── vite.config.ts         # 主应用 Vite 配置
├── vite.doc.config.ts     # 文档 Vite 配置
├── tsconfig.json          # TypeScript 配置
└── ...
```

## 🎨 开发指南

### 添加新页面

1. 在 `src/` 目录下创建新的组件文件
2. 在 `App.tsx` 中导入并使用组件
3. 根据需要添加路由配置

### 编写文档

1. 在 `docs/content/` 目录下创建 `.md` 文件
2. 使用标准的 Markdown 语法编写内容
3. 文档会自动被文档系统识别和渲染

### 代码规范

项目使用 ESLint 进行代码质量检查：

```bash
# 检查代码
npm run lint

# 自动修复可修复的问题
npm run lint -- --fix
```

## 🚨 常见问题

### Q: 开发服务器启动失败

**A:** 检查以下几点：
- Node.js 版本是否符合要求 (>= 20.12.0)
- 端口是否被占用
- 依赖是否正确安装

### Q: 构建失败

**A:** 尝试以下解决方案：
```bash
# 清理 node_modules 并重新安装
rm -rf node_modules package-lock.json
npm install

# 检查 TypeScript 错误
npm run lint
```

### Q: 文档页面显示异常

**A:** 确保：
- Markdown 文件格式正确
- 文档服务器正常运行
- 浏览器缓存已清理

## 📞 获取帮助

如果遇到问题，可以：

1. 查看项目的 [API 文档](api)
2. 阅读 [部署指南](deployment)
3. 提交 Issue 到项目仓库

---

🎉 **恭喜！** 你已经成功设置了 Lexee 项目。现在可以开始开发你的应用了！