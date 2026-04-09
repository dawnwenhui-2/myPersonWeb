'use client'

import { useEffect, useRef } from 'react'

interface WebGLBackgroundProps {
  color1?: string
  color2?: string
  color3?: string
}

export default function WebGLBackground({ 
  color1 = '#0ea5e9',
  color2 = '#3b82f6', 
  color3 = '#8b5cf6' 
}: WebGLBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    // 设置画布
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    // 鼠标跟踪
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Vertex Shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    // Fragment Shader - 深海发光效果
    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      
      #define PI 3.14159265359
      
      // 噪声函数
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      
      // 分形布朗运动
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
        
        // 鼠标影响
        vec2 mouse = (u_mouse * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
        float mouseInfluence = 1.0 - smoothstep(0.0, 2.0, length(p - mouse));
        
        // 时间
        float t = u_time * 0.1;
        
        // 深海漩涡效果
        vec2 q = vec2(0.0);
        q.x = fbm(p + t * 0.5);
        q.y = fbm(p + vec2(1.0) + t * 0.3);
        
        vec2 r = vec2(0.0);
        r.x = fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
        r.y = fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);
        
        float f = fbm(p + r);
        
        // 颜色渐变
        vec3 color1 = vec3(0.055, 0.098, 0.161); // #0e1929 深蓝
        vec3 color2 = vec3(0.0, 0.6, 0.9);  // 青色
        vec3 color3 = vec3(0.23, 0.51, 0.96); // 蓝色
        vec3 glowColor = vec3(0.055, 0.9, 1.0); // 发光蓝
        
        vec3 color = mix(color1, color2, clamp(f * f * 4.0, 0.0, 1.0));
        color = mix(color, color3, clamp(length(q), 0.0, 1.0));
        color = mix(color, glowColor, clamp(length(r.x), 0.0, 1.0));
        
        // 添加发光效果
        float glow = pow(f, 3.0) * mouseInfluence * 0.5;
        color += glowColor * glow;
        
        // 添加星星点
        float stars = step(0.98, hash(floor(p * 50.0 + t * 10.0)));
        color += vec3(stars) * 0.3;
        
        // 边缘暗化
        float vignette = 1.0 - length(uv - 0.5) * 0.5;
        color *= vignette;
        
        gl_FragColor = vec4(color, 0.9);
      }
    `

    // 编译 Shader
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    // 设置顶点
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse')

    // 动画循环
    const startTime = Date.now()
    
    function render() {
      const time = (Date.now() - startTime) / 1000
      
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      
      gl.useProgram(program)
      gl.enableVertexAttribArray(positionLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      
      gl.uniform1f(timeLocation, time)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.uniform2f(mouseLocation, mouseRef.current.x, canvas.height - mouseRef.current.y)
      
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      
      requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20"
      style={{ opacity: 0.7 }}
    />
  )
}
