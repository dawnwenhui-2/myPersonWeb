// 全站低代码配置系统
// 定义页面布局、组件、主题等可配置项

export interface PageConfig {
  id: string
  name: string
  path: string
  layout: LayoutConfig
  sections: SectionConfig[]
  theme: ThemeConfig
}

export interface LayoutConfig {
  type: 'single' | 'sidebar' | 'grid' | 'custom'
  sidebar?: {
    position: 'left' | 'right'
    width: string
    components: string[]
  }
  header?: boolean
  footer?: boolean
}

export interface SectionConfig {
  id: string
  type: 'hero' | 'skills' | 'projects' | 'blog' | 'contact' | 'custom'
  order: number
  visible: boolean
  props: Record<string, any>
  style: StyleConfig
}

export interface StyleConfig {
  background?: string
  padding?: string
  margin?: string
  borderRadius?: string
  maxWidth?: string
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  borderRadius: string
}

export interface ComponentLibrary {
  id: string
  name: string
  icon: string
  category: 'layout' | 'content' | 'media' | 'interactive'
  defaultProps: Record<string, any>
  propsSchema: PropSchema[]
}

export interface PropSchema {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'textarea' | 'array'
  label: string
  defaultValue: any
  options?: string[]
  required?: boolean
}

// 组件库定义
export const componentLibrary: ComponentLibrary[] = [
  // 布局组件
  {
    id: 'hero',
    name: 'Hero 区域',
    icon: '🎯',
    category: 'layout',
    defaultProps: {
      title: 'Hello, World',
      subtitle: 'Welcome to my site',
      showAvatar: true,
      avatarUrl: '',
      backgroundType: 'gradient',
      backgroundValue: 'linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%)',
      height: '80vh',
      align: 'center'
    },
    propsSchema: [
      { name: 'title', type: 'string', label: '主标题', defaultValue: 'Hello, World' },
      { name: 'subtitle', type: 'string', label: '副标题', defaultValue: 'Welcome to my site' },
      { name: 'showAvatar', type: 'boolean', label: '显示头像', defaultValue: true },
      { name: 'backgroundType', type: 'select', label: '背景类型', defaultValue: 'gradient', options: ['gradient', 'image', 'video', 'solid'] },
      { name: 'backgroundValue', type: 'string', label: '背景值', defaultValue: 'linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%)' },
      { name: 'height', type: 'select', label: '高度', defaultValue: '80vh', options: ['60vh', '80vh', '100vh', 'auto'] },
      { name: 'align', type: 'select', label: '对齐方式', defaultValue: 'center', options: ['left', 'center', 'right'] }
    ]
  },
  {
    id: 'skills',
    name: '技能展示',
    icon: '💻',
    category: 'content',
    defaultProps: {
      title: 'My Skills',
      layout: 'grid',
      columns: 4,
      showIcons: true,
      showProgress: true,
      animation: 'flip'
    },
    propsSchema: [
      { name: 'title', type: 'string', label: '标题', defaultValue: 'My Skills' },
      { name: 'layout', type: 'select', label: '布局', defaultValue: 'grid', options: ['grid', 'list', 'cards', 'timeline'] },
      { name: 'columns', type: 'select', label: '列数', defaultValue: '4', options: ['2', '3', '4', '5'] },
      { name: 'showIcons', type: 'boolean', label: '显示图标', defaultValue: true },
      { name: 'showProgress', type: 'boolean', label: '显示进度条', defaultValue: true },
      { name: 'animation', type: 'select', label: '动画效果', defaultValue: 'flip', options: ['none', 'flip', 'fade', 'slide', 'zoom'] }
    ]
  },
  {
    id: 'projects',
    name: '项目展示',
    icon: '🚀',
    category: 'content',
    defaultProps: {
      title: 'Featured Projects',
      layout: 'grid',
      columns: 3,
      showTech: true,
      showStatus: true,
      filterable: true
    },
    propsSchema: [
      { name: 'title', type: 'string', label: '标题', defaultValue: 'Featured Projects' },
      { name: 'layout', type: 'select', label: '布局', defaultValue: 'grid', options: ['grid', 'list', 'carousel', 'masonry'] },
      { name: 'columns', type: 'select', label: '列数', defaultValue: '3', options: ['2', '3', '4'] },
      { name: 'showTech', type: 'boolean', label: '显示技术栈', defaultValue: true },
      { name: 'showStatus', type: 'boolean', label: '显示状态', defaultValue: true },
      { name: 'filterable', type: 'boolean', label: '可筛选', defaultValue: true }
    ]
  },
  {
    id: 'blog',
    name: '博客列表',
    icon: '📝',
    category: 'content',
    defaultProps: {
      title: 'Latest Posts',
      layout: 'cards',
      columns: 3,
      showExcerpt: true,
      showTags: true,
      showDate: true,
      pagination: true,
      postsPerPage: 9
    },
    propsSchema: [
      { name: 'title', type: 'string', label: '标题', defaultValue: 'Latest Posts' },
      { name: 'layout', type: 'select', label: '布局', defaultValue: 'cards', options: ['cards', 'list', 'compact', 'timeline'] },
      { name: 'columns', type: 'select', label: '列数', defaultValue: '3', options: ['1', '2', '3', '4'] },
      { name: 'showExcerpt', type: 'boolean', label: '显示摘要', defaultValue: true },
      { name: 'showTags', type: 'boolean', label: '显示标签', defaultValue: true },
      { name: 'showDate', type: 'boolean', label: '显示日期', defaultValue: true },
      { name: 'pagination', type: 'boolean', label: '分页', defaultValue: true },
      { name: 'postsPerPage', type: 'select', label: '每页文章数', defaultValue: '9', options: ['6', '9', '12', '15'] }
    ]
  },
  {
    id: 'contact',
    name: '联系方式',
    icon: '📧',
    category: 'content',
    defaultProps: {
      title: 'Get In Touch',
      layout: 'horizontal',
      showForm: true,
      showSocial: true,
      showLocation: true
    },
    propsSchema: [
      { name: 'title', type: 'string', label: '标题', defaultValue: 'Get In Touch' },
      { name: 'layout', type: 'select', label: '布局', defaultValue: 'horizontal', options: ['horizontal', 'vertical', 'split'] },
      { name: 'showForm', type: 'boolean', label: '显示表单', defaultValue: true },
      { name: 'showSocial', type: 'boolean', label: '显示社交链接', defaultValue: true },
      { name: 'showLocation', type: 'boolean', label: '显示位置', defaultValue: true }
    ]
  },
  {
    id: 'text',
    name: '文本块',
    icon: '📄',
    category: 'content',
    defaultProps: {
      content: 'Your text here...',
      align: 'left',
      size: 'normal'
    },
    propsSchema: [
      { name: 'content', type: 'textarea', label: '内容', defaultValue: 'Your text here...' },
      { name: 'align', type: 'select', label: '对齐', defaultValue: 'left', options: ['left', 'center', 'right', 'justify'] },
      { name: 'size', type: 'select', label: '字号', defaultValue: 'normal', options: ['small', 'normal', 'large', 'xlarge'] }
    ]
  },
  {
    id: 'image',
    name: '图片',
    icon: '🖼️',
    category: 'media',
    defaultProps: {
      src: '',
      alt: '',
      caption: '',
      rounded: true,
      shadow: true
    },
    propsSchema: [
      { name: 'src', type: 'string', label: '图片地址', defaultValue: '' },
      { name: 'alt', type: 'string', label: '替代文本', defaultValue: '' },
      { name: 'caption', type: 'string', label: '图片说明', defaultValue: '' },
      { name: 'rounded', type: 'boolean', label: '圆角', defaultValue: true },
      { name: 'shadow', type: 'boolean', label: '阴影', defaultValue: true }
    ]
  },
  {
    id: 'button',
    name: '按钮',
    icon: '🔘',
    category: 'interactive',
    defaultProps: {
      text: 'Click Me',
      variant: 'primary',
      size: 'medium',
      href: ''
    },
    propsSchema: [
      { name: 'text', type: 'string', label: '文本', defaultValue: 'Click Me' },
      { name: 'variant', type: 'select', label: '样式', defaultValue: 'primary', options: ['primary', 'secondary', 'outline', 'ghost'] },
      { name: 'size', type: 'select', label: '大小', defaultValue: 'medium', options: ['small', 'medium', 'large'] },
      { name: 'href', type: 'string', label: '链接', defaultValue: '' }
    ]
  },
  {
    id: 'divider',
    name: '分割线',
    icon: '➖',
    category: 'layout',
    defaultProps: {
      style: 'solid',
      spacing: 'medium'
    },
    propsSchema: [
      { name: 'style', type: 'select', label: '样式', defaultValue: 'solid', options: ['solid', 'dashed', 'dotted', 'gradient'] },
      { name: 'spacing', type: 'select', label: '间距', defaultValue: 'medium', options: ['small', 'medium', 'large'] }
    ]
  },
  {
    id: 'spacer',
    name: '空白间距',
    icon: '↕️',
    category: 'layout',
    defaultProps: {
      height: '40px'
    },
    propsSchema: [
      { name: 'height', type: 'select', label: '高度', defaultValue: '40px', options: ['20px', '40px', '60px', '80px', '100px'] }
    ]
  }
]

