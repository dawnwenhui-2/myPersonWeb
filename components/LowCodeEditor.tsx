'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, Layout, Type, Box, Image, MousePointer2, 
  ChevronRight, ChevronDown, Plus, Trash2, GripVertical,
  Eye, EyeOff, Settings2, Undo, Redo, Save, Download, Upload
} from 'lucide-react'
import { useLowCode } from '@/lib/lowcode-context'
import { componentLibrary, themePresets } from '@/lib/lowcode-config'

interface LowCodeEditorProps {
  pageId: string
}

export default function LowCodeEditor({ pageId }: LowCodeEditorProps) {
  const {
    pages,
    currentPage,
    updatePage,
    theme,
    updateTheme,
    isPreview,
    setIsPreview,
    saveConfig,
    exportConfig,
    importConfig
  } = useLowCode()

  const [activeTab, setActiveTab] = useState<'components' | 'layout' | 'theme' | 'pages'>('components')
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importJson, setImportJson] = useState('')

  if (!currentPage) return null

  const handleAddSection = (componentId: string) => {
    const component = componentLibrary.find(c => c.id === componentId)
    if (!component) return

    const newSection = {
      id: `${componentId}-${Date.now()}`,
      type: componentId as any,
      order: currentPage.sections.length + 1,
      visible: true,
      props: { ...component.defaultProps },
      style: {}
    }

    updatePage({
      ...currentPage,
      sections: [...currentPage.sections, newSection]
    })
  }

  const handleDeleteSection = (sectionId: string) => {
    updatePage({
      ...currentPage,
      sections: currentPage.sections.filter(s => s.id !== sectionId)
    })
  }

  const handleToggleVisibility = (sectionId: string) => {
    updatePage({
      ...currentPage,
      sections: currentPage.sections.map(s => 
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      )
    })
  }

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = currentPage.sections.findIndex(s => s.id === sectionId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === currentPage.sections.length - 1) return

    const newSections = [...currentPage.sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]

    // 重新排序
    newSections.forEach((s, i) => { s.order = i + 1 })

    updatePage({ ...currentPage, sections: newSections })
  }

  const handleUpdateSectionProps = (sectionId: string, props: Record<string, any>) => {
    updatePage({
      ...currentPage,
      sections: currentPage.sections.map(s => 
        s.id === sectionId ? { ...s, props: { ...s.props, ...props } } : s
      )
    })
  }

  const handleExport = () => {
    const json = exportConfig()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lowcode-config-${currentPage.id}.json`
    a.click()
  }

  const handleImport = () => {
    try {
      importConfig(importJson)
      setShowImportModal(false)
      setImportJson('')
    } catch (error) {
      alert('导入失败：无效的 JSON 格式')
    }
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings2 size={20} className="text-sky-400" />
            低代码编辑器
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded-lg transition-colors ${
                isPreview ? 'bg-sky-500 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              title={isPreview ? '退出预览' : '预览'}
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
          {[
            { id: 'components', icon: Box, label: '组件' },
            { id: 'layout', icon: Layout, label: '布局' },
            { id: 'theme', icon: Palette, label: '主题' },
            { id: 'pages', icon: Type, label: '页面' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm transition-colors ${
                activeTab === tab.id ? 'bg-sky-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {/* Components Tab */}
          {activeTab === 'components' && (
            <motion.div
              key="components"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Component Library */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">组件库</h3>
                <div className="grid grid-cols-2 gap-2">
                  {componentLibrary.map(component => (
                    <button
                      key={component.id}
                      onClick={() => handleAddSection(component.id)}
                      className="p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-sky-500 transition-colors text-left"
                    >
                      <span className="text-2xl mb-1 block">{component.icon}</span>
                      <span className="text-sm text-white">{component.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Sections */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">当前页面组件</h3>
                <div className="space-y-2">
                  {currentPage.sections.map((section, index) => {
                    const component = componentLibrary.find(c => c.id === section.type)
                    return (
                      <div
                        key={section.id}
                        className={`p-3 bg-slate-800 rounded-lg border transition-colors ${
                          selectedSection === section.id ? 'border-sky-500' : 'border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <GripVertical size={16} className="text-gray-500 cursor-move" />
                          <span className="text-lg">{component?.icon}</span>
                          <span className="text-sm text-white flex-1">{component?.name}</span>
                          <button
                            onClick={() => handleToggleVisibility(section.id)}
                            className="text-gray-400 hover:text-white"
                          >
                            {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteSection(section.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        {/* Section Props Editor */}
                        {selectedSection === section.id && component && (
                          <div className="mt-3 pt-3 border-t border-slate-700 space-y-3">
                            {component.propsSchema.map(prop => (
                              <div key={prop.name}>
                                <label className="text-xs text-gray-400 block mb-1">{prop.label}</label>
                                {prop.type === 'string' && (
                                  <input
                                    type="text"
                                    value={section.props[prop.name] || ''}
                                    onChange={(e) => handleUpdateSectionProps(section.id, { [prop.name]: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-900 rounded text-sm text-white border border-slate-700 focus:border-sky-500 outline-none"
                                  />
                                )}
                                {prop.type === 'textarea' && (
                                  <textarea
                                    value={section.props[prop.name] || ''}
                                    onChange={(e) => handleUpdateSectionProps(section.id, { [prop.name]: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-slate-900 rounded text-sm text-white border border-slate-700 focus:border-sky-500 outline-none resize-none"
                                  />
                                )}
                                {prop.type === 'boolean' && (
                                  <button
                                    onClick={() => handleUpdateSectionProps(section.id, { [prop.name]: !section.props[prop.name] })}
                                    className={`px-3 py-1 rounded text-sm ${
                                      section.props[prop.name] ? 'bg-sky-500 text-white' : 'bg-slate-700 text-gray-400'
                                    }`}
                                  >
                                    {section.props[prop.name] ? '是' : '否'}
                                  </button>
                                )}
                                {prop.type === 'select' && (
                                  <select
                                    value={section.props[prop.name] || prop.defaultValue}
                                    onChange={(e) => handleUpdateSectionProps(section.id, { [prop.name]: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-900 rounded text-sm text-white border border-slate-700 focus:border-sky-500 outline-none"
                                  >
                                    {prop.options?.map(opt => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                )}
                                {prop.type === 'color' && (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={section.props[prop.name] || prop.defaultValue}
                                      onChange={(e) => handleUpdateSectionProps(section.id, { [prop.name]: e.target.value })}
                                      className="w-10 h-10 rounded cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-400">{section.props[prop.name]}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Select Section */}
                        <button
                          onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                          className="w-full mt-2 text-xs text-sky-400 hover:text-sky-300"
                        >
                          {selectedSection === section.id ? '收起配置' : '配置组件'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <motion.div
              key="layout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">页面布局</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">布局类型</label>
                    <select
                      value={currentPage.layout.type}
                      onChange={(e) => updatePage({
                        ...currentPage,
                        layout: { ...currentPage.layout, type: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 bg-slate-800 rounded text-sm text-white border border-slate-700"
                    >
                      <option value="single">单栏布局</option>
                      <option value="sidebar">侧边栏布局</option>
                      <option value="grid">网格布局</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentPage.layout.header}
                      onChange={(e) => updatePage({
                        ...currentPage,
                        layout: { ...currentPage.layout, header: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm text-white">显示导航栏</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentPage.layout.footer}
                      onChange={(e) => updatePage({
                        ...currentPage,
                        layout: { ...currentPage.layout, footer: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm text-white">显示页脚</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Theme Presets */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">主题预设</h3>
                <div className="grid grid-cols-2 gap-2">
                  {themePresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => updateTheme(preset.theme)}
                      className="p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-sky-500 transition-colors"
                    >
                      <div className="flex gap-1 mb-2">
                        <div className="w-4 h-4 rounded" style={{ background: preset.theme.primaryColor }} />
                        <div className="w-4 h-4 rounded" style={{ background: preset.theme.secondaryColor }} />
                        <div className="w-4 h-4 rounded" style={{ background: preset.theme.accentColor }} />
                      </div>
                      <span className="text-sm text-white">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">自定义颜色</h3>
                <div className="space-y-3">
                  {[
                    { key: 'primaryColor', label: '主色' },
                    { key: 'secondaryColor', label: '次色' },
                    { key: 'backgroundColor', label: '背景色' },
                    { key: 'textColor', label: '文字色' },
                    { key: 'accentColor', label: '强调色' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-white">{label}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme[key as keyof typeof theme]}
                          onChange={(e) => updateTheme({ [key]: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <span className="text-xs text-gray-400 font-mono">{theme[key as keyof typeof theme]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">圆角大小</h3>
                <select
                  value={theme.borderRadius}
                  onChange={(e) => updateTheme({ borderRadius: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 rounded text-sm text-white border border-slate-700"
                >
                  <option value="0px">无圆角</option>
                  <option value="4px">小圆角</option>
                  <option value="8px">中等圆角</option>
                  <option value="12px">大圆角</option>
                  <option value="16px">超大圆角</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Pages Tab */}
          {activeTab === 'pages' && (
            <motion.div
              key="pages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">页面列表</h3>
                <div className="space-y-2">
                  {pages.map(page => (
                    <div
                      key={page.id}
                      className={`p-3 bg-slate-800 rounded-lg border ${
                        page.id === currentPage.id ? 'border-sky-500' : 'border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-white font-medium">{page.name}</span>
                          <span className="text-xs text-gray-500 block">{page.path}</span>
                        </div>
                        {page.id === currentPage.id && (
                          <span className="text-xs text-sky-400">当前编辑</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Import/Export */}
              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-sm font-medium text-gray-400 mb-3">配置管理</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-sm text-white hover:bg-slate-700"
                  >
                    <Download size={16} />
                    导出配置
                  </button>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-sm text-white hover:bg-slate-700"
                  >
                    <Upload size={16} />
                    导入配置
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={saveConfig}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 rounded-lg text-white font-medium transition-colors"
        >
          <Save size={18} />
          保存配置
        </button>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="absolute inset-0 bg-slate-900/95 z-50 p-4 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">导入配置</h3>
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="粘贴 JSON 配置..."
            className="flex-1 p-4 bg-slate-800 rounded-lg text-sm text-white font-mono resize-none mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportModal(false)}
              className="flex-1 px-4 py-2 bg-slate-700 rounded-lg text-white"
            >
              取消
            </button>
            <button
              onClick={handleImport}
              className="flex-1 px-4 py-2 bg-sky-500 rounded-lg text-white"
            >
              导入
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
