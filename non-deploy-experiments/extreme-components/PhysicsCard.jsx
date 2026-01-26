'use client'

import { useEffect, useRef, useState } from 'react'

export default function PhysicsCard({ index, mousePos }) {
  const cardRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const dragStartRef = useRef({ x: 0, y: 0 })
  const lastPosRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef(null)

  useEffect(() => {
    // Initial random position within container (constrained to safe area)
    const initialX = 50 + (Math.random() - 0.5) * 30
    const initialY = 50 + (Math.random() - 0.5) * 30
    // Clamp to safe bounds
    const safeX = Math.max(15, Math.min(85, initialX))
    const safeY = Math.max(15, Math.min(85, initialY))
    setPosition({ x: safeX, y: safeY })
    lastPosRef.current = { x: safeX, y: safeY }
  }, [index])

  useEffect(() => {
    if (!isDragging) {
      // Apply physics when not dragging
      const updatePhysics = () => {
        setPosition((prev) => {
          const newX = prev.x + velocity.x
          const newY = prev.y + velocity.y

          // Apply friction
          setVelocity((v) => ({
            x: v.x * 0.95,
            y: v.y * 0.95,
          }))

          // Bounce off edges (with safe margins)
          let newVelX = velocity.x
          let newVelY = velocity.y
          const margin = 10 // Safe margin from edges

          if (newX < margin) {
            newVelX = Math.abs(newVelX) * 0.8
            return { x: margin, y: newY }
          }
          if (newX > 100 - margin) {
            newVelX = -Math.abs(newVelX) * 0.8
            return { x: 100 - margin, y: newY }
          }
          if (newY < margin) {
            newVelY = Math.abs(newVelY) * 0.8
            return { x: newX, y: margin }
          }
          if (newY > 100 - margin) {
            newVelY = -Math.abs(newVelY) * 0.8
            return { x: newX, y: 100 - margin }
          }

          setVelocity({ x: newVelX, y: newVelY })
          return { x: newX, y: newY }
        })

        animationFrameRef.current = requestAnimationFrame(updatePhysics)
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isDragging, velocity])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    const rect = cardRef.current?.getBoundingClientRect()
    if (rect) {
      dragStartRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && cardRef.current) {
      const rect = cardRef.current.parentElement?.getBoundingClientRect()
      if (rect) {
        let newX = ((e.clientX - rect.left) / rect.width) * 100
        let newY = ((e.clientY - rect.top) / rect.height) * 100
        
        // Clamp to container bounds with margin
        const margin = 10
        newX = Math.max(margin, Math.min(100 - margin, newX))
        newY = Math.max(margin, Math.min(100 - margin, newY))

        // Calculate velocity
        const velX = newX - lastPosRef.current.x
        const velY = newY - lastPosRef.current.y
        setVelocity({ x: velX * 0.5, y: velY * 0.5 })

        setPosition({ x: newX, y: newY })
        lastPosRef.current = { x: newX, y: newY }
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  // Magnetic effect to mouse (only within container)
  useEffect(() => {
    if (!isDragging && mousePos && cardRef.current) {
      const container = cardRef.current.parentElement
      if (!container) return
      
      const containerRect = container.getBoundingClientRect()
      const cardRect = cardRef.current.getBoundingClientRect()
      
      // Check if mouse is within container bounds
      const mouseInContainer = 
        mousePos.x >= containerRect.left &&
        mousePos.x <= containerRect.right &&
        mousePos.y >= containerRect.top &&
        mousePos.y <= containerRect.bottom
      
      if (mouseInContainer) {
        const cardCenterX = cardRect.left + cardRect.width / 2
        const cardCenterY = cardRect.top + cardRect.height / 2

        const dx = mousePos.x - cardCenterX
        const dy = mousePos.y - cardCenterY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150 // Reduced for better containment

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const pullX = Math.cos(angle) * force * 1.5
          const pullY = Math.sin(angle) * force * 1.5

          setVelocity((v) => ({
            x: v.x + pullX * 0.08,
            y: v.y + pullY * 0.08,
          }))
        }
      }
    }
  }, [mousePos, isDragging])

  const colors = [
    'from-purple-500/30 to-pink-500/30',
    'from-cyan-500/30 to-blue-500/30',
    'from-emerald-500/30 to-teal-500/30',
    'from-amber-500/30 to-orange-500/30',
    'from-rose-500/30 to-red-500/30',
    'from-indigo-500/30 to-purple-500/30',
  ]

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      className={`absolute cursor-grab active:cursor-grabbing transition-transform duration-75 ${
        isDragging ? 'scale-110 z-50' : 'scale-100'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) ${isDragging ? 'scale(1.1)' : ''}`,
        willChange: 'transform',
      }}
    >
      <div
        className={`w-24 h-24 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-center text-3xl font-bold text-white`}
        style={{
          transform: isDragging ? 'rotate(5deg)' : 'rotate(0deg)',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          pointerEvents: 'none', // Prevent card from blocking interactions
        }}
      >
        {index}
      </div>
    </div>
  )
}
