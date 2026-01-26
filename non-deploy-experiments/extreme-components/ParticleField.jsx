'use client'

import { useEffect, useRef } from 'react'

export default function ParticleField({ mousePos, particleCount = 10000, interactive = false }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2) // Limit for performance

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

    // Set canvas size
    const resize = () => {
      const { width, height } = getContainerSize()
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    const createParticles = () => {
      particlesRef.current = []
      const { width, height } = getContainerSize()
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          color: `hsl(${Math.random() * 60 + 180}, 70%, ${Math.random() * 30 + 60}%)`,
        })
      }
    }
    createParticles()

    // Animation loop
    const animate = () => {
      const { width, height } = getContainerSize()
      ctx.clearRect(0, 0, width, height)

      // Get mouse position relative to container
      let relativeMousePos = null
      if (interactive && mousePos) {
        const container = canvas.parentElement
        if (container) {
          const rect = container.getBoundingClientRect()
          relativeMousePos = {
            x: mousePos.x - rect.left,
            y: mousePos.y - rect.top
          }
        }
      }

      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1
        if (particle.y < 0 || particle.y > height) particle.vy *= -1

        // Mouse interaction (relative to container)
        if (relativeMousePos) {
          const dx = relativeMousePos.x - particle.x
          const dy = relativeMousePos.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance
            const angle = Math.atan2(dy, dx)
            particle.vx -= Math.cos(angle) * force * 0.1
            particle.vy -= Math.sin(angle) * force * 0.1
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        // Draw connections
        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx = other.x - particle.x
          const dy = other.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = (1 - distance / 100) * 0.2
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      ctx.globalAlpha = 1
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mousePos, particleCount, interactive])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        background: 'transparent',
        display: 'block',
        contain: 'layout style paint'
      }}
    />
  )
}
