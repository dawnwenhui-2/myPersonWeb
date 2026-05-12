'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Trash2, Copy, ThumbsUp, ThumbsDown, Brain, Briefcase, FileText,
  Zap, Loader2, History, ChevronDown, ChevronUp, Star, Clock, Square,
  Sparkles
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { GlowBox } from '@/components/AnimatedBorder'

// ============ Types ============
type TabType = 'chat' | 'interview' | 'exam'
type InterviewType = 'behavioral' | 'technical' | 'system-design' | 'coding'

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
  type: 'single' | 'multiple' | 'open' | 'coding'
  question: string
  options?: string[]
  explanation?: string
  tip?: string
  _correctAnswer?: string | string[]
}

export interface AIAgentSectionProps {
  props: {
    showChat?: boolean
    showInterview?: boolean
    showExam?: boolean
    defaultTab?: TabType
    showBubbles?: boolean
    showGlowBox?: boolean
    height?: string
  }
  style?: Record<string, string>
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

// ============ AIAgentSection Component ============
export default function AIAgentSection({ props, style }: AIAgentSectionProps) {
  const {
    showChat = true,
    showInterview = true,
    showExam = true,
    defaultTab,
    showBubbles = true,
    showGlowBox = true,
    height = '700px',
  } = props

  const getDefaultTab = (): TabType => {
    if (defaultTab && ['chat', 'interview', 'exam'].includes(defaultTab)) return defaultTab as TabType
    if (showChat) return 'chat'
    if (showInterview) return 'interview'
    if (showExam) return 'exam'
    return 'chat'
  }

  const [activeTab, setActiveTab] = useState<TabType>(getDefaultTab())

  // Chat state
  const [messages, setMessages] = useState<Message[]>(() => [{
    id: '1',
    role: 'assistant' as const,
    content: `🌊 你好！我是 **AI 面试助手** 🐙\n\n我可以帮你：\n- 💬 聊天问答\n- 🎯 模拟面试\n- 📝 在线笔试\n\n有什么想聊的吗？`,
    timestamp: new Date()
  }])
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
    try { const saved = localStorage.getItem('interview-history-section'); return saved ? JSON.parse(saved) : [] }
    catch { return [] }
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

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages])
  useEffect(() => { localStorage.setItem('interview-history-section', JSON.stringify(interviewHistory)) }, [interviewHistory])

  const saveInterviewRecord = useCallback((q: InterviewQuestion, ans: string) => {
    const record: InterviewRecord = {
      id: Date.now().toString(), question: q.question, category: q.category,
      difficulty: interviewDifficulty, userAnswer: ans, tips: q.tips,
      goodAnswer: q.goodAnswer, badAnswer: q.badAnswer, timestamp: Date.now(), keywords: q.keywords,
    }
    setInterviewHistory(prev => [record, ...prev].slice(0, 50))
  }, [interviewDifficulty])

  // ============ Chat Handlers ============
  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    const aiMsgId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date(), isStreaming: true }])
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
      setMessages(prev => prev.map(m => m.id === aiMsgId ? {
        ...m, content: isAborted ? (m.content || '⏹ 已停止生成') : '❌ ' + (err instanceof Error ? err.message : 'AI 连接失败'),
        isStreaming: false
      } : m))
    } finally {
      setIsLoading(false)
      abortRef.current = null
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m))
    }
  }

  const handleStop = () => { abortRef.current?.abort() }

  const handleClear = () => setMessages([{
    id: Date.now().toString(), role: 'assistant' as const,
    content: '🌊 对话已清空！小蓝鱼已准备好，有什么新问题吗？🐠', timestamp: new Date()
  }])

  const handleRating = (id: string, rating: 'up' | 'down') =>
    setMessages(prev => prev.map(m => m.id === id ? { ...m, rating } : m))

  // ============ Interview Handlers ============
  const startInterview = async () => {
    setInterviewLoading(true); setInterviewError(''); setCurrentQuestion(null)
    setUserAnswer(''); setShowFeedback(false)
    try { const q = await fetchInterviewQuestion(interviewType, interviewDifficulty); setCurrentQuestion(q) }
    catch (err) { setInterviewError(err instanceof Error ? err.message : '获取面试题失败') }
    finally { setInterviewLoading(false) }
  }

  const submitInterviewAnswer = () => {
    if (!userAnswer.trim() || !currentQuestion) return
    saveInterviewRecord(currentQuestion, userAnswer)
    setShowFeedback(true)
  }

  // ============ Exam Handlers ============
  const startExam = async () => {
    setExamLoading(true); setExamError(''); setExamQuestions([])
    setCurrentExamIndex(0); setUserExamAnswers({}); setExamSubmitted(false)
    setExamScore({ correct: 0, total: 0 })
    try { const qs = await fetchExamQuestions(examCategory, 5); setExamQuestions(qs) }
    catch (err) { setExamError(err instanceof Error ? err.message : '获取笔试题失败') }
    finally { setExamLoading(false) }
  }

  const handleExamAnswer = (answer: string) => {
    const q = examQuestions[currentExamIndex]
    setUserExamAnswers(prev => ({ ...prev, [q.id]: answer }))
    if (q.type !== 'open' && q.type !== 'coding') {
      setTimeout(() => {
        const finalAns = { ...userExamAnswers, [q.id]: answer }
        if (currentExamIndex < examQuestions.length - 1) setCurrentExamIndex(prev => prev + 1)
        else finishExam(finalAns)
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
        const keywords = correctText.split(/[，。、,\s]+/).filter(k => k.length > 1)
        const matched = keywords.filter(k => userText.includes(k)).length
        if (keywords.length === 0 || matched / keywords.length >= 0.5) correct++
      }
    })
    setExamScore({ correct, total: examQuestions.length })
    setExamSubmitted(true)
  }

  const submitOpenAnswer = () => {
    if (currentExamIndex < examQuestions.length - 1) setCurrentExamIndex(prev => prev + 1)
    else finishExam(userExamAnswers)
  }

  const categoryLabels: Record<string, string> = {
    behavioral: '💬 行为面', technical: '💻 技术面',
    'system-design': '🏗️ 系统设计', coding: '⌨️ 代码面',
  }

  const availableTabs = [
    ...(showChat ? [{ id: 'chat' as TabType, icon: <Brain size={16} />, label: 'AI Chat' }] : []),
    ...(showInterview ? [{ id: 'interview' as TabType, icon: <Briefcase size={16} />, label: 'Mock Interview' }] : []),
    ...(showExam ? [{ id: 'exam' as TabType, icon: <FileText size={16} />, label: 'Written Test' }] : []),
  ]

  return (
    <section className="relative overflow-hidden rounded-2xl" style={{ minHeight: height, ...style }}>
      {/* Bubbles */}
      {showBubbles && (
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-pulse" style={{
              left: `${(i * 13 + 5) % 100}%`, bottom: '-10px',
              width: `${4 + (i % 3) * 3}px`, height: `${4 + (i % 3) * 3}px`,
              background: `rgba(14, 165, 233, ${0.1 + (i % 3) * 0.08})`,
              animationDuration: `${3 + i % 3}s`, animationDelay: `${i * 0.5}s`
            }} />
          ))}
          <motion.div className="absolute text-lg" style={{ top: '10%', left: '5%' }}
            animate={{ y: [0, -15, 0], rotate: [-5, 5, -5], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}>🐠</motion.div>
          <motion.div className="absolute text-base" style={{ top: '20%', right: '8%' }}
            animate={{ y: [0, -12, 0], x: [0, 8, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}>🐟</motion.div>
          <motion.div className="absolute text-2xl" style={{ top: '45%', left: '3%' }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, delay: 2 }}>🦈</motion.div>
          <motion.div className="absolute text-lg" style={{ top: '65%', right: '5%' }}
            animate={{ y: [0, -10, 0], rotate: [-3, 3, -3], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}>🐙</motion.div>
        </div>
      )}

      {/* Inner container */}
      <div className="relative h-full flex flex-col bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-sky-500/20">
        {/* Header / Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-sky-500/10">
          {showGlowBox ? (
            <GlowBox colors={['#38bdf8', '#818cf8', '#c084fc', '#f472b6']}>
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="text-base">🤖</span>
                <span className="font-bold text-white text-sm">AI Assistant</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">🟢 GLM</span>
              </div>
            </GlowBox>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-base">🤖</span>
              <span className="font-bold text-white text-sm">AI Assistant</span>
            </div>
          )}

          {availableTabs.length > 1 && (
            <div className="flex gap-1">
              {availableTabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-gray-400 hover:text-white'
                  }`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'chat' && (
            <button onClick={handleClear} className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col" style={{ height: `calc(${height} - 60px)` }}>
          {/* ===== Chat Tab ===== */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <AnimatePresence>
                  {messages.map(message => (
                    <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center flex-shrink-0 text-sm">🐙</div>
                      )}
                      <div className={`max-w-[75%] ${message.role === 'user' ? 'order-1' : ''}`}>
                        <div className="bg-slate-800/80 rounded-2xl p-3 border border-sky-500/15">
                          {message.role === 'assistant' ? (
                            <div className="ai-markdown text-slate-200 leading-relaxed text-sm">
                              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}
                                components={{
                                  pre: ({ children }) => (
                                    <div className="my-2"><pre className="bg-slate-900 rounded-lg p-3 text-xs overflow-x-auto">{children}</pre></div>
                                  ),
                                  code: ({ children }) => <code className="text-sky-300 bg-slate-800 px-1 py-0.5 rounded text-xs">{children}</code>,
                                }}>
                                {message.content}
                              </ReactMarkdown>
                              {message.isStreaming && <span className="inline-block w-1.5 h-3 bg-sky-400 ml-1 animate-pulse rounded" />}
                            </div>
                          ) : (
                            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                          )}
                          {message.role === 'assistant' && !message.isStreaming && (
                            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-sky-500/10">
                              <button onClick={() => handleRating(message.id, 'up')}
                                className={`p-1 rounded transition-all ${message.rating === 'up' ? 'bg-green-500/20 text-green-400' : 'text-slate-500 hover:text-green-400'}`}>
                                <ThumbsUp size={11} />
                              </button>
                              <button onClick={() => handleRating(message.id, 'down')}
                                className={`p-1 rounded transition-all ${message.rating === 'down' ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-red-400'}`}>
                                <ThumbsDown size={11} />
                              </button>
                              <button onClick={() => navigator.clipboard.writeText(message.content)}
                                className="p-1 rounded text-slate-500 hover:text-sky-400 transition-all"><Copy size={11} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-sm">🐳</div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-sm">🐠</div>
                    <div className="bg-slate-800/80 rounded-2xl p-3 border border-sky-500/15">
                      <span className="text-sky-300 text-sm animate-pulse">🪼 小蓝鱼正在思考...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Chat Input - sticky within section */}
              <div className="px-4 pb-4 pt-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20 opacity-50 blur-sm" />
                  <div className="relative flex items-center gap-2 bg-slate-800/90 backdrop-blur-lg rounded-xl px-3 py-2 border border-sky-500/20">
                    <input type="text" value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder="问任何前端问题..." disabled={isLoading}
                      className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none" />
                    {isLoading ? (
                      <button onClick={handleStop} className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500"><Square size={14} fill="white" /></button>
                    ) : (
                      <button onClick={handleSend} disabled={!input.trim()}
                        className="p-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 text-white disabled:opacity-50 transition-all hover:opacity-90">
                        <Send size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===== Interview Tab ===== */}
          {activeTab === 'interview' && (
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {!currentQuestion ? (
                <>
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-white mb-1">🎯 模拟面试</h2>
                    <p className="text-xs text-gray-400">AI 智能出题，真实面试体验</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {([
                      { type: 'behavioral', icon: '💬', label: '行为面', desc: '自我介绍、优缺点' },
                      { type: 'technical', icon: '💻', label: '技术面', desc: 'Vue、React、JS' },
                      { type: 'system-design', icon: '🏗️', label: '系统设计', desc: '架构设计' },
                      { type: 'coding', icon: '⌨️', label: '代码面', desc: '算法手写' },
                    ] as { type: InterviewType; icon: string; label: string; desc: string }[]).map(item => (
                      <button key={item.type} onClick={() => setInterviewType(item.type)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          interviewType === item.type ? 'bg-sky-500/20 border-sky-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-sky-500/30'
                        }`}>
                        <span className="text-2xl mb-1 block">{item.icon}</span>
                        <h3 className="text-sm font-bold text-white">{item.label}</h3>
                        <p className="text-[10px] text-gray-400">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">选择难度</p>
                    <div className="flex gap-2">
                      {(['easy', 'medium', 'hard'] as const).map(d => (
                        <button key={d} onClick={() => setInterviewDifficulty(d)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            interviewDifficulty === d
                              ? d === 'easy' ? 'bg-green-500/20 border-green-500/50 text-green-400'
                              : d === 'medium' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                              : 'bg-red-500/20 border-red-500/50 text-red-400'
                              : 'bg-slate-800/50 border-slate-700 text-gray-400'
                          }`}>
                          {d === 'easy' ? '🟢 简单' : d === 'medium' ? '🟡 中等' : '🔴 困难'}
                        </button>
                      ))}
                    </div>
                  </div>
                  {interviewError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                      ❌ {interviewError}
                    </div>
                  )}
                  <button onClick={startInterview} disabled={interviewLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {interviewLoading ? <><Loader2 size={16} className="animate-spin" />AI 出题中...</> : <><Sparkles size={16} />开始面试</>}
                  </button>
                </>
              ) : (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-sky-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-sky-500/20 text-sky-400">{categoryLabels[currentQuestion.category]}</span>
                    <button onClick={() => { setCurrentQuestion(null); setShowFeedback(false); setUserAnswer('') }} className="text-gray-400 hover:text-white">
                      <Trash2 size={14} /></button>
                  </div>
                  <h3 className="text-base font-bold text-white">{currentQuestion.question}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {currentQuestion.tips.map((tip, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg text-xs bg-slate-700/50 text-gray-300">{tip}</span>
                    ))}
                  </div>
                  {!showFeedback ? (
                    <>
                      <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                        placeholder="输入你的回答..." onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitInterviewAnswer() } }}
                        className="w-full p-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 resize-none h-28 text-sm" />
                      <div className="flex gap-2">
                        <button onClick={submitInterviewAnswer} disabled={!userAnswer.trim()}
                          className="flex-1 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium disabled:opacity-50">提交回答</button>
                        <button onClick={startInterview} disabled={interviewLoading}
                          className="px-3 py-2 rounded-xl bg-slate-700 text-white text-xs">{interviewLoading ? <Loader2 size={14} className="animate-spin inline" /> : '换一题'}</button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                        <h4 className="font-bold text-green-400 text-xs mb-1">✅ 优秀回答</h4>
                        <p className="text-gray-300 text-xs whitespace-pre-wrap">{currentQuestion.goodAnswer}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <h4 className="font-bold text-red-400 text-xs mb-1">❌ 常见错误</h4>
                        <p className="text-gray-300 text-xs">{currentQuestion.badAnswer}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { startInterview(); setShowFeedback(false); setUserAnswer('') }}
                          className="flex-1 py-2 rounded-xl bg-sky-500 text-white text-sm">下一题</button>
                        <button onClick={() => { setShowFeedback(false); setUserAnswer('') }}
                          className="flex-1 py-2 rounded-xl bg-slate-700 text-white text-sm">重新回答</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* History */}
              {interviewHistory.length > 0 && (
                <div className="border-t border-slate-700/50 pt-3 mt-3">
                  <button onClick={() => setHistoryOpen(v => !v)}
                    className="flex items-center gap-2 w-full text-left text-gray-400 hover:text-white transition-colors mb-2">
                    <History size={14} /><span className="text-xs font-medium">面试记录</span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded-full">{interviewHistory.length}</span>
                    {historyOpen ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
                  </button>
                  <AnimatePresence>
                    {historyOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-2 max-h-60 overflow-y-auto">
                        {interviewHistory.map((record) => (
                          <details key={record.id} className="group bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                            <summary className="flex items-center gap-2 p-3 cursor-pointer list-none hover:bg-slate-800/50 transition-colors">
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                record.category === 'technical' ? 'bg-blue-400' : record.category === 'behavioral' ? 'bg-green-400' :
                                record.category === 'coding' ? 'bg-yellow-400' : 'bg-purple-400'
                              }`} />
                              <span className="text-xs text-gray-200 flex-1 line-clamp-1">{record.question}</span>
                              <span className="text-[10px] text-gray-500">
                                {new Date(record.timestamp).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </summary>
                            <div className="px-3 pb-3 space-y-2 border-t border-slate-700/30 pt-2">
                              <div><p className="text-[10px] text-gray-500">💬 你的回答</p><p className="text-xs text-gray-300 whitespace-pre-wrap line-clamp-3">{record.userAnswer}</p></div>
                              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                <p className="text-[10px] text-green-400 flex items-center gap-1"><Star size={8} />优秀回答</p>
                                <p className="text-xs text-gray-300 whitespace-pre-wrap line-clamp-3">{record.goodAnswer}</p>
                              </div>
                            </div>
                          </details>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* ===== Exam Tab ===== */}
          {activeTab === 'exam' && (
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {!examQuestions.length ? (
                <>
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-white mb-1">📝 在线笔试</h2>
                    <p className="text-xs text-gray-400">AI 生成真实笔试题</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {([
                      { type: 'technical' as const, icon: '💻', label: '技术题', desc: 'JS/Vue/React' },
                      { type: 'behavioral' as const, icon: '💬', label: '软技能', desc: '沟通、协作' },
                    ]).map(item => (
                      <button key={item.type} onClick={() => setExamCategory(item.type)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          examCategory === item.type ? 'bg-sky-500/20 border-sky-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-sky-500/30'
                        }`}>
                        <span className="text-2xl mb-1 block">{item.icon}</span>
                        <h3 className="text-sm font-bold text-white">{item.label}</h3>
                        <p className="text-[10px] text-gray-400">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                  {examError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">❌ {examError}</div>
                  )}
                  <button onClick={startExam} disabled={examLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {examLoading ? <><Loader2 size={16} className="animate-spin" />AI 出题中...</> : <><Zap size={16} />开始答题 (5题)</>}
                  </button>
                </>
              ) : examSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-xl font-bold text-white mb-2">答题完成！</h2>
                  <div className="text-5xl font-bold mb-3" style={{
                    color: examScore.correct / examScore.total >= 0.8 ? '#22c55e' : examScore.correct / examScore.total >= 0.6 ? '#f59e0b' : '#ef4444'
                  }}>{examScore.correct}/{examScore.total}</div>
                  <p className="text-gray-400 text-sm mb-4">
                    {examScore.correct / examScore.total >= 0.8 ? '太棒了！' : examScore.correct / examScore.total >= 0.6 ? '还不错！' : '继续加油！'}
                  </p>
                  <div className="space-y-2 text-left">
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
                        <div key={q.id} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-left">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{isCorrect ? '✅' : '❌'}</span>
                            <span className="text-xs text-gray-300">第{i + 1}题</span>
                          </div>
                          <p className="text-[10px] text-gray-500 line-clamp-1">{q.question}</p>
                          {q.explanation && <p className="text-[10px] text-sky-400 mt-0.5">💡 {q.explanation}</p>}
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={() => setExamQuestions([])} className="mt-4 px-6 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium">再来一轮</button>
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-sky-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sky-400 text-sm">第 {currentExamIndex + 1}/{examQuestions.length} 题</span>
                    <div className="flex gap-1">
                      {examQuestions.map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${
                          i === currentExamIndex ? 'bg-sky-500 scale-125' : userExamAnswers[examQuestions[i].id] ? 'bg-green-500' : 'bg-slate-700'
                        }`} />
                      ))}
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                    examQuestions[currentExamIndex].type === 'single' ? 'bg-green-500/20 text-green-400' :
                    examQuestions[currentExamIndex].type === 'multiple' ? 'bg-yellow-500/20 text-yellow-400' :
                    examQuestions[currentExamIndex].type === 'open' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {examQuestions[currentExamIndex].type === 'single' ? '📗 单选' : examQuestions[currentExamIndex].type === 'multiple' ? '📙 多选' :
                     examQuestions[currentExamIndex].type === 'open' ? '📝 简答' : '💻 编程'}
                  </span>
                  <h3 className="text-sm text-white whitespace-pre-wrap">{examQuestions[currentExamIndex].question}</h3>
                  {examQuestions[currentExamIndex].options ? (
                    <div className="space-y-2">
                      {examQuestions[currentExamIndex].options!.map((opt, i) => {
                        const isSelected = userExamAnswers[examQuestions[currentExamIndex].id] === opt
                        return (
                          <label key={i} className={`flex items-start gap-2 p-3 rounded-lg cursor-pointer transition-all text-sm ${
                            isSelected ? 'bg-sky-500/20 border border-sky-500/50' : 'bg-slate-900/50 border border-slate-700 hover:border-sky-500/30'
                          }`}>
                            <input type={examQuestions[currentExamIndex].type === 'multiple' ? 'checkbox' : 'radio'}
                              checked={isSelected} onChange={() => handleExamAnswer(opt)} className="mt-0.5 accent-sky-500" />
                            <span className="text-gray-300 whitespace-pre-wrap">{opt}</span>
                          </label>
                        )
                      })}
                    </div>
                  ) : (
                    <>
                      <textarea value={(userExamAnswers[examQuestions[currentExamIndex].id] as string) || ''}
                        onChange={e => setUserExamAnswers(prev => ({ ...prev, [examQuestions[currentExamIndex].id]: e.target.value }))}
                        placeholder="输入你的答案..."
                        className="w-full p-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 resize-none h-28 text-sm" />
                      <button onClick={submitOpenAnswer} className="w-full py-2 rounded-xl bg-sky-500 text-white text-sm font-medium">
                        {currentExamIndex < examQuestions.length - 1 ? '下一题' : '提交答卷'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}