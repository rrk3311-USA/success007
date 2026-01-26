'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Constants (data model alignment) ───────────────────────────────────────
const DOMAINS = ['All', 'Health', 'Wealth', 'Career', 'Relationships', 'Brand', 'Skills', 'Lifestyle']
const STATUSES = ['All', 'In Progress', 'Planning', 'Completed']
const PRIORITIES = ['All', 'High', 'Medium', 'Low']

const DATA_URL = '/goals-data.json'
const STORAGE_KEY = 'lifeOSGoals'

// ─── Data layer: load & persist ─────────────────────────────────────────────
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

// ─── KPIs (derived from goals) ──────────────────────────────────────────────
function calculateKPIs(goals) {
  const active = goals.filter(g => g.status === 'In Progress').length
  const onTrack = goals.filter(g => {
    if (g.status !== 'In Progress') return false
    const progress = (g.metricCurrent / g.metricTarget) * 100
    const daysLeft = (new Date(g.targetDate) - new Date()) / (1000 * 60 * 60 * 24)
    const daysTotal = (new Date(g.targetDate) - new Date((g.lastUpdated || '') + 'T00:00:00')) / (1000 * 60 * 60 * 24)
    const expected = daysTotal > 0 ? ((daysTotal - daysLeft) / daysTotal) * 100 : 0
    return progress >= expected * 0.9
  }).length
  const weekly = goals.filter(g => g.completedThisWeek).length
  return {
    active,
    onTrack: active > 0 ? Math.round((onTrack / active) * 100) : 0,
    weekly,
  }
}

// ─── Filter logic ───────────────────────────────────────────────────────────
function applyFilters(goals, { domain, status, priority, search }) {
  let out = [...goals]
  if (domain !== 'All') out = out.filter(g => g.domain === domain)
  if (status !== 'All') out = out.filter(g => g.status === status)
  if (priority !== 'All') out = out.filter(g => g.priority === priority)
  if (search.trim()) {
    const q = search.toLowerCase()
    out = out.filter(g =>
      g.title.toLowerCase().includes(q) ||
      (g.tags || []).some(t => t.toLowerCase().includes(q)) ||
      (g.notes || '').toLowerCase().includes(q)
    )
  }
  return out
}

