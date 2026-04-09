'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Terminal, Code2, Sparkles, Monitor, Menu, 
  Github, Linkedin, Mail, ChevronDown, MousePointer2
} from 'lucide-react'

import FlipCard3D from '@/components/FlipCard3D'
import OceanEffects from '@/components/OceanEffects'

// 背景组件 - 全海洋特效
function BeachBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {/* 深海渐变背景 */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #0a1929 0%, #0d2137 30%, #102a43 60%, #1e3a5f 100%)'
      }} />
      
      {/* 大型海洋生物漂浮 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute text-6xl opacity-20" style={{top: '10%', left: '5%'}}
          animate={{ y: [0, -50, 0], x: [0, 30, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}>🐋</motion.div>
        <motion.div className="absolute text-5xl opacity-15" style={{top: '30%', right: '10%'}}
          animate={{ y: [0, -40, 0], x: [-20, 20, -20] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}>🦈</motion.div>
        <motion.div className="absolute text-4xl opacity-25" style={{top: '50%', left: '15%'}}
          animate={{ y: [0, -35, 0], rotate: [-8, 8, -8] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}>🐳</motion.div>
        <motion.div className="absolute text-5xl opacity-20" style={{top: '70%', right: '20%'}}
          animate={{ y: [0, -45, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, delay: 3 }}>🐙</motion.div>
        <motion.div className="absolute text-4xl opacity-15" style={{top: '20%', left: '50%'}}
          animate={{ y: [0, -30, 0], x: [-15, 15, -15] }}
          transition={{ duration: 11, repeat: Infinity, delay: 0.5 }}>🪼</motion.div>
        <motion.div className="absolute text-3xl opacity-30" style={{top: '60%', left: '60%'}}
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1.5 }}>🦑</motion.div>
        <motion.div className="absolute text-5xl opacity-15" style={{top: '80%', left: '30%'}}
          animate={{ y: [0, -40, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 13, repeat: Infinity, delay: 2.5 }}>🦈</motion.div>
        <motion.div className="absolute text-4xl opacity-20" style={{top: '15%', right: '30%'}}
          animate={{ y: [0, -35, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 4 }}>🐠</motion.div>
      </div>
      
      {/* 鼠标跟随大光晕 */}
      <div 
        className="absolute rounded-full pointer-events-none transition-all duration-300"
        style={{
          left: mousePos.x - 200,
          top: mousePos.y - 200,
          width: 400,
          height: 400,
          background: `radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.1) 40%, transparent 70%)`,
          transform: `translateY(${-scrollY * 0.1}px)`
        }}
      />
      
      {/* 波浪层 */}
      <svg className="absolute w-full" style={{ top: '80%', height: '15%' }} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          fill="#1e3a5f"
          fillOpacity="0.6"
          animate={{
            d: [
              `M0,${100 + (mousePos.x / window.innerWidth - 0.5) * 30} Q360,${60 + (mousePos.y / window.innerHeight - 0.5) * 20} 720,${100 + (mousePos.x / window.innerWidth - 0.5) * 30} T1440,${100} V320 H0 Z`,
              `M0,${100 + (mousePos.x / window.innerWidth - 0.5) * 30} Q360,${140 + (mousePos.y / window.innerHeight - 0.5) * 20} 720,${100 + (mousePos.x / window.innerWidth - 0.5) * 30} T1440,${100} V320 H0 Z`,
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      </svg>
      
      <svg className="absolute w-full" style={{ top: '88%', height: '12%' }} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          fill="#234e6f"
          fillOpacity="0.8"
          animate={{
            d: [
              `M0,${120 + (mousePos.x / window.innerWidth - 0.5) * 25} Q480,${80 + (mousePos.y / window.innerHeight - 0.5) * 15} 960,${120} T1440,${120} V320 H0 Z`,
              `M0,${120 + (mousePos.x / window.innerWidth - 0.5) * 25} Q480,${160 + (mousePos.y / window.innerHeight - 0.5) * 15} 960,${120} T1440,${120} V320 H0 Z`,
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      </svg>
      
      <svg className="absolute w-full" style={{ top: '94%', height: '10%' }} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          fill="#2a6178"
          animate={{
            d: [
              `M0,${80 + (mousePos.x / window.innerWidth - 0.5) * 20} Q240,${40} 480,${80} T960,${80} T1440,${80} V320 H0 Z`,
              `M0,${80 + (mousePos.x / window.innerWidth - 0.5) * 20} Q240,${120} 480,${80} T960,${80} T1440,${80} V320 H0 Z`,
            ]
          }}
          transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      </svg>
    </div>
  )
}

// 导航栏
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/interview', label: 'Interview' },
    { href: '/resume', label: 'Resume' },
    { href: '/ai-agent', label: 'AI Agent' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/90 backdrop-blur-md py-2 shadow-lg' : 'py-4'
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <motion.a href="#home" className="text-xl font-bold flex items-center gap-2 text-white"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <path d="M4,20 Q10,12 18,18 Q26,24 32,16" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M4,26 Q12,18 18,24 Q28,32 32,24" stroke="#e0f2fe" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M6,30 Q14,24 20,28 Q28,34 30,28" stroke="#bae6fd" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="18" cy="14" r="2" fill="#ffffff" opacity="0.9"/>
            <circle cx="22" cy="12" r="1.5" fill="#ffffff" opacity="0.8"/>
            <circle cx="15" cy="15" r="1" fill="#ffffff" opacity="0.7"/>
            <circle cx="28" cy="18" r="1.5" fill="#ffffff" opacity="0.8"/>
          </svg>
          <span className="drop-shadow-lg">dawnwenhui</span>
        </motion.a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.a key={item.href} href={item.href} className="transition-colors relative font-medium text-white"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }}>
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-400 transition-all hover:w-full" />
            </motion.a>
          ))}
        </div>

        <button className="md:hidden text-white"><Menu size={24} /></button>
      </div>
    </nav>
  )
}

