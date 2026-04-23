'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code2, Eye, Sparkles } from 'lucide-react'

interface FlipCard3DProps {
  title: string
  description?: string
  code?: string
  tags?: string[]
  emoji?: string
  frontColor?: string
  backContent?: string
}

export default function FlipCard3D({ title, description = '', code, tags = [], emoji = '🧠', frontColor, backContent }: FlipCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="perspective-1000 w-full h-64"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 正面 */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            background: 'rgba(15, 41, 65, 0.8)',
            border: `1px solid ${frontColor ? frontColor + '66' : 'rgba(56, 189, 248, 0.2)'}`,
            boxShadow: isHovered ? `0 8px 30px ${frontColor ? frontColor + '4D' : 'rgba(56, 189, 248, 0.3)'}` : '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">{emoji}</span>
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              className="p-2 rounded-lg"
              style={{ background: frontColor ? frontColor + '33' : 'rgba(56, 189, 248, 0.2)' }}
            >
              <Code2 className="w-6 h-6" style={{ color: frontColor || '#38bdf8' }} />
            </motion.div>
          </div>
          
          <h3 className="text-xl font-bold mb-2" style={{ color: '#e0f2fe' }}>
            {title}
          </h3>
          
          <p className="text-sm flex-1" style={{ color: '#94a3b8' }}>
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full"
                style={{ 
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#7dd3fc',
                  border: '1px solid rgba(56, 189, 248, 0.2)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mt-4 text-xs flex items-center gap-2" style={{ color: '#64748b' }}>
            <Eye className="w-3 h-3" />
            <span>点击查看代码</span>
          </div>
        </div>

        {/* 背面 */}
        <div
          className="absolute inset-0 rounded-2xl p-6 overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(56, 189, 248, 0.1))',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}
        >
          {/* 装饰光线 */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 opacity-10"
            style={{
              background: 'radial-gradient(circle, #38bdf8, transparent)',
              filter: 'blur(20px)'
            }}
          />
          
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: '#38bdf8' }} />
            <span className="text-sm font-semibold" style={{ color: '#e0f2fe' }}>{backContent ? '知识卡片' : '代码实现'}</span>
          </div>
          
          <div 
            className="flex-1 overflow-auto rounded-lg p-3"
            style={{ 
              background: 'rgba(10, 25, 41, 0.8)',
            }}
          >
            {backContent ? (
              <p className="text-sm whitespace-pre-wrap" style={{ color: '#cbd5e1' }}>
                {backContent}
              </p>
            ) : (
              <pre className="text-xs whitespace-pre-wrap" style={{ color: '#7dd3fc', fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
                {code || '// 点击查看完整代码'}
              </pre>
            )}
          </div>
          
          <div className="mt-4 text-xs flex items-center gap-2" style={{ color: '#64748b' }}>
            <Code2 className="w-3 h-3" />
            <span>点击返回</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
