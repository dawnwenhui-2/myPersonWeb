'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, FileText, Code2, FolderKanban, Mail, Settings, Plus, Edit3, Trash2, Save, X, Menu, Home, Terminal, Sparkles, Monitor, LogOut, Shield, Layout } from 'lucide-react'
import dynamic from 'next/dynamic'
const OceanEffects = dynamic(() => import('@/components/OceanEffects'), { ssr: false })
import { useRouter } from 'next/navigation'

interface Skill { id: string; category: string; items: string[]; color: string; icon: string }
interface Project { id: string; title: string; description: string; tech: string[]; status: string; emoji: string; featured: boolean }
interface Tip { id: string; title: string; description: string; code: string; tags: string[]; difficulty: string; emoji: string }
interface Contact { email: string; phone: string; location: string; github: string; linkedin: string }
interface SiteSettings { siteName: string; siteDescription: string; themeColor: string }
interface BlogPost { id: string; title: string; excerpt: string; content: string; coverImage: string; tags: string[]; author: string; publishedAt: string; updatedAt: string; status: 'draft' | 'published'; views: number }

const defaultSkills: Skill[] = [
  { id: '1', category: 'Frontend', icon: 'Code2', items: ['Vue3', 'React', 'Next.js', 'TypeScript'], color: '#0ea5e9' },
  { id: '2', category: 'Backend', icon: 'Terminal', items: ['Node.js', 'Python', 'Docker', 'Git'], color: '#22c55e' },
  { id: '3', category: 'AI/ML', icon: 'Sparkles', items: ['LangChain', 'RAG', 'Prompt', 'OpenAI'], color: '#a855f7' },
  { id: '4', category: 'Desktop', icon: 'Monitor', items: ['Electron', 'Tauri', 'WebGL', 'Canvas'], color: '#f97316' },
]

const defaultProjects: Project[] = [
  { id: '1', title: 'Blog System', description: 'Full-stack blog with admin panel', tech: ['Next.js', 'LocalStorage'], status: 'Completed', emoji: '📝', featured: true },
  { id: '2', title: 'Portfolio', description: 'Deep sea themed portfolio', tech: ['Next.js', 'Framer Motion'], status: 'Completed', emoji: '🌊', featured: false },
  { id: '3', title: 'AI Resume Analyzer', description: 'RAG-based resume analysis', tech: ['Vue3', 'Python', 'LangChain'], status: 'In Progress', emoji: '🤖', featured: false },
  { id: '4', title: 'Stock Analyzer', description: 'Real-time data + AI prediction', tech: ['React', 'Node.js'], status: 'Planning', emoji: '📈', featured: false },
]

const defaultTips: Tip[] = [
  { id: '1', title: 'Prototype Chain', description: 'JavaScript inheritance', code: 'function inherit(Target, Origin) {...}', tags: ['class', 'prototype'], difficulty: 'Intermediate', emoji: '🔗' },
  { id: '2', title: 'Event Loop', description: 'JavaScript async mechanism', code: 'console.log(1); setTimeout...', tags: ['Event Loop', 'Promise'], difficulty: 'Core', emoji: '⚡' },
  { id: '3', title: 'Debounce/Throttle', description: 'Performance optimization', code: 'function debounce(fn, delay)...', tags: ['debounce', 'throttle'], difficulty: 'Basic', emoji: '🎯' },
  { id: '4', title: 'Vue3 Reactivity', description: 'Proxy-based reactivity', code: 'function reactive(obj)...', tags: ['Vue3', 'Proxy'], difficulty: 'Advanced', emoji: '🔮' },
]

const defaultContact: Contact = { email: 'dawnwenhui@example.com', phone: '138-xxxx-xxxx', location: 'Shanghai', github: 'https://github.com/dawnwenhui', linkedin: 'https://linkedin.com/in/dawnwenhui' }
const defaultSettings: SiteSettings = { siteName: 'dawnwenhui', siteDescription: 'Frontend | AI | Creative', themeColor: '#0ea5e9' }
const defaultBlogPosts: BlogPost[] = [
  { id: '1', title: 'Vue3 Reactivity Deep Dive', excerpt: 'Understanding Vue3 reactive system...', content: '## Vue3 Reactivity\n\nVue3 uses Proxy...', coverImage: '📝', tags: ['Vue3', 'Frontend'], author: 'dawnwenhui', publishedAt: '2026-04-01', updatedAt: '2026-04-01', status: 'published', views: 1280 },
]

