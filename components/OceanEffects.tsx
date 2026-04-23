'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// 拖拽的海洋生物
interface DraggableCreature {
  id: number
  emoji: string
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  isDragging: boolean
}

// 客户端渲染 hook
function useClientOnly() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return mounted
}

// WebGL 深海背景
export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  // 鼠标位置用 ref 而非 state，避免触发重渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const handleMouse = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: window.innerHeight - e.clientY }
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl!.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.y *= u_resolution.y / u_resolution.x;

        vec2 mouse = u_mouse / u_resolution;
        float mouseInfluence = 1.0 - smoothstep(0.0, 0.4, distance(st, mouse));

        vec3 deepBlue = vec3(0.04, 0.1, 0.16);
        vec3 midBlue = vec3(0.05, 0.13, 0.23);

        float t = u_time * 0.1;
        float f = fbm(st + vec2(t, t * 0.5));

        vec3 color = mix(deepBlue, midBlue, f);
        color += vec3(0.1, 0.3, 0.4) * mouseInfluence * 0.5;

        float stars = step(0.998, random(st * 100.0 + u_time * 0.1));
        color += vec3(0.8, 0.9, 1.0) * stars * 0.3;

        float bubble = step(0.995, random(vec2(floor(st.x * 20.0), floor(st.y * 20.0 - u_time * 2.0))));
        color += vec3(0.5, 0.8, 1.0) * bubble * 0.2;

        gl_FragColor = vec4(color, 1.0);
      }
    `

    function createShader(type: number, source: string) {
      const shader = gl!.createShader(type)!
      gl!.shaderSource(shader, source)
      gl!.compileShader(shader)
      return shader
    }

    const program = gl!.createProgram()!
    gl!.attachShader(program, createShader(gl!.VERTEX_SHADER, vertexShaderSource))
    gl!.attachShader(program, createShader(gl!.FRAGMENT_SHADER, fragmentShaderSource))
    gl!.linkProgram(program)
    gl!.useProgram(program)

    const positionBuffer = gl!.createBuffer()
    gl!.bindBuffer(gl!.ARRAY_BUFFER, positionBuffer)
    gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl!.STATIC_DRAW)

    const positionLocation = gl!.getAttribLocation(program, 'a_position')
    gl!.enableVertexAttribArray(positionLocation)
    gl!.vertexAttribPointer(positionLocation, 2, gl!.FLOAT, false, 0, 0)

    const timeLocation = gl!.getUniformLocation(program, 'u_time')!
    const resolutionLocation = gl!.getUniformLocation(program, 'u_resolution')!
    const mouseLocation = gl!.getUniformLocation(program, 'u_mouse')!

    let animationId: number
    const startTime = Date.now()

    const render = () => {
      const time = (Date.now() - startTime) / 1000
      gl!.uniform1f(timeLocation, time)
      gl!.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl!.uniform2f(mouseLocation, mousePosRef.current.x, mousePosRef.current.y)
      gl!.drawArrays(gl!.TRIANGLES, 0, 6)
      animationId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-[1] pointer-events-none"
    />
  )
}

// 可拖拽的海洋生物
export function DraggableCreatures() {
  const [mounted, setMounted] = useState(false)
  const [creatures, setCreatures] = useState<DraggableCreature[]>([
    { id: 1, emoji: '🐠', x: 10, y: 20, size: 50, speed: 1, opacity: 0.8, isDragging: false },
    { id: 2, emoji: '🐟', x: 30, y: 40, size: 40, speed: 1.2, opacity: 0.7, isDragging: false },
    { id: 3, emoji: '🐡', x: 50, y: 60, size: 45, speed: 0.8, opacity: 0.6, isDragging: false },
    { id: 4, emoji: '🦈', x: 70, y: 30, size: 60, speed: 1.5, isDragging: false, opacity: 0.5 },
    { id: 5, emoji: '🐙', x: 85, y: 50, size: 55, speed: 0.9, opacity: 0.7, isDragging: false },
    { id: 6, emoji: '🪼', x: 15, y: 70, size: 48, speed: 1.1, opacity: 0.6, isDragging: false },
    { id: 7, emoji: '🦑', x: 45, y: 15, size: 52, speed: 1.3, opacity: 0.8, isDragging: false },
    { id: 8, emoji: '🐳', x: 60, y: 80, size: 65, speed: 0.7, opacity: 0.5, isDragging: false },
  ])

  const [draggedId, setDraggedId] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 鼠标位置（用于跟随效果）
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mounted])

  // 动画效果
  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setCreatures(prev => prev.map(c => {
        if (c.isDragging || draggedId === c.id) return c

        // 轻微漂浮
        const newX = c.x + (Math.random() - 0.5) * 0.5
        const newY = c.y + (Math.random() - 0.5) * 0.5

        // 边界限制
        return {
          ...c,
          x: Math.max(0, Math.min(90, newX)),
          y: Math.max(0, Math.min(85, newY)),
        }
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [draggedId])

  const handleMouseDown = (id: number) => {
    setDraggedId(id)
    setCreatures(prev => prev.map(c =>
      c.id === id ? { ...c, isDragging: true } : c
    ))
  }

  const handleMouseUp = () => {
    if (draggedId !== null) {
      setCreatures(prev => prev.map(c =>
        c.id === draggedId ? { ...c, isDragging: false } : c
      ))
    }
    setDraggedId(null)
  }

  useEffect(() => {
    if (draggedId !== null) {
      const handleMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100
        const y = (e.clientY / window.innerHeight) * 100

        setCreatures(prev => prev.map(c =>
          c.id === draggedId ? {
            ...c,
            x: Math.max(0, Math.min(90, x)),
            y: Math.max(0, Math.min(85, y))
          } : c
        ))
      }

      const handleUp = () => {
        setCreatures(prev => prev.map(c =>
          c.id === draggedId ? { ...c, isDragging: false } : c
        ))
        setDraggedId(null)
      }

      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleUp)

      return () => {
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleUp)
      }
    }
  }, [draggedId])

  if (!mounted) return null

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10">
      {creatures.map(c => {
        // 计算与鼠标的距离
        const dx = mousePos.x - (c.x / 100 * window.innerWidth)
        const dy = mousePos.y - (c.y / 100 * window.innerHeight)
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200

        // 鼠标靠近时的反应
        const isNear = distance < maxDistance
        const pushAngle = Math.atan2(dy, dx)
        const pushStrength = (maxDistance - distance) / maxDistance * 20

        const offsetX = isNear ? Math.cos(pushAngle) * pushStrength : 0
        const offsetY = isNear ? Math.sin(pushAngle) * pushStrength : 0

        return (
          <div
            key={c.id}
            className={`absolute cursor-grab transition-transform duration-300 ${c.isDragging ? 'cursor-grabbing scale-125 z-50' : ''}`}
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              fontSize: `${c.size}px`,
              opacity: c.opacity,
              transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) ${c.isDragging ? 'scale(1.2)' : ''}`,
              animation: c.isDragging ? 'none' : `float-${c.id % 3} ${5 + c.speed * 2}s ease-in-out infinite`,
              filter: isNear ? 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.8))' : 'none',
            }}
            onMouseDown={() => handleMouseDown(c.id)}
          >
            {c.emoji}
          </div>
        )
      })}
    </div>
  )
}

