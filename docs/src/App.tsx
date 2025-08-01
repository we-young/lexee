import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import './App.css'

const sections = [
  { id: 'introduction', title: '介绍', icon: '📖' },
  { id: 'getting-started', title: '快速开始', icon: '🚀' },
  { id: 'api', title: 'API 文档', icon: '⚙️' },
  { id: 'deployment', title: '部署', icon: '🌐' },
]


function App() {
  const [activeSection, setActiveSection] = useState('introduction')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)



  const loadMarkdownContent = async (sectionId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/docs/content/${sectionId}.md`)
      if (response.ok) {
        const text = await response.text()
        setContent(text)
      } else {
        setContent(`# 文档未找到\n\n无法加载 ${sectionId} 的文档内容。`)
      }
    } catch (error) {
      console.error('加载文档失败:', error)
      setContent(`# 加载错误\n\n加载文档时发生错误: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMarkdownContent(activeSection)
  }, [activeSection])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      )
    }

    return (
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <code className={`language-${match[1]}`}>
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            table: ({ children }) => (
              <div className="table-wrapper">
                <table>{children}</table>
              </div>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="docs-container">
      <nav className="docs-sidebar">
        <div className="docs-logo">
          <h1>Lexee Docs</h1>
        </div>
        <ul className="docs-nav">
          {sections.map(section => (
            <li key={section.id}>
              <button
                className={`docs-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="docs-content">
        <div className="docs-content-inner">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App