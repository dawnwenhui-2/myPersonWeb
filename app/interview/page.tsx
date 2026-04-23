'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronUp, Copy, Check, Home, Code2, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const OceanEffects = dynamic(() => import('@/components/OceanEffects'), { ssr: false })

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
  // React 进阶 - 第一部分：React 基础与核心思想
  {
    id: 'react-4',
    question: '如何理解 UI = f(state) 这个公式？',
    answer: `**核心思想**：React 将 UI 看作状态的函数映射

\`\`\`javascript
UI = f(state)

// 相同的输入（state）永远产生相同的输出（UI）
// 这就是 React "声明式编程" 的基础
\`\`\`

**含义**：
1. **视图是状态的映射**：开发者只需关注状态变化，React 自动更新 UI
2. **单向数据流**：state → UI，数据流向清晰可预测
3. **可预测性**：相同 state 必定产生相同 UI（纯函数特性）

**实践意义**：
- 不要直接操作 DOM，而是修改 state
- 使用纯组件（PureComponent、memo）优化性能
- 状态不可变：setState 时创建新对象而非修改原对象`,
    category: 'React',
    difficulty: 'Easy',
    tags: ['核心思想', '声明式', '单向数据流']
  },
  {
    id: 'react-5',
    question: '虚拟 DOM 是什么？它解决了哪些实际问题？',
    answer: `**虚拟 DOM**：用 JavaScript 对象描述真实 DOM 结构

\`\`\`javascript
// 虚拟 DOM 对象
const vnode = {
  type: 'div',
  props: { className: 'container' },
  children: [
    { type: 'h1', props: {}, children: 'Hello' }
  ]
}
\`\`\`

**解决的问题**：
1. **DOM 操作昂贵**：直接操作 DOM 触发重排重绘，性能差
2. **批量更新**：多次 setState 合并为一次 DOM 更新
3. **跨平台**：虚拟 DOM 可渲染到 Web、Native、Canvas

**Diff 算法**：
- 同层比较（O(n) 复杂度）
- key 标识节点
- 只比较同类型节点

**缺点**：
- 内存占用（维护虚拟 DOM 树）
- 首次渲染稍慢（需构建虚拟 DOM）`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['Virtual DOM', 'Diff算法', '性能']
  },
  {
    id: 'react-6',
    question: '为什么说 JSX 不仅仅是模板语法，而是一种 JavaScript 的扩展？',
    answer: `**JSX 本质**：JavaScript 语法扩展，编译后是函数调用

\`\`\`javascript
// JSX 写法
const element = <div className="app">Hello</div>

// 编译后
const element = React.createElement(
  'div',
  { className: 'app' },
  'Hello'
)

// 最终返回对象
const element = {
  type: 'div',
  props: { className: 'app', children: 'Hello' }
}
\`\`\`

**与模板的区别**：
| JSX | 模板（如 Vue template） |
|-----|----------------------|
| JavaScript 表达式 | 字符串模板 |
| 图灵完备 | 受限语法 |
| 原生 JS 逻辑 | 指令语法 (v-if, v-for) |
| 编译时检查 | 运行时解析 |

**优势**：
- 完整的 JavaScript 能力
- 类型检查支持（TypeScript）
- 更灵活的逻辑控制`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['JSX', '编译原理', '模板语法']
  },
  {
    id: 'react-7',
    question: '函数组件和类组件的本质区别究竟是什么？',
    answer: `**核心区别**：

| 函数组件 | 类组件 |
|---------|--------|
| 无实例 | 有实例（this） |
| 无生命周期 | 有生命周期方法 |
| 无状态（Hooks 前） | 有 state |
| 更容易测试 | this 指向问题 |
| 闭包陷阱 | 读取最新 state |

**Hooks 的意义**：
\`\`\`javascript
// 类组件
class Counter extends React.Component {
  state = { count: 0 }
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>
      {this.state.count}
    </button>
  }
}

// 函数组件（Hooks）
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
\`\`\`

**闭包陷阱**：
\`\`\`javascript
// 函数组件的坑
function Counter() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      console.log(count) // 永远是 0，闭包陷阱
    }, 1000)
    return () => clearInterval(id)
  }, [])
}

// 解决方案：使用 ref 或依赖项
\`\`\``,
    category: 'React',
    difficulty: 'Medium',
    tags: ['函数组件', '类组件', 'Hooks']
  },
  {
    id: 'react-8',
    question: 'React 为什么如此强调 Props 的不可变性？',
    answer: `**Props 不可变的原因**：

1. **单向数据流**：Props 从父组件流向子组件，子组件不应修改
2. **可预测性**：相同 props 产生相同渲染结果
3. **性能优化**：React.memo 浅比较 props 变化
4. **调试友好**：状态变化可追踪

**错误示例**：
\`\`\`javascript
// ❌ 错误：直接修改 props
function Child({ user }) {
  user.name = 'new name' // 不要这样做！
  return <div>{user.name}</div>
}

// ✅ 正确：使用 state 或回调
function Child({ user, onUpdate }) {
  const [name, setName] = useState(user.name)
  return <div>{name}</div>
}
\`\`\`

**深拷贝 vs 浅拷贝**：
\`\`\`javascript
// 浅拷贝（推荐）
const newObj = { ...obj, key: 'new value' }
const newArr = [...arr, newItem]

// 深拷贝（必要时）
const deepClone = JSON.parse(JSON.stringify(obj))
// 或使用 immer
import { produce } from 'immer'
const nextState = produce(state, draft => {
  draft.deep.nested.value = 'new'
})
\`\`\``,
    category: 'React',
    difficulty: 'Easy',
    tags: ['Props', '不可变性', '单向数据流']
  },
  {
    id: 'react-9',
    question: 'React 的 Fiber 架构主要是为了解决什么问题？',
    answer: `**Fiber 解决的核心问题**：**同步渲染阻塞主线程**

**React 15 及之前**：
- 递归遍历虚拟 DOM
- 无法中断，大组件树卡顿
- 动画、用户输入无响应

**React 16 Fiber**：
- 可中断的增量渲染
- 时间切片（每帧 5ms）
- 优先级调度

\`\`\`javascript
// Fiber 节点结构
const fiber = {
  type: 'div',           // 组件类型
  key: null,             // key
  props: {},             // props
  stateNode: null,       // DOM 节点或组件实例
  
  // Fiber 树结构
  return: parentFiber,   // 父节点
  child: firstChild,     // 第一个子节点
  sibling: nextSibling,  // 兄弟节点
  
  // 双缓冲
  alternate: workInProgress,
  
  // 状态
  effectTag: 'UPDATE',   // 副作用标记
  expirationTime: 0,     // 过期时间（优先级）
}
\`\`\`

**调度流程**：
\`\`\`
用户输入（高优先级）
    ↓
打断低优先级任务（渲染）
    ↓
执行高优先级任务
    ↓
恢复低优先级任务
\`\`\`

**生命周期变化**：
- componentWillMount → 删除
- componentWillReceiveProps → 删除
- componentWillUpdate → 删除
- 新增：getDerivedStateFromProps、getSnapshotBeforeUpdate`,
    category: 'React',
    difficulty: 'Hard',
    tags: ['Fiber', '调度', '并发渲染']
  },
  {
    id: 'react-10',
    question: 'React 中的 key 属性有什么作用？它的内部机制是怎样的？最佳实践是什么？',
    answer: `**Key 的作用**：标识列表中的元素，帮助 React 识别哪些元素变化了

**Diff 算法中的 Key**：
\`\`\`javascript
// 没有 key，React 无法识别节点
<ul>
  <li>A</li>
  <li>B</li>
</ul>

// 插入新元素到头部
<ul>
  <li>C</li>  // React 会认为是 A 变成了 C
  <li>A</li>  // B 变成了 A
  <li>B</li>  // 新增 B
</ul>

// 使用 key，React 正确识别
<ul>
  <li key="C">C</li>  // 新增
  <li key="A">A</li>  // 保持不变
  <li key="B">B</li>  // 保持不变
</ul>
\`\`\`

**最佳实践**：
\`\`\`javascript
// ✅ 使用稳定的唯一标识
{items.map(item => <Item key={item.id} {...item} />)}

// ❌ 不要使用索引（除非列表是静态的）
{items.map((item, index) => <Item key={index} {...item} />)}

// ❌ 不要使用随机值
{items.map(item => <Item key={Math.random()} {...item} />)}
\`\`\`

**为什么不用 index**：
- 列表变化时，index 改变
- 导致不必要的重渲染
- 可能导致状态错乱（表单输入等）

**内部机制**：
- Key 在同层级兄弟节点间比较
- 相同 key → 复用节点
- 不同 key → 创建新节点`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['key', 'Diff算法', '列表渲染']
  },
  {
    id: 'react-11',
    question: 'React 的事件机制和合成事件是如何工作的？',
    answer: `**合成事件（SyntheticEvent）**：React 自定义的事件对象，跨浏览器兼容

**事件机制流程**：
\`\`\`
1. 用户点击按钮
      ↓
2. 事件冒泡到 document（React 17 前是 document，17+ 是根容器）
      ↓
3. React 收集事件，创建合成事件对象
      ↓
4. 模拟事件冒泡/捕获
      ↓
5. 执行用户绑定的事件处理函数
      ↓
6. 释放合成事件对象（池化）
\`\`\`

**代码示例**：
\`\`\`javascript
function Button() {
  const handleClick = (e) => {
    // e 是合成事件对象
    e.preventDefault()
    e.stopPropagation()
    console.log(e.nativeEvent) // 原生事件
  }
  return <button onClick={handleClick}>Click</button>
}
\`\`\`

**React 17 之前的事件池化**：
\`\`\`javascript
// React 17 之前：事件池化（性能优化）
function handleClick(e) {
  // 异步访问会报错（事件被回收）
  setTimeout(() => {
    console.log(e.type) // null
  }, 0)
  
  // 解决：持久化保存
  e.persist()
  setTimeout(() => {
    console.log(e.type) // 'click'
  }, 0)
}

// React 17+：移除事件池化，不再需要 e.persist()
\`\`\`

**与原生事件的区别**：
| 合成事件 | 原生事件 |
|---------|---------|
| 跨浏览器兼容 | 浏览器差异 |
| 事件委托到根容器 | 每个元素单独绑定 |
| 自动清理 | 需手动移除 |
| 命名：onClick | 命名：onclick |

**阻止原生事件**：
\`\`\`javascript
document.addEventListener('click', () => {
  console.log('document')
})

function App() {
  const handleClick = (e) => {
    e.stopPropagation() // 阻止合成事件冒泡
    e.nativeEvent.stopImmediatePropagation() // 阻止原生事件
  }
  return <button onClick={handleClick}>Click</button>
}
\`\`\``,
    category: 'React',
    difficulty: 'Hard',
    tags: ['合成事件', '事件机制', '事件池']
  },
  {
    id: 'react-12',
    question: '受控组件和非受控组件有什么区别？应该在什么场景下选择使用它们？',
    answer: `**受控组件**：表单值由 React state 控制
**非受控组件**：表单值由 DOM 自身维护

**受控组件**：
\`\`\`javascript
function ControlledInput() {
  const [value, setValue] = useState('')
  
  const handleChange = (e) => {
    setValue(e.target.value) // React 控制值
  }
  
  const handleSubmit = () => {
    console.log(value) // 直接使用 state
  }
  
  return <input value={value} onChange={handleChange} />
}
\`\`\`

**非受控组件**：
\`\`\`javascript
function UncontrolledInput() {
  const inputRef = useRef(null)
  
  const handleSubmit = () => {
    console.log(inputRef.current.value) // 从 DOM 读取
  }
  
  return <input ref={inputRef} defaultValue="initial" />
}
\`\`\`

**对比**：

| 特性 | 受控组件 | 非受控组件 |
|-----|---------|-----------|
| 数据源 | React state | DOM |
| 实时验证 | ✅ 支持 | ❌ 困难 |
| 禁用输入 | ✅ 简单 | ❌ 需要 DOM 操作 |
| 表单重置 | ✅ setState('') | ❌ 需要 DOM 操作 |
| 性能 | 每次输入触发渲染 | 无额外渲染 |
| 集成非 React 代码 | ❌ 困难 | ✅ 简单 |

**选择建议**：

**使用受控组件**：
- 需要实时验证
- 需要禁用按钮
- 需要动态设置值
- 需要格式化输入

**使用非受控组件**：
- 文件上传（<input type="file">）
- 快速原型开发
- 集成非 React 库
- 性能敏感场景

**React Hook Form**（推荐）：
\`\`\`javascript
import { useForm } from 'react-hook-form'

function Form() {
  const { register, handleSubmit } = useForm()
  
  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('name')} />
    </form>
  )
}
\`\`\``,
    category: 'React',
    difficulty: 'Medium',
    tags: ['受控组件', '非受控组件', '表单']
  },
  {
    id: 'react-13',
    question: 'React 的严格模式 (StrictMode) 有什么作用？',
    answer: `**StrictMode 作用**：开发环境下的代码质量检查工具

\`\`\`javascript
import { StrictMode } from 'react'

function App() {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}
\`\`\`

**检查项**：
1. **不安全的生命周期**：componentWillMount 等已废弃的方法
2. **废弃的 API**：findDOMNode、legacy string refs
3. **意外的副作用**：组件渲染两次检测副作用
4. **废弃的 findDOMNode**：不推荐使用
5. **检测过时的 context API**

**渲染两次的原因**：
\`\`\`javascript
// StrictMode 下，组件会渲染两次
function Counter() {
  console.log('render') // 打印两次
  
  useEffect(() => {
    console.log('effect') // 打印两次
  }, [])
  
  return <div>Counter</div>
}

// 这是为了检测副作用：
// - 如果 effect 有问题（如资源泄漏），会暴露出来
// - 生产环境不会重复渲染
\`\`\`

**常见问题**：
\`\`\`javascript
// ❌ 问题：effect 中有未清理的副作用
useEffect(() => {
  const id = setInterval(() => {}, 1000)
  // 忘记 return cleanup
})

// ✅ 修复：清理副作用
useEffect(() => {
  const id = setInterval(() => {}, 1000)
  return () => clearInterval(id)
})
\`\`\`

**注意**：
- 只在开发环境生效
- 不渲染任何 UI
- 不会影响性能（生产环境无开销）`,
    category: 'React',
    difficulty: 'Easy',
    tags: ['StrictMode', '开发工具', '生命周期']
  },
  {
    id: 'react-14',
    question: '为什么在 React 开发中，我们总是提倡"组合优于继承"？',
    answer: `**React 不使用继承的原因**：

1. **组件组合更灵活**
\`\`\`javascript
// ❌ 继承方式（不推荐）
class Button extends BaseButton {
  render() {
    return <button>{this.props.children}</button>
  }
}

// ✅ 组合方式（推荐）
function Button({ children, variant }) {
  return <button className={variant}>{children}</button>
}

// 使用时可以组合
<Button>
  <Icon name="check" />
  <span>Submit</span>
</Button>
\`\`\`

2. **Props 作为 API 更清晰**
\`\`\`javascript
// 继承：耦合严重
class PrimaryButton extends Button {
  // 难以扩展
}

// 组合：解耦
function Button({ variant = 'default', size = 'medium', children }) {
  return <button className={\`btn btn-\${variant} btn-\${size}\`}>{children}</button>
}

<Button variant="primary" size="large">Click</Button>
\`\`\`

3. **高阶组件（HOC）vs 继承**
\`\`\`javascript
// ❌ 继承
class AuthenticatedPage extends Page {
  componentDidMount() {
    if (!this.props.isLoggedIn) {
      this.redirect()
    }
  }
}

// ✅ 高阶组件
function withAuth(WrappedComponent) {
  return function(props) {
    if (!props.isLoggedIn) {
      return <Redirect to="/login" />
    }
    return <WrappedComponent {...props} />
  }
}
\`\`\`

4. **Render Props / Hooks 更强大**
\`\`\`javascript
// Render Props
function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  return <div onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}>
    {render(position)}
  </div>
}

// Hooks（更简洁）
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMove = e => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])
  return position
}
\`\`\`

**总结**：
- 组合更灵活、更易测试
- Props 提供清晰的 API
- Hooks 解决了逻辑复用问题
- React 官方推荐使用组合而非继承`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['组合', '继承', '设计模式']
  },
  // React 状态管理
  {
    id: 'react-15',
    question: 'React 的父子组件如何传递参数？兄弟组件如何传递参数？',
    answer: `**父子通信**：

**1. 父 → 子（Props）**
\`\`\`javascript
function Parent() {
  const data = 'hello'
  return <Child data={data} />
}

function Child({ data }) {
  return <div>{data}</div>
}
\`\`\`

**2. 子 → 父（回调函数）**
\`\`\`javascript
function Parent() {
  const handleData = (data) => console.log(data)
  return <Child onSend={handleData} />
}

function Child({ onSend }) {
  return <button onClick={() => onSend('hello')}>Send</button>
}
\`\`\`

**兄弟通信**：

**1. 状态提升（推荐）**
\`\`\`javascript
function Parent() {
  const [shared, setShared] = useState('')
  
  return (
    <>
      <SiblingA onChange={setShared} />
      <SiblingB value={shared} />
    </>
  )
}

function SiblingA({ onChange }) {
  return <input onChange={e => onChange(e.target.value)} />
}

function SiblingB({ value }) {
  return <div>{value}</div>
}
\`\`\`

**2. Context（跨层级）**
\`\`\`javascript
const DataContext = createContext()

function Parent() {
  const [data, setData] = useState('')
  return (
    <DataContext.Provider value={{ data, setData }}>
      <SiblingA />
      <SiblingB />
    </DataContext.Provider>
  )
}

function SiblingA() {
  const { setData } = useContext(DataContext)
  return <input onChange={e => setData(e.target.value)} />
}

function SiblingB() {
  const { data } = useContext(DataContext)
  return <div>{data}</div>
}
\`\`\`

**3. 事件总线（不推荐）**
\`\`\`javascript
// 小型项目可用
const EventBus = {
  events: {},
  on(event, callback) {
    this.events[event] = this.events[event] || []
    this.events[event].push(callback)
  },
  emit(event, data) {
    this.events[event]?.forEach(cb => cb(data))
  }
}
\`\`\``,
    category: 'React',
    difficulty: 'Easy',
    tags: ['组件通信', 'Props', 'Context']
  },
  {
    id: 'react-16',
    question: '使用 useState 的函数式更新方式能带来哪些好处？',
    answer: `**函数式更新**：setState(prevState => newState)

**场景 1：依赖前一个状态**
\`\`\`javascript
// ❌ 错误：闭包陷阱
function Counter() {
  const [count, setCount] = useState(0)
  
  const handleClick = () => {
    setTimeout(() => {
      setCount(count + 1) // count 是旧值
    }, 1000)
  }
  
  return <button onClick={handleClick}>{count}</button>
}

// ✅ 正确：使用函数式更新
const handleClick = () => {
  setTimeout(() => {
    setCount(prev => prev + 1) // 总是最新的
  }, 1000)
}
\`\`\`

**场景 2：批量更新**
\`\`\`javascript
// ❌ 错误：三次点击只增加 1
function handleClick() {
  setCount(count + 1)
  setCount(count + 1)
  setCount(count + 1)
}

// ✅ 正确：三次更新都生效
function handleClick() {
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)
}
\`\`\`

**场景 3：在回调中使用**
\`\`\`javascript
// 使用 useCallback 时不依赖 count
const increment = useCallback(() => {
  setCount(prev => prev + 1)
}, []) // 无需 count 依赖
\`\`\`

**对比**：

| 直接更新 | 函数式更新 |
|---------|-----------|
| setCount(count + 1) | setCount(prev => prev + 1) |
| 可能使用旧值 | 总是最新值 |
| 依赖外部变量 | 不依赖外部 |
| 批量更新问题 | 批量更新正确 |

**最佳实践**：
- 新状态依赖旧状态时，使用函数式更新
- 在异步回调中，使用函数式更新
- 在 useCallback 中减少依赖项`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['useState', '函数式更新', '闭包']
  },
  {
    id: 'react-17',
    question: '"状态提升"这种模式有哪些优缺点？它的适用边界在哪里？',
    answer: `**状态提升**：将共享状态移动到最近的共同父组件

**示例**：
\`\`\`javascript
// 状态提升前：两个组件各自管理状态
function TemperatureInput() {
  const [temperature, setTemperature] = useState('')
  // ...
}

// 状态提升后：父组件管理状态
function Calculator() {
  const [temperature, setTemperature] = useState('')
  
  return (
    <>
      <TemperatureInput value={temperature} onChange={setTemperature} />
      <BoilingVerdict celsius={temperature} />
    </>
  )
}
\`\`\`

**优点**：
1. **单一数据源**：状态集中管理
2. **数据一致性**：避免状态不同步
3. **易于调试**：状态变化可追踪
4. **简单直观**：适合简单场景

**缺点**：
1. **Props Drilling**：层级深时传递繁琐
\`\`\`javascript
<GrandParent>
  <Parent>
    <Child>
      <GrandChild data={data} /> {/* data 层层传递 */}
    </Child>
  </Parent>
</GrandParent>
\`\`\`

2. **性能问题**：父组件更新导致所有子组件重渲染
3. **组件耦合**：子组件依赖父组件结构
4. **代码膨胀**：父组件承担过多职责

**适用边界**：

| 场景 | 是否适用 |
|-----|---------|
| 两个组件共享状态 | ✅ 适用 |
| 简单表单 | ✅ 适用 |
| 深层嵌套（3层以上） | ❌ 不适用，用 Context |
| 大量组件共享 | ❌ 不适用，用状态管理库 |
| 跨页面共享 | ❌ 不适用，用 URL/Storage |

**替代方案**：
- **Context**：跨层级共享
- **Zustand/Redux**：全局状态
- **URL 参数**：页面间共享
- **LocalStorage**：持久化状态`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['状态提升', 'Props Drilling', '设计模式']
  },
  {
    id: 'react-18',
    question: '在一个 React 项目中，你会如何进行状态管理方案的选型？',
    answer: `**选型决策树**：

\`\`\`
组件内部状态？
├─ 是 → useState / useReducer
└─ 否 → 多组件共享？
         ├─ 2-3 个组件 → 状态提升
         └─ 更多组件 → 层级关系？
                      ├─ 深层嵌套 → Context
                      └─ 平级/跨页面 → 全局状态库
\`\`\`

**方案对比**：

| 方案 | 适用场景 | 复杂度 | 性能 |
|-----|---------|-------|------|
| useState | 组件内状态 | ⭐ | ⭐⭐⭐⭐⭐ |
| useReducer | 复杂组件状态 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 状态提升 | 2-3 组件共享 | ⭐ | ⭐⭐⭐⭐ |
| Context | 跨层级共享 | ⭐⭐ | ⭐⭐⭐ |
| Zustand | 全局状态 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Redux Toolkit | 大型应用 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Recoil/Jotai | 原子化状态 | ⭐⭐ | ⭐⭐⭐⭐⭐ |

**推荐选型**：

**小型项目（< 10 组件）**：
\`\`\`javascript
// useState + 状态提升
const [user, setUser] = useState(null)
\`\`\`

**中型项目（10-50 组件）**：
\`\`\`javascript
// Zustand（推荐）
import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))
\`\`\`

**大型项目（50+ 组件）**：
\`\`\`javascript
// Redux Toolkit
import { createSlice, configureStore } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => { state.user = action.payload }
  }
})
\`\`\`

**考虑因素**：
1. **团队熟悉度**：选择团队熟悉的方案
2. **项目规模**：小项目不过度设计
3. **性能需求**：频繁更新的状态需细粒度控制
4. **开发效率**：权衡开发速度和可维护性`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['状态管理', '选型', '架构']
  },
  {
    id: 'react-19',
    question: '如何利用 useContext 和 useReducer 来实现一个轻量级的全局状态管理器？',
    answer: `**实现步骤**：

**1. 定义 Reducer 和初始状态**
\`\`\`javascript
// store.js
const initialState = {
  user: null,
  theme: 'light',
  notifications: []
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] }
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) }
    default:
      return state
  }
}
\`\`\`

**2. 创建 Context 和 Provider**
\`\`\`javascript
import { createContext, useReducer, useContext } from 'react'

const StateContext = createContext()
const DispatchContext = createContext()

export function StateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
\`\`\`

**3. 创建自定义 Hooks**
\`\`\`javascript
export function useAppState() {
  return useContext(StateContext)
}

export function useAppDispatch() {
  return useContext(DispatchContext)
}

// 可选：创建选择器 Hook
export function useUser() {
  const state = useAppState()
  return state.user
}
\`\`\`

**4. 使用示例**
\`\`\`javascript
function App() {
  return (
    <StateProvider>
      <Header />
      <Main />
    </StateProvider>
  )
}

function Header() {
  const user = useUser()
  const dispatch = useAppDispatch()
  
  const handleLogin = () => {
    dispatch({ type: 'SET_USER', payload: { name: 'John' } })
  }
  
  return (
    <header>
      {user ? <span>{user.name}</span> : <button onClick={handleLogin}>Login</button>}
    </header>
  )
}
\`\`\`

**5. 性能优化：拆分 Context**
\`\`\`javascript
// 避免 Context 变化导致所有消费者重渲染
const UserContext = createContext()
const ThemeContext = createContext()

function StateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <UserContext.Provider value={state.user}>
      <ThemeContext.Provider value={state.theme}>
        {children}
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}
\`\`\`

**优缺点**：
- ✅ 无需第三方库
- ✅ 代码可控
- ✅ 适合简单场景
- ❌ 无法处理异步 action
- ❌ 缺少中间件
- ❌ 性能优化需手动处理`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['useContext', 'useReducer', '状态管理']
  },
  {
    id: 'react-20',
    question: '如何有效优化因 useContext 引起的性能问题？',
    answer: `**问题根源**：Context 值变化时，所有消费者组件都会重渲染

**优化方案**：

**1. 拆分 Context**
\`\`\`javascript
// ❌ 单一 Context：任何状态变化都触发所有消费者
const AppContext = createContext({ user: null, theme: 'light', notifications: [] })

// ✅ 拆分 Context：只有相关状态变化才触发
const UserContext = createContext(null)
const ThemeContext = createContext('light')
const NotificationsContext = createContext([])

function Provider({ children }) {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')
  
  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}
\`\`\`

**2. 拆分状态和更新函数**
\`\`\`javascript
// ❌ 问题和解决方案在同一个 Context
const Context = createContext({ state, setState })

// ✅ 分离：状态消费者不受更新函数变化影响
const StateContext = createContext()
const DispatchContext = createContext()

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

// 消费者可以只订阅 dispatch
function Button() {
  const dispatch = useContext(DispatchContext) // 状态变化不会触发重渲染
  return <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
}
\`\`\`

**3. 使用 useMemo 稳定 Context 值**
\`\`\`javascript
function Provider({ children }) {
  const [user, setUser] = useState(null)
  
  // 稳定对象引用
  const value = useMemo(() => ({ user, setUser }), [user])
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
\`\`\`

**4. 使用选择器模式**
\`\`\`javascript
// 自定义 Hook 只返回需要的部分
function useUser() {
  const state = useContext(StateContext)
  return state.user
}

function ThemeComponent() {
  const theme = useTheme() // 只有 theme 变化才重渲染
  return <div className={theme}>Theme: {theme}</div>
}
\`\`\`

**5. React.memo 配合**
\`\`\`javascript
const ExpensiveComponent = React.memo(function({ data }) {
  // 只在 props 变化时重渲染
  return <div>{data}</div>
})

function Parent() {
  const value = useContext(SomeContext)
  
  // Context 变化，但 ExpensiveComponent 的 props 没变
  // React.memo 阻止不必要的重渲染
  return <ExpensiveComponent data="static" />
}
\`\`\`

**6. 状态管理库替代**
\`\`\`javascript
// Zustand：细粒度订阅
import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  theme: 'light',
  setUser: (user) => set({ user })
}))

// 组件只订阅需要的字段
function UserComponent() {
  const user = useStore(state => state.user) // 只在 user 变化时重渲染
  return <div>{user?.name}</div>
}
\`\`\``,
    category: 'React',
    difficulty: 'Hard',
    tags: ['useContext', '性能优化', 'Context']
  },
  {
    id: 'react-21',
    question: '和 useState 相比，useReducer 的优势体现在哪里？我们应该如何在这两者之间做选择？',
    answer: `**useReducer 优势**：

**1. 复杂状态逻辑**
\`\`\`javascript
// ❌ useState：多个相关状态
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [data, setData] = useState(null)

const fetchData = async () => {
  setLoading(true)
  setError(null)
  try {
    const res = await fetch(url)
    setData(res)
  } catch (e) {
    setError(e)
  } finally {
    setLoading(false)
  }
}

// ✅ useReducer：状态逻辑集中管理
const initialState = { loading: false, error: null, data: null }

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, data: action.payload }
    case 'FETCH_ERROR':
      return { loading: false, error: action.payload, data: null }
    default:
      return state
  }
}
\`\`\`

**2. 易于测试**
\`\`\`javascript
// Reducer 是纯函数，易于单元测试
test('FETCH_SUCCESS updates state correctly', () => {
  const state = { loading: true, error: null, data: null }
  const newState = reducer(state, { type: 'FETCH_SUCCESS', payload: { id: 1 } })
  expect(newState).toEqual({ loading: false, error: null, data: { id: 1 } })
})
\`\`\`

**3. 传递 dispatch 而非多个回调**
\`\`\`javascript
// ❌ useState：传递多个回调
function Parent() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  return <Child setData={setData} setError={setError} />
}

// ✅ useReducer：传递单个 dispatch
function Parent() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <Child dispatch={dispatch} />
}
\`\`\`

**4. 可预测的状态变化**
\`\`\`javascript
// 所有状态变化都有明确的 action type
dispatch({ type: 'INCREMENT', payload: 5 })
dispatch({ type: 'RESET' })
\`\`\`

**选择决策**：

| 场景 | 推荐 |
|-----|------|
| 单一简单值（string/number/boolean） | useState |
| 独立的多个状态 | useState |
| 对象状态，多个字段相关联 | useReducer |
| 复杂状态逻辑（如表单验证） | useReducer |
| 需要测试状态变化 | useReducer |
| 多个组件共享 dispatch | useReducer |
| 状态机（有限状态） | useReducer |

**示例：表单状态**
\`\`\`javascript
// 使用 useReducer 管理表单
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, values: { ...state.values, [action.field]: action.value } }
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.error } }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
\`\`\``,
    category: 'React',
    difficulty: 'Medium',
    tags: ['useReducer', 'useState', '状态管理']
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
  },
  // React Hooks 深度解析
  {
    id: 'react-22',
    question: 'useEffect 的执行时机具体是什么时候？',
    answer: `**useEffect**：DOM 更新后异步执行，不阻塞渲染
**useLayoutEffect**：DOM 更新后同步执行，阻塞渲染

使用场景：默认用 useEffect，需要 DOM 测量/同步修改时用 useLayoutEffect`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['useEffect', 'useLayoutEffect']
  },
  {
    id: 'react-23',
    question: 'useEffect 的依赖项原理是什么？',
    answer: `**依赖项机制**：
- 无依赖项：每次渲染都执行
- 空数组 []：仅挂载/卸载时执行
- 有依赖项 [a, b]：依赖变化时执行

**原理**：React 浅比较前后依赖值，有变化则执行 effect`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['useEffect', '依赖项']
  },
  {
    id: 'react-24',
    question: '如何避免 useEffect 中的竞态条件？',
    answer: `**解决方案**：
1. 使用 AbortController 取消请求
2. 使用布尔标记 cancelled
3. 使用 useRef 追踪最新请求
4. 使用 SWR / React Query 自动处理`,
    category: 'React',
    difficulty: 'Hard',
    tags: ['useEffect', '竞态条件', '异步']
  },
  {
    id: 'react-25',
    question: '什么时候使用 useCallback 和 useMemo？',
    answer: `**useCallback**：缓存函数引用
- 传递给 memo 子组件的回调

**useMemo**：缓存计算结果
- 昂贵的计算
- 需要稳定对象引用

**滥用后果**：内存开销、性能开销`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['useCallback', 'useMemo', '性能优化']
  },
  {
    id: 'react-26',
    question: 'useRef 有哪些应用场景？',
    answer: `**常见场景**：
1. 访问 DOM 元素
2. 存储任意可变值（不触发重渲染）
3. 保存前一个值
4. 解决闭包陷阱

**与 useState 区别**：修改 ref.current 不触发重渲染`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['useRef', 'DOM操作']
  },
  {
    id: 'react-27',
    question: 'React 18 自动批处理如何工作？',
    answer: `**批处理**：多次状态更新合并为一次渲染

**React 18 之前**：仅在 React 事件中批处理
**React 18**：所有更新都自动批处理（Promise、setTimeout 等）

**退出批处理**：使用 flushSync`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['React 18', '批处理', '性能']
  },
  {
    id: 'react-28',
    question: 'React 19 的 use Hook 有什么作用？',
    answer: `**use Hook**：在组件中直接使用 Promise

\`\`\`javascript
function User({ id }) {
  const user = use(fetchUser(id))
  return <div>{user.name}</div>
}
\`\`\`

**特点**：
- 可在条件语句中使用
- 可 use Context
- 自动缓存`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['React 19', 'use', '异步']
  },
  {
    id: 'react-29',
    question: 'React 19 的 useActionState 有什么作用？',
    answer: `**useActionState**：管理表单提交状态

\`\`\`javascript
const [state, formAction, isPending] = useActionState(
  async (prev, formData) => {
    // 处理表单提交
  },
  { error: null }
)
\`\`\`

**配合**：useFormStatus 获取表单状态`,
    category: 'React',
    difficulty: 'Medium',
    tags: ['React 19', 'useActionState', '表单']
  },
  {
    id: 'react-30',
    question: 'React 19 ref 作为 prop 有什么优势？',
    answer: `**React 19**：ref 作为普通 prop，无需 forwardRef

\`\`\`javascript
// React 19
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
\`\`\`

**优势**：代码更简洁、类型推断更好、向后兼容`,
    category: 'React',
    difficulty: 'Easy',
    tags: ['React 19', 'ref', 'forwardRef']
  }
]

