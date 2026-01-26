'use client'

import { useState, useEffect, useCallback } from 'react'

const DATA_URL = '/goals-data.json'
const STORAGE_KEY = 'lifeOSGoals'

// Domain colors & icons for visual distinction
const DOMAIN_STYLES = {
  Health: { color: '#10b981', icon: '💚', gradient: 'from-green-400 to-emerald-600' },
  Wealth: { color: '#f59e0b', icon: '💰', gradient: 'from-yellow-400 to-orange-600' },
  Career: { color: '#3b82f6', icon: '💼', gradient: 'from-blue-400 to-indigo-600' },
  Relationships: { color: '#ec4899', icon: '💕', gradient: 'from-pink-400 to-rose-600' },
  Brand: { color: '#8b5cf6', icon: '✨', gradient: 'from-purple-400 to-violet-600' },
  Skills: { color: '#06b6d4', icon: '🎓', gradient: 'from-cyan-400 to-teal-600' },
  Lifestyle: { color: '#f97316', icon: '🌟', gradient: 'from-orange-400 to-red-600' },
}

// Generate images based on domain (using Unsplash collections)
function getGoalImage(goal) {
  const domain = goal.domain.toLowerCase()
  const imageMap = {
    health: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80',
    wealth: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&q=80',
    career: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop&q=80',
    relationships: 'https://images.unsplash.com/photo-1518568814500-bf0f8e12580e?w=800&h=600&fit=crop&q=80',
    brand: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&q=80',
    skills: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
  }
  return imageMap[domain] || imageMap.brand
}

// Load & persist (same as modern)
async function loadGoalsFromSource() {
  try {
    const res = await fetch(DATA_URL)
    if (!res.ok) throw new Error('fetch failed')
    return await res.json()
  } catch {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    return raw ? JSON.parse(raw) : []
  }
}

function persistGoals(goals) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
}

