'use client'

import { useEffect, useState } from 'react'

export default function DataDrivenMotion() {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    users: 0,
    growth: 0,
    active: 0,
  })

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setMetrics({
        revenue: Math.random() * 100000 + 50000,
        users: Math.random() * 10000 + 5000,
        growth: Math.random() * 20 + 10,
        active: Math.random() * 1000 + 500,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const MetricCard = ({ label, value, color, icon }) => {
    const [displayValue, setDisplayValue] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
      setIsAnimating(true)
      const startValue = displayValue
      const endValue = value
      const duration = 1000
      const startTime = performance.now()

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(startValue + (endValue - startValue) * easeOutCubic)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    }, [value])

    return (
      <div
        className="p-6 rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-white/10 relative overflow-hidden"
        style={{
          transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`text-4xl ${color}`}>{icon}</div>
            <div
              className="w-16 h-16 rounded-full border-4 border-transparent"
              style={{
                borderTopColor: color.includes('cyan') ? '#06B6D4' : color.includes('purple') ? '#8B5CF6' : color.includes('emerald') ? '#10B981' : '#F59E0B',
                transform: `rotate(${displayValue * 3.6}deg)`,
                transition: 'transform 0.1s linear',
              }}
            />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
          </div>
          <div className="text-sm text-gray-400">{label}</div>
          <div
            className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden"
          >
            <div
              className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min((displayValue / 100000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      <MetricCard
        label="Monthly Revenue"
        value={metrics.revenue}
        color="text-cyan-400"
        icon="💰"
      />
      <MetricCard
        label="Active Users"
        value={metrics.users}
        color="text-purple-400"
        icon="👥"
      />
      <MetricCard
        label="Growth Rate"
        value={metrics.growth}
        color="text-emerald-400"
        icon="📈"
      />
      <MetricCard
        label="Active Sessions"
        value={metrics.active}
        color="text-amber-400"
        icon="⚡"
      />
    </div>
  )
}