const categories = ['All', 'JavaScript', 'Vue', 'React', 'CSS', 'Network']

// 懒加载配置
const QUESTIONS_PER_PAGE = 10

export default function InterviewPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // 懒加载状态
  const [displayCount, setDisplayCount] = useState(QUESTIONS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const filteredQuestions = interviewQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) ||
                         q.answer.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 当前显示的题目
  const displayedQuestions = filteredQuestions.slice(0, displayCount)
  const hasMore = displayCount < filteredQuestions.length

  // 重置懒加载
  useEffect(() => {
    setDisplayCount(QUESTIONS_PER_PAGE)
  }, [search, selectedCategory])

  // Intersection Observer 懒加载
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true)
          setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + QUESTIONS_PER_PAGE, filteredQuestions.length))
            setIsLoading(false)
          }, 300)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoading, filteredQuestions.length])

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
            {displayedQuestions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
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

        {/* Load More Trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isLoading ? (
              <motion.div 
                className="flex items-center gap-2 text-sky-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Loader2 size={20} className="animate-spin" />
                <span>加载中...</span>
              </motion.div>
            ) : (
              <div className="text-gray-500 text-sm">
                已加载 {displayCount}/{filteredQuestions.length} 题，滚动加载更多
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {!hasMore && displayedQuestions.length > 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            已加载全部 {filteredQuestions.length} 题
          </div>
        )}
      </main>
    </div>
  )
}
