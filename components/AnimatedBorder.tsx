'use client'

import { useEffect, useRef } from 'react'

// 流动边框组件
interface AnimatedBorderProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  speed?: number
  borderWidth?: number
  borderRadius?: string
}

export function AnimatedBorder({
  children,
  className = '',
  colors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#38bdf8'],
  speed = 3000,
  borderWidth = 2,
  borderRadius = '16px',
}: AnimatedBorderProps) {
  const gradientRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gradientRef.current) return
    gradientRef.current.style.backgroundSize = '400% 400%'
    
    let start = 0
    const gradientColors = colors.join(', ')
    
    function step() {
      start += 1
      const position = start % 100
      gradientRef.current!.style.background = 
        `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 75%, ${colors[0]} 100%)`
      gradientRef.current!.style.backgroundPosition = `${100 - position}% 0%`
      requestAnimationFrame(step)
    }
    
    // 简化动画：直接通过 JS 控制背景位置
    let startTime: number | null = null
    const duration = speed
    
    function animate(timestamp: number) {
      if (!gradientRef.current) return
      if (!startTime) startTime = timestamp
      const progress = ((timestamp - startTime) % duration) / duration
      
      gradientRef.current.style.background = `linear-gradient(90deg, ${colors.join(', ')}, ${colors[0]})`
      gradientRef.current.style.backgroundPosition = `${progress * 100}% 0%`
      gradientRef.current.style.backgroundSize = '200% 100%'
      
      requestAnimationFrame(animate)
    }
    
    requestAnimationFrame(animate)
  }, [colors, speed])

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ borderRadius }}
    >
      {/* 边框层 */}
      <div
        ref={gradientRef}
        className="absolute inset-0"
        style={{
          padding: `${borderWidth}px`,
          borderRadius,
          background: `linear-gradient(90deg, ${colors.join(', ')}, ${colors[0]})`,
          backgroundSize: '200% 100%',
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: `spin ${speed}ms linear infinite`,
        }}
      />
      
      {/* 内容层 */}
      <div
        className="relative z-10 bg-[#0a1929]"
        style={{ borderRadius }}
      >
        {children}
      </div>
      
      {/* 动画样式 */}
      <style jsx>{`
        @keyframes spin {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// 独立装饰性流动边框盒子
interface GlowBoxProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
}

export function GlowBox({
  children,
  className = '',
  colors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6'],
}: GlowBoxProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* 背景流动光效 */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, ${colors.join(', ')})`,
          backgroundSize: '300% 100%',
          animation: 'flowGradient 3s ease infinite',
          filter: 'blur(8px)',
        }}
      />
      {/* 边框线 */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(90deg, ${colors.join(', ')})`,
          backgroundSize: '300% 100%',
          animation: 'flowGradient 3s ease infinite',
          padding: '1.5px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {/* 内容 */}
      <div
        className="relative z-10 rounded-2xl bg-[#0a1929]/90 backdrop-blur-sm border border-white/5"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        {children}
      </div>
      <style jsx>{`
        @keyframes flowGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}

// 顶部横幅流动边框
export function HeroBorder() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, #38bdf8, #818cf8, #c084fc, #f472b6, #38bdf8, transparent)',
          backgroundSize: '200% 100%',
          animation: 'flowRight 3s linear infinite',
          boxShadow: '0 0 20px #38bdf8, 0 0 40px #818cf8',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, #f472b6, #c084fc, #818cf8, #38bdf8, transparent)',
          backgroundSize: '200% 100%',
          animation: 'flowLeft 4s linear infinite',
          boxShadow: '0 0 20px #f472b6, 0 0 40px #c084fc',
        }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: 'linear-gradient(180deg, transparent, #38bdf8, transparent)',
          backgroundSize: '100% 200%',
          animation: 'flowDown 3.5s ease-in-out infinite',
          boxShadow: '0 0 20px #38bdf8',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1"
        style={{
          background: 'linear-gradient(180deg, transparent, #f472b6, transparent)',
          backgroundSize: '100% 200%',
          animation: 'flowUp 4.5s ease-in-out infinite',
          boxShadow: '0 0 20px #f472b6',
        }}
      />
      <style jsx>{`
        @keyframes flowRight {
          0% { background-position: 200% 0; }
          100% { background-position: 0% 0; }
        }
        @keyframes flowLeft {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes flowDown {
          0% { background-position: 0 100%; }
          100% { background-position: 0 0; }
        }
        @keyframes flowUp {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
      `}</style>
    </div>
  )
}
