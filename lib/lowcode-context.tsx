'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PageConfig, defaultPageConfigs, ThemeConfig } from '@/lib/lowcode-config'

interface LowCodeContextType {
  // 页面配置
  pages: PageConfig[]
  currentPage: PageConfig | null
  setCurrentPageId: (id: string) => void
  updatePage: (page: PageConfig) => void
  addPage: (page: PageConfig) => void
  deletePage: (id: string) => void
  
  // 主题
  theme: ThemeConfig
  updateTheme: (theme: Partial<ThemeConfig>) => void
  
  // 预览模式
  isPreview: boolean
  setIsPreview: (value: boolean) => void
  
  // 编辑模式
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  
  // 保存/加载
  saveConfig: () => void
  resetConfig: () => void
  exportConfig: () => string
  importConfig: (json: string) => void
}

const LowCodeContext = createContext<LowCodeContextType | undefined>(undefined)

export function LowCodeProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<PageConfig[]>(defaultPageConfigs)
  const [currentPageId, setCurrentPageId] = useState<string>('home')
  const [isPreview, setIsPreview] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // 从 localStorage 加载配置
  useEffect(() => {
    const saved = localStorage.getItem('lowcode_config')
    if (saved) {
      try {
        const config = JSON.parse(saved)
        setPages(config.pages || defaultPageConfigs)
      } catch {
        console.error('Failed to load lowcode config')
      }
    }
  }, [])

  const currentPage = pages.find(p => p.id === currentPageId) || pages[0]
  const theme = currentPage?.theme || defaultPageConfigs[0].theme

  const updatePage = (updatedPage: PageConfig) => {
    setPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p))
  }

  const addPage = (page: PageConfig) => {
    setPages(prev => [...prev, page])
  }

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id))
  }

  const updateTheme = (themeUpdate: Partial<ThemeConfig>) => {
    if (currentPage) {
      updatePage({
        ...currentPage,
        theme: { ...currentPage.theme, ...themeUpdate }
      })
    }
  }

  const saveConfig = () => {
    localStorage.setItem('lowcode_config', JSON.stringify({ pages }))
    // 触发保存提示
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lowcode-saved'))
    }
  }

  const resetConfig = () => {
    setPages(defaultPageConfigs)
    localStorage.removeItem('lowcode_config')
  }

  const exportConfig = () => {
    return JSON.stringify({ pages, version: '1.0' }, null, 2)
  }

  const importConfig = (json: string) => {
    try {
      const config = JSON.parse(json)
      if (config.pages) {
        setPages(config.pages)
        saveConfig()
      }
    } catch (error) {
      console.error('Failed to import config:', error)
      throw new Error('Invalid config format')
    }
  }

  return (
    <LowCodeContext.Provider value={{
      pages,
      currentPage,
      setCurrentPageId,
      updatePage,
      addPage,
      deletePage,
      theme,
      updateTheme,
      isPreview,
      setIsPreview,
      isEditing,
      setIsEditing,
      saveConfig,
      resetConfig,
      exportConfig,
      importConfig
    }}>
      {children}
    </LowCodeContext.Provider>
  )
}

export function useLowCode() {
  const context = useContext(LowCodeContext)
  if (!context) {
    throw new Error('useLowCode must be used within LowCodeProvider')
  }
  return context
}
