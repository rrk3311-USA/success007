'use client'

import { useState, useEffect, useRef } from 'react'
// NOTE: Update these imports if using this file standalone
// Original paths were relative to deploy-site/life-jet/app/extreme/
import ParticleField from '../../extreme-components/ParticleField'
import PhysicsCard from '../../extreme-components/PhysicsCard'
import ShaderBackground from '../../extreme-components/ShaderBackground'

export default function ExtremeShowcase() {
  const [activeFeature, setActiveFeature] = useState('particles')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    { id: 'particles', name: 'Particle Field', icon: '✨', description: '10k+ particles reacting to cursor' },
    { id: 'physics', name: 'Physics UI', icon: '⚡', description: 'Draggable cards with bounce' },
    { id: 'shaders', name: 'Shader Effects', icon: '🌈', description: 'WebGL glassmorphism & distortion' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div ref={containerRef} className="w-full max-w-[900px] relative">
        {/* Header */}
        <header className="relative z-50 backdrop-blur-xl bg-gradient-to-b from-slate-900/80 via-purple-900/60 to-transparent border-b border-white/10 rounded-t-2xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  EXTREME SHOWCASE
                </h1>
                <p className="text-xs text-gray-400 font-mono">Advanced web UI capabilities</p>
              </div>
            </div>
          </div>
        </header>

        {/* Constrained Container */}
        <div className="relative w-full h-[600px] bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-b-2xl overflow-hidden" style={{ contain: 'layout style paint' }}>
          {/* Particle Field Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <ParticleField mousePos={mousePos} particleCount={3000} />
          </div>

          {/* Shader Background Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
            <ShaderBackground mousePos={mousePos} />
          </div>

          {/* Main Content */}
          <main className="relative z-20 h-full flex flex-col">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col px-4 py-4">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-black mb-2">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    EXTREME
                  </span>
                </h2>
                <p className="text-sm text-gray-400">
                  Particles, physics, and shaders
                </p>
              </div>

              {/* Feature Selector */}
              <div className="flex justify-center gap-2 mb-4">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`px-3 py-2 rounded-lg backdrop-blur-xl border transition-all text-xs ${
                      activeFeature === feature.id
                        ? 'bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                        : 'bg-slate-900/40 border-white/10 hover:border-purple-400/30'
                    }`}
                  >
                    <div className="text-lg mb-0.5">{feature.icon}</div>
                    <div className="font-semibold text-white text-[10px]">{feature.name}</div>
                  </button>
                ))}
              </div>

              {/* Active Feature Display */}
              <div className="flex-1 relative min-h-0">
                {activeFeature === 'particles' && (
                  <div className="relative h-full rounded-xl overflow-hidden border border-white/10 backdrop-blur-xl bg-slate-900/40">
                    <ParticleField mousePos={mousePos} particleCount={8000} interactive />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-4 bg-slate-900/60 backdrop-blur-xl rounded-lg border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-1">8,000 Particles</h3>
                        <p className="text-gray-400 text-xs">Move your mouse to interact</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeature === 'physics' && (
                  <div className="relative h-full rounded-xl overflow-hidden border border-white/10 backdrop-blur-xl bg-slate-900/40 p-2">
                    <div className="relative w-full h-full" style={{ position: 'relative', overflow: 'hidden' }}>
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <PhysicsCard key={i} index={i} mousePos={mousePos} />
                      ))}
                    </div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center p-2 bg-slate-900/60 backdrop-blur-xl rounded-lg border border-white/10 z-10">
                      <p className="text-xs text-gray-400">Drag the cards!</p>
                    </div>
                  </div>
                )}

                {activeFeature === 'shaders' && (
                  <div className="relative h-full rounded-xl overflow-hidden border border-white/10">
                    <ShaderBackground mousePos={mousePos} fullScreen />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-2xl rounded-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                        <h3 className="text-xl font-bold text-white mb-1">WebGL Shaders</h3>
                        <p className="text-gray-200 text-xs">Glassmorphism effects</p>
                        <p className="text-[10px] text-gray-400 mt-1">Move mouse to see distortion</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="p-2 rounded-lg backdrop-blur-xl bg-slate-900/40 border border-white/10 text-center">
                  <div className="text-sm font-bold text-cyan-400 mb-0.5">3k-8k</div>
                  <div className="text-[10px] text-gray-400">Particles</div>
                </div>
                <div className="p-2 rounded-lg backdrop-blur-xl bg-slate-900/40 border border-white/10 text-center">
                  <div className="text-sm font-bold text-purple-400 mb-0.5">60 FPS</div>
                  <div className="text-[10px] text-gray-400">Target</div>
                </div>
                <div className="p-2 rounded-lg backdrop-blur-xl bg-slate-900/40 border border-white/10 text-center">
                  <div className="text-sm font-bold text-pink-400 mb-0.5">WebGL</div>
                  <div className="text-[10px] text-gray-400">GPU</div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
