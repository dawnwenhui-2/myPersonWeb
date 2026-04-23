'use client'

import { motion } from 'framer-motion'
import { useLowCode } from '@/lib/lowcode-context'
import { SectionConfig } from '@/lib/lowcode-config'
import OceanEffects from '@/components/OceanEffects'

// Hero Section
function HeroSection({ props, style }: { props: any; style: any }) {
  const { title, subtitle, showAvatar, avatarUrl, backgroundType, backgroundValue, height, align } = props
  
  return (
    <section 
      className="relative flex items-center justify-center overflow-hidden"
      style={{ 
        height: height || '80vh',
        background: backgroundType === 'gradient' ? backgroundValue : backgroundType === 'solid' ? backgroundValue : backgroundValue,
        ...style 
      }}
    >
      <OceanEffects />
      <motion.div 
        className="relative z-10 text-center max-w-4xl px-6"
        style={{ textAlign: align || 'center' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {showAvatar && (
          <motion.div 
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-5xl shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌊
          </motion.div>
        )}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {title || 'Hello, World'}
        </h1>
        <p className="text-xl md:text-2xl text-sky-300 max-w-2xl mx-auto">
          {subtitle || 'Welcome to my site'}
        </p>
      </motion.div>
    </section>
  )
}

// Skills Section
function SkillsSection({ props, style }: { props: any; style: any }) {
  const { layout, columns, showIcons, showProgress, animation } = props
  const skills = [
    { category: 'Frontend', icon: '💻', items: ['Vue3', 'React', 'Next.js', 'TypeScript'], color: '#0ea5e9' },
    { category: 'Backend', icon: '⚙️', items: ['Node.js', 'Python', 'Docker', 'Git'], color: '#22c55e' },
    { category: 'AI/ML', icon: '🤖', items: ['LangChain', 'RAG', 'Prompt', 'OpenAI'], color: '#a855f7' },
    { category: 'Desktop', icon: '🖥️', items: ['Electron', 'Tauri', 'WebGL', 'Canvas'], color: '#f97316' },
  ]

  return (
    <section className="py-20 px-6" style={{ background: '#0f172a', ...style }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {props.title || 'My Skills'}
        </motion.h2>
        
        <div className={`grid gap-6 ${
          columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
          columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          columns === 5 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {skills.map((skill, index) => (
            <motion.div
              key={skill.category}
              className="bg-slate-800/50 rounded-2xl p-6 border border-sky-500/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, borderColor: skill.color }}
            >
              <div className="flex items-center gap-3 mb-4">
                {showIcons && <span className="text-3xl">{skill.icon}</span>}
                <h3 className="text-lg font-bold text-white">{skill.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.items.map(item => (
                  <span 
                    key={item} 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ background: `${skill.color}20`, color: skill.color }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              {showProgress && (
                <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ background: skill.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '80%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Projects Section
function ProjectsSection({ props, style }: { props: any; style: any }) {
  const { layout, columns, showTech, showStatus } = props
  const projects = [
    { id: '1', title: 'Blog System', description: 'Full-stack blog with admin panel', tech: ['Next.js', 'LocalStorage'], status: 'Completed', emoji: '📝', featured: true },
    { id: '2', title: 'Portfolio', description: 'Deep sea themed portfolio', tech: ['Next.js', 'Framer Motion'], status: 'Completed', emoji: '🌊', featured: false },
    { id: '3', title: 'AI Resume Analyzer', description: 'RAG-based resume analysis', tech: ['Vue3', 'Python', 'LangChain'], status: 'In Progress', emoji: '🤖', featured: false },
    { id: '4', title: 'Stock Analyzer', description: 'Real-time data + AI prediction', tech: ['React', 'Node.js'], status: 'Planning', emoji: '📈', featured: false },
  ]

  const statusColors: Record<string, string> = {
    'Completed': '#22c55e',
    'In Progress': '#f59e0b',
    'Planning': '#6366f1'
  }

  return (
    <section className="py-20 px-6" style={{ background: '#0a1929', ...style }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {props.title || 'Featured Projects'}
        </motion.h2>
        
        <div className={`grid gap-6 ${
          columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
          columns === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group bg-slate-800/50 rounded-2xl overflow-hidden border border-sky-500/20 hover:border-sky-500/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-40 bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition-transform">{project.emoji}</span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{project.title}</h3>
                  {showStatus && (
                    <span 
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: `${statusColors[project.status]}20`, color: statusColors[project.status] }}
                    >
                      {project.status}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                {showTech && (
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(tech => (
                      <span key={tech} className="px-2 py-1 rounded text-xs bg-slate-700 text-sky-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Blog Section
function BlogSection({ props, style }: { props: any; style: any }) {
  const { columns, showExcerpt, showTags, showDate, postsPerPage } = props
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('blog_posts')
    if (saved) {
      const allPosts = JSON.parse(saved)
      setPosts(allPosts.filter((p: any) => p.status === 'published').slice(0, postsPerPage || 9))
    }
  }, [postsPerPage])

  if (posts.length === 0) {
    return (
      <section className="py-20 px-6" style={{ background: '#0f172a', ...style }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">暂无文章</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-6" style={{ background: '#0f172a', ...style }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {props.title || 'Latest Posts'}
        </motion.h2>
        
        <div className={`grid gap-6 ${
          columns === 1 ? 'grid-cols-1' :
          columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
          columns === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {posts.map((post, index) => (
            <motion.a
              key={post.id}
              href={`/blog?id=${post.id}`}
              className="block bg-slate-800/50 rounded-2xl overflow-hidden border border-sky-500/20 hover:border-sky-500/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-32 bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center">
                <span className="text-5xl">{post.coverImage || '📝'}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                {showExcerpt && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  {showTags && (
                    <div className="flex gap-2">
                      {post.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 rounded text-xs bg-sky-500/20 text-sky-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {showDate && (
                    <span className="text-xs text-gray-500">{post.publishedAt}</span>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection({ props, style }: { props: any; style: any }) {
  const { layout, showForm, showSocial, showLocation } = props
  const contact = {
    email: 'dawnwenhui@example.com',
    github: 'https://github.com/dawnwenhui',
    linkedin: 'https://linkedin.com/in/dawnwenhui'
  }

  return (
    <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #0a1929 0%, #0f172a 100%)', ...style }}>
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {props.title || 'Get In Touch'}
        </motion.h2>
        
        <div className={`flex flex-wrap gap-8 ${layout === 'horizontal' ? 'justify-center' : 'flex-col'}`}>
          {showSocial && (
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { icon: '📧', label: 'Email', href: `mailto:${contact.email}` },
                { icon: '💻', label: 'GitHub', href: contact.github },
                { icon: '🔗', label: 'LinkedIn', href: contact.linkedin },
              ].map(item => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  className="flex items-center gap-3 px-6 py-4 bg-slate-800/50 rounded-2xl border border-sky-500/20 hover:border-sky-500/50 transition-all"
                  whileHover={{ y: -3 }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white font-medium">{item.label}</span>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Text Section
function TextSection({ props, style }: { props: any; style: any }) {
  const { content, align, size } = props
  
  const sizeClasses = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-xl',
    xlarge: 'text-2xl'
  }

  return (
    <section className="py-12 px-6" style={style}>
      <div className={`max-w-4xl mx-auto text-${align || 'left'}`}>
        <p className={`text-gray-300 ${sizeClasses[(size as keyof typeof sizeClasses) || 'normal']}`} style={{ textAlign: align || 'left' }}>
          {content || 'Your text here...'}
        </p>
      </div>
    </section>
  )
}

// Image Section
function ImageSection({ props, style }: { props: any; style: any }) {
  const { src, alt, caption, rounded, shadow } = props
  
  return (
    <section className="py-12 px-6" style={style}>
      <div className="max-w-4xl mx-auto">
        <figure className={`${rounded ? 'rounded-2xl' : ''} ${shadow ? 'shadow-xl' : ''} overflow-hidden`}>
          {src ? (
            <img src={src} alt={alt} className="w-full" />
          ) : (
            <div className="w-full h-64 bg-slate-800 flex items-center justify-center text-gray-500">
              🖼️ Add an image URL
            </div>
          )}
          {caption && (
            <figcaption className="p-4 bg-slate-800 text-gray-400 text-sm text-center">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  )
}

// Button Section
function ButtonSection({ props, style }: { props: any; style: any }) {
  const { text, variant, size, href } = props
  
  const variantClasses = {
    primary: 'bg-sky-500 hover:bg-sky-600 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    outline: 'border-2 border-sky-500 text-sky-400 hover:bg-sky-500/10',
    ghost: 'text-sky-400 hover:text-sky-300'
  }
  
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }

  return (
    <section className="py-12 px-6" style={style}>
      <div className="max-w-4xl mx-auto">
        <a
          href={href || '#'}
          className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all ${variantClasses[(variant as keyof typeof variantClasses) || 'primary']} ${sizeClasses[(size as keyof typeof sizeClasses) || 'medium']}`}
        >
          {text || 'Click Me'}
        </a>
      </div>
    </section>
  )
}

// Divider Section
function DividerSection({ props, style }: { props: any; style: any }) {
  const { style: dividerStyle, spacing } = props
  
  const spacingClasses = {
    small: 'my-4',
    medium: 'my-8',
    large: 'my-12'
  }

  const lineStyles: Record<string, string> = {
    solid: 'border-t border-slate-700',
    dashed: 'border-t-2 border-dashed border-slate-600',
    dotted: 'border-t-2 border-dotted border-slate-600',
    gradient: 'h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent'
  }

  return (
    <section className={spacingClasses[(spacing as keyof typeof spacingClasses) || 'medium']} style={style}>
      <div className={lineStyles[(dividerStyle as keyof typeof lineStyles) || 'solid']} />
    </section>
  )
}

// Spacer Section
function SpacerSection({ props, style }: { props: any; style: any }) {
  return (
    <div style={{ height: props.height || '40px' }} />
  )
}

// Main Renderer
export default function DynamicPageRenderer() {
  const { currentPage, theme, isEditing } = useLowCode()

  if (!currentPage) return null

  // 排序可见的 sections
  const sortedSections = [...currentPage.sections]
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)

  return (
    <div className={isEditing ? 'mr-96' : ''} style={{ 
      '--theme-primary': theme.primaryColor,
      '--theme-secondary': theme.secondaryColor,
      '--theme-background': theme.backgroundColor,
      '--theme-text': theme.textColor,
      '--theme-accent': theme.accentColor,
      '--theme-radius': theme.borderRadius,
      fontFamily: theme.fontFamily,
    } as any}>
      {currentPage.layout.header !== false && <DefaultHeader />}
      
      {sortedSections.map(section => {
        const SectionComponent = sectionComponents[section.type]
        if (!SectionComponent) return null
        
        return (
          <SectionComponent 
            key={section.id} 
            props={{ ...section.props, ...section.props }} 
            style={section.style} 
          />
        )
      })}
      
      {currentPage.layout.footer !== false && <DefaultFooter />}
    </div>
  )
}

// Section component map
const sectionComponents: Record<string, any> = {
  hero: HeroSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  blog: BlogSection,
  contact: ContactSection,
  text: TextSection,
  image: ImageSection,
  button: ButtonSection,
  divider: DividerSection,
  spacer: SpacerSection,
  custom: ({ props }: any) => (
    <section className="py-20 px-6 bg-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white">{props.title}</h2>
      </div>
    </section>
  )
}

// Default Header
function DefaultHeader() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-sky-500/20">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 36 36">
              <path d="M4,20 Q10,12 18,18 Q26,24 32,16" stroke="#38bdf8" strokeWidth="3" fill="none"/>
              <path d="M4,26 Q12,18 18,24 Q28,32 32,24" stroke="#0ea5e9" strokeWidth="2.5" fill="none"/>
            </svg>
            <span className="font-bold text-white">dawnwenhui</span>
          </a>
          <div className="flex items-center gap-6">
            {['Home', 'Blog', 'Interview', 'Resume', 'AI Agent'].map(item => (
              <a 
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

// Default Footer
function DefaultFooter() {
  return (
    <footer className="py-8 px-6 bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
        <p>© 2026 dawnwenhui. All rights reserved. 🌊</p>
      </div>
    </footer>
  )
}

// Import useState and useEffect for blog section
import { useState, useEffect } from 'react'
