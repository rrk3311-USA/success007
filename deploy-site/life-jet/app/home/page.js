'use client'

import { useState, useEffect } from 'react'
import HUD from '../../components/HUD'
import RadarDisplay from '../../components/RadarDisplay'
import MealFinder from '../../components/MealFinder'
import DealCards from '../../components/DealCards'
import LocationTracker from '../../components/LocationTracker'
import StatusPanel from '../../components/StatusPanel'
import VisionMatrix from '../../components/VisionMatrix'
import DailyOps from '../../components/DailyOps'
import ActiveOperations from '../../components/ActiveOperations'
import QuickIntel from '../../components/QuickIntel'

export default function MainHome() {
  const [location, setLocation] = useState(null)
  const [deals, setDeals] = useState([])
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [systemStatus, setSystemStatus] = useState('OPERATIONAL')
  const [activeTab, setActiveTab] = useState('daily-focus')
  const [todos, setTodos] = useState([
    { id: 1, text: 'Review daily meal deals', completed: false, priority: 'high' },
    { id: 2, text: 'Update location preferences', completed: true, priority: 'medium' },
    { id: 3, text: 'Check new restaurant additions', completed: false, priority: 'low' }
  ])
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'OPERATION: MEAL DEAL OPTIMIZATION',
      progress: 45,
      milestones: [
        { id: '1a', text: 'Integrate location API', completed: true },
        { id: '1b', text: 'Add real-time pricing', completed: false },
        { id: '1c', text: 'Deploy deal notifications', completed: false }
      ]
    }
  ])
  const [visionPhotos, setVisionPhotos] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', caption: 'TARGET: PREMIUM DINING' },
    { id: 2, url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', caption: 'MISSION: BEST DEALS' },
    { id: 3, url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop', caption: 'OBJECTIVE: SAVINGS' }
  ])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          setLocation({ lat: 34.0522, lng: -118.2437 })
        }
      )
    }
    loadDeals()
    setTimeout(() => setSystemStatus('ONLINE'), 2000)
  }, [])

  const loadDeals = () => {
    const mockDeals = [
      { id: 1, name: "Thunder Strike Burger", restaurant: "Base Nine Diner", distance: 0.8, price: 8.99, originalPrice: 12.99, discount: 31, image: "🍔", category: "American", rating: 4.8, time: "5 min", coordinates: { lat: 34.0522, lng: -118.2437 } },
      { id: 2, name: "Stealth Mode Pizza", restaurant: "Fighter's Kitchen", distance: 1.2, price: 11.99, originalPrice: 16.99, discount: 29, image: "🍕", category: "Italian", rating: 4.6, time: "12 min", coordinates: { lat: 34.0532, lng: -118.2447 } },
      { id: 3, name: "Afterburner Wings", restaurant: "Wing Command", distance: 0.5, price: 9.99, originalPrice: 14.99, discount: 33, image: "🍗", category: "American", rating: 4.9, time: "8 min", coordinates: { lat: 34.0512, lng: -118.2427 } },
      { id: 4, name: "Sonic Boom Sushi", restaurant: "Altitude Sushi", distance: 1.5, price: 14.99, originalPrice: 22.99, discount: 35, image: "🍣", category: "Japanese", rating: 4.7, time: "15 min", coordinates: { lat: 34.0542, lng: -118.2457 } },
      { id: 5, name: "Mach 3 Tacos", restaurant: "Taco Squadron", distance: 0.3, price: 6.99, originalPrice: 9.99, discount: 30, image: "🌮", category: "Mexican", rating: 4.5, time: "3 min", coordinates: { lat: 34.0502, lng: -118.2417 } }
    ]
    setDeals(mockDeals)
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const toggleMilestone = (projectId, milestoneId) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p
      const updatedMilestones = p.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      )
      const completedCount = updatedMilestones.filter(m => m.completed).length
      const newProgress = Math.round((completedCount / updatedMilestones.length) * 100)
      return { ...p, milestones: updatedMilestones, progress: newProgress }
    }))
  }

  return (
    <div className="life-jet-container">
      <HUD systemStatus={systemStatus} />

      <div className="tabs-container">
        <div className="tabs-list">
          <button className={`tab-btn ${activeTab === 'daily-focus' ? 'active' : ''}`} onClick={() => setActiveTab('daily-focus')}>
            <span>🎯</span> Daily Focus
          </button>
          <button className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`} onClick={() => setActiveTab('vision')}>
            <span>👁️</span> Vision Matrix
          </button>
          <button className={`tab-btn ${activeTab === 'operations' ? 'active' : ''}`} onClick={() => setActiveTab('operations')}>
            <span>⚡</span> Operations
          </button>
          <button className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>
            <span>🏆</span> Achievements
          </button>
          <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            <span>📊</span> Stats
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="panel left-panel">
          {activeTab === 'daily-focus' && (
            <>
              <RadarDisplay location={location} deals={deals} onDealSelect={setSelectedDeal} />
              <QuickIntel deals={deals} projects={projects} visionPhotos={visionPhotos} />
            </>
          )}
          {activeTab === 'vision' && <VisionMatrix photos={visionPhotos} onPhotosChange={setVisionPhotos} />}
          {activeTab === 'operations' && <ActiveOperations projects={projects} onToggleMilestone={toggleMilestone} />}
          {activeTab === 'achievements' && (
            <div style={{ color: 'var(--text-primary)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--amber)', marginBottom: '24px' }}>ACHIEVEMENT VAULT</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Achievement tracking coming soon...</p>
            </div>
          )}
          {activeTab === 'stats' && <StatusPanel deal={selectedDeal} location={location} />}
        </div>

        <div className="panel center-panel">
          {activeTab === 'daily-focus' && (
            <MealFinder location={location} deals={deals} selectedDeal={selectedDeal} onDealSelect={setSelectedDeal} />
          )}
          {activeTab === 'vision' && <VisionMatrix photos={visionPhotos} onPhotosChange={setVisionPhotos} fullWidth />}
          {activeTab === 'operations' && <ActiveOperations projects={projects} onToggleMilestone={toggleMilestone} fullWidth />}
          {activeTab === 'achievements' && (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-primary)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--amber)', marginBottom: '16px' }}>ACHIEVEMENT VAULT</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Track your milestones and accomplishments</p>
            </div>
          )}
          {activeTab === 'stats' && (
            <div style={{ padding: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--cyan)', marginBottom: '24px' }}>PERFORMANCE METRICS</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div className="info-item"><div className="info-label">Total Deals</div><div className="info-value">{deals.length}</div></div>
                <div className="info-item"><div className="info-label">Active Operations</div><div className="info-value">{projects.length}</div></div>
                <div className="info-item"><div className="info-label">Vision Targets</div><div className="info-value">{visionPhotos.length}</div></div>
                <div className="info-item"><div className="info-label">System Status</div><div className="info-value" style={{ color: 'var(--emerald)' }}>ONLINE</div></div>
              </div>
            </div>
          )}
        </div>

        <div className="panel right-panel">
          {activeTab === 'daily-focus' && (
            <>
              <DailyOps todos={todos} onToggleTodo={toggleTodo} />
              <StatusPanel deal={selectedDeal} location={location} />
            </>
          )}
          {(activeTab === 'vision' || activeTab === 'operations' || activeTab === 'achievements' || activeTab === 'stats') && (
            <StatusPanel deal={selectedDeal} location={location} />
          )}
        </div>
      </div>

      <div className="panel bottom-panel">
        <DealCards deals={deals} onDealSelect={setSelectedDeal} selectedDeal={selectedDeal} />
      </div>

      <LocationTracker location={location} />
      {selectedDeal && <div className="targeting-reticle"></div>}
    </div>
  )
}