// ─── UI: Goal card ──────────────────────────────────────────────────────────
function GoalCard({ goal, isExpanded, onToggleExpand, onToggleWeekly }) {
  const progress = Math.min(100, (goal.metricCurrent / goal.metricTarget) * 100)
  const priorityClass = goal.priority === 'High' ? 'badge-high' : goal.priority === 'Medium' ? 'badge-medium' : 'badge-low'

  return (
    <article className="goal-card">
      <div className="goal-card-header">
        <h3 className="goal-title">{goal.title}</h3>
        <span className={`badge ${priorityClass}`}>{goal.priority}</span>
      </div>
      <div className="goal-badges">
        <span className="badge badge-status">{goal.status}</span>
        <span className="badge badge-domain">{goal.domain}</span>
      </div>
      <div className="goal-metric">
        <span className="metric-label">{goal.metricName}</span>
        <span className="metric-value">{goal.metricCurrent} / {goal.metricTarget}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="goal-target">🎯 Target: {new Date(goal.targetDate).toLocaleDateString()}</div>
      <label className="goal-next-action">
        <input
          type="checkbox"
          checked={!!goal.completedThisWeek}
          onChange={() => onToggleWeekly(goal.id)}
          className="goal-checkbox"
        />
        <span>{goal.nextAction}</span>
      </label>
      <button
        type="button"
        className="goal-expand-btn"
        onClick={() => onToggleExpand(goal.id)}
      >
        {isExpanded ? '▼ Show less' : '▶ Show more'}
      </button>
      {isExpanded && (
        <div className="goal-detail">
          <p><strong>Notes:</strong> {goal.notes}</p>
          <div className="goal-tags">
            {(goal.tags || []).map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <div className="goal-updated">Last updated: {goal.lastUpdated}</div>
        </div>
      )}
    </article>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function ModernDashboard() {
  const [goals, setGoals] = useState([])
  const [filteredGoals, setFilteredGoals] = useState([])
  const [filters, setFilters] = useState({
    domain: 'All',
    status: 'All',
    priority: 'All',
    search: '',
  })
  const [expandedId, setExpandedId] = useState(null)
  const [mounted, setMounted] = useState(false)

  // Load once on mount
  useEffect(() => {
    setMounted(true)
    loadGoalsFromSource().then(setGoals)
  }, [])

  // Recompute filtered list when goals or filters change
  useEffect(() => {
    setFilteredGoals(applyFilters(goals, filters))
  }, [goals, filters])

  const updateFilter = useCallback((key, value) => {
    setFilters(f => ({ ...f, [key]: value }))
  }, [])

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

  const kpis = calculateKPIs(goals)

  return (
    <div className="modern-dashboard">
      <style jsx>{`
        .modern-dashboard {
          min-height: 100vh;
          background: linear-gradient(180deg, #a78bfa 0%, #c084fc 50%, #e879f9 100%);
          position: relative;
        }
        .modern-dashboard::before {
          content: '';
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255,255,255,.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(255,255,255,.08) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .dashboard-inner { position: relative; z-index: 1; }

        .site-header {
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,.15);
        }
        .site-title { font-size: 1.75rem; font-weight: 700; color: #fff; margin: 0 0 .25rem 0; }
        .site-subtitle { font-size: .875rem; color: rgba(255,255,255,.8); margin: 0; }
        .add-goal-btn {
          padding: .6rem 1.25rem;
          border-radius: .5rem;
          font-weight: 600;
          color: #fff;
          background: #c084fc;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(192,132,252,.35);
          transition: transform .2s, box-shadow .2s;
        }
        .add-goal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(192,132,252,.45);
        }

        .kpi-block { margin-bottom: 1.5rem; color: #fff; }
        .kpi-block h4 { font-size: 1rem; font-weight: 600; margin: 0 0 .25rem 0; }
        .kpi-block .kpi-val { font-size: 1.5rem; font-weight: 700; }
        .kpi-block .kpi-desc { font-size: .8rem; opacity: .85; margin-bottom: .75rem; }

        .domain-row { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .domain-btn {
          padding: .5rem 1rem;
          border-radius: .5rem;
          font-weight: 600;
          font-size: .875rem;
          color: #fff;
          background: rgba(255,255,255,.15);
          border: 1px solid rgba(255,255,255,.25);
          cursor: pointer;
          transition: background .2s;
        }
        .domain-btn:hover { background: rgba(255,255,255,.25); }
        .domain-btn.active { background: rgba(255,255,255,.3); }

        .filter-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          background: rgba(255,255,255,.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 1rem;
          box-shadow: 0 4px 16px rgba(0,0,0,.08);
        }
        .filter-row label { display: block; font-size: .8rem; font-weight: 600; color: #fff; margin-bottom: .35rem; }
        .filter-row input,
        .filter-row select {
          width: 100%;
          padding: .5rem .75rem;
          border-radius: .5rem;
          border: 1px solid rgba(255,255,255,.3);
          background: rgba(255,255,255,.2);
          color: #fff;
          font-size: .9rem;
        }
        .filter-row input::placeholder { color: rgba(255,255,255,.6); }
        .filter-row input:focus,
        .filter-row select:focus {
          outline: none;
          border-color: rgba(255,255,255,.5);
          box-shadow: 0 0 0 3px rgba(255,255,255,.15);
        }
        .filter-row option { background: #7c3aed; color: #fff; }

        .goals-list { display: flex; flex-direction: column; gap: 0; }
        .goal-card {
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,.2);
          color: #fff;
          animation: fadeIn .4s ease-out;
        }
        .goal-card:last-child { border-bottom: none; }
        .goal-card:hover { background: rgba(255,255,255,.04); margin-left: -.5rem; margin-right: -.5rem; padding-left: .5rem; padding-right: .5rem; border-radius: .5rem; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn .4s ease-out; }

        .goal-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: .5rem; }
        .goal-title { font-size: 1.25rem; font-weight: 700; margin: 0; flex: 1; }
        .goal-badges { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .75rem; }
        .badge {
          display: inline-block;
          padding: .2rem .6rem;
          border-radius: 9999px;
          font-size: .7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .badge-high { background: #f472b6; color: #fff; }
        .badge-medium { background: #fb923c; color: #fff; }
        .badge-low { background: #34d399; color: #fff; }
        .badge-status { background: #60a5fa; color: #fff; }
        .badge-domain { background: #a78bfa; color: #fff; }

        .goal-metric { display: flex; justify-content: space-between; font-size: .9rem; margin-bottom: .35rem; }
        .metric-label { opacity: .9; }
        .metric-value { font-weight: 600; }
        .progress-track {
          height: 10px;
          background: rgba(0,0,0,.2);
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: .75rem;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f472b6, #a78bfa, #60a5fa);
          border-radius: 9999px;
          transition: width .5s ease;
        }
        .goal-target { font-size: .85rem; opacity: .9; margin-bottom: .75rem; }
        .goal-next-action {
          display: flex; align-items: center; gap: .5rem;
          font-size: .9rem; cursor: pointer; margin-bottom: .5rem;
        }
        .goal-checkbox {
          width: 1rem; height: 1rem;
          accent-color: #a78bfa;
          cursor: pointer;
        }
        .goal-expand-btn {
          font-size: .8rem;
          color: rgba(255,255,255,.85);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }
        .goal-expand-btn:hover { color: #fff; }
        .goal-detail {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,.2);
          font-size: .9rem;
        }
        .goal-detail p { margin: 0 0 .5rem 0; opacity: .95; }
        .goal-tags { display: flex; gap: .35rem; flex-wrap: wrap; margin-bottom: .5rem; }
        .goal-tags .tag {
          padding: .2rem .5rem;
          background: rgba(255,255,255,.2);
          border-radius: 9999px;
          font-size: .75rem;
        }
        .goal-updated { font-size: .75rem; opacity: .7; }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: rgba(255,255,255,.85);
        }
        .empty-state .icon { font-size: 3rem; margin-bottom: .5rem; }
        .empty-state h3 { font-size: 1.1rem; margin: 0 0 .25rem 0; }
        .empty-state p { font-size: .9rem; opacity: .8; margin: 0; }
      `}</style>

      <div className="dashboard-inner max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <header className="site-header flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="site-title">Life OS Dashboard</h1>
            <p className="site-subtitle">Modern — React + Tailwind + styled-jsx · Database-first</p>
          </div>
          <button type="button" className="add-goal-btn">+ Add goal</button>
        </header>

        <section className={`kpi-block ${mounted ? 'fade-in' : ''}`}>
          <h4>Active goals <span className="kpi-val">{kpis.active}</span></h4>
          <p className="kpi-desc">Currently in progress</p>
          <h4>On-track <span className="kpi-val">{kpis.onTrack}%</span></h4>
          <p className="kpi-desc">Meeting targets</p>
          <h4>Weekly actions <span className="kpi-val">{kpis.weekly}</span></h4>
          <p className="kpi-desc">Completed this week</p>
        </section>

        <div className="domain-row">
          {DOMAINS.map(d => (
            <button
              key={d}
              type="button"
              className={`domain-btn ${filters.domain === d ? 'active' : ''}`}
              onClick={() => updateFilter('domain', d)}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="filter-row">
          <div>
            <label>Status</label>
            <select value={filters.status} onChange={e => updateFilter('status', e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>Priority</label>
            <select value={filters.priority} onChange={e => updateFilter('priority', e.target.value)}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label>Search</label>
            <input
              type="text"
              placeholder="Search goals…"
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
            />
          </div>
        </div>

        <div className="goals-list">
          {filteredGoals.map(g => (
            <GoalCard
              key={g.id}
              goal={g}
              isExpanded={expandedId === g.id}
              onToggleExpand={toggleExpand}
              onToggleWeekly={toggleWeekly}
            />
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No goals match your filters</h3>
            <p>Try changing domain, status, priority, or search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
