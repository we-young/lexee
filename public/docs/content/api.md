# API 文档

本文档描述了 Lexee 项目中的主要 API 和组件接口。

## 🧩 核心组件

### App 组件

主应用组件，负责整个应用的布局和状态管理。

```typescript
interface AppProps {
  // 应用配置
  config?: AppConfig;
  // 主题设置
  theme?: 'light' | 'dark';
}

function App(props: AppProps): JSX.Element
```

**使用示例：**

```tsx
import App from './App';

function Root() {
  return (
    <App 
      theme="light"
      config={{
        title: 'My Lexee App',
        version: '1.0.0'
      }}
    />
  );
}
```

## 📚 文档系统 API

### MarkdownRenderer 组件

用于渲染 Markdown 内容的组件。

```typescript
interface MarkdownRendererProps {
  // Markdown 内容
  content: string;
  // 是否启用代码高亮
  enableHighlight?: boolean;
  // 自定义样式类名
  className?: string;
}

function MarkdownRenderer(props: MarkdownRendererProps): JSX.Element
```

**功能特性：**

- ✅ 支持标准 Markdown 语法
- ✅ 代码语法高亮
- ✅ 表格渲染
- ✅ 任务列表
- ✅ 自定义样式

**使用示例：**

```tsx
import { MarkdownRenderer } from './components/MarkdownRenderer';

const markdownContent = `
# 标题

这是一段 **粗体** 和 *斜体* 文本。

\`\`\`typescript
const greeting = 'Hello, World!';
console.log(greeting);
\`\`\`
`;

function DocumentPage() {
  return (
    <MarkdownRenderer 
      content={markdownContent}
      enableHighlight={true}
      className="custom-markdown"
    />
  );
}
```

### DocumentLoader 工具

用于加载和管理文档内容的工具类。

```typescript
class DocumentLoader {
  // 加载单个文档
  static async loadDocument(path: string): Promise<string>;
  
  // 加载文档列表
  static async loadDocumentList(): Promise<DocumentMeta[]>;
  
  // 搜索文档
  static searchDocuments(query: string): DocumentMeta[];
}

interface DocumentMeta {
  id: string;
  title: string;
  path: string;
  lastModified: Date;
  tags?: string[];
}
```

**使用示例：**

```typescript
import { DocumentLoader } from './utils/DocumentLoader';

// 加载文档
const content = await DocumentLoader.loadDocument('/docs/api.md');

// 获取文档列表
const docs = await DocumentLoader.loadDocumentList();

// 搜索文档
const results = DocumentLoader.searchDocuments('API');
```

## 🎨 样式系统

### CSS 变量

项目使用 CSS 变量来管理主题和样式：

```css
:root {
  /* 主色调 */
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  
  /* 文本颜色 */
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  
  /* 背景颜色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  
  /* 边框颜色 */
  --border-color: #e2e8f0;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### 响应式断点

```css
/* 移动设备 */
@media (max-width: 768px) {
  /* 移动端样式 */
}

/* 平板设备 */
@media (min-width: 769px) and (max-width: 1024px) {
  /* 平板端样式 */
}

/* 桌面设备 */
@media (min-width: 1025px) {
  /* 桌面端样式 */
}
```

## 🔧 工具函数

### 类型定义

```typescript
// 应用配置类型
interface AppConfig {
  title: string;
  version: string;
  description?: string;
  author?: string;
}

// 文档节点类型
interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode | string;
  children?: DocSection[];
}

// 主题类型
type Theme = 'light' | 'dark' | 'auto';

// 语言类型
type Language = 'zh-CN' | 'en-US';
```

### 实用工具

```typescript
// 格式化日期
function formatDate(date: Date, format: string): string;

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void;

// 节流函数
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void;

// 深拷贝
function deepClone<T>(obj: T): T;
```

## 📦 构建配置

### Vite 配置选项

```typescript
// vite.config.ts
export default defineConfig({
  // 基础路径
  base: '/',
  
  // 开发服务器配置
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser'
  },
  
  // 插件配置
  plugins: [
    react(),
    // 其他插件...
  ]
});
```

## 🚀 性能优化

### 代码分割

```typescript
// 懒加载组件
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// 使用 Suspense 包装
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 缓存策略

```typescript
// 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 使用 useCallback 缓存函数
const handleClick = useCallback((id: string) => {
  // 处理点击事件
}, []);
```

## 📝 最佳实践

### 组件设计原则

1. **单一职责**: 每个组件只负责一个功能
2. **可复用性**: 设计可在多处使用的通用组件
3. **类型安全**: 为所有 props 定义 TypeScript 类型
4. **性能优化**: 合理使用 memo、useMemo 和 useCallback

### 代码组织

```
src/
├── components/          # 可复用组件
│   ├── common/         # 通用组件
│   ├── forms/          # 表单组件
│   └── layout/         # 布局组件
├── hooks/              # 自定义 Hooks
├── utils/              # 工具函数
├── types/              # 类型定义
├── constants/          # 常量定义
└── styles/             # 样式文件
```

---

📖 **更多信息**: 查看 [部署指南](deployment) 了解如何部署你的应用。