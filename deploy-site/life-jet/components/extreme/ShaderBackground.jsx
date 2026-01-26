'use client'

import { useEffect, useRef } from 'react'

export default function ShaderBackground({ mousePos, fullScreen = false }) {
  const canvasRef = useRef(null)
  const glRef = useRef(null)
  const programRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS effects')
      return
    }

    glRef.current = gl

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    // Fragment shader with glassmorphism and distortion
    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;
      
      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        return a + b * cos(6.28318 * (c * t + d));
      }
      
      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
        vec2 mouse = (u_mouse * 2.0 - u_resolution) / u_resolution.y;
        
        float dist = length(uv - mouse * 0.5);
        float wave = sin(dist * 10.0 - u_time * 2.0) * 0.5 + 0.5;
        
        // Glassmorphism effect
        vec3 color = palette(wave + u_time * 0.1);
        float alpha = 0.3 + wave * 0.2;
        
        // Refraction-like distortion
        vec2 distorted = uv + vec2(sin(uv.y * 10.0 + u_time) * 0.02, cos(uv.x * 10.0 + u_time) * 0.02);
        float pattern = sin(distorted.x * 20.0) * sin(distorted.y * 20.0);
        
        color += vec3(pattern * 0.1);
        
        gl_FragColor = vec4(color, alpha);
      }
    `

    const createShader = (type, source) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return
    }

    programRef.current = program

    // Setup geometry
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [-1, -1, 1, -1, -1, 1, 1, 1]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Get container dimensions
    const getContainerSize = () => {
      const container = canvas.parentElement
      if (container) {
        return {
          width: container.clientWidth || 900,
          height: container.clientHeight || 600
        }
      }
      return { width: 900, height: 600 }
    }

    // Resize handler
    const resize = () => {
      const { width, height } = getContainerSize()
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    // Animation loop
    let time = 0
    const animate = () => {
      time += 0.016 // ~60fps

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      // Get mouse position relative to container
      let relativeMouseX = 0
      let relativeMouseY = 0
      if (mousePos) {
        const container = canvas.parentElement
        if (container) {
          const rect = container.getBoundingClientRect()
          relativeMouseX = mousePos.x - rect.left
          relativeMouseY = mousePos.y - rect.top
        } else {
          relativeMouseX = mousePos.x
          relativeMouseY = mousePos.y
        }
      }

      // Set uniforms
      const timeLocation = gl.getUniformLocation(program, 'u_time')
      gl.uniform1f(timeLocation, time)

      const mouseLocation = gl.getUniformLocation(program, 'u_mouse')
      gl.uniform2f(mouseLocation, relativeMouseX, relativeMouseY)

      const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mousePos])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${fullScreen ? '' : 'rounded-2xl'}`}
      style={{ 
        background: 'transparent',
        display: 'block',
        contain: 'layout style paint'
      }}
    />
  )
}
