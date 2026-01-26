'use client'

import { useEffect, useRef, useState } from 'react'

export default function SVGLogo({ animated = false, size = 100 }) {
  const svgRef = useRef(null)
  const [morphProgress, setMorphProgress] = useState(0)

  useEffect(() => {
    if (!animated) return

    let animationFrame
    let startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = (currentTime - startTime) / 2000 // 2 second cycle
      const progress = (elapsed % 1) * 2 // 0 to 2
      setMorphProgress(progress > 1 ? 2 - progress : progress)
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [animated])

  // Morphing path between different shapes
  const shapes = [
    'M 50,20 L 80,50 L 50,80 L 20,50 Z', // Diamond
    'M 50,20 Q 80,50 50,80 Q 20,50 50,20', // Leaf
    'M 30,50 Q 50,20 70,50 Q 50,80 30,50', // Heart-like
    'M 50,20 L 70,40 L 50,60 L 30,40 Z', // Square rotated
  ]

  const currentShapeIndex = Math.floor(morphProgress * (shapes.length - 1))
  const nextShapeIndex = Math.min(currentShapeIndex + 1, shapes.length - 1)
  const localProgress = (morphProgress * (shapes.length - 1)) % 1

  // Interpolate between shapes (simplified - real morphing needs more complex math)
  const getMorphedPath = () => {
    if (!animated) return shapes[0]
    // For simplicity, we'll just cycle through shapes
    return shapes[nextShapeIndex]
  }

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="transition-all duration-300"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={getMorphedPath()}
        fill="url(#logoGradient)"
        filter="url(#glow)"
        style={{
          transform: animated ? `rotate(${morphProgress * 360}deg)` : 'none',
          transformOrigin: '50% 50%',
          transition: animated ? 'none' : 'transform 0.3s',
        }}
      />
      {animated && (
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          opacity="0.5"
          style={{
            transform: `scale(${1 + Math.sin(morphProgress * Math.PI * 2) * 0.2})`,
            transformOrigin: '50% 50%',
          }}
        />
      )}
    </svg>
  )
}
