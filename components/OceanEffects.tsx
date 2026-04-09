'use client'

import { useEffect, useRef, useState } from 'react'

// 海洋生物光标
export function OceanCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', updateCursor)
    return () => window.removeEventListener('mousemove', updateCursor)
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] transition-all duration-100"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="text-4xl animate-bounce">🐠</div>
    </div>
  )
}

// Canvas 气泡效果
export function CanvasBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    interface Bubble {
      x: number
      y: number
      radius: number
      speed: number
      opacity: number
      wobble: number
      wobbleSpeed: number
    }

    const bubbles: Bubble[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 20 + 5,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      bubbles.forEach(bubble => {
        // 移动
        bubble.y -= bubble.speed
        bubble.wobble += bubble.wobbleSpeed
        
        // 左右摇摆
        const wobbleX = Math.sin(bubble.wobble) * 20
        
        // 重置到顶部
        if (bubble.y < -bubble.radius * 2) {
          bubble.y = canvas.height + bubble.radius
          bubble.x = Math.random() * canvas.width
        }

        // 绘制气泡
        ctx.beginPath()
        ctx.arc(bubble.x + wobbleX, bubble.y, bubble.radius, 0, Math.PI * 2)
        
        // 渐变效果
        const gradient = ctx.createRadialGradient(
          bubble.x + wobbleX - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          0,
          bubble.x + wobbleX,
          bubble.y,
          bubble.radius
        )
        gradient.addColorStop(0, `rgba(186, 230, 253, ${bubble.opacity * 0.8})`)
        gradient.addColorStop(0.5, `rgba(56, 189, 248, ${bubble.opacity * 0.4})`)
        gradient.addColorStop(1, `rgba(14, 165, 233, ${bubble.opacity * 0.1})`)
        
        ctx.fillStyle = gradient
        ctx.fill()
        
        // 高光
        ctx.beginPath()
        ctx.arc(
          bubble.x + wobbleX - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.2,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-[1] pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

// 漂浮海洋生物
export function FloatingMarineLife() {
  const creatures = ['🐠', '🐟', '🐡', '🦈', '🐙', '🪼', '🦑', '🐳', '🦐', '🐋', '🪸', '🦐', '🐚', '🦀', '🐌']
  
  return (
    <div className="fixed inset-0 -z-[2] pointer-events-none overflow-hidden">
      {creatures.map((creature, i) => {
        const size = Math.random() * 30 + 40 // 40-70px
        const top = Math.random() * 80 + 10 // 10-90%
        const left = Math.random() * 90 // 0-90%
        const duration = Math.random() * 10 + 10 // 10-20s
        const delay = Math.random() * 5
        
        return (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              fontSize: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          >
            {creature}
          </div>
        )
      })}
    </div>
  )
}

// 鼠标跟随鱼群
export function MouseFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }
    
    const handleMouseLeave = () => setIsVisible(false)
    
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed pointer-events-none z-[9998]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* 主光晕 */}
      <div
        className="absolute rounded-full animate-pulse"
        style={{
          width: 150,
          height: 150,
          left: -75,
          top: -75,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
        }}
      />
      {/* 小鱼 */}
      <div className="text-2xl animate-follow" style={{ animationDelay: '0s' }}>🐟</div>
      <div className="text-xl animate-follow" style={{ animationDelay: '0.2s', marginTop: -10, marginLeft: 20 }}>🐠</div>
      <div className="text-lg animate-follow" style={{ animationDelay: '0.4s', marginTop: -8, marginLeft: -15 }}>🐡</div>
    </div>
  )
}

// 海洋波浪边饰
export function OceanWaves() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-50 overflow-hidden">
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          fill="url(#waveGradient)"
          d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
        />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(14, 165, 233, 0.3)" />
            <stop offset="100%" stopColor="rgba(10, 25, 41, 0.8)" />
          </linearGradient>
        </defs>
      </svg>
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ opacity: 0.5 }}>
        <path
          fill="rgba(56, 189, 248, 0.2)"
          d="M0,40 C360,100 720,0 1080,50 C1260,75 1350,25 1440,40 L1440,100 L0,100 Z"
        />
      </svg>
    </div>
  )
}

// 全局海洋特效组件
export default function OceanEffects() {
  return (
    <>
      <CanvasBubbles />
      <FloatingMarineLife />
      <MouseFollower />
      <OceanWaves />
    </>
  )
}
