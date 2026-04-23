'use client'

import { useEffect, useRef } from 'react'

export default function HanddrawnLines() {
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

    // 手绘线条类
    class HanddrawnLine {
      points: { x: number; y: number; offset: number }[]
      amplitude: number
      frequency: number
      speed: number
      phase: number
      y: number
      color: string
      opacity: number

      constructor(y: number) {
        this.points = []
        this.amplitude = 20 + Math.random() * 30
        this.frequency = 0.01 + Math.random() * 0.02
        this.speed = 0.02 + Math.random() * 0.03
        this.phase = Math.random() * Math.PI * 2
        this.y = y
        this.color = ['#6366f1', '#8b5cf6', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 4)]
        this.opacity = 0.1 + Math.random() * 0.15

        // 生成手绘风格的点
        const numPoints = Math.floor((canvas?.width || 800) / 20)
        for (let i = 0; i <= numPoints; i++) {
          this.points.push({
            x: i * 20,
            y: 0,
            offset: Math.random() * 5
          })
        }
      }

      update() {
        this.phase += this.speed
      }

      draw() {
        ctx!.beginPath()
        
        for (let i = 0; i < this.points.length; i++) {
          const x = this.points[i].x
          const wobble = Math.sin(this.phase + i * this.frequency) * this.amplitude
          const y = this.y + wobble + this.points[i].offset * Math.sin(this.phase * 0.5)
          
          if (i === 0) {
            ctx!.moveTo(x, y)
          } else {
            ctx!.lineTo(x, y)
          }
        }

        ctx!.strokeStyle = this.color
        ctx!.lineWidth = 1.5
        ctx!.globalAlpha = this.opacity
        ctx!.stroke()
        ctx!.globalAlpha = 1
      }
    }

    // 创建手绘线条
    const lines: HanddrawnLine[] = []
    for (let i = 0; i < 8; i++) {
      lines.push(new HanddrawnLine(100 + i * 120))
    }

    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height)
      lines.forEach(line => {
        line.update()
        line.draw()
      })
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