const iconMap: Record<string, any> = { Code2, Terminal, Sparkles, Monitor }

function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }: { activeTab: string; setActiveTab: (tab: string) => void; isOpen: boolean; setIsOpen: (open: boolean) => void; onLogout: () => void }) {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'blog', icon: <FileText size={20} />, label: 'Blog Posts' },
    { id: 'skills', icon: <Code2 size={20} />, label: 'Skills' },
    { id: 'projects', icon: <FolderKanban size={20} />, label: 'Projects' },
    { id: 'tips', icon: <Terminal size={20} />, label: 'Tips' },
    { id: 'contact', icon: <Mail size={20} />, label: 'Contact' },
    { id: 'page-builder', icon: <Layout size={20} />, label: 'Page Builder' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ]

  return (
    <>
      {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}
      <motion.aside className={`fixed top-0 left-0 h-full w-72 bg-slate-900/95 backdrop-blur-lg border-r border-sky-500/20 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-sky-500/20">
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <path d="M4,20 Q10,12 18,18 Q26,24 32,16" stroke="#38bdf8" strokeWidth="3" fill="none"/>
              <path d="M4,26 Q12,18 18,24 Q28,32 32,24" stroke="#0ea5e9" strokeWidth="2.5" fill="none"/>
              <path d="M6,30 Q14,24 20,28 Q28,34 30,28" stroke="#7dd3fc" strokeWidth="2" fill="none"/>
            </svg>
            <div><h1 className="font-bold text-white">Admin Panel</h1><p className="text-xs text-sky-400">Full Site Management</p></div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <motion.button key={item.id} onClick={() => { setActiveTab(item.id); setIsOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-gray-400 hover:text-white hover:bg-slate-800/50'}`}
              whileHover={{ x: 4 }}>
              {item.icon}<span>{item.label}</span>
            </motion.button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <motion.a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800/50 transition-all" whileHover={{ x: 4 }}>
            <Home size={20} /><span>Back to Home</span>
          </motion.a>
          <motion.button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 transition-all" whileHover={{ x: 4 }}>
            <LogOut size={20} /><span>Logout</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}

