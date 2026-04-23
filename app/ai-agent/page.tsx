'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2, Copy, ThumbsUp, ThumbsDown, Sparkles, Brain, Briefcase, FileText, Zap, Loader2, History, ChevronDown, ChevronUp, Star, Clock, Square } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { GlowBox } from '@/components/AnimatedBorder'

// ============ Types ============
type TabType = 'chat' | 'interview' | 'exam'
type InterviewType = 'behavioral' | 'technical' | 'system-design' | 'coding'
type QuestionType = 'single' | 'multiple' | 'open' | 'coding'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  rating?: 'up' | 'down'
  isStreaming?: boolean
}

interface InterviewQuestion {
  id: string
  question: string
  tips: string[]
  goodAnswer: string
  badAnswer: string
  category: InterviewType
  keywords?: string[]
}

interface InterviewRecord {
  id: string
  question: string
  category: InterviewType
  difficulty: string
  userAnswer: string
  tips: string[]
  goodAnswer: string
  badAnswer: string
  timestamp: number
  keywords?: string[]
}

interface ExamQuestion {
  id: string
  type: QuestionType
  question: string
  options?: string[]
  explanation?: string
  tip?: string
  _correctAnswer?: string | string[]
}

// ============ API Functions ============

async function* streamChat(messages: { role: string; content: string }[], signal?: AbortSignal) {
  const response = await fetch('/api/ai-agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (!data || data === '[DONE]') continue
      try {
        const json = JSON.parse(data)
        if (json.type === 'chunk') yield json.content as string
        else if (json.type === 'done') return
        else if (json.type === 'error') throw new Error(json.message)
      } catch { /* skip */ }
    }
  }
}

