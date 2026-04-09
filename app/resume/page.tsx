'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Github, Linkedin, MapPin, Download, Sparkles, Code, Zap, Palette } from 'lucide-react'
import OceanEffects from '@/components/OceanEffects'

// 简历数据
const resumeData = {
  name: 'dawnwenhui',
  title: 'AI前端开发工程师',
  contact: {
    email: 'dawnwenhui@example.com',
    phone: '138-xxxx-xxxx',
    location: '上海',
    github: 'https://github.com/dawnwenhui',
    linkedin: 'https://linkedin.com/in/dawnwenhui'
  },
  summary: '6年前端开发经验，擅长 Vue/React 全家桶，对 AI 大模型应用有深入研究和实践经验。追求代码艺术与用户体验的完美结合，热衷于用创意和技术解决实际问题。',
  
  skills: [
    { category: '前端框架', items: ['Vue3 / Pinia / Vue Router', 'React / Redux / Zustand', 'Next.js / Nuxt.js', 'TypeScript'], color: '#0ea5e9' },
    { category: '后端工具', items: ['Node.js / Express / Koa', 'Python / FastAPI', 'Docker / Git', 'Webpack / Vite'], color: '#22c55e' },
    { category: 'AI 大模型', items: ['LangChain / LlamaIndex', 'RAG 知识库', 'Prompt Engineering', 'OpenAI / Claude API'], color: '#a855f7' },
    { category: '桌面应用', items: ['Electron', 'Tauri', 'WebGL / Three.js', 'Canvas / SVG'], color: '#f97316' },
  ],
  
  experience: [
    {
      company: '某科技公司',
      position: '高级前端工程师',
      period: '2022.03 - 至今',
      highlights: ['负责核心业务系统前端架构设计与开发', '主导前端性能优化，首页加载时间降低 60%', '推动 TypeScript 全面落地，提升代码质量', '搭建前端组件库，被 5 个项目复用']
    },
    {
      company: '某互联网公司',
      position: '前端开发工程师',
      period: '2020.06 - 2022.02',
      highlights: ['参与多个大型项目的前端开发', '负责 Vue 技术栈迁移与重构', '实现移动端适配与响应式设计', '优化页面性能，提升用户体验']
    },
    {
      company: '某创业公司',
      position: '前端开发工程师',
      period: '2018.07 - 2020.05',
      highlights: ['从 0 到 1 搭建公司前端项目', '开发后台管理系统', '实现数据可视化报表', '对接第三方 API']
    }
  ],
  
  projects: [
    { name: 'AI 简历分析助手', description: '基于 RAG 技术的智能简历分析系统', tech: ['Vue3', 'Python', 'LangChain', 'OpenAI'] },
    { name: '股票分析系统', description: '实时数据可视化 + AI 趋势预测', tech: ['React', 'Node.js', 'Python', 'ECharts'] },
    { name: '前端代码编辑器', description: '在线代码编辑器，支持 AI 补全', tech: ['Monaco Editor', 'Vue3', 'TypeScript'] }
  ],
  
  education: { school: '某大学', degree: '本科 · 计算机科学与技术', period: '2014.09 - 2018.06' }
}

// 深海蓝气泡背景
function DeepSeaBackground() {
  const [bubbles, setBubbles] = useState<Array<{left: number, delay: number, size: number}>>([])
  
  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 15 + 5
    }))
    setBubbles(newBubbles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-bounce"
          style={{
            left: `${bubble.left}%`,
            bottom: '-50px',
            width: bubble.size,
            height: bubble.size,
            background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(56,189,248,0.1))',
            animationDuration: `${8 + bubble.delay}s`,
            animationDelay: `${bubble.delay}s`
          }}
        />
      ))}
    </div>
  )
}

// 鼠标跟随光效
function MouseGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className="fixed w-96 h-96 rounded-full pointer-events-none -z-10 transition-all duration-200"
      style={{
        left: mousePos.x - 192,
        top: mousePos.y - 192,
        background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)'
      }}
    />
  )
}

// 深海卡片组件
function DeepCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ y: -5 }}
    >
      <div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 blur-xl"
      />
      <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-500/20 shadow-xl">
        {children}
      </div>
    </motion.div>
  )
}