// 默认页面配置
export const defaultPageConfigs: PageConfig[] = [
  {
    id: 'home',
    name: '首页',
    path: '/',
    layout: { type: 'single', header: true, footer: true },
    sections: [
      { id: 'hero', type: 'hero', order: 1, visible: true, props: {}, style: {} },
      { id: 'skills', type: 'skills', order: 2, visible: true, props: {}, style: {} },
      { id: 'projects', type: 'projects', order: 3, visible: true, props: {}, style: {} },
      { id: 'blog', type: 'blog', order: 4, visible: true, props: {}, style: {} },
      { id: 'contact', type: 'contact', order: 5, visible: true, props: {}, style: {} }
    ],
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#38bdf8',
      backgroundColor: '#0a1929',
      textColor: '#ffffff',
      accentColor: '#7dd3fc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '12px'
    }
  },
  {
    id: 'blog',
    name: '博客页',
    path: '/blog',
    layout: { type: 'single', header: true, footer: true },
    sections: [
      { id: 'blog-header', type: 'custom', order: 1, visible: true, props: { title: 'Blog' }, style: {} },
      { id: 'blog-list', type: 'blog', order: 2, visible: true, props: { layout: 'cards' }, style: {} }
    ],
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#38bdf8',
      backgroundColor: '#0a1929',
      textColor: '#ffffff',
      accentColor: '#7dd3fc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '12px'
    }
  }
]

// 主题预设
export const themePresets = [
  {
    name: '深海蓝',
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#38bdf8',
      backgroundColor: '#0a1929',
      textColor: '#ffffff',
      accentColor: '#7dd3fc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '12px'
    }
  },
  {
    name: '暗夜紫',
    theme: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#a78bfa',
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff',
      accentColor: '#c4b5fd',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '12px'
    }
  },
  {
    name: '森林绿',
    theme: {
      primaryColor: '#22c55e',
      secondaryColor: '#4ade80',
      backgroundColor: '#0f291e',
      textColor: '#ffffff',
      accentColor: '#86efac',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '12px'
    }
  },
  {
    name: '极简白',
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#60a5fa',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#93c5fd',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '8px'
    }
  },
  {
    name: '日落橙',
    theme: {
      primaryColor: '#f97316',
      secondaryColor: '#fb923c',
      backgroundColor: '#2a1810',
      textColor: '#ffffff',
      accentColor: '#fdba74',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '16px'
    }
  }
]