// Vision Board Card Component
function VisionCard({ goal, onToggleWeekly, onToggleExpand, isExpanded }) {
  const domainStyle = DOMAIN_STYLES[goal.domain] || DOMAIN_STYLES.Brand
  const progress = Math.min(100, (goal.metricCurrent / goal.metricTarget) * 100)
  const imageUrl = getGoalImage(goal)

  return (
    <div className="vision-card">
      <div className="vision-card-image" style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className={`vision-card-overlay bg-gradient-to-br ${domainStyle.gradient}`}>
          <div className="vision-card-badge">{domainStyle.icon} {goal.domain}</div>
        </div>
      </div>
      
      <div className="vision-card-content">
        <h3 className="vision-card-title">{goal.title}</h3>
        
        <div className="vision-card-meta">
          <span className={`vision-badge priority-${goal.priority.toLowerCase()}`}>
            {goal.priority}
          </span>
          <span className="vision-badge status">{goal.status}</span>
        </div>

        <div className="vision-progress-section">
          <div className="vision-progress-label">
            <span>{goal.metricName}</span>
            <span className="vision-progress-value">
              {goal.metricCurrent} / {goal.metricTarget}
            </span>
          </div>
          <div className="vision-progress-bar">
            <div 
              className="vision-progress-fill" 
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${domainStyle.color}, ${domainStyle.color}dd)`
              }}
            />
          </div>
        </div>

        <div className="vision-card-actions">
          <label className="vision-checkbox-label">
            <input
              type="checkbox"
              checked={!!goal.completedThisWeek}
              onChange={() => onToggleWeekly(goal.id)}
              className="vision-checkbox"
            />
            <span>{goal.nextAction}</span>
          </label>
        </div>

        <button
          className="vision-expand-btn"
          onClick={() => onToggleExpand(goal.id)}
        >
          {isExpanded ? '▼ Less' : '▶ More'}
        </button>

        {isExpanded && (
          <div className="vision-card-details">
            <p className="vision-notes">{goal.notes}</p>
            <div className="vision-tags">
              {(goal.tags || []).map(tag => (
                <span key={tag} className="vision-tag">{tag}</span>
              ))}
            </div>
            <div className="vision-date">
              🎯 Target: {new Date(goal.targetDate).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VisionBoardFull() {
  const [goals, setGoals] = useState([])
  const [filteredGoals, setFilteredGoals] = useState([])
  const [selectedDomain, setSelectedDomain] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadGoalsFromSource().then(setGoals)
  }, [])

  useEffect(() => {
    const filtered = selectedDomain === 'All' 
      ? goals 
      : goals.filter(g => g.domain === selectedDomain)
    setFilteredGoals(filtered)
  }, [goals, selectedDomain])

  const toggleWeekly = useCallback((id) => {
    const next = goals.map(g =>
      g.id === id
        ? { ...g, completedThisWeek: !g.completedThisWeek, lastUpdated: new Date().toISOString().split('T')[0] }
        : g
    )
    setGoals(next)
    persistGoals(next)
  }, [goals])

  const toggleExpand = useCallback((id) => {
    setExpandedId(prev => (prev === id ? null : id))
  }, [])

  const domains = ['All', ...Object.keys(DOMAIN_STYLES)]

  return (
    <div className="vision-board-container">
      <style jsx>{`
        .vision-board-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
          background-size: 400% 400%;
          animation: gradientFlow 20s ease infinite;
          padding: 2rem 1rem;
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .vision-header {
          max-width: 1400px;
          margin: 0 auto 3rem;
          text-align: center;
          color: white;
        }

        .vision-header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
          background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .vision-header p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin: 0;
        }

        .vision-filters {
          max-width: 1400px;
          margin: 0 auto 2rem;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .vision-filter-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 0.95rem;
          color: white;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .vision-filter-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .vision-filter-btn.active {
          background: rgba(255, 255, 255, 0.4);
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 4px 15px rgba(255,255,255,0.3);
        }

        .vision-grid {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          padding-bottom: 3rem;
        }

        .vision-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: cardFadeIn 0.6s ease-out;
        }

        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .vision-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 30px 80px rgba(0,0,0,0.4);
        }

        .vision-card-image {
          width: 100%;
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }

        .vision-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
          display: flex;
          align-items: flex-end;
          padding: 1rem;
        }

        .vision-card-badge {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .vision-card-content {
          padding: 1.5rem;
        }

        .vision-card-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
          line-height: 1.3;
        }

        .vision-card-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .vision-badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .vision-badge.priority-high {
          background: #fee2e2;
          color: #dc2626;
        }

        .vision-badge.priority-medium {
          background: #fef3c7;
          color: #d97706;
        }

        .vision-badge.priority-low {
          background: #d1fae5;
          color: #059669;
        }

        .vision-badge.status {
          background: #dbeafe;
          color: #2563eb;
        }

        .vision-progress-section {
          margin-bottom: 1rem;
        }

        .vision-progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .vision-progress-value {
          font-weight: 600;
          color: #1f2937;
        }

        .vision-progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }

        .vision-progress-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .vision-card-actions {
          margin-bottom: 0.75rem;
        }

        .vision-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #374151;
          cursor: pointer;
        }

        .vision-checkbox {
          width: 1.1rem;
          height: 1.1rem;
          accent-color: #8b5cf6;
          cursor: pointer;
        }

        .vision-expand-btn {
          font-size: 0.85rem;
          color: #8b5cf6;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem 0;
          font-weight: 600;
          transition: color 0.2s;
        }

        .vision-expand-btn:hover {
          color: #7c3aed;
        }

        .vision-card-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .vision-notes {
          font-size: 0.9rem;
          color: #4b5563;
          line-height: 1.6;
          margin: 0 0 0.75rem 0;
        }

        .vision-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }

        .vision-tag {
          padding: 0.3rem 0.7rem;
          background: #f3f4f6;
          border-radius: 9999px;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .vision-date {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .vision-empty {
          text-align: center;
          padding: 4rem 2rem;
          color: white;
        }

        .vision-empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .vision-empty h2 {
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
        }

        .vision-empty p {
          font-size: 1rem;
          opacity: 0.9;
        }
      `}</style>

      <header className="vision-header">
        <h1>Vision Board</h1>
        <p>Visualize your goals · Inspire action · Track progress</p>
      </header>

      <div className="vision-filters">
        {domains.map(domain => (
          <button
            key={domain}
            className={`vision-filter-btn ${selectedDomain === domain ? 'active' : ''}`}
            onClick={() => setSelectedDomain(domain)}
          >
            {domain === 'All' ? '🌍 All' : `${DOMAIN_STYLES[domain]?.icon || '✨'} ${domain}`}
          </button>
        ))}
      </div>

      {filteredGoals.length > 0 ? (
        <div className="vision-grid">
          {filteredGoals.map((goal, idx) => (
            <VisionCard
              key={goal.id}
              goal={goal}
              onToggleWeekly={toggleWeekly}
              onToggleExpand={toggleExpand}
              isExpanded={expandedId === goal.id}
            />
          ))}
        </div>
      ) : (
        <div className="vision-empty">
          <div className="vision-empty-icon">🎯</div>
          <h2>No goals in this category</h2>
          <p>Try selecting a different domain or add new goals</p>
        </div>
      )}
    </div>
  )
}
