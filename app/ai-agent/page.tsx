'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Loader2, Trash2, Copy, ThumbsUp, ThumbsDown, Target, FileText, Code, Brain, Briefcase, Zap } from 'lucide-react'
import OceanEffects from '@/components/OceanEffects'

type InterviewType = 'behavioral' | 'technical' | 'system-design' | 'coding'
type QuestionType = 'single' | 'multiple' | 'coding' | 'open'

interface Question {
  id: string
  type: QuestionType
  question: string
  options?: string[]
  correctAnswer?: string | string[]
  hint?: string
  explanation?: string
}

interface InterviewQuestion {
  id: string
  category: InterviewType
  question: string
  tips: string[]
  goodAnswer: string
  badAnswer: string
}

// 笔试题库
const questionBank: Record<InterviewType, Question[]> = {
  behavioral: [
    {
      id: 'b1',
      type: 'open',
      question: '请介绍一下你自己，以及你为什么想面试这个岗位？',
      tips: ['突出技术背景和项目经验', '结合应聘岗位JD说明匹配度', '控制在2-3分钟'],
      goodAnswer: '我是一名10年前端开发工程师，擅长Vue/React全栈开发，近两年专注于AI大模型应用开发。贵司的岗位要求与我的经历高度匹配...',
      badAnswer: '我叫xxx，我想要这份工作...'
    },
    {
      id: 'b2',
      type: 'single',
      question: '你在项目中遇到的最大挑战是什么？如何解决的？',
      options: ['A. 描述挑战\nB. 说明解决方案\nC. 总结结果和收获', 'A. 描述挑战', 'STAR法则：Situation-Task-Action-Result'],
      tips: ['使用STAR法则', '量化你的成果'],
      goodAnswer: '当时项目需要3个月，我用2个月完成...',
      badAnswer: '没什么挑战...'
    },
    {
      id: 'b3',
      type: 'multiple',
      question: '你最大的优点和缺点是什么？',
      options: ['优点要量化：代码质量高、项目交付快', '缺点要真实但可控', '展示自我认知和改进意识'],
      tips: ['优点要具体可证明', '缺点要真诚但不影响工作'],
      goodAnswer: '优点：喜欢优化，性能提升50%案例...缺点：有时过于追求完美...',
      badAnswer: '我太完美主义了（太假）'
    },
    {
      id: 'b4',
      type: 'open',
      question: '你为什么离开上一家公司？',
      tips: ['避免负面评价前公司', '聚焦个人发展', '表达对未来的期待'],
      goodAnswer: '希望寻求更大平台，专注AI方向...',
      badAnswer: '领导太烂/钱太少/加班太狠'
    }
  ],
  technical: [
    {
      id: 't1',
      type: 'single',
      question: '以下哪个不是 JavaScript 的原始数据类型？',
      options: ['A. string\nB. boolean\nC. object\nD. undefined', 'C'],
      tips: ['原始类型：string, number, boolean, null, undefined, symbol, bigint'],
      explanation: 'object 是引用类型，其他都是原始类型'
    },
    {
      id: 't2',
      type: 'single',
      question: 'Vue3 中，实现响应式的最佳方式是？',
      options: ['A. Object.defineProperty\nB. Proxy\nC. get/set\nD. 手动监听', 'B'],
      tips: ['Vue3 使用 Proxy 替代了 Vue2 的 defineProperty'],
      explanation: 'Proxy 可以检测数组变化，监听新增属性，性能更好'
    },
    {
      id: 't3',
      type: 'multiple',
      question: '以下哪些方法可以清除 CSS 浮动？',
      options: ['A. overflow: hidden\nB. display: flex\nC. ::after 伪元素\nD. clearfix', 'A,B,C,D'],
      tips: ['现代布局推荐使用 flex/grid'],
      explanation: '四种方法都可以，常用的是 BFC 和 clearfix'
    },
    {
      id: 't4',
      type: 'single',
      question: 'HTTP 状态码 304 表示？',
      options: ['A. 服务器错误\nB. 重定向\nC. 未修改\nD. 客户端错误', 'C'],
      tips: ['304 = Not Modified，使用缓存'],
      explanation: '304 表示资源未修改，浏览器使用本地缓存'
    },
    {
      id: 't5',
      type: 'open',
      question: '请解释什么是 Event Loop，并说明 setTimeout 和 Promise 的执行顺序',
      tips: ['先说同步，再讲任务队列', '区分宏任务和微任务'],
      goodAnswer: 'Event Loop 是 JavaScript 处理异步的机制...同步任务 > 微任务(Promise) > 宏任务(setTimeout)...',
      badAnswer: '就是事件循环...'
    }
  ],
  'system-design': [
    {
      id: 's1',
      type: 'open',
      question: '如何设计一个秒杀系统？',
      tips: ['高并发、库存超卖、防刷', 'CDN、缓存、消息队列', '限流、熔断、降级'],
      goodAnswer: '1. 前端：按钮防抖、验证码\n2. 接入层：CDN、限流\n3. 服务层：消息队列、乐观锁\n4. 数据层：Redis缓存、数据库事务',
      badAnswer: '直接扣库存就行...'
    },
    {
      id: 's2',
      type: 'open',
      question: '设计一个短链接系统',
      tips: ['哈希算法生成短码', '唯一索引避免冲突', '跳转性能优化'],
      goodAnswer: '1. 62进制生成6位短码\n2. Redis缓存热点数据\n3. 数据库索引优化\n4. 301/302重定向',
      badAnswer: '存到数据库就行...'
    }
  ],
  coding: [
    {
      id: 'c1',
      type: 'coding',
      question: '实现防抖函数 debounce',
      options: ['```javascript\nfunction debounce(fn, delay) {\n  let timer = null\n  return function(...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => {\n      fn.apply(this, args)\n    }, delay)\n  }\n}\n```'],
      tips: ['使用闭包保存定时器', '清除上一次的定时器', '使用 apply 绑定 this'],
      goodAnswer: 'function debounce(fn, delay) {\n  let timer = null\n  return function(...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn.apply(this, args), delay)\n  }\n}',
      badAnswer: '不会...'
    },
    {
      id: 'c2',
      type: 'coding',
      question: '实现深拷贝函数 deepClone',
      options: ['```javascript\nfunction deepClone(obj, map = new Map()) {\n  if (obj === null || typeof obj !== \'object\') return obj\n  if (map.has(obj)) return map.get(obj)\n  const clone = Array.isArray(obj) ? [] : {}\n  map.set(obj, clone)\n  for (const key in obj) {\n    clone[key] = deepClone(obj[key], map)\n  }\n  return clone\n}\n```'],
      tips: ['处理循环引用', '区分数组和对象', '使用 WeakMap 避免内存泄漏'],
      goodAnswer: 'function deepClone(obj) {\n  if (obj === null) return null\n  if (typeof obj !== \'object\') return obj\n  const clone = Array.isArray(obj) ? [] : {}\n  for (let key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      clone[key] = deepClone(obj[key])\n    }\n  }\n  return clone\n}',
      badAnswer: 'JSON.parse(JSON.stringify(obj))'
    },
    {
      id: 'c3',
      type: 'coding',
      question: '实现数组扁平化 flatten',
      options: ['```javascript\n// 方法1：reduce\nconst flatten = (arr) => arr.reduce((acc, val) => \n  Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), [])\n\n// 方法2：flat\nconst flatten = (arr) => arr.flat(Infinity)\n```'],
      tips: ['递归处理', 'reduce 方法', 'Array.flat()'],
      goodAnswer: 'function flatten(arr) {\n  return arr.reduce((res, item) => {\n    return res.concat(Array.isArray(item) ? flatten(item) : item)\n  }, [])\n}',
      badAnswer: '不会...'
    }
  ]
}

