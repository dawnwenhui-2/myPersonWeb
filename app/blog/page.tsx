'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Eye, Tag, ArrowLeft, ChevronRight, Search } from 'lucide-react'
import OceanEffects from '@/components/OceanEffects'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  tags: string[]
  author: string
  publishedAt: string
  updatedAt: string
  status: 'draft' | 'published'
  views: number
}

// Markdown 简单渲染
function renderMarkdown(content: string) {
  return content
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-white mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-sky-400">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-gray-300">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-slate-800 px-2 py-1 rounded text-sky-300">$1</code>')
    .replace(/\n/g, '<br/>')
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    const savedPosts = localStorage.getItem('blog_posts')
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts)
      setPosts(allPosts.filter((p: BlogPost) => p.status === 'published'))
    }
  }, [])

  // 过滤文章
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  // 获取所有标签
  const allTags = [...new Set(posts.flatMap(p => p.tags))]

  // 阅读文章
  const handleRead = (post: BlogPost) => {
    setSelectedPost(post)
    // 增加阅读量
    const savedPosts = localStorage.getItem('blog_posts')
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts)
      const updated = allPosts.map((p: BlogPost) => 
        p.id === post.id ? { ...p, views: p.views + 1 } : p
      )
      localStorage.setItem('blog_posts', JSON.stringify(updated))
      setPosts(posts.map(p => p.id === post.id ? { ...p, views: p.views + 1 } : p))
    }
  }

  // 文章详情页
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-slate-900">
        <OceanEffects />
        
        {/* 导航 */}
        <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-sky-500/20">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-sky-400 hover:text-white transition-colors"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft size={20} />
              返回列表
            </motion.button>
            <a href="/" className="flex items-center gap-2 text-sky-400 hover:text-white">
              <svg width="28" height="28" viewBox="0 0 36 36">
                <path d="M4,20 Q10,12 18,18 Q26,24 32,16" stroke="#38bdf8" strokeWidth="3" fill="none"/>
                <path d="M4,26 Q12,18 18,24 Q28,32 32,24" stroke="#0ea5e9" strokeWidth="2.5" fill="none"/>
                <path d="M6,30 Q14,24 20,28 Q28,34 30,28" stroke="#7dd3fc" strokeWidth="2" fill="none"/>
              </svg>
              <span className="font-bold">dawnwenhui</span>
            </a>
          </div>
        </nav>

        {/* 文章内容 */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-3xl p-8 border border-sky-500/20"
          >
            {/* 封面 */}
            <div className="text-center mb-8">
              <span className="text-8xl">{selectedPost.coverImage}</span>
              <h1 className="text-4xl font-bold text-white mt-6 mb-4">{selectedPost.title}</h1>
              <div className="flex items-center justify-center gap-6 text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {selectedPost.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  {selectedPost.views} 阅读
                </span>
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {selectedPost.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* 内容 */}
            <div 
              className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedPost.content) }}
            />
          </motion.article>
        </main>
      </div>
    )
  }

  // 文章列表页
  return (
    <div className="min-h-screen bg-slate-900">
      <OceanEffects />

      {/* 导航 */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-sky-500/20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-sky-400">
            <svg width="28" height="28" viewBox="0 0 36 36">
              <path d="M4,20 Q10,12 18,18 Q26,24 32,16" stroke="#38bdf8" strokeWidth="3" fill="none"/>
              <path d="M4,26 Q12,18 18,24 Q28,32 32,24" stroke="#0ea5e9" strokeWidth="2.5" fill="none"/>
              <path d="M6,30 Q14,24 20,28 Q28,34 30,28" stroke="#7dd3fc" strokeWidth="2" fill="none"/>
            </svg>
            <span className="font-bold text-white">dawnwenhui</span>
          </a>
          <motion.a
            href="/admin"
            className="px-4 py-2 rounded-xl bg-sky-500/20 text-sky-400 text-sm"
            whileHover={{ scale: 1.05 }}
          >
            管理后台
          </motion.a>
        </div>
      </nav>

      {/* 头部 */}
      <header className="max-w-5xl mx-auto px-6 py-16 text-center">
        <motion.h1
          className="text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          技术博客
        </motion.h1>
        <motion.p
          className="text-xl text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          分享前端技术、AI 应用与创意实践
        </motion.p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        {/* 搜索和标签 */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                !selectedTag ? 'bg-sky-500/30 text-sky-400 border border-sky-500/50' : 'text-gray-400 hover:text-white'
              }`}
            >
              全部
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  tag === selectedTag ? 'bg-sky-500/30 text-sky-400 border border-sky-500/50' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 文章列表 */}
        {filteredPosts.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-6xl mb-4 block">🐠</span>
            <p className="text-gray-400">暂无文章</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleRead(post)}
                className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-sky-500/50 transition-all cursor-pointer group"
              >
                {/* 封面 */}
                <div className="h-48 bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-110 transition-transform">{post.coverImage}</span>
                </div>
                
                {/* 内容 */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs bg-sky-500/10 text-sky-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {post.views}
                      </span>
                    </div>
                    <span className="text-sky-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                      阅读全文 <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