// Hero 区域
function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <BeachBackground />
      
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: 'rgba(15, 41, 65, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(56, 189, 248, 0.3)' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span className="text-lg">🌊</span>
          <span className="text-sm font-medium text-white">深海蓝 · AI前端开发者</span>
        </motion.div>

        <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 text-white"
          style={{ textShadow: '0 0 30px rgba(56, 189, 248, 0.5)' }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          你好，我是 <span style={{ color: '#38bdf8', textShadow: '0 0 40px rgba(56, 189, 248, 0.8)' }}>dawnwenhui</span>
        </motion.h1>

        <motion.p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white"
          style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          专注 Vue / React / TypeScript / AI大模型 开发
        </motion.p>

        <motion.div className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {['Vue3', 'React', 'TypeScript', 'Node.js', 'AI/LLM'].map((tech) => (
            <motion.span key={tech} className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: 'rgba(15, 41, 65, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)' }}
              whileHover={{ scale: 1.05 }}>
              {tech}
            </motion.span>
          ))}
        </motion.div>

        <motion.div className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <motion.a href="#frontend-tips" className="px-8 py-3 rounded-full font-semibold flex items-center gap-2 text-white"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)' }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <MousePointer2 className="w-4 h-4" />
            探索前端难点
          </motion.a>
          <motion.a href="#projects" className="px-8 py-3 rounded-full font-semibold text-white"
            style={{ background: 'rgba(15, 41, 65, 0.8)', border: '1px solid rgba(56, 189, 248, 0.5)' }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            查看项目作品
          </motion.a>
        </motion.div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6 text-sky-400" />
        </motion.div>
      </div>
    </section>
  )
}

