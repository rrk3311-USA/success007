'use client'

import { useEffect, useRef } from 'react'

export default function ScrollTimeline({ progress, interactive = false }) {
  const containerRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    if (!interactive) return

    const handleScroll = () => {
      if (containerRef.current && timelineRef.current) {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = scrollTop / docHeight

        // Animate timeline based on scroll
        const items = timelineRef.current.children
        Array.from(items).forEach((item, index) => {
          const itemProgress = (scrollProgress - index * 0.2) * 5
          const opacity = Math.max(0, Math.min(1, itemProgress))
          const scale = 0.8 + opacity * 0.2
          const translateY = (1 - opacity) * 50

          item.style.opacity = opacity
          item.style.transform = `translateY(${translateY}px) scale(${scale})`
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [interactive])

  const timelineItems = [
    { year: '2024', event: 'Project Launch', color: 'from-purple-500 to-pink-500' },
    { year: '2025', event: 'First Milestone', color: 'from-cyan-500 to-blue-500' },
    { year: '2026', event: 'Scale Up', color: 'from-emerald-500 to-teal-500' },
    { year: '2027', event: 'Global Expansion', color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {interactive ? (
        <div ref={timelineRef} className="space-y-8">
          {timelineItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-6 transition-all duration-300"
              style={{ opacity: 0, transform: 'translateY(50px) scale(0.8)' }}
            >
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                {item.year}
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 rounded-full" />
              <div className="text-2xl font-bold text-white">{item.event}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative w-full h-64">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 rounded-full" />
          <div
            className="absolute top-0 h-1 bg-white rounded-full transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
          <div className="absolute top-4 left-0 right-0 flex justify-between">
            {timelineItems.map((item, index) => (
              <div
                key={index}
                className="text-center"
                style={{
                  opacity: progress >= index / timelineItems.length ? 1 : 0.3,
                  transform: progress >= index / timelineItems.length ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.3s',
                }}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} mx-auto mb-2 shadow-lg`} />
                <div className="text-xs text-gray-400">{item.year}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