// 面试题库
const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'i1',
    category: 'behavioral',
    question: '你为什么想加入我们公司？',
    tips: ['了解公司业务', '匹配个人发展', '真诚表达']
  },
  {
    id: 'i2',
    category: 'technical',
    question: 'Vue3 的 Composition API 相比 Options API 有什么优势？',
    tips: ['逻辑复用更灵活', '更好的 TypeScript 支持', '代码组织更清晰']
  },
  {
    id: 'i3',
    category: 'system-design',
    question: '如何设计一个高可用的前端监控系统？',
    tips: ['性能指标采集', '错误边界处理', '数据上报策略']
  },
  {
    id: 'i4',
    category: 'coding',
    question: '手写一个发布订阅模式 EventEmitter',
    tips: ['on/off/emit/once', '事件队列管理', 'this 绑定问题']
  }
]

// 气泡背景
function Bubbles() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="absolute rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-50px',
            width: Math.random() * 10 + 3,
            height: Math.random() * 10 + 3,
            background: `rgba(14, 165, 233, ${Math.random() * 0.3 + 0.1})`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      ))}
      <motion.div className="absolute text-2xl" style={{ top: '15%', left: '5%' }}
        animate={{ y: [0, -20, 0], rotate: [-5, 5, -5], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}>🐠</motion.div>
      <motion.div className="absolute text-xl" style={{ top: '25%', right: '8%' }}
        animate={{ y: [0, -15, 0], x: [0, 10, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}>🐟</motion.div>
      <motion.div className="absolute text-3xl" style={{ top: '40%', left: '3%' }}
        animate={{ y: [0, -25, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}>🦈</motion.div>
      <motion.div className="absolute text-xl" style={{ top: '60%', right: '5%' }}
        animate={{ y: [0, -12, 0], rotate: [-3, 3, -3], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}>🐙</motion.div>
      <motion.div className="absolute text-2xl" style={{ top: '75%', left: '8%' }}
        animate={{ y: [0, -18, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}>🪼</motion.div>
    </div>
  )
}

export default function AIAgent() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'chat' | 'interview' | 'exam'>('chat')
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: `🌊 你好！我是 AI 面试助手 🐙

我可以帮你：
• 💬 聊天问答
• 🎯 模拟面试（行为面/技术面）
• 📝 在线笔试（选择/编程）

有什么想聊的吗？`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Interview state
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [interviewType, setInterviewType] = useState<InterviewType>('behavioral')
  
  // Exam state
  const [examType, setExamType] = useState<InterviewType>('technical')
  const [examQuestions, setExamQuestions] = useState<Question[]>([])
  const [currentExamIndex, setCurrentExamIndex] = useState(0)
  const [userExamAnswer, setUserExamAnswer] = useState<Record<string, any>>({})
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages])

  // Chat handlers
  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setTimeout(() => {
      const responses = [
        { content: `很好的问题！关于「${input.slice(0, 20)}...」让我来解答：\n\n**核心要点：**\n1. 这是现代前端开发的重要概念\n2. 需要理解底层原理\n3. 实践中要多加运用\n\n有什么具体场景想讨论吗？` },
        { content: `这是个很棒的问题！🌊\n\n从我的经验来看：\n• **理论层面**：需要扎实的基础\n• **实践层面**：多写代码多踩坑\n• **进阶层面**：理解底层原理\n\n建议结合项目来学习，效果更好！` },
        { content: `让我来回答这个问题～\n\n**主要观点：**\n1. 先掌握基础概念\n2. 然后深入原理\n3. 最后应用于实践\n\n如果你想深入讨论某个点，随时问我！` }
      ]
      const response = responses[Math.floor(Math.random() * responses.length)]
      const assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant' as const, content: response.content, timestamp: new Date() }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleClear = () => {
    setMessages([{ id: Date.now().toString(), role: 'assistant', content: '🌊 对话已清空！小蓝鱼已准备好，有什么新问题吗？🐠', timestamp: new Date() }])
  }

  // Interview handlers
  const startInterview = () => {
    const questions = interviewQuestions.filter(q => q.category === interviewType)
    const randomQ = questions[Math.floor(Math.random() * questions.length)]
    setCurrentQuestion(randomQ)
    setUserAnswer('')
    setShowFeedback(false)
  }

  const submitInterviewAnswer = () => {
    if (!userAnswer.trim()) return
    setShowFeedback(true)
  }

  // Exam handlers
  const startExam = () => {
    const questions = questionBank[examType]
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5)
    setExamQuestions(shuffled)
    setCurrentExamIndex(0)
    setUserExamAnswer({})
    setExamSubmitted(false)
    setScore({ correct: 0, total: shuffled.length })
  }

  const submitExamAnswer = (answer: string) => {
    setUserExamAnswer(prev => ({ ...prev, [examQuestions[currentExamIndex].id]: answer }))
    if (currentExamIndex < examQuestions.length - 1) {
      setCurrentExamIndex(prev => prev + 1)
    } else {
      // Calculate score
      let correct = 0
      examQuestions.forEach(q => {
        const userAns = userExamAnswer[q.id] || answer
        if (q.type === 'single' || q.type === 'coding') {
          if (userAns === q.correctAnswer) correct++
        } else if (q.type === 'multiple') {
          if (JSON.stringify([...userAns].sort()) === JSON.stringify([...(q.correctAnswer as string[])])) correct++
        }
      })
      if (answer && answer !== userExamAnswer[examQuestions[currentExamIndex]?.id]) correct++
      setScore({ correct, total: examQuestions.length })
      setExamSubmitted(true)
    }
  }

  const handleRating = (id: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, rating } : msg))
  }

  const handleCopy = (content: string) => navigator.clipboard.writeText(content)

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a1929 0%, #0d2137 100%)' }}>
      <Bubbles />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-sky-500/20">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 36 36">
                <path d="M4,20 Q10,12 18,18 Q26,24 32,16" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M4,26 Q12,18 18,24 Q28,32 32,24" stroke="#0ea5e9" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M6,30 Q14,24 20,28 Q28,34 30,28" stroke="#7dd3fc" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <circle cx="18" cy="14" r="2" fill="#e0f2fe" opacity="0.8"/>
              </svg>
              <span className="font-bold text-white">AI Interview Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleClear} className="px-4 py-2 rounded-full text-sm text-sky-400 hover:text-white transition-colors">
                <Trash2 size={16} className="inline mr-1" />
                Clear
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'chat', icon: <Brain size={18} />, label: 'AI Chat' },
              { id: 'interview', icon: <Briefcase size={18} />, label: 'Mock Interview' },
              { id: 'exam', icon: <FileText size={18} />, label: 'Written Test' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-gray-400 hover:text-white'
                }`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 pb-24">
        {/* AI Chat Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map(message => (
                  <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <motion.div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center flex-shrink-0 text-xl" whileHover={{ scale: 1.1 }}>
                        🐙
                      </motion.div>
                    )}
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-sky-500/20">
                        <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sky-500/10">
                            <span className="text-xs text-slate-500">有帮助吗？</span>
                            <button onClick={() => handleRating(message.id, 'up')} className={`p-1.5 rounded-lg transition-all ${message.rating === 'up' ? 'bg-green-500/20 text-green-400' : 'text-slate-500 hover:text-green-400'}`}>
                              <ThumbsUp size={14} />
                            </button>
                            <button onClick={() => handleRating(message.id, 'down')} className={`p-1.5 rounded-lg transition-all ${message.rating === 'down' ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-red-400'}`}>
                              <ThumbsDown size={14} />
                            </button>
                            <button onClick={() => handleCopy(message.content)} className="p-1.5 rounded-lg text-slate-500 hover:text-sky-400 transition-all">
                              <Copy size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <motion.div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-xl" whileHover={{ scale: 1.1 }}>
                        🐳
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <motion.div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>
                    🐠
                  </motion.div>
                  <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-sky-500/20">
                    <div className="flex items-center gap-3 text-sky-300">
                      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                        🪼
                      </motion.span>
                      <span>小蓝鱼正在思考...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Mock Interview Tab */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            {!currentQuestion ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">🎯 模拟面试</h2>
                  <p className="text-gray-400">选择一个面试类型开始练习</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {[
                    { type: 'behavioral', icon: '💬', label: '行为面试', desc: '自我介绍、优缺点、职业规划' },
                    { type: 'technical', icon: '💻', label: '技术面试', desc: 'Vue、React、JavaScript' },
                    { type: 'system-design', icon: '🏗️', label: '系统设计', desc: '架构设计、方案权衡' },
                    { type: 'coding', icon: '⌨️', label: '代码面试', desc: '算法、手写实现' },
                  ].map(item => (
                    <button key={item.type} onClick={() => setInterviewType(item.type as InterviewType)}
                      className={`p-6 rounded-2xl border text-left transition-all ${
                        interviewType === item.type ? 'bg-sky-500/20 border-sky-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-sky-500/30'
                      }`}>
                      <span className="text-4xl mb-3 block">{item.icon}</span>
                      <h3 className="text-lg font-bold text-white mb-1">{item.label}</h3>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
                <motion.button onClick={startInterview}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold text-lg"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Sparkles size={20} className="inline mr-2" />
                  开始面试
                </motion.button>
              </>
            ) : (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-sky-500/20 text-sky-400">
                    {currentQuestion.category === 'behavioral' ? '💬 行为面' : currentQuestion.category === 'technical' ? '💻 技术面' : currentQuestion.category === 'system-design' ? '🏗️ 系统设计' : '⌨️ 代码面'}
                  </span>
                  <button onClick={() => { setCurrentQuestion(null); setShowFeedback(false) }} className="text-gray-400 hover:text-white">
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{currentQuestion.question}</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">💡 答题提示：</p>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.tips.map((tip, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg text-sm bg-slate-700/50 text-gray-300">{tip}</span>
                    ))}
                  </div>
                </div>
                {!showFeedback ? (
                  <>
                    <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="输入你的回答..."
                      className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 resize-none h-40 mb-4" />
                    <motion.button onClick={submitInterviewAnswer}
                      className="w-full py-3 rounded-xl bg-sky-500 text-white font-medium" whileHover={{ scale: 1.02 }}>
                      提交回答
                    </motion.button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                      <h4 className="font-bold text-green-400 mb-2">✅ 参考答案</h4>
                      <p className="text-gray-300 whitespace-pre-wrap">{currentQuestion.goodAnswer}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                      <h4 className="font-bold text-red-400 mb-2">❌ 常见错误</h4>
                      <p className="text-gray-300">{currentQuestion.badAnswer}</p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={startInterview} className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-medium">
                        下一题
                      </button>
                      <button onClick={() => setShowFeedback(false)} className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-medium">
                        重新回答
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Written Test Tab */}
        {activeTab === 'exam' && (
          <div className="space-y-6">
            {!examQuestions.length ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">📝 在线笔试</h2>
                  <p className="text-gray-400">选择一个类型开始答题</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {[
                    { type: 'technical', icon: '💻', label: '技术题', desc: 'JS/Vue/React/CSS' },
                    { type: 'behavioral', icon: '💬', label: '软技能', desc: '职场沟通、团队协作' },
                  ].map(item => (
                    <button key={item.type} onClick={() => setExamType(item.type as InterviewType)}
                      className={`p-6 rounded-2xl border text-left transition-all ${
                        examType === item.type ? 'bg-sky-500/20 border-sky-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-sky-500/30'
                      }`}>
                      <span className="text-4xl mb-3 block">{item.icon}</span>
                      <h3 className="text-lg font-bold text-white mb-1">{item.label}</h3>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
                <motion.button onClick={startExam}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold text-lg"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Zap size={20} className="inline mr-2" />
                  开始答题 (5题)
                </motion.button>
              </>
            ) : examSubmitted ? (
              <div className="text-center py-12">
                <div className="text-8xl mb-6">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-4">答题完成！</h2>
                <div className="text-6xl font-bold mb-4" style={{ color: score.correct / score.total >= 0.8 ? '#22c55e' : score.correct / score.total >= 0.6 ? '#f59e0b' : '#ef4444' }}>
                  {score.correct}/{score.total}
                </div>
                <p className="text-gray-400 mb-8">
                  {score.correct / score.total >= 0.8 ? '优秀！' : score.correct / score.total >= 0.6 ? '还不错！' : '继续加油！'}
                </p>
                <button onClick={() => setExamQuestions([])} className="px-8 py-3 rounded-xl bg-sky-500 text-white font-medium">
                  再来一轮
                </button>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sky-400">第 {currentExamIndex + 1}/{examQuestions.length} 题</span>
                  <div className="flex gap-1">
                    {examQuestions.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i <= currentExamIndex ? 'bg-sky-500' : 'bg-slate-700'}`} />
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    examQuestions[currentExamIndex].type === 'single' ? 'bg-green-500/20 text-green-400' :
                    examQuestions[currentExamIndex].type === 'multiple' ? 'bg-yellow-500/20 text-yellow-400' :
                    examQuestions[currentExamIndex].type === 'open' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {examQuestions[currentExamIndex].type === 'single' ? '单选' : examQuestions[currentExamIndex].type === 'multiple' ? '多选' : examQuestions[currentExamIndex].type === 'open' ? '简答' : '编程'}
                  </span>
                </div>
                <h3 className="text-lg text-white mb-4 whitespace-pre-wrap">{examQuestions[currentExamIndex].question}</h3>
                {examQuestions[currentExamIndex].options && (
                  <div className="space-y-3 mb-4">
                    {(examQuestions[currentExamIndex].options || []).map((opt, i) => (
                      <label key={i} className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                        userExamAnswer[examQuestions[currentExamIndex].id] === opt ? 'bg-sky-500/20 border border-sky-500/50' : 'bg-slate-900/50 border border-slate-700 hover:border-sky-500/30'
                      }`}>
                        <input type="radio" name={`q-${currentExamIndex}`} checked={userExamAnswer[examQuestions[currentExamIndex].id] === opt}
                          onChange={() => submitExamAnswer(opt)} className="mt-1" />
                        <span className="text-gray-300 whitespace-pre-wrap">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {!examQuestions[currentExamIndex].options && (
                  <textarea value={userExamAnswer[examQuestions[currentExamIndex].id] || ''}
                    onChange={(e) => setUserExamAnswer(prev => ({ ...prev, [examQuestions[currentExamIndex].id]: e.target.value }))}
                    placeholder="输入你的答案..."
                    className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 resize-none h-40 mb-4" />
                )}
                {examQuestions[currentExamIndex].options ? (
                  <p className="text-center text-gray-500 text-sm">选择后自动下一题</p>
                ) : (
                  <motion.button onClick={() => submitExamAnswer(userExamAnswer[examQuestions[currentExamIndex].id] || '')}
                    className="w-full py-3 rounded-xl bg-sky-500 text-white font-medium" whileHover={{ scale: 1.02 }}>
                    提交答案
                  </motion.button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Input */}
      {activeTab === 'chat' && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pt-8 pb-6 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/20 to-blue-500/20 blur-xl" />
              <div className="relative flex items-center gap-4 bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-sky-500/30 p-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入你的问题..." className="flex-1 bg-transparent px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none"
                  disabled={isLoading} />
                <motion.button onClick={handleSend} disabled={!input.trim() || isLoading}
                  className="p-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
            <p className="text-center text-xs text-slate-600 mt-3">AI 助手会尽力帮助您，但可能会有不准确之处</p>
          </div>
        </div>
      )}
    </div>
  )
}