// 鼠标跟随鱼群效果
export function MouseFollower() {
  const [mounted, setMounted] = useState(false)
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      // 添加到轨迹
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }]
        return newTrail.slice(-15) // 保留最近15个点
      })
    }

    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mounted])

  const fishes = ['🐠', '🐟', '🐡', '🫧']

  if (!mounted) return null
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {/* 轨迹 */}
      {trail.map((point, i) => {
        const opacity = (i / trail.length) * 0.5
        const scale = 0.5 + (i / trail.length) * 0.5
        const fish = fishes[i % fishes.length]

        return (
          <div
            key={point.id}
            className="absolute transition-all duration-300"
            style={{
              left: point.x,
              top: point.y,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale})`,
              fontSize: '24px',
            }}
          >
            {fish}
          </div>
        )
      })}

      {/* 主光晕 */}
      <div
        className="absolute rounded-full"
        style={{
          left: position.x,
          top: position.y,
          width: 200,
          height: 200,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

// Canvas 气泡
export function CanvasBubbles() {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
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
    window.addEventListener('mousemove', (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    })

    interface Bubble {
      x: number
      y: number
      radius: number
      speed: number
      opacity: number
      wobble: number
      wobbleSpeed: number
      wobbleAmount: number
    }

    const bubbles: Bubble[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 15 + 3,
      speed: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      wobbleAmount: Math.random() * 15 + 5,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach(bubble => {
        bubble.y -= bubble.speed
        bubble.wobble += bubble.wobbleSpeed

        // 鼠标排斥
        const dx = bubble.x - mousePos.current.x
        const dy = bubble.y - mousePos.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          const force = (100 - dist) / 100
          bubble.x += (dx / dist) * force * 2
          bubble.y += (dy / dist) * force * 2
        }

        if (bubble.y < -bubble.radius * 2) {
          bubble.y = canvas.height + bubble.radius
          bubble.x = Math.random() * canvas.width
        }

        const wobbleX = Math.sin(bubble.wobble) * bubble.wobbleAmount

        ctx.beginPath()
        ctx.arc(bubble.x + wobbleX, bubble.y, bubble.radius, 0, Math.PI * 2)

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
  }, [mounted])

  if (!mounted) return null
  return <canvas ref={canvasRef} className="fixed inset-0 -z-0 pointer-events-none" style={{ opacity: 0.5 }} />
}

// 全局海洋特效
export default function OceanEffects() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  return (
    <>
      <WebGLBackground />
      <DraggableCreatures />
      <CanvasBubbles />
      <MouseFollower />
    </>
  )
}