async function fetchInterviewQuestion(type: InterviewType, difficulty: string = 'medium') {
  const res = await fetch('/api/ai-agent/interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, difficulty }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || '获取面试题失败')
  return data.data as InterviewQuestion
}

async function fetchExamQuestions(category: string = 'technical', count: number = 5) {
  const res = await fetch('/api/ai-agent/exam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, count }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || '获取笔试题失败')
  return data.data as ExamQuestion[]
}

// ============ Main Component ============
export default function AIAgent() {
  const [activeTab, setActiveTab] = useState<TabType>('chat')

  // Chat state
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('ai-chat-history')
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return [{
      id: '1',
      role: 'assistant' as const,
      content: `🌊 你好！我是 **AI 面试助手** 🐙\n\n我可以帮你：\n- 💬 聊天问答（前端技术问题）\n- 🎯 模拟面试（AI 智能出题）\n- 📝 在线笔试（选择/简答/编程）\n\n有什么想聊的吗？`,
      timestamp: new Date()
    }]
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Interview state
  const [interviewType, setInterviewType] = useState<InterviewType>('technical')
  const [interviewDifficulty, setInterviewDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [interviewLoading, setInterviewLoading] = useState(false)
  const [interviewError, setInterviewError] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [interviewHistory, setInterviewHistory] = useState<InterviewRecord[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('interview-history')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  // Exam state
  const [examCategory, setExamCategory] = useState<'technical' | 'behavioral'>('technical')
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([])
  const [currentExamIndex, setCurrentExamIndex] = useState(0)
  const [userExamAnswers, setUserExamAnswers] = useState<Record<string, string | string[]>>({})
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [examScore, setExamScore] = useState({ correct: 0, total: 0 })
  const [examLoading, setExamLoading] = useState(false)
  const [examError, setExamError] = useState('')

  // Scroll to bottom
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages])

  // Persist chat history
  useEffect(() => {
    localStorage.setItem('ai-chat-history', JSON.stringify(messages))
  }, [messages])

  // Persist history
  useEffect(() => {
    localStorage.setItem('interview-history', JSON.stringify(interviewHistory))
  }, [interviewHistory])

  // Save interview record
  const saveInterviewRecord = useCallback((q: InterviewQuestion, ans: string) => {
    const record: InterviewRecord = {
      id: Date.now().toString(),
      question: q.question,
      category: q.category,
      difficulty: interviewDifficulty,
      userAnswer: ans,
      tips: q.tips,
      goodAnswer: q.goodAnswer,
      badAnswer: q.badAnswer,
      timestamp: Date.now(),
      keywords: q.keywords,
    }
    setInterviewHistory(prev => [record, ...prev].slice(0, 50))
  }, [interviewDifficulty])

  // ============ Chat Handlers ============
  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    const aiMsgId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date(), isStreaming: true }])

    // 创建 AbortController
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      history.push({ role: 'user', content: userMsg.content })
      let fullContent = ''
      for await (const chunk of streamChat(history, controller.signal)) {
        fullContent += chunk
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: fullContent } : m))
      }
    } catch (err) {
      const isAborted = err instanceof DOMException && err.name === 'AbortError'
      if (isAborted) {
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: m.content || '⏹ 已停止生成', isStreaming: false } : m))
      } else {
        const errorMsg = err instanceof Error ? err.message : 'AI 连接失败'
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: '❌ ' + errorMsg, isStreaming: false } : m))
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m))
    }
  }

  // 停止生成
  const handleStop = () => {
    abortRef.current?.abort()
  }

  const handleClear = () => {
    const freshMessages = [{
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: '🌊 对话已清空！小蓝鱼已准备好，有什么新问题吗？🐠',
      timestamp: new Date()
    }]
    setMessages(freshMessages)
    localStorage.removeItem('ai-chat-history')
  }

  const handleRating = (id: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, rating } : m))
  }

  // ============ Interview Handlers ============
  const startInterview = async () => {
    setInterviewLoading(true)
    setInterviewError('')
    setCurrentQuestion(null)
    setUserAnswer('')
    setShowFeedback(false)
    try {
      const question = await fetchInterviewQuestion(interviewType, interviewDifficulty)
      setCurrentQuestion(question)
    } catch (err) {
      setInterviewError(err instanceof Error ? err.message : '获取面试题失败')
    } finally {
      setInterviewLoading(false)
    }
  }

  const submitInterviewAnswer = () => {
    if (!userAnswer.trim() || !currentQuestion) return
    saveInterviewRecord(currentQuestion, userAnswer)
    setShowFeedback(true)
  }

  // ============ Exam Handlers ============
  const startExam = async () => {
    setExamLoading(true)
    setExamError('')
    setExamQuestions([])
    setCurrentExamIndex(0)
    setUserExamAnswers({})
    setExamSubmitted(false)
    setExamScore({ correct: 0, total: 0 })
    try {
      const questions = await fetchExamQuestions(examCategory, 5)
      setExamQuestions(questions)
    } catch (err) {
      setExamError(err instanceof Error ? err.message : '获取笔试题失败')
    } finally {
      setExamLoading(false)
    }
  }

  const handleExamAnswer = (answer: string) => {
    const q = examQuestions[currentExamIndex]
    setUserExamAnswers(prev => ({ ...prev, [q.id]: answer }))
    if (q.type !== 'open' && q.type !== 'coding') {
      setTimeout(() => {
        const finalAns = { ...userExamAnswers, [q.id]: answer }
        if (currentExamIndex < examQuestions.length - 1) {
          setCurrentExamIndex(prev => prev + 1)
        } else {
          finishExam(finalAns)
        }
      }, 300)
    }
  }

  const finishExam = (finalAnswers: Record<string, string | string[]>) => {
    let correct = 0
    examQuestions.forEach(q => {
      const userAns = finalAnswers[q.id]
      if (!userAns) return
      if (q.type === 'single' && userAns === q._correctAnswer) correct++
      else if (q.type === 'multiple') {
        const us = new Set(Array.isArray(userAns) ? userAns : [userAns])
        const cs = new Set(Array.isArray(q._correctAnswer) ? q._correctAnswer : [q._correctAnswer])
        if (us.size === cs.size && Array.from(us).every(a => cs.has(a))) correct++
      } else if (q.type === 'open' || q.type === 'coding') {
        const correctText = String(q._correctAnswer || '').toLowerCase()
        const userText = String(userAns).toLowerCase()
        const keywords = correctText.split(/[，。、,\s]+/).filter((k: string) => k.length > 1)
        const matched = keywords.filter((k: string) => userText.includes(k)).length
        if (keywords.length === 0 || matched / keywords.length >= 0.5) correct++
      }
    })
    setExamScore({ correct, total: examQuestions.length })
    setExamSubmitted(true)
  }

  const submitOpenAnswer = () => {
    const q = examQuestions[currentExamIndex]
    if (currentExamIndex < examQuestions.length - 1) {
      setCurrentExamIndex(prev => prev + 1)
    } else {
      finishExam(userExamAnswers)
    }
  }

  const categoryLabels: Record<string, string> = {
    behavioral: '💬 行为面',
    technical: '💻 技术面',
    'system-design': '🏗️ 系统设计',
    coding: '⌨️ 代码面',
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a1929 0%, #0d2137 100%)' }}>
      {/* Bubbles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-pulse" style={{
            left: `${Math.random() * 100}%`, bottom: '-50px',
            width: Math.random() * 10 + 3, height: Math.random() * 10 + 3,
            background: `rgba(14, 165, 233, ${Math.random() * 0.3 + 0.1})`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 3}s`
          }} />
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

      {/* Header */}
      <header className="sticky top-0 z-50">
        {/* 流光顶部条 */}
        <div className="h-[2px] relative overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #0a1929, #0ea5e9, #818cf8, #c084fc, #0ea5e9, #0a1929)', backgroundSize: '200% 100%', animation: 'headerFlow 4s linear infinite' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 0%, #fff 50%, transparent 100%)', opacity: 0.6, animation: 'headerSweep 2s ease-in-out infinite' }}/>
        </div>
        
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-sky-500/20">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              {/* 标题区流动边框 */}
              <GlowBox colors={['#38bdf8', '#818cf8', '#c084fc', '#f472b6']}>
                <div className="flex items-center gap-3 px-4 py-2">
                  <svg width="32" height="32" viewBox="0 0 36 36">
                    <path d="M4,20 Q10,12 18,18 Q26,24 32,16" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    <path d="M4,26 Q12,18 18,24 Q28,32 32,24" stroke="#0ea5e9" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M6,30 Q14,24 20,28 Q28,34 30,28" stroke="#7dd3fc" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <circle cx="18" cy="14" r="2" fill="#e0f2fe" opacity="0.8"/>
                  </svg>
                  <span className="font-bold text-white text-lg">AI Interview Assistant</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">🟢 智谱GLM</span>
                </div>
              </GlowBox>
              <button onClick={handleClear} className="px-4 py-2 rounded-full text-sm text-sky-400 hover:text-white transition-colors">
                <Trash2 size={16} className="inline mr-1" />
                Clear
              </button>
            </div>
            <div className="flex gap-2">
              {[
                { id: 'chat', icon: <Brain size={18} />, label: 'AI Chat' },
                { id: 'interview', icon: <Briefcase size={18} />, label: 'Mock Interview' },
                { id: 'exam', icon: <FileText size={18} />, label: 'Written Test' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-gray-400 hover:text-white'
                  }`}>
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 pb-28">
        {/* ===== Chat Tab ===== */}
        {activeTab === 'chat' && (
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
                      {message.role === 'assistant' ? (
                        <div className="ai-markdown text-slate-200 leading-relaxed">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              pre: ({ children }) => {
                                // 提取代码语言
                                const codeEl = children as React.ReactElement
                                const lang = codeEl?.props?.className?.replace('hljs language-', '') || ''
                                return (
                                  <div>
                                    {lang && (
                                      <div className="code-block-header">
                                        <span>{lang}</span>
                                        <button
                                          className="code-copy-btn"
                                          onClick={() => {
                                            const code = codeEl?.props?.children || ''
                                            navigator.clipboard.writeText(typeof code === 'string' ? code : String(code))
                                          }}
                                        >复制</button>
                                      </div>
                                    )}
                                    <pre>{children}</pre>
                                  </div>
                                )
                              }
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                          {message.isStreaming && <span className="inline-block w-2 h-4 bg-sky-400 ml-1 animate-pulse rounded" />}
                        </div>
                      ) : (
                        <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      )}
                      {message.role === 'assistant' && !message.isStreaming && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sky-500/10">
                          <span className="text-xs text-slate-500">有帮助吗？</span>
                          <button onClick={() => handleRating(message.id, 'up')}
                            className={`p-1.5 rounded-lg transition-all ${message.rating === 'up' ? 'bg-green-500/20 text-green-400' : 'text-slate-500 hover:text-green-400'}`}>
                            <ThumbsUp size={14} />
                          </button>
                          <button onClick={() => handleRating(message.id, 'down')}
                            className={`p-1.5 rounded-lg transition-all ${message.rating === 'down' ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-red-400'}`}>
                            <ThumbsDown size={14} />
                          </button>
                          <button onClick={() => navigator.clipboard.writeText(message.content)} className="p-1.5 rounded-lg text-slate-500 hover:text-sky-400 transition-all">
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
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>🪼</motion.span>
                    <span>小蓝鱼正在思考...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* ===== Interview Tab ===== */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            {!currentQuestion ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">🎯 模拟面试</h2>
                  <p className="text-gray-400">AI 智能出题，真实面试体验</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {([
                    { type: 'behavioral', icon: '💬', label: '行为面试', desc: '自我介绍、优缺点、职业规划' },
                    { type: 'technical', icon: '💻', label: '技术面试', desc: 'Vue、React、JavaScript' },
                    { type: 'system-design', icon: '🏗️', label: '系统设计', desc: '架构设计、方案权衡' },
                    { type: 'coding', icon: '⌨️', label: '代码面试', desc: '算法、手写实现' },
                  ] as { type: InterviewType; icon: string; label: string; desc: string }[]).map(item => (
                    <button key={item.type} onClick={() => setInterviewType(item.type)}
                      className={`p-6 rounded-2xl border text-left transition-all ${
                        interviewType === item.type ? 'bg-sky-500/20 border-sky-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-sky-500/30'
                      }`}>
                      <span className="text-4xl mb-3 block">{item.icon}</span>
                      <h3 className="text-lg font-bold text-white mb-1">{item.label}</h3>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-3">选择难度</p>
                  <div className="flex gap-3">
                    {(['easy', 'medium', 'hard'] as const).map(d => (
                      <button key={d} onClick={() => setInterviewDifficulty(d)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                          interviewDifficulty === d
                            ? d === 'easy' ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : d === 'medium' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                            : 'bg-red-500/20 border-red-500/50 text-red-400'
                            : 'bg-slate-800/50 border-slate-700 text-gray-400 hover:border-sky-500/30'
                        }`}>
                        {d === 'easy' ? '🟢 简单' : d === 'medium' ? '🟡 中等' : '🔴 困难'}
                      </button>
                    ))}
                  </div>
                </div>
                {interviewError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center">
                    ❌ {interviewError}
                  </div>
                )}
                <motion.button onClick={startInterview} disabled={interviewLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold text-lg disabled:opacity-60"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {interviewLoading ? (
                    <><Loader2 size={20} className="inline mr-2 animate-spin" />AI 出题中...</>
                  ) : (
                    <><Sparkles size={20} className="inline mr-2" />开始面试</>
                  )}
                </motion.button>
              </>
            ) : (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-sky-500/20 text-sky-400">
                    {categoryLabels[currentQuestion.category]}
                  </span>
                  <button onClick={() => { setCurrentQuestion(null); setShowFeedback(false); setUserAnswer('') }}
                    className="text-gray-400 hover:text-white">
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
                    <textarea
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      placeholder="输入你的回答...（按 Enter 提交，Shift+Enter 换行）"
                      className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 resize-none h-40 mb-4"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          submitInterviewAnswer()
                        }
                      }}
                    />
                    <div className="flex gap-3">
                      <motion.button onClick={submitInterviewAnswer} disabled={!userAnswer.trim()}
                        className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-medium disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}>
                        提交回答
                      </motion.button>
                      <button onClick={startInterview} disabled={interviewLoading}
                        className="px-4 py-3 rounded-xl bg-slate-700 text-white text-sm disabled:opacity-50">
                        <Loader2 size={16} className="inline mr-1 animate-spin" />换一题
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                      <h4 className="font-bold text-green-400 mb-2">✅ 优秀回答参考</h4>
                      <p className="text-gray-300 whitespace-pre-wrap">{currentQuestion.goodAnswer}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                      <h4 className="font-bold text-red-400 mb-2">❌ 常见错误</h4>
                      <p className="text-gray-300">{currentQuestion.badAnswer}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { startInterview(); setShowFeedback(false); setUserAnswer('') }}
                        className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-medium">
                        下一题
                      </button>
                      <button onClick={() => { setShowFeedback(false); setUserAnswer('') }}
                        className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-medium">
                        重新回答
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 历史记录面板 */}
            {interviewHistory.length > 0 && (
              <div className="mt-8 border-t border-slate-700/50 pt-6">
                <button
                  onClick={() => setHistoryOpen(v => !v)}
                  className="flex items-center gap-2 w-full text-left text-gray-400 hover:text-white transition-colors mb-4"
                >
                  <History size={18} />
                  <span className="text-sm font-medium">面试记录</span>
                  <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full">{interviewHistory.length}</span>
                  <span className="ml-auto">{historyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                </button>
                <AnimatePresence>
                  {historyOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {interviewHistory.map((record) => (
                          <details key={record.id} className="group bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
                            <summary className="flex items-center gap-3 p-4 cursor-pointer list-none hover:bg-slate-800/50 transition-colors">
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                record.category === 'technical' ? 'bg-blue-400' :
                                record.category === 'behavioral' ? 'bg-green-400' :
                                record.category === 'coding' ? 'bg-yellow-400' : 'bg-purple-400'
                              }`} />
                              <span className="text-sm text-gray-200 flex-1 line-clamp-2">{record.question}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                                record.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                record.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {record.difficulty === 'easy' ? '🟢' : record.difficulty === 'medium' ? '🟡' : '🔴'}
                              </span>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {new Date(record.timestamp).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </summary>
                            <div className="px-4 pb-4 space-y-3 border-t border-slate-700/30 pt-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">💬 你的回答</p>
                                <p className="text-sm text-gray-300 whitespace-pre-wrap">{record.userAnswer}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <p className="text-xs text-green-400 mb-1 flex items-center gap-1"><Star size={10} /> 优秀回答</p>
                                <p className="text-sm text-gray-300 whitespace-pre-wrap">{record.goodAnswer}</p>
                              </div>
                              {record.badAnswer && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                  <p className="text-xs text-red-400 mb-1">⚠️ 常见错误</p>
                                  <p className="text-sm text-gray-300">{record.badAnswer}</p>
                                </div>
                              )}
                              {record.tips && record.tips.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {record.tips.map((tip, i) => (
                                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-slate-700/50 text-gray-400">{tip}</span>
                                  ))}
                                </div>
                              )}
                              <button
                                onClick={() => setInterviewHistory(prev => prev.filter(r => r.id !== record.id))}
                                className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
                              >
                                <Trash2 size={12} /> 删除此记录
                              </button>
                            </div>
                          </details>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-3">
                        <button onClick={() => setInterviewHistory([])}
                          className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1">
                          <Trash2 size={12} /> 清空全部
                        </button>
                        <button
                          onClick={() => {
                            const data = JSON.stringify(interviewHistory, null, 2)
                            const blob = new Blob([data], { type: 'application/json' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `interview-history-${new Date().toISOString().slice(0, 10)}.json`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="text-xs text-gray-500 hover:text-sky-400 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Clock size={12} /> 导出 JSON
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* ===== Exam Tab ===== */}
        {activeTab === 'exam' && (
          <div className="space-y-6">
            {!examQuestions.length ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">📝 在线笔试</h2>
                  <p className="text-gray-400">AI 生成真实笔试题</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {([
                    { type: 'technical', icon: '💻', label: '技术题', desc: 'JS/Vue/React/CSS/网络' },
                    { type: 'behavioral', icon: '💬', label: '软技能', desc: '沟通、协作、职业素养' },
                  ] as { type: 'technical' | 'behavioral'; icon: string; label: string; desc: string }[]).map(item => (
                    <button key={item.type} onClick={() => setExamCategory(item.type)}
                      className={`p-6 rounded-2xl border text-left transition-all ${
                        examCategory === item.type ? 'bg-sky-500/20 border-sky-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-sky-500/30'
                      }`}>
                      <span className="text-4xl mb-3 block">{item.icon}</span>
                      <h3 className="text-lg font-bold text-white mb-1">{item.label}</h3>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
                {examError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center">
                    ❌ {examError}
                  </div>
                )}
                <motion.button onClick={startExam} disabled={examLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold text-lg disabled:opacity-60"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {examLoading ? (
                    <><Loader2 size={20} className="inline mr-2 animate-spin" />AI 出题中...</>
                  ) : (
                    <><Zap size={20} className="inline mr-2" />开始答题 (5题)</>
                  )}
                </motion.button>
              </>
            ) : examSubmitted ? (
              <div className="text-center py-12">
                <div className="text-8xl mb-6">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-4">答题完成！</h2>
                <div className="text-6xl font-bold mb-4" style={{
                  color: examScore.correct / examScore.total >= 0.8 ? '#22c55e' : examScore.correct / examScore.total >= 0.6 ? '#f59e0b' : '#ef4444'
                }}>
                  {examScore.correct}/{examScore.total}
                </div>
                <p className="text-gray-400 mb-8">
                  {examScore.correct / examScore.total >= 0.8 ? '太棒了！' : examScore.correct / examScore.total >= 0.6 ? '还不错！' : '继续加油！'}
                </p>
                <div className="space-y-3 max-w-md mx-auto">
                  {examQuestions.map((q, i) => {
                    const userAns = userExamAnswers[q.id]
                    let isCorrect = false
                    if (q.type === 'single') isCorrect = userAns === q._correctAnswer
                    else if (q.type === 'multiple') {
                      const us = new Set(Array.isArray(userAns) ? userAns : [])
                      const cs = new Set(Array.isArray(q._correctAnswer) ? q._correctAnswer : [])
                      isCorrect = us.size === cs.size && Array.from(us).every((a: string) => cs.has(a))
                    }
                    return (
                      <div key={q.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{isCorrect ? '✅' : '❌'}</span>
                          <span className="text-sm text-gray-300">第{i + 1}题</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{q.question}</p>
                        {q.explanation && <p className="text-xs text-sky-400 mt-1">💡 {q.explanation}</p>}
                      </div>
                    )
                  })}
                </div>
                <button onClick={() => setExamQuestions([])} className="mt-8 px-8 py-3 rounded-xl bg-sky-500 text-white font-medium">
                  再来一轮
                </button>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sky-400">第 {currentExamIndex + 1}/{examQuestions.length} 题</span>
                  <div className="flex gap-1">
                    {examQuestions.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentExamIndex ? 'bg-sky-500 scale-125' : userExamAnswers[examQuestions[i].id] ? 'bg-green-500' : 'bg-slate-700'}`} />
                    ))}
                  </div>
                </div>
                <span className={`inline-block px-2 py-1 rounded text-xs mb-3 ${
                  examQuestions[currentExamIndex].type === 'single' ? 'bg-green-500/20 text-green-400' :
                  examQuestions[currentExamIndex].type === 'multiple' ? 'bg-yellow-500/20 text-yellow-400' :
                  examQuestions[currentExamIndex].type === 'open' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {examQuestions[currentExamIndex].type === 'single' ? '📗 单选' :
                   examQuestions[currentExamIndex].type === 'multiple' ? '📙 多选' :
                   examQuestions[currentExamIndex].type === 'open' ? '📝 简答' : '💻 编程'}
                </span>
                <h3 className="text-lg text-white mb-4 whitespace-pre-wrap">{examQuestions[currentExamIndex].question}</h3>
                {examQuestions[currentExamIndex].options ? (
                  <div className="space-y-3 mb-4">
                    {examQuestions[currentExamIndex].options!.map((opt, i) => {
                      const isSelected = userExamAnswers[examQuestions[currentExamIndex].id] === opt
                      return (
                        <label key={i} className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                          isSelected ? 'bg-sky-500/20 border border-sky-500/50' : 'bg-slate-900/50 border border-slate-700 hover:border-sky-500/30'
                        }`}>
                          <input
                            type={examQuestions[currentExamIndex].type === 'multiple' ? 'checkbox' : 'radio'}
                            name={`exam-${currentExamIndex}`}
                            checked={isSelected}
                            onChange={() => handleExamAnswer(opt)}
                            className="mt-1 accent-sky-500"
                          />
                          <span className="text-gray-300 whitespace-pre-wrap">{opt}</span>
                        </label>
                      )
                    })}
                  </div>
                ) : (
                  <>
                    <textarea
                      value={(userExamAnswers[examQuestions[currentExamIndex].id] as string) || ''}
                      onChange={e => setUserExamAnswers(prev => ({ ...prev, [examQuestions[currentExamIndex].id]: e.target.value }))}
                      placeholder="输入你的答案..."
                      className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 resize-none h-40 mb-4"
                    />
                    <motion.button onClick={submitOpenAnswer}
                      className="w-full py-3 rounded-xl bg-sky-500 text-white font-medium"
                      whileHover={{ scale: 1.02 }}>
                      {currentExamIndex < examQuestions.length - 1 ? '下一题' : '提交答卷'}
                    </motion.button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===== Chat Input (fixed bottom) ===== */}
      {activeTab === 'chat' && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pt-8 pb-6 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* 流光外发光 */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 opacity-30 blur-xl animate-pulse"
                style={{ animationDuration: '2s' }} />
              
              {/* 流光边框容器 */}
              <div className="relative rounded-2xl p-[2px]"
                style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc, #f472b6, #38bdf8)', backgroundSize: '300% 100%', animation: 'inputFlow 4s linear infinite' }}>
                <div className="flex items-center gap-4 bg-slate-800/90 backdrop-blur-lg rounded-[14px] p-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="问任何前端问题，或者让我出一道面试题..."
                    className="flex-1 bg-transparent px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none"
                    disabled={isLoading}
                  />
                  {isLoading ? (
                    <motion.button
                      onClick={handleStop}
                      className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Square size={18} fill="white" />
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="p-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send size={20} />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-600 mt-3">🟢 智谱 GLM-4-Flash · 流式响应</p>
          </div>
        </div>
      )}
    </div>
  )
}