function DashboardPanel({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Blog Posts', value: data.blog.length, icon: '📝' },
          { label: 'Skills', value: data.skills.length, icon: '💻' },
          { label: 'Projects', value: data.projects.length, icon: '🚀' },
          { label: 'Tips', value: data.tips.length, icon: '🎯' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function EditModal({ title, children, onSave, onCancel }: { title: string; children: React.ReactNode; onSave: () => void; onCancel: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-auto">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto border border-sky-500/20">
        <div className="sticky top-0 bg-slate-800 p-6 border-b border-sky-500/20 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
        <div className="sticky bottom-0 bg-slate-800 p-6 border-t border-sky-500/20 flex justify-end gap-3">
          <button onClick={onCancel} className="px-6 py-2 rounded-xl text-gray-400 hover:text-white">Cancel</button>
          <button onClick={onSave} className="px-6 py-2 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-600">Save</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function BlogPanel({ blog, setBlog }: { blog: BlogPost[]; setBlog: (v: BlogPost[]) => void }) {
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const filtered = blog.filter(p => filter === 'all' || p.status === filter)
  const emojis = ['📝', '🚀', '⚡', '🎨', '🔮', '🌟', '💡', '🎯', '🔥', '💻', '🤖']

  const handleSave = () => {
    if (!editing) return
    const idx = blog.findIndex(p => p.id === editing.id)
    if (idx >= 0) { const updated = [...blog]; updated[idx] = { ...editing, updatedAt: new Date().toISOString().split('T')[0] }; setBlog(updated) }
    else setBlog([{ ...editing, id: Date.now().toString(), publishedAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] }, ...blog])
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
        <motion.button onClick={() => setEditing({ id: '', title: '', excerpt: '', content: '', coverImage: '📝', tags: [], author: 'dawnwenhui', publishedAt: new Date().toISOString().split('T')[0], updatedAt: '', status: 'draft', views: 0 })}
          className="px-4 py-2 rounded-xl bg-sky-500 text-white font-medium flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Plus size={18} />New Post
        </motion.button>
      </div>
      <div className="flex gap-2">
        {(['all', 'published', 'draft'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm ${filter === f ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-gray-400 hover:text-white'}`}>
            {f === 'all' ? 'All' : f === 'published' ? 'Published' : 'Draft'}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20 hover:border-sky-500/40 transition-all">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{post.coverImage}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{post.title || 'Untitled'}</h3>
                    <p className="text-sm text-gray-400 line-clamp-1">{post.excerpt}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>{post.status === 'published' ? 'Published' : 'Draft'}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">{post.tags.map(t => <span key={t} className="px-2 py-0.5 rounded text-xs bg-sky-500/10 text-sky-300">{t}</span>)}</div>
                <div className="flex items-center gap-2 mt-4">
                  <button onClick={() => setEditing(post)} className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-400 text-sm flex items-center gap-1"><Edit3 size={14} />Edit</button>
                  <button onClick={() => setBlog(blog.filter(p => p.id !== post.id))} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm flex items-center gap-1"><Trash2 size={14} />Delete</button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{editing && (
        <EditModal title={editing.id ? 'Edit Post' : 'New Post'} onSave={handleSave} onCancel={() => setEditing(null)}>
          <div><label className="block text-sm text-gray-400 mb-2">Cover Emoji</label><div className="flex flex-wrap gap-2">{emojis.map(e => (
            <button key={e} onClick={() => setEditing({ ...editing, coverImage: e })} className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center ${editing.coverImage === e ? 'bg-sky-500/30 border-2 border-sky-500' : 'bg-slate-900'}`}>{e}</button>
          ))}</div></div>
          <div><label className="block text-sm text-gray-400 mb-2">Title</label><input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
          <div><label className="block text-sm text-gray-400 mb-2">Excerpt</label><textarea value={editing.excerpt} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 resize-none h-20" /></div>
          <div><label className="block text-sm text-gray-400 mb-2">Content (Markdown)</label><textarea value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 resize-none h-40 font-mono text-sm" /></div>
          <div><label className="block text-sm text-gray-400 mb-2">Tags (comma separated)</label><input type="text" value={editing.tags.join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
          <div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.status === 'published'} onChange={e => setEditing({ ...editing, status: e.target.checked ? 'published' : 'draft' })} className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-sky-500" /><span className="text-white">Publish immediately</span></label></div>
        </EditModal>
      )}</AnimatePresence>
    </div>
  )
}

function SkillsPanel({ skills, setSkills }: { skills: Skill[]; setSkills: (v: Skill[]) => void }) {
  const [editing, setEditing] = useState<Skill | null>(null)
  const colors = ['#0ea5e9', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#06b6d4']
  const icons = ['Code2', 'Terminal', 'Sparkles', 'Monitor']

  const handleSave = () => {
    if (!editing) return
    const idx = skills.findIndex(s => s.id === editing.id)
    if (idx >= 0) { const updated = [...skills]; updated[idx] = editing; setSkills(updated) }
    else setSkills([{ ...editing, id: Date.now().toString() }, ...skills])
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Skills</h2>
        <motion.button onClick={() => setEditing({ id: '', category: '', items: [], color: '#0ea5e9', icon: 'Code2' })} className="px-4 py-2 rounded-xl bg-sky-500 text-white font-medium flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Plus size={18} />New Category</motion.button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((skill, i) => {
          const IconComp = iconMap[skill.icon] || Code2
          return (
            <motion.div key={skill.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20 hover:border-sky-500/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${skill.color}20` }}><IconComp size={24} style={{ color: skill.color }} /></div>
                <div><h3 className="text-lg font-bold text-white">{skill.category}</h3><span className="text-xs px-2 py-0.5 rounded" style={{ background: `${skill.color}20`, color: skill.color }}>{skill.items.length} skills</span></div>
              </div>
              <div className="space-y-2 mb-4">{skill.items.map((item, j) => <div key={j} className="flex items-center gap-2 text-gray-400"><span className="w-1.5 h-1.5 rounded-full" style={{ background: skill.color }} />{item}</div>)}</div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(skill)} className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-400 text-sm flex items-center gap-1"><Edit3 size={14} />Edit</button>
                <button onClick={() => setSkills(skills.filter(s => s.id !== skill.id))} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm flex items-center gap-1"><Trash2 size={14} />Delete</button>
              </div>
            </motion.div>
          )
        })}
      </div>
      <AnimatePresence>{editing && (
        <EditModal title={editing.id ? 'Edit Skill' : 'New Skill Category'} onSave={handleSave} onCancel={() => setEditing(null)}>
          <div><label className="block text-sm text-gray-400 mb-2">Category Name</label><input type="text" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
          <div><label className="block text-sm text-gray-400 mb-2">Icon</label><div className="flex gap-2">{icons.map(icon => (
            <button key={icon} onClick={() => setEditing({ ...editing, icon })} className={`px-4 py-2 rounded-lg ${editing.icon === icon ? 'bg-sky-500/30 border border-sky-500 text-white' : 'bg-slate-900 text-gray-400'} flex items-center gap-2`}>{icon}</button>
          ))}</div></div>
          <div><label className="block text-sm text-gray-400 mb-2">Color</label><div className="flex gap-2">{colors.map(color => (
            <button key={color} onClick={() => setEditing({ ...editing, color })} className={`w-10 h-10 rounded-lg ${editing.color === color ? 'ring-2 ring-white' : ''}`} style={{ background: color }} />
          ))}</div></div>
          <div><label className="block text-sm text-gray-400 mb-2">Skills (one per line)</label><textarea value={editing.items.join('\n')} onChange={e => setEditing({ ...editing, items: e.target.value.split('\n').filter(Boolean) })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 resize-none h-32" /></div>
        </EditModal>
      )}</AnimatePresence>
    </div>
  )
}

function ProjectsPanel({ projects, setProjects }: { projects: Project[]; setProjects: (v: Project[]) => void }) {
  const [editing, setEditing] = useState<Project | null>(null)
  const emojis = ['📝', '🚀', '🤖', '📈', '💻', '🌊', '🔮', '🎨', '⚡']
  const statuses = ['Completed', 'In Progress', 'Planning']

  const handleSave = () => {
    if (!editing) return
    const idx = projects.findIndex(p => p.id === editing.id)
    if (idx >= 0) { const updated = [...projects]; updated[idx] = editing; setProjects(updated) }
    else setProjects([{ ...editing, id: Date.now().toString() }, ...projects])
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <motion.button onClick={() => setEditing({ id: '', title: '', description: '', tech: [], status: 'Planning', emoji: '🚀', featured: false })} className="px-4 py-2 rounded-xl bg-sky-500 text-white font-medium flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Plus size={18} />New Project</motion.button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20 hover:border-sky-500/40 transition-all ${project.featured ? 'md:col-span-2' : ''}`}>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{project.emoji}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div><h3 className="text-lg font-bold text-white">{project.title}</h3><p className="text-sm text-gray-400 mt-1">{project.description}</p></div>
                  <span className={`px-3 py-1 rounded-full text-xs ${project.status === 'Completed' ? 'bg-green-500/20 text-green-400' : project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{project.status}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">{project.tech.map(t => <span key={t} className="px-2 py-0.5 rounded text-xs bg-sky-500/10 text-sky-300">{t}</span>)}</div>
                <div className="flex items-center gap-4 mt-4">
                  <button onClick={() => setEditing(project)} className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-400 text-sm flex items-center gap-1"><Edit3 size={14} />Edit</button>
                  <button onClick={() => setProjects(projects.filter(p => p.id !== project.id))} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm flex items-center gap-1"><Trash2 size={14} />Delete</button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{editing && (
        <EditModal title={editing.id ? 'Edit Project' : 'New Project'} onSave={handleSave} onCancel={() => setEditing(null)}>
          <div><label className="block text-sm text-gray-400 mb-2">Cover Emoji</label><div className="flex flex-wrap gap-2">{emojis.map(e => (
            <button key={e} onClick={() => setEditing({ ...editing, emoji: e })} className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center ${editing.emoji === e ? 'bg-sky-500/30 border-2 border-sky-500' : 'bg-slate-900'}`}>{e}</button>
          ))}</div></div>
          <div><label className="block text-sm text-gray-400 mb-2">Project Name</label><input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
          <div><label className="block text-sm text-gray-400 mb-2">Description</label><input type="text" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
          <div><label className="block text-sm text-gray-400 mb-2">Tech Stack (comma separated)</label><input type="text" value={editing.tech.join(', ')} onChange={e => setEditing({ ...editing, tech: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
          <div><label className="block text-sm text-gray-400 mb-2">Status</label><div className="flex gap-2">{statuses.map(s => (
            <button key={s} onClick={() => setEditing({ ...editing, status: s })} className={`px-4 py-2 rounded-lg ${editing.status === s ? 'bg-sky-500/30 border border-sky-500 text-white' : 'bg-slate-900 text-gray-400'}`}>{s}</button>
          ))}</div></div>
          <div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-sky-500" /><span className="text-white">Show on homepage</span></label></div>
        </EditModal>
      )}</AnimatePresence>
    </div>
  )
}

function TipsPanel({ tips, setTips }: { tips: Tip[]; setTips: (v: Tip[]) => void }) {
  const [editing, setEditing] = useState<Tip | null>(null)
  const emojis = ['🔗', '⚡', '🎯', '🔮', '🧩', '🚀', '💡', '🔥']
  const difficulties = ['Basic', 'Intermediate', 'Core', 'Advanced']

  const handleSave = () => {
    if (!editing) return
    const idx = tips.findIndex(t => t.id === editing.id)
    if (idx >= 0) { const updated = [...tips]; updated[idx] = editing; setTips(updated) }
    else setTips([{ ...editing, id: Date.now().toString() }, ...tips])
    setEditing(null)
  }

  const diffColor = (d: string) => d === 'Basic' ? 'bg-green-500/20 text-green-400' : d === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' : d === 'Core' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Frontend Tips</h2>
        <motion.button onClick={() => setEditing({ id: '', title: '', description: '', code: '', tags: [], difficulty: 'Basic', emoji: '🔗' })} className="px-4 py-2 rounded-xl bg-sky-500 text-white font-medium flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Plus size={18} />New Tip</motion.button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tips.map((tip, i) => (
          <motion.div key={tip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-slate-800/50 rounded-xl p-4 border border-sky-500/20 hover:border-sky-500/40 transition-all">
            <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{tip.emoji}</span><span className={`px-2 py-0.5 rounded text-xs ${diffColor(tip.difficulty)}`}>{tip.difficulty}</span></div>
            <h3 className="font-bold text-white mb-1">{tip.title}</h3>
            <p className="text-xs text-gray-400 mb-2">{tip.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">{tip.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded text-xs bg-sky-500/10 text-sky-300">{t}</span>)}</div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(tip)} className="px-2 py-1 rounded bg-sky-500/20 text-sky-400 text-xs flex items-center gap-1"><Edit3 size={12} />Edit</button>
              <button onClick={() => setTips(tips.filter(t => t.id !== tip.id))} className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs flex items-center gap-1"><Trash2 size={12} />Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{editing && (
        <EditModal title={editing.id ? 'Edit Tip' : 'New Tip'} onSave={handleSave} onCancel={() => setEditing(null)}>
          <div><label className="block text-sm text-gray-400 mb-2">Icon</label><div className="flex flex-wrap gap-2">{emojis.map(e => (
            <button key={e} onClick={() => setEditing({ ...editing, emoji: e })} className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center ${editing.emoji === e ? 'bg-sky-500/30 border-2 border-sky-500' : 'bg-slate-900'}`}>{e}</button>
          ))}</div></div>
          <div><label className="block text-sm text-gray-400 mb-2">Title</label><input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
          <div><label className="block text-sm text-gray-400 mb-2">Description</label><input type="text" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
          <div><label className="block text-sm text-gray-400 mb-2">Difficulty</label><div className="flex gap-2">{difficulties.map(d => (
            <button key={d} onClick={() => setEditing({ ...editing, difficulty: d })} className={`px-4 py-2 rounded-lg ${editing.difficulty === d ? 'bg-sky-500/30 border border-sky-500 text-white' : 'bg-slate-900 text-gray-400'}`}>{d}</button>
          ))}</div></div>
          <div><label className="block text-sm text-gray-400 mb-2">Code</label><textarea value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 resize-none h-32 font-mono text-sm" /></div>
          <div><label className="block text-sm text-gray-400 mb-2">Tags (comma separated)</label><input type="text" value={editing.tags.join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
        </EditModal>
      )}</AnimatePresence>
    </div>
  )
}

function ContactPanel({ contact, setContact }: { contact: Contact; setContact: (v: Contact) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Contact Info</h2>
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20 space-y-4">
        {[
          { label: 'Email', key: 'email', type: 'email' },
          { label: 'Phone', key: 'phone', type: 'text' },
          { label: 'Location', key: 'location', type: 'text' },
          { label: 'GitHub', key: 'github', type: 'url' },
          { label: 'LinkedIn', key: 'linkedin', type: 'url' },
        ].map(field => (
          <div key={field.key}>
            <label className="block text-sm text-gray-400 mb-2">{field.label}</label>
            <input type={field.type} value={(contact as any)[field.key]} onChange={e => setContact({ ...contact, [field.key]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Page Builder Panel - 低代码页面定制
function PageBuilderPanel({ data, saveData }: { data: any; saveData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState<'theme' | 'layout' | 'components'>('theme')
  const [theme, setTheme] = useState({
    primaryColor: '#0ea5e9',
    secondaryColor: '#38bdf8',
    backgroundColor: '#0a1929',
    textColor: '#ffffff',
    accentColor: '#7dd3fc',
  })
  const [layout, setLayout] = useState({
    heroTitle: '你好，我是文辉',
    heroSubtitle: '10年前端开发 · AI大模型应用 · 全栈工程师',
    showSkills: true,
    showProjects: true,
    showBlog: true,
    showContact: true,
    columns: 3,
  })

  // 加载已有配置
  useEffect(() => {
    const saved = localStorage.getItem('lowcode_config')
    if (saved) {
      try {
        const config = JSON.parse(saved)
        if (config.theme) setTheme(config.theme)
        if (config.layout) setLayout(config.layout)
      } catch {}
    }
  }, [])

  const handleSave = () => {
    const config = {
      theme,
      layout,
      pages: data,
      version: '1.0'
    }
    localStorage.setItem('lowcode_config', JSON.stringify(config))
    saveData(config)
    alert('页面配置已保存！')
  }

  const themePresets = [
    { name: '深海蓝', primary: '#0ea5e9', secondary: '#38bdf8', bg: '#0a1929', accent: '#7dd3fc' },
    { name: '暗夜紫', primary: '#8b5cf6', secondary: '#a78bfa', bg: '#1a1a2e', accent: '#c4b5fd' },
    { name: '森林绿', primary: '#22c55e', secondary: '#4ade80', bg: '#0f291e', accent: '#86efac' },
    { name: '极简白', primary: '#3b82f6', secondary: '#60a5fa', bg: '#ffffff', accent: '#93c5fd' },
    { name: '日落橙', primary: '#f97316', secondary: '#fb923c', bg: '#2a1810', accent: '#fdba74' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">页面定制</h2>
        <button onClick={handleSave} className="px-6 py-2 rounded-xl bg-sky-500 text-white font-medium flex items-center gap-2 hover:bg-sky-600">
          <Save size={18} /> 保存配置
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl">
        {[
          { id: 'theme', icon: '🎨', label: '主题' },
          { id: 'layout', icon: '📐', label: '布局' },
          { id: 'components', icon: '🧩', label: '组件' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-sky-500/20 text-sky-400' : 'text-gray-400 hover:text-white'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          {/* Theme Presets */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
            <h3 className="text-lg font-bold text-white mb-4">主题预设</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {themePresets.map(preset => (
                <button key={preset.name} onClick={() => setTheme({ ...theme, primaryColor: preset.primary, secondaryColor: preset.secondary, backgroundColor: preset.bg, accentColor: preset.accent })}
                  className="p-4 rounded-xl border-2 border-slate-700 hover:border-sky-500 transition-all">
                  <div className="flex gap-1 mb-3">
                    <div className="w-6 h-6 rounded" style={{ background: preset.primary }} />
                    <div className="w-6 h-6 rounded" style={{ background: preset.secondary }} />
                    <div className="w-6 h-6 rounded" style={{ background: preset.accent }} />
                  </div>
                  <span className="text-sm text-white">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
            <h3 className="text-lg font-bold text-white mb-4">自定义颜色</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'primaryColor', label: '主色', value: theme.primaryColor },
                { key: 'secondaryColor', label: '次色', value: theme.secondaryColor },
                { key: 'backgroundColor', label: '背景色', value: theme.backgroundColor },
                { key: 'textColor', label: '文字色', value: theme.textColor },
                { key: 'accentColor', label: '强调色', value: theme.accentColor },
              ].map(color => (
                <div key={color.key} className="flex items-center justify-between">
                  <span className="text-white">{color.label}</span>
                  <div className="flex items-center gap-3">
                    <input type="color" value={color.value} onChange={e => setTheme({ ...theme, [color.key]: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer" />
                    <input type="text" value={color.value} onChange={e => setTheme({ ...theme, [color.key]: e.target.value })} className="w-28 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm font-mono" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
            <h3 className="text-lg font-bold text-white mb-4">主题预览</h3>
            <div className="p-6 rounded-xl" style={{ background: theme.backgroundColor }}>
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold mb-2" style={{ color: theme.textColor }}>{layout.heroTitle}</h1>
                <p style={{ color: theme.secondaryColor }}>{layout.heroSubtitle}</p>
              </div>
              <div className="flex justify-center gap-2">
                <button className="px-4 py-2 rounded-lg text-white" style={{ background: theme.primaryColor }}>主按钮</button>
                <button className="px-4 py-2 rounded-lg border-2" style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}>次按钮</button>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm" style={{ background: `${theme.primaryColor}20`, color: theme.primaryColor }}>标签1</span>
                <span className="px-3 py-1 rounded-full text-sm" style={{ background: `${theme.secondaryColor}20`, color: theme.secondaryColor }}>标签2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
            <h3 className="text-lg font-bold text-white mb-4">Hero 区域</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">主标题</label>
                <input type="text" value={layout.heroTitle} onChange={e => setLayout({ ...layout, heroTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">副标题</label>
                <input type="text" value={layout.heroSubtitle} onChange={e => setLayout({ ...layout, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
            <h3 className="text-lg font-bold text-white mb-4">网格布局</h3>
            <div className="grid grid-cols-3 gap-4">
              {[2, 3, 4].map(col => (
                <button key={col} onClick={() => setLayout({ ...layout, columns: col })}
                  className={`p-4 rounded-xl border-2 transition-all ${layout.columns === col ? 'border-sky-500 bg-sky-500/10' : 'border-slate-700'}`}>
                  <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `repeat(${col}, 1fr)` }}>
                    {[...Array(col)].map((_, i) => <div key={i} className="h-12 rounded bg-slate-600" />)}
                  </div>
                  <span className="text-sm text-white">{col} 列布局</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Components Tab */}
      {activeTab === 'components' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
            <h3 className="text-lg font-bold text-white mb-4">显示/隐藏组件</h3>
            <div className="space-y-3">
              {[
                { key: 'showSkills', label: '技能展示', icon: '💻' },
                { key: 'showProjects', label: '项目展示', icon: '🚀' },
                { key: 'showBlog', label: '博客列表', icon: '📝' },
                { key: 'showContact', label: '联系方式', icon: '📧' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white">{item.label}</span>
                  </div>
                  <button onClick={() => setLayout({ ...layout, [item.key]: !layout[item.key as keyof typeof layout] })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${layout[item.key as keyof typeof layout] ? 'bg-sky-500' : 'bg-slate-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${layout[item.key as keyof typeof layout] ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20">
            <h3 className="text-lg font-bold text-white mb-4">重置配置</h3>
            <p className="text-gray-400 text-sm mb-4">将所有页面配置恢复为默认值</p>
            <button onClick={() => {
              localStorage.removeItem('lowcode_config')
              alert('配置已重置！')
            }} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
              重置为默认
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsPanel({ settings, setSettings }: { settings: SiteSettings; setSettings: (v: SiteSettings) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Site Settings</h2>
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20 space-y-4">
        <div><label className="block text-sm text-gray-400 mb-2">Site Name</label><input type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
        <div><label className="block text-sm text-gray-400 mb-2">Site Description</label><input type="text" value={settings.siteDescription} onChange={e => setSettings({ ...settings, siteDescription: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500" /></div>
        <div><label className="block text-sm text-gray-400 mb-2">Theme Color</label><input type="color" value={settings.themeColor} onChange={e => setSettings({ ...settings, themeColor: e.target.value })} className="w-full h-12 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer" /></div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState({ blog: defaultBlogPosts, skills: defaultSkills, projects: defaultProjects, tips: defaultTips, contact: defaultContact, settings: defaultSettings })

  // Auth check
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('admin_logged_in') === 'true'
    if (!loggedIn) {
      router.replace('/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    const saved = localStorage.getItem('admin_data')
    if (saved) {
      try { setData(JSON.parse(saved)) } catch { localStorage.setItem('admin_data', JSON.stringify(data)) }
    } else {
      localStorage.setItem('admin_data', JSON.stringify(data))
    }
  }, [])

  const saveData = (newData: typeof data) => { setData(newData); localStorage.setItem('admin_data', JSON.stringify(newData)) }
  const handleSaveAll = () => { localStorage.setItem('admin_data', JSON.stringify(data)); alert('All changes saved!') }
  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in')
    sessionStorage.removeItem('admin_user')
    router.push('/login')
  }

  const tabTitles: Record<string, string> = { dashboard: 'Dashboard', blog: 'Blog Posts', skills: 'Skills', projects: 'Projects', tips: 'Tips', contact: 'Contact', settings: 'Settings' }

  if (isAuthenticated === null) return null

  return (
    <div className="min-h-screen bg-slate-900">
      <OceanEffects />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onLogout={handleLogout} />
      <button onClick={() => setSidebarOpen(true)} className="fixed top-4 left-4 z-30 p-2 rounded-xl bg-slate-800/80 text-white md:hidden"><Menu size={24} /></button>
      <main className="md:ml-72 p-6">
        <div className="flex items-center justify-between mb-6">
          <AnimatePresence mode="wait"><motion.h1 key={activeTab} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-2xl font-bold text-white">{tabTitles[activeTab]}</motion.h1></AnimatePresence>
          <div className="flex items-center gap-3">
            <motion.button onClick={handleSaveAll} className="px-4 py-2 rounded-xl bg-sky-500 text-white font-medium flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Save size={18} />Save All</motion.button>
            <motion.button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-slate-700 text-gray-300 font-medium flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><LogOut size={18} />Logout</motion.button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><DashboardPanel data={data} /></motion.div>}
          {activeTab === 'blog' && <motion.div key="blog" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><BlogPanel blog={data.blog} setBlog={(v) => saveData({ ...data, blog: v })} /></motion.div>}
          {activeTab === 'skills' && <motion.div key="skills" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><SkillsPanel skills={data.skills} setSkills={(v) => saveData({ ...data, skills: v })} /></motion.div>}
          {activeTab === 'projects' && <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><ProjectsPanel projects={data.projects} setProjects={(v) => saveData({ ...data, projects: v })} /></motion.div>}
          {activeTab === 'tips' && <motion.div key="tips" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><TipsPanel tips={data.tips} setTips={(v) => saveData({ ...data, tips: v })} /></motion.div>}
          {activeTab === 'contact' && <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><ContactPanel contact={data.contact} setContact={(v) => saveData({ ...data, contact: v })} /></motion.div>}
          {activeTab === 'page-builder' && <motion.div key="page-builder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><PageBuilderPanel data={data} saveData={saveData} /></motion.div>}
          {activeTab === 'settings' && <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><SettingsPanel settings={data.settings} setSettings={(v) => saveData({ ...data, settings: v })} /></motion.div>}
        </AnimatePresence>
      </main>
    </div>
  )
}
