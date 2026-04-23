'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DynamicPageRenderer from '@/components/DynamicPageRenderer'
import LowCodeEditor from '@/components/LowCodeEditor'
import { useLowCode } from '@/lib/lowcode-context'
import { Settings2, X, ExternalLink } from 'lucide-react'
import dynamicImport from 'next/dynamic'

// 原有静态组件（作为后备）
const OceanEffects = dynamicImport(() => import('@/components/OceanEffects'), { ssr: false })
import { Terminal, Code2, Sparkles, Monitor, Github, Linkedin, Mail, ChevronDown } from 'lucide-react'
import FlipCard3D from '@/components/FlipCard3D'

export default function HomePage() {
  const { isEditing, setIsEditing, currentPage, theme } = useLowCode()
  const [showEditorHint, setShowEditorHint] = useState(false)

  // 检查是否是首次访问
  useEffect(() => {
    const hasVisited = localStorage.getItem('has_visited_lowcode')
    if (!hasVisited && !isEditing) {
      setShowEditorHint(true)
      setTimeout(() => setShowEditorHint(false), 10000)
    }
  }, [isEditing])

  return (
    <div className="min-h-screen" style={{ background: theme.backgroundColor }}>
      {/* 编辑器入口按钮 */}
      {!isEditing && (
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={() => setIsEditing(true)}
          className="fixed right-4 bottom-24 z-40 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg flex items-center gap-2"
          title="打开低代码编辑器"
        >
          <Settings2 size={20} />
        </motion.button>
      )}

      {/* 编辑器提示 */}
      {showEditorHint && !isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 right-4 z-40 bg-slate-800 border border-sky-500/30 rounded-xl p-4 max-w-xs shadow-xl"
        >
          <p className="text-sm text-white mb-2">💡 低代码编辑器已就绪</p>
          <p className="text-xs text-gray-400 mb-3">点击右下角 ⚙️ 按钮可以自定义页面布局</p>
          <button
            onClick={() => { setIsEditing(true); setShowEditorHint(false) }}
            className="text-xs text-sky-400 hover:text-sky-300"
          >
            立即体验 →
          </button>
        </motion.div>
      )}

      {/* 低代码编辑器 */}
      {isEditing && (
        <>
          <LowCodeEditor pageId={currentPage?.id || 'home'} />
          <motion.button
            onClick={() => setIsEditing(false)}
            className="fixed left-4 top-4 z-50 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2"
          >
            <ExternalLink size={16} />
            退出编辑
          </motion.button>
        </>
      )}

      {/* 动态页面渲染器 */}
      <DynamicPageRenderer />

      {/* 后备：当没有配置时显示原页面 */}
      {!isEditing && !currentPage?.sections?.length && <StaticHomePage />}
    </div>
  )
}

// 原有静态首页（后备）
function StaticHomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <OceanEffects />
        
        {/* 鼠标光效 */}
        <div 
          className="absolute w-96 h-96 rounded-full pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%)',
            left: mousePos.x - 192,
            top: mousePos.y - 192,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />

        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-6xl shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌊
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            你好，我是 <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">文辉</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-sky-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            10年前端开发 · AI大模型应用 · 全栈工程师
          </motion.p>
          
          <motion.div 
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <a href="/resume" className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              查看简历
            </a>
            <a href="/blog" className="px-8 py-3 border border-sky-500 text-sky-400 rounded-xl font-medium hover:bg-sky-500/10 transition-colors">
              阅读博客
            </a>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6 bg-slate-900/80">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">技术栈</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Code2, title: 'Frontend', items: ['Vue3', 'React', 'Next.js', 'TypeScript'], color: '#0ea5e9' },
              { icon: Terminal, title: 'Backend', items: ['Node.js', 'Python', 'Docker', 'Git'], color: '#22c55e' },
              { icon: Sparkles, title: 'AI/ML', items: ['LangChain', 'RAG', 'Prompt', 'OpenAI'], color: '#a855f7' },
              { icon: Monitor, title: 'Desktop', items: ['Electron', 'Tauri', 'WebGL', 'Canvas'], color: '#f97316' },
            ].map((skill, i) => (
              <motion.div
                key={skill.title}
                className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20 hover:border-sky-500/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <skill.icon size={32} className="mb-4" style={{ color: skill.color }} />
                <h3 className="text-lg font-bold text-white mb-4">{skill.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map(item => (
                    <span key={item} className="px-3 py-1 rounded-full text-sm" style={{ background: `${skill.color}20`, color: skill.color }}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flip Cards Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">前端难点解析</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FlipCard3D title="原型链" emoji="🔗" frontColor="#0ea5e9" backContent="JavaScript 通过原型链实现继承。每个对象都有一个 [[Prototype]]，通过 __proto__ 或 Object.getPrototypeOf() 访问。" />
            <FlipCard3D title="Event Loop" emoji="⚡" frontColor="#22c55e" backContent="同步任务在调用栈执行，微任务(Promise)在当前任务后执行，宏任务(setTimeout)在下个任务队列执行。" />
            <FlipCard3D title="防抖/节流" emoji="🎯" frontColor="#a855f7" backContent="防抖：事件触发n秒后执行，期间再次触发则重新计时。节流：n秒内只执行一次。" />
            <FlipCard3D title="Vue3响应式" emoji="🔮" frontColor="#f97316" backContent="Vue3使用Proxy替代Object.defineProperty，支持数组下标监听，新增属性自动响应。" />
            <FlipCard3D title="Virtual DOM" emoji="🌲" frontColor="#06b6d4" backContent="Virtual DOM是真实DOM的JS对象映射，通过Diff算法最小化真实DOM操作，提升性能。" />
            <FlipCard3D title="Promise" emoji="🤝" frontColor="#ec4899" backContent="Promise有三种状态：pending、fulfilled、rejected。通过then/catch/finally处理异步结果。" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-slate-900/80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">联系我</h2>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { icon: Mail, label: 'dawnwenhui@example.com', href: 'mailto:dawnwenhui@example.com' },
              { icon: Github, label: 'GitHub', href: 'https://github.com/dawnwenhui' },
              { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/dawnwenhui' },
            ].map(item => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                className="flex items-center gap-3 px-6 py-4 bg-slate-800/50 rounded-2xl border border-sky-500/20 hover:border-sky-500/50 transition-all"
                whileHover={{ y: -3 }}
              >
                <item.icon size={24} className="text-sky-400" />
                <span className="text-white font-medium">{item.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 dawnwenhui. All rights reserved. 🌊</p>
        </div>
      </footer>
    </>
  )
}
