'use client'

import { useState, useEffect } from 'react'
import VisionMatrix from '../../components/VisionMatrix'
import DailyOps from '../../components/DailyOps'
import QuickIntel from '../../components/QuickIntel'
import ActiveOperations from '../../components/ActiveOperations'

const DEFAULT_PHOTOS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', caption: 'DESTINATION: SUMMIT' },
  { id: '2', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop', caption: 'ASSET: ACQUIRED' },
  { id: '3', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', caption: 'BASE: ESTABLISHED' },
  { id: '4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', caption: 'MINDSET: FOCUSED' },
  { id: '5', url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop', caption: 'OBJECTIVE: FREEDOM' },
  { id: '6', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop', caption: 'MISSION: STRENGTH' },
]

const DEFAULT_TODOS = [
  { id: 1, text: 'Morning meditation—20-min', completed: true, priority: 'high' },
  { id: 2, text: 'Review weekly goals', completed: false, priority: 'high' },
  { id: 3, text: 'Gym session - strength training', completed: false, priority: 'medium' },
  { id: 4, text: 'Read 30 pages', completed: false, priority: 'low' },
  { id: 5, text: 'Ship Operation Phoenix milestone', completed: false, priority: 'high' },
]

const DEFAULT_PROJECTS = [
  {
    id: 1,
    name: 'OPERATION: TIKTOK AFFILIATE',
    progress: 25,
    milestones: [
      { id: '1a', text: 'Account setup and niche validation', completed: true },
      { id: '1b', text: 'First 10 posts live', completed: false },
      { id: '1c', text: 'Affiliate links integrated', completed: false },
    ],
  },
]

export default function VisionBoardPage() {
  const [visionPhotos, setVisionPhotos] = useState(DEFAULT_PHOTOS)
  const [todos, setTodos] = useState(DEFAULT_TODOS)
  const [projects, setProjects] = useState(DEFAULT_PROJECTS)
  const [time, setTime] = useState(null)
  const [activeTab, setActiveTab] = useState('command')

  useEffect(() => {
    setTime(new Date())
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const toggleTodo = (id) => {
    setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const toggleMilestone = (projectId, milestoneId) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p
      const updated = p.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      )
      const done = updated.filter(m => m.completed).length
      return { ...p, milestones: updated, progress: Math.round((done / updated.length) * 100) }
    }))
  }

  const tabs = [
    { id: 'command', label: 'Command', icon: 'shield-check' },
    { id: 'health', label: 'Health', icon: 'heart' },
    { id: 'income', label: '$ Income', icon: 'currency-dollar' },
    { id: 'achievements', label: 'Achievements', icon: 'trophy' },
    { id: 'skills', label: 'Skills', icon: 'brain' },
    { id: 'romance', label: 'Romance', icon: 'heart-straight' },
    { id: 'customers', label: 'Customers', icon: 'users' },
    { id: 'infographics', label: 'Infographics', icon: 'file-text' },
    { id: 'loyalty', label: 'Loyalty', icon: 'envelope-simple' },
    { id: 'terminal', label: 'Terminal', icon: 'terminal' },
    { id: 'walmart', label: 'Walmart', icon: 'shopping-cart' },
  ]

  return (
    <div className="min-h-screen text-gray-100 bg-gradient-to-br from-[#0a1628] via-[#1a2744] to-[#0f1b2d]">
      {/* Gradient bars (match localhost:3000) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      {/* Header (match localhost:3000) */}
      <header className="relative border-b border-cyan-500/20 bg-slate-900/90 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 lg:justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative flex-shrink-0 w-10 h-10 rounded bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-lg">
                <span className="ph ph-shield-check" style={{ fontSize: '1.5rem' }} aria-hidden />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold tracking-widest text-cyan-400" style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.5)' }}>
                  LIFE VISION BOARD
                </h1>
                <p className="text-[10px] md:text-xs text-emerald-500/70 tracking-[0.2em] md:tracking-[0.3em] uppercase">
                  Command Center // Private Ops
                </p>
              </div>
            </div>

            <div className="hidden lg:block flex-1 mx-8">
              <div className="relative p-3 bg-slate-900/80 rounded border border-emerald-800/50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-amber-400 font-mono tracking-widest">EYES ONLY</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-emerald-400 tracking-wider mb-0.5">OPERATION PHOENIX</div>
                    <p className="text-xs text-gray-400 italic">
                      Build the empire. Execute with precision. Leave no opportunity unexplored.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded border border-cyan-900/50">
                <span className="ph ph-sun text-amber-400 text-lg" aria-hidden />
                <span className="text-amber-400 font-mono text-xs md:text-sm">72°F</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-red-950/50 rounded border border-red-900/50">
                <span className="text-red-400 font-bold text-xs md:text-sm">B+</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded border border-emerald-900/50">
                <span className="ph ph-clock text-cyan-400 text-lg" aria-hidden />
                <span className="text-cyan-400 font-mono text-xs md:text-sm">
                  {time ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs (match localhost:3000) */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-wrap gap-1 p-1 mb-6 bg-slate-900/60 border border-slate-700/50 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-700/50 text-sky-400'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-slate-800/50'
              }`}
            >
              <span className={`ph ph-${tab.icon}`} style={{ fontSize: '1.125rem' }} aria-hidden />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'command' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Left column (8) – Vision Matrix + Active Ops (match 3000) */}
            <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
              <div className="bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm rounded-lg overflow-hidden p-4 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:-translate-y-0.5 transition-all">
                <VisionMatrix photos={visionPhotos} onPhotosChange={setVisionPhotos} />
              </div>

              <div className="bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm rounded-lg overflow-hidden p-4 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:-translate-y-0.5 transition-all">
                <ActiveOperations projects={projects} onToggleMilestone={toggleMilestone} fullWidth />
              </div>
            </div>

            {/* Right column (4) – Daily Ops + Quick Intel */}
            <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
              <div className="bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm rounded-lg overflow-hidden p-4 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:-translate-y-0.5 transition-all">
                <DailyOps todos={todos} onToggleTodo={toggleTodo} />
              </div>

              <div className="bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm rounded-lg overflow-hidden p-4">
                <QuickIntel deals={[]} projects={projects} visionPhotos={visionPhotos} />
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'command' && (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg font-medium mb-2">{tabs.find(t => t.id === activeTab)?.label} tab</p>
            <p className="text-sm">Content for this tab is available in the full Vision Board app at localhost:3000.</p>
          </div>
        )}
      </div>
    </div>
  )
}
