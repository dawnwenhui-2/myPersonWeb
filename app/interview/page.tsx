'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronUp, Copy, Check, Home, Code2 } from 'lucide-react'
import OceanEffects from '@/components/OceanEffects'

interface Question {
  id: string
  question: string
  answer: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
}

const interviewQuestions: Question[] = [
  // JavaScript Basics
  {
    id: 'js-1',
    question: 'var、let、const 的区别？',
    answer: `1. **var**：函数作用域，可重复声明，存在变量提升
2. **let**：块级作用域，不可重复声明，暂时性死区
3. **const**：块级作用域，必须初始化，不可重新赋值（但对象属性可修改）

推荐：优先使用 const，需要修改变量时用 let，避免使用 var`,
    category: 'JavaScript',
    difficulty: 'Easy',
    tags: ['作用域', '变量提升', 'ES6']
  },
  {
    id: 'js-2',
    question: '什么是 Event Loop？',
    answer: `JavaScript 是单线程语言，通过 Event Loop 处理异步任务：

1. **调用栈**：同步代码在此执行
2. **任务队列**：宏任务（setTimeout、setInterval、I/O）和微任务（Promise、async/await）
3. **执行顺序**：调用栈清空后，先执行所有微任务，再执行宏任务

**经典输出题**：
\`\`\`javascript
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
// 输出：1 3 2
\`\`\``,
    category: 'JavaScript',
    difficulty: 'Medium',
    tags: ['Event Loop', '异步', 'Promise']
  },
  {
    id: 'js-3',
    question: '原型链继承的实现方式？',
    answer: `\`\`\`javascript
// 方式1：原型链继承
function Parent() { this.name = 'parent' }
function Child() {}
Child.prototype = new Parent()
Child.prototype.constructor = Child

// 方式2：圣杯模式（推荐）
function inherit(Target, Origin) {
  function F() {}
  F.prototype = Origin.prototype
  Target.prototype = new F()
  Target.prototype.constructor = Target
  Target.prototype.uber = Origin.prototype
}

// 方式3：ES6 Class
class Child extends Parent {
  constructor() { super() }
}
\`\`\``,
    category: 'JavaScript',
    difficulty: 'Medium',
    tags: ['原型链', '继承', 'Class']
  },
  {
    id: 'js-4',
    question: '闭包是什么？有什么应用场景？',
    answer: `**闭包**：函数能访问其词法作用域之外的变量

**应用场景**：
1. **防抖/节流**：缓存定时器
2. **防抖函数**：
\`\`\`javascript
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
\`\`\`
3. **函数柯里化**：参数缓存
4. **模块化**：私有变量`,
    category: 'JavaScript',
    difficulty: 'Medium',
    tags: ['闭包', '防抖', '节流']
  },
  {
    id: 'js-5',
    question: 'Promise、async/await 的区别？',
    answer: `**Promise**：ES6 引入的异步编程解决方案
\`\`\`javascript
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
\`\`\`

**async/await**：Promise 的语法糖，更直观
\`\`\`javascript
async function fetchData() {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}
\`\`\`

**区别**：async/await 让异步代码看起来像同步代码，错误处理更清晰`,
    category: 'JavaScript',
    difficulty: 'Medium',
    tags: ['Promise', 'async/await', '异步']
  },
  // Vue
  {
    id: 'vue-1',
    question: 'Vue2 和 Vue3 响应式原理的区别？',
    answer: `**Vue2：Object.defineProperty**
\`\`\`javascript
Object.defineProperty(data, 'name', {
  get() { return value },
  set(newValue) {
    value = newValue
    notify()
  }
})
\`\`\`
缺点：无法检测数组下标、需递归

**Vue3：Proxy**
\`\`\`javascript
const reactive = (obj) => new Proxy(obj, {
  get(target, key) {
    track(target, key)  // 依赖收集
    const val = target[key]
    return typeof val === 'object' ? reactive(val) : val
  },
  set(target, key, value) {
    target[key] = value
    trigger(target, key)  // 触发更新
    return true
  }
})
\`\`\`
优点：可以监听数组、Map、Set，新增属性自动响应`,
    category: 'Vue',
    difficulty: 'Hard',
    tags: ['响应式', 'Proxy', 'defineProperty']
  },
  {
    id: 'vue-2',
    question: 'Vue 的生命周期有哪些？',
    answer: `**Vue2 生命周期**：
- beforeCreate → created → beforeMount → mounted
- beforeUpdate → updated
- beforeDestroy → destroyed

**Vue3 生命周期**：
- setup（相当于 beforeCreate + created）
- onBeforeMount → onMounted
- onBeforeUpdate → onUpdated
- onBeforeUnmount → onUnmounted

**常用场景**：
- created：接口请求、初始化数据
- mounted：DOM 操作、第三方库初始化
- beforeUnmount：清除定时器、移除事件监听`,
    category: 'Vue',
    difficulty: 'Medium',
    tags: ['生命周期', 'Hooks']
  },
  {
    id: 'vue-3',
    question: 'Vuex 和 Pinia 的区别？',
    answer: `**Vuex**：
- 4 个核心概念：state、mutations、actions、getters
- mutations 必须是同步函数
- 需要手动开启命名空间
- Vue2/Vue3 都可用

**Pinia**（Vue3 官方推荐）：
\`\`\`javascript
// stores/counter.js
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2
  },
  actions: {
    increment() { this.count++ }
  }
})
\`\`\`
优点：API 简洁、支持 Composition API、无需手动刷新`,
    category: 'Vue',
    difficulty: 'Medium',
    tags: ['Vuex', 'Pinia', '状态管理']
  },
  // React
  {
    id: 'react-1',
    question: 'React Hooks 的使用规则？',
    answer: `1. **只在顶层调用**：不要在循环、条件语句、嵌套函数中调用 Hooks
2. **只在 React 函数中调用**：在 React 函数组件或自定义 Hook 中调用

\`\`\`javascript
// ❌ 错误
if (isLoggedIn) {
  const [user, setUser] = useState(null)
}

// ✅ 正确
const [user, setUser] = useState(null)
if (isLoggedIn) {
  // 使用 user
}
\`\`\`

**自定义 Hook**：以 use 开头的函数，可复用逻辑
\`\`\`javascript
function useFetch(url) {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData)
  }, [url])
  return data
}
\`\`\``,
    category: 'React',
    difficulty: 'Medium',
    tags: ['Hooks', 'useState', 'useEffect']
  },
  {
    id: 'react-2',
    question: 'React Fiber 架构是什么？',
    answer: `**Fiber**：React 16 引入的新协调引擎

**解决的问题**：
- 同步渲染阻塞主线程，大列表卡顿
- 无法中断和恢复任务

**核心概念**：
\`\`\`javascript
const fiber = {
  type: 'div',
  child: firstChild,      // 第一个子节点
  sibling: nextSibling,    // 兄弟节点
  return: parentFiber,     // 父节点
  alternate: workInProgress, // 双缓冲
}
\`\`\`

**时间切片**：
- 每个任务单元 5ms
- 高优先级（用户输入）可打断低优先级（渲染）

**生命周期调整**：
- getDerivedStateFromProps
- getSnapshotBeforeUpdate`,
    category: 'React',
    difficulty: 'Hard',
    tags: ['Fiber', 'Virtual DOM', '调和']
  },
  {
    id: 'react-3',
    question: 'React 的性能优化有哪些？',
    answer: `**1. 减少不必要的渲染**
\`\`\`javascript
// 父组件用 memo
const Child = React.memo(({ data }) => {
  console.log('Child rendered')
  return <div>{data.name}</div>
})

// 传入稳定引用
const stableCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])

// 计算属性用 useMemo
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
\`\`\`

**2. 代码分割**
\`\`\`javascript
const LazyComponent = React.lazy(() => import('./Component'))
\`\`\`

**3. 虚拟列表**：大量数据用 react-window

**4. 避免内联对象/函数**`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['性能优化', 'memo', 'useCallback']
  },
  // CSS
  {
    id: 'css-1',
    question: 'Flex 和 Grid 的区别？',
    answer: `**Flexbox**：一维布局（行或列）
\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between; /* 主轴 */
  align-items: center;            /* 交叉轴 */
}
\`\`\`

**Grid**：二维布局（行和列）
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

**选择建议**：
- 导航栏、卡片布局 → Flex
- 页面整体布局、相册 → Grid`,
    category: 'CSS',
    difficulty: 'Easy',
    tags: ['Flex', 'Grid', '布局']
  },
  {
    id: 'css-2',
    question: 'BFC（块级格式化上下文）是什么？',
    answer: `**BFC**：独立的渲染区域，不影响外部元素

**触发条件**：
- display: inline-block / table
- float 不为 none
- position: absolute / fixed
- overflow 不为 visible
- display: flex / grid

**应用场景**：
1. **清除浮动**：
\`\`\`css
.parent {
  display: flow-root; /* 触发 BFC */
}
\`\`\`
2. **避免外边距重叠**
3. **两栏自适应布局**`,
    category: 'CSS',
    difficulty: 'Medium',
    tags: ['BFC', '浮动', '外边距']
  },
  // Network
  {
    id: 'net-1',
    question: '从输入 URL 到页面展示，发生了什么？',
    answer: `1. **DNS 解析**：域名 → IP 地址
2. **TCP 连接**：三次握手建立连接
3. **TLS/SSL**：HTTPS 加密（如果使用）
4. **发送请求**：HTTP 请求报文
5. **服务器处理**：路由、中间件、业务逻辑
6. **返回响应**：HTML/CSS/JS/图片等
7. **浏览器解析**：
   - HTML → DOM Tree
   - CSS → CSSOM
   - DOM + CSSOM → Render Tree
8. **Layout**：计算每个节点位置
9. **Paint**：绘制像素
10. **Composite**：图层合成

**优化点**：
- DNS 预解析
- HTTP/2 多路复用
- 资源压缩、缓存`,
    category: 'Network',
    difficulty: 'Hard',
    tags: ['浏览器', 'HTTP', 'DNS']
  },
  {
    id: 'net-2',
    question: 'HTTP 缓存策略有哪些？',
    answer: `**强缓存**（不发请求）：
- Cache-Control: max-age=3600
- Expires: Wed, 21 Oct 2026 07:28:00 GMT

**协商缓存**（发请求验证）：
- Last-Modified / If-Modified-Since
- ETag / If-None-Match

\`\`\`javascript
// 响应头设置
res.setHeader('Cache-Control', 'public, max-age=86400')
res.setHeader('ETag', 'W/"abc123"')
\`\`\`

**Cache-Control 指令**：
- public：可被任何缓存存储
- private：只有浏览器缓存
- no-cache：需验证
- no-store：完全不缓存`,
    category: 'Network',
    difficulty: 'Medium',
    tags: ['缓存', 'HTTP', '性能优化']
  }
]