// 深海按钮
function DeepButton({ children, primary = false }: { children: React.ReactNode, primary?: boolean }) {
  return (
    <motion.button
      className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${
        primary 
          ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/30' 
          : 'bg-slate-800/50 text-sky-400 border border-sky-500/30'
      }`}
      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(14,165,233,0.4)' }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

// 打字机效果
function Typewriter({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('')
  
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [text])

  return <span>{displayText}<span className="animate-pulse">|</span></span>
}

// 技能条组件
function SkillBar({ name, color, delay }: { name: string, color: string, delay: number }) {
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    setTimeout(() => setWidth(70 + Math.random() * 30), 500)
  }, [])

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span style={{ color }}>{name}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// 简历展示页
export default function Resume() {
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #0a1929 0%, #0d2137 50%, #102a43 100%)' }}>
      <OceanEffects />

      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-sky-500/20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.a href="/" className="font-bold text-xl flex items-center gap-2 text-sky-300"
            whileHover={{ scale: 1.05 }}
          >
            <svg width="32" height="32" viewBox="0 0 36 36">
              {/* 浪花主体 */}
              <path d="M4,20 Q10,12 18,18 Q26,24 32,16" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M4,26 Q12,18 18,24 Q28,32 32,24" stroke="#0ea5e9" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M6,30 Q14,24 20,28 Q28,34 30,28" stroke="#7dd3fc" strokeWidth="2" fill="none" strokeLinecap="round"/>
              {/* 浪尖泡沫 */}
              <circle cx="18" cy="14" r="2" fill="#e0f2fe" opacity="0.8"/>
              <circle cx="22" cy="12" r="1.5" fill="#e0f2fe" opacity="0.6"/>
              <circle cx="15" cy="15" r="1" fill="#e0f2fe" opacity="0.5"/>
              <circle cx="28" cy="18" r="1.5" fill="#e0f2fe" opacity="0.6"/>
            </svg>
            dawnwenhui
          </motion.a>
          <DeepButton primary>
            <Download size={18} /> 下载 PDF
          </DeepButton>
        </div>
      </nav>
      
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* 头像 */}
          <motion.div
            className="relative inline-block mb-6"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <div 
              className="w-36 h-36 rounded-full mx-auto flex items-center justify-center text-6xl text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6, #8b5cf6)' }}
            >
              D
            </div>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'conic-gradient(from 0deg, #0ea5e9, #3b82f6, #8b5cf6, #0ea5e9)', filter: 'blur(20px)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          <h1 className="text-5xl font-bold mb-2 text-sky-100">
            {resumeData.name}
          </h1>
          <h2 className="text-2xl mb-6 text-sky-400">
            {resumeData.title}
          </h2>

          {/* 联系方式 */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              { icon: <Mail size={14} />, text: resumeData.contact.email },
              { icon: <Phone size={14} />, text: resumeData.contact.phone },
              { icon: <MapPin size={14} />, text: resumeData.contact.location },
              { icon: <Github size={14} />, text: 'GitHub', href: resumeData.contact.github },
              { icon: <Linkedin size={14} />, text: 'LinkedIn', href: resumeData.contact.linkedin },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href || '#'}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-sky-500/20 text-sky-300 text-sm"
                whileHover={{ y: -2, borderColor: 'rgba(14,165,233,0.5)' }}
              >
                {item.icon}
                {item.text}
              </motion.a>
            ))}
          </div>

          <DeepCard className="max-w-2xl mx-auto">
            <p className="text-slate-300 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-sky-400 flex-shrink-0 mt-1" />
              <Typewriter text={resumeData.summary} />
            </p>
          </DeepCard>
        </motion.div>

        {/* 技能 */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionTitle icon={<Zap />} title="技能专长" />
          <DeepCard>
            <div className="grid md:grid-cols-2 gap-6">
              {resumeData.skills.map((skill, i) => (
                <div key={skill.category}>
                  <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: skill.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: skill.color }} />
                    {skill.category}
                  </h4>
                  {skill.items.map((item, j) => (
                    <SkillBar key={item} name={item} color={skill.color} delay={i * 0.2 + j * 0.1} />
                  ))}
                </div>
              ))}
            </div>
          </DeepCard>
        </motion.section>

        {/* 工作经历 */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionTitle icon={<Code />} title="工作经历" />
          <div className="space-y-6">
            {resumeData.experience.map((job, i) => (
              <motion.div
                key={i}
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12"
              >
                <motion.div
                  className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-500"
                  whileHover={{ scale: 1.3 }}
                />
                <div className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 to-transparent" />

                <DeepCard>
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-sky-100">{job.position}</h4>
                      <p className="font-medium text-sky-400">{job.company}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {job.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {job.highlights.map((h, j) => (
                      <li key={j} className="text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full mt-2 bg-sky-500 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </DeepCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 项目 */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionTitle icon={<Palette />} title="项目经验" />
          <div className="grid md:grid-cols-3 gap-6">
            {resumeData.projects.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <DeepCard className="h-full">
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' }}
                  >
                    🚀
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-sky-100">{project.name}</h4>
                  <p className="text-slate-400 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
                      <span key={t} className="px-2 py-1 text-xs rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </DeepCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 教育 */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionTitle icon={<Sparkles />} title="教育经历" />
          <DeepCard>
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <h4 className="text-xl font-bold text-sky-100">{resumeData.education.school}</h4>
                <p className="text-slate-400">{resumeData.education.degree}</p>
              </div>
              <span className="px-4 py-2 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {resumeData.education.period}
              </span>
            </div>
          </DeepCard>
        </motion.section>

        <motion.footer
          className="text-center py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 flex items-center justify-center gap-2">
            <span>Made with</span>
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              💜
            </motion.span>
            <span>&</span>
            <span>贝壳</span>
            <span>🪸</span>
            <span>by dawnwenhui</span>
          </p>
        </motion.footer>
      </main>
    </div>
  )
}

// 章节标题
function SectionTitle({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <motion.h3
      className="text-2xl font-bold mb-6 flex items-center gap-3 text-sky-100"
      initial={{ x: -30, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
    >
      <span className="text-3xl">{icon}</span>
      {title}
      <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-sky-500 to-transparent" />
    </motion.h3>
  )
}