// 技术栈区域
function SkillsSection() {
  const skillCategories = [
    { icon: <Code2 className="w-8 h-8" />, title: '前端框架', skills: ['Vue3 / Pinia / Vue Router', 'React / Redux / Zustand', 'Next.js / Nuxt.js', 'TypeScript'], color: '#0ea5e9' },
    { icon: <Terminal className="w-8 h-8" />, title: '后端工具', skills: ['Node.js / Express / Koa', 'Python / FastAPI', 'Docker / Git', 'Webpack / Vite'], color: '#22c55e' },
    { icon: <Sparkles className="w-8 h-8" />, title: 'AI大模型', skills: ['LangChain / LlamaIndex', 'RAG知识库', 'Prompt Engineering', 'OpenAI API'], color: '#a855f7' },
    { icon: <Monitor className="w-8 h-8" />, title: '桌面应用', skills: ['Electron', 'Tauri', 'WebGL / Three.js', 'Canvas动画'], color: '#f97316' },
  ]

  return (
    <section id="skills" className="py-24 relative" style={{ background: 'rgba(10, 25, 41, 0.95)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4 text-white">技术栈 <span style={{ color: '#38bdf8' }}>Skills</span></h2>
          <p className="max-w-2xl mx-auto text-gray-300">从前端到后端，从传统开发到AI大模型</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div key={category.title} className="rounded-2xl p-6"
              style={{ background: 'rgba(15, 41, 65, 0.8)', border: '1px solid rgba(56, 189, 248, 0.2)' }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }}>
              <div className="inline-flex p-3 rounded-xl mb-4" style={{ background: `${category.color}20` }}>
                <div style={{ color: category.color }}>{category.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{category.title}</h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: category.color }} />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 前端难点区域
function FrontendTipsSection() {
  const tips = [
    { title: '原型链继承', description: '手写JavaScript类继承', code: `function inherit(Target, Origin) {\n  const F = () => {};\n  F.prototype = Origin.prototype;\n  Target.prototype = new F();\n}`, tags: ['class', '原型'], difficulty: '进阶', emoji: '🔗' },
    { title: 'Event Loop', description: 'JavaScript异步机制', code: `console.log('1')\nsetTimeout(() => console.log('2'), 0)\nPromise.resolve().then(() => console.log('3'))`, tags: ['Event Loop', 'Promise'], difficulty: '核心', emoji: '⚡' },
    { title: '防抖节流', description: 'Promise.all与性能优化', code: `function debounce(fn, delay) {\n  let timer = null;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(), delay);\n  };\n}`, tags: ['防抖', '节流'], difficulty: '基础', emoji: '🎯' },
    { title: 'Vue3响应式', description: 'Proxy实现Vue3响应式', code: `function reactive(obj) {\n  return new Proxy(obj, {\n    get(target, key) {\n      return typeof val === 'object' ? reactive(val) : val;\n    },\n    set(target, key, value) {\n      trigger(target, key);\n    }\n  });\n}`, tags: ['Vue3', 'Proxy'], difficulty: '高级', emoji: '🔮' },
    { title: 'React Fiber', description: 'Fiber架构原理', code: `const fiber = {\n  type: 'div',\n  child: firstChild,\n  sibling: nextSibling,\n  return: parentFiber,\n};`, tags: ['Fiber', '架构'], difficulty: '高级', emoji: '🧩' },
    { title: '性能优化', description: 'Canvas/WebGL优化技巧', code: `// GPU加速\nelement.style.transform = 'translateX(100px)';\nelement.style.willChange = 'transform';`, tags: ['优化', 'WebGL'], difficulty: '进阶', emoji: '🚀' },
  ]

  const getDifficultyColor = (d: string) => {
    switch (d) {
      case '基础': return 'bg-green-500/20 text-green-400'
      case '进阶': return 'bg-yellow-500/20 text-yellow-400'
      case '核心': return 'bg-red-500/20 text-red-400'
      case '高级': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <section id="frontend-tips" className="py-24 relative" style={{ background: 'rgba(15, 41, 65, 0.9)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4 text-white">前端难点 <span style={{ color: '#38bdf8' }}>Interview Tips</span></h2>
          <p className="max-w-2xl mx-auto text-gray-300">点击卡片查看代码实现</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <motion.div key={tip.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <FlipCard3D {...tip} />
              <div className="mt-2 px-2">
                <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(tip.difficulty)}`}>{tip.difficulty}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-16 rounded-2xl p-8" style={{ background: 'rgba(15, 41, 65, 0.8)', border: '1px solid rgba(56, 189, 248, 0.2)' }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[{value: '20+', label: '手写代码题'}, {value: '15+', label: '原理动画'}, {value: '10+', label: '特效'}, {value: '∞', label: '持续更新'}].map((stat, i) => (
              <motion.div key={i} initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-4xl font-bold mb-2" style={{ color: '#38bdf8' }}>{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// 项目展示
function ProjectsSection() {
  const projects = [
    { title: '博客系统', description: '前后台联动博客，支持Markdown编辑', tech: ['Next.js', 'LocalStorage', 'TailwindCSS'], status: '已完成', emoji: '📝', featured: true, link: '/blog' },
    { title: '个人简历网站', description: '深海蓝主题技术展示', tech: ['Next.js', 'Framer Motion', 'WebGL'], status: '已完成', emoji: '🌊', featured: false, link: '/resume' },
    { title: 'AI简历分析助手', description: '基于RAG技术的智能分析', tech: ['Vue3', 'Python', 'LangChain'], status: '开发中', emoji: '🤖' },
    { title: '股票分析系统', description: '实时数据可视化+AI预测', tech: ['React', 'Node.js', 'Python'], status: '规划中', emoji: '📈' },
  ]

  return (
    <section id="projects" className="py-24 relative" style={{ background: 'rgba(10, 25, 41, 0.95)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4 text-white">项目展示 <span style={{ color: '#38bdf8' }}>Projects</span></h2>
          <p className="max-w-2xl mx-auto text-gray-300">创意与代码的结合</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div key={project.title} as={project.link ? 'a' : 'div'} href={project.link}
              className={`rounded-2xl p-6 transition-all group ${project.featured ? 'md:col-span-2' : ''}`}
              style={{ background: 'rgba(15, 41, 65, 0.8)', border: '1px solid rgba(56, 189, 248, 0.2)', cursor: project.link ? 'pointer' : 'default' }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }}>
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{project.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">{project.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${project.status === '已完成' ? 'bg-green-500/20 text-green-400' : project.status === '开发中' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{project.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="px-3 py-1 text-xs rounded-full" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>{tech}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 联系我
function ContactSection() {
  const socialLinks = [
    { icon: <Github className="w-6 h-6" />, label: 'GitHub', href: 'https://github.com/dawnwenhui' },
    { icon: <Linkedin className="w-6 h-6" />, label: 'LinkedIn', href: '#' },
    { icon: <Mail className="w-6 h-6" />, label: 'Email', href: 'mailto:dawnwenhui@example.com' },
  ]

  return (
    <section id="contact" className="py-24 relative" style={{ background: 'rgba(15, 41, 65, 0.9)' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4 text-white">联系我 <span style={{ color: '#38bdf8' }}>Contact</span></h2>
          <p className="mb-8 text-gray-300">有问题欢迎联系我</p>

          <div className="flex justify-center gap-6 mb-12">
            {socialLinks.map((link) => (
              <motion.a key={link.label} href={link.href} className="p-4 rounded-full transition-all text-sky-300"
                style={{ background: 'rgba(15, 41, 65, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                title={link.label} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                {link.icon}
              </motion.a>
            ))}
          </div>

          <motion.div className="rounded-2xl p-8" style={{ background: 'rgba(15, 41, 65, 0.8)', border: '1px solid rgba(56, 189, 248, 0.2)' }} whileHover={{ scale: 1.02 }}>
            <p className="mb-4 text-gray-300">或者发送邮件至：</p>
            <a href="mailto:dawnwenhui@example.com" className="text-2xl hover:opacity-80 transition-opacity text-sky-400">
              dawnwenhui@example.com
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="py-8" style={{ background: 'rgba(10, 25, 41, 0.98)', borderTop: '1px solid rgba(56, 189, 248, 0.2)' }}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm text-gray-400">© 2026 dawnwenhui. Built with Next.js, TailwindCSS, 🌊 & ❤️</p>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="relative">
      <OceanEffects />
      <Navbar />
      <HeroSection />
      <SkillsSection />
      <FrontendTipsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