const categories = ['All', ...new Set(interviewQuestions.map(q => q.category))]

export default function InterviewPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredQuestions = interviewQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) ||
                         q.answer.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyCode = (answer: string, id: string) => {
    navigator.clipboard.writeText(answer)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getDifficultyColor = (d: string) => {
    switch (d) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <OceanEffects />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-sky-500/20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-sky-400">
              <Home size={20} />
              <span className="font-bold">dawnwenhui</span>
            </a>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">Interview Questions</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 pb-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">面试题汇总</h1>
          <p className="text-gray-400">Frontend Interview Questions Collection</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索面试题..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500/30 text-sky-400 border border-sky-500/50'
                  : 'bg-slate-800/50 text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-2 text-xs opacity-60">
                  {interviewQuestions.filter(q => q.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Questions */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredQuestions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/50 rounded-2xl border border-sky-500/20 overflow-hidden"
              >
                {/* Question Header */}
                <button
                  onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs bg-sky-500/20 text-sky-400">{q.category}</span>
                        <span className={`px-2 py-0.5 rounded text-xs border ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</span>
                      </div>
                      <h3 className="text-lg font-medium text-white">{q.question}</h3>
                    </div>
                    <div className="text-gray-400">
                      {expandedId === q.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {expandedId === q.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-sky-500/20"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-wrap gap-2">
                            {q.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 rounded text-xs bg-slate-700/50 text-gray-400">{tag}</span>
                            ))}
                          </div>
                          <button
                            onClick={() => copyCode(q.answer, q.id)}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-700/50 text-gray-400 hover:text-white text-sm"
                          >
                            {copiedId === q.id ? <Check size={14} /> : <Copy size={14} />}
                            {copiedId === q.id ? '已复制' : '复制'}
                          </button>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-4 overflow-auto max-h-96">
                          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                            {q.answer}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-gray-400">没有找到匹配的面试题</p>
          </div>
        )}
      </main>
    </div>
  )
}
