# 部署指南

本指南将帮助你将 Lexee 项目部署到各种平台和环境中。

## 🏗️ 构建准备

### 环境检查

在部署之前，确保你的构建环境满足以下要求：

```bash
# 检查 Node.js 版本 (推荐 LTS 版本)
node --version  # >= 20.12.0

# 检查 npm 版本
npm --version   # >= 9.0.0
```

### 构建项目

```bash
# 安装依赖
npm install

# 构建主应用
npm run build

# 构建文档系统
npm run docs:build
```

构建完成后，你将得到以下文件：

- `dist/` - 主应用构建产物
- `docs/dist/` - 文档系统构建产物

## 🌐 静态网站部署

### Vercel 部署

[Vercel](https://vercel.com) 是部署 React 应用的最佳选择之一。

#### 方法一：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 部署到生产环境
vercel --prod
```

#### 方法二：通过 Git 集成

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 Vercel 控制台导入项目
3. 配置构建设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Vercel 配置文件

创建 `vercel.json` 配置文件：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/docs/(.*)",
      "dest": "/docs/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Netlify 部署

[Netlify](https://netlify.com) 提供简单的静态网站托管服务。

#### 通过 Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 构建并部署
npm run build
netlify deploy --prod --dir=dist
```

#### Netlify 配置文件

创建 `netlify.toml` 配置文件：

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/docs/*"
  to = "/docs/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages 部署

#### 使用 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: |
        npm run build
        npm run docs:build
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🐳 Docker 部署

### Dockerfile

创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build && npm run docs:build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/docs/dist /usr/share/nginx/html/docs

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx 配置

创建 `nginx.conf`：

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # 主应用路由
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # 文档系统路由
        location /docs {
            try_files $uri $uri/ /docs/index.html;
        }
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  lexee:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    
  # 可选：添加反向代理
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./proxy.conf:/etc/nginx/nginx.conf
    depends_on:
      - lexee
```

### 构建和运行

```bash
# 构建镜像
docker build -t lexee .

# 运行容器
docker run -p 80:80 lexee

# 或使用 Docker Compose
docker-compose up -d
```

## ☁️ 云平台部署

### AWS S3 + CloudFront

#### 1. 创建 S3 存储桶

```bash
# 使用 AWS CLI
aws s3 mb s3://your-bucket-name
aws s3 website s3://your-bucket-name --index-document index.html
```

#### 2. 上传文件

```bash
# 构建项目
npm run build
npm run docs:build

# 上传到 S3
aws s3 sync dist/ s3://your-bucket-name/ --delete
aws s3 sync docs/dist/ s3://your-bucket-name/docs/ --delete
```

#### 3. 配置 CloudFront

创建 CloudFront 分发，配置：
- **Origin Domain**: S3 存储桶域名
- **Default Root Object**: `index.html`
- **Error Pages**: 404 → `/index.html` (200)

### Azure Static Web Apps

创建 `.github/workflows/azure-static-web-apps.yml`：

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
```

## 🔧 部署优化

### 性能优化

#### 1. 启用 Gzip 压缩

```nginx
# Nginx 配置
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;
```

#### 2. 设置缓存策略

```nginx
# 静态资源长期缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 文件不缓存
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 安全配置

#### 1. HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
}
```

#### 2. 环境变量管理

```bash
# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=your-analytics-id
```

## 📊 监控和分析

### 添加分析工具

```typescript
// src/utils/analytics.ts
export const initAnalytics = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_ANALYTICS_ID) {
    // Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_ANALYTICS_ID}`;
    document.head.appendChild(script);
    
    window.gtag = function() {
      dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', import.meta.env.VITE_ANALYTICS_ID);
  }
};
```

### 错误监控

```typescript
// src/utils/errorTracking.ts
export const initErrorTracking = () => {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // 发送错误到监控服务
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // 发送错误到监控服务
  });
};
```

## 🚀 CI/CD 最佳实践

### 多环境部署

```yaml
# .github/workflows/deploy.yml
strategy:
  matrix:
    environment: [staging, production]
    
steps:
  - name: Deploy to ${{ matrix.environment }}
    run: |
      if [ "${{ matrix.environment }}" == "staging" ]; then
        npm run build:staging
      else
        npm run build:production
      fi
```

### 自动化测试

```yaml
- name: Run tests
  run: |
    npm run test
    npm run test:e2e
    npm run lint
    npm run type-check
```

---

🎉 **部署完成！** 你的 Lexee 应用现在已经成功部署并可以访问了。记得定期更新和维护你的部署环境。