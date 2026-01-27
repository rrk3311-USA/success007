import { useState } from 'react'
import BrandAudiences from '../components/BrandAudiences'

export default function QuantumTestPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <>
      <div className="q-page">
        {/* Top bar */}
        <header className="q-topbar">
          <div className="q-topbar-left">
            <div className="q-title">Admin Dashboard</div>
            <div className="q-subtitle">Manage your platform</div>
          </div>

          <div className="q-topbar-right">
            <input className="q-input" placeholder="Search…" aria-label="Search" />
            <button className="q-btn q-btn-primary">New</button>
          </div>
        </header>

        {/* Body */}
        <div className="q-body">
          {/* Sidebar */}
          <aside className="q-sidebar">
            <div className="q-brand">
              <div className="q-mark" />
              <div>
                <div className="q-brand-title">Control</div>
                <div className="q-brand-sub">Panel</div>
              </div>
            </div>

            <nav className="q-nav">
              <button 
                className={`q-nav-item ${activeTab === 'overview' ? 'q-active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <span className="q-nav-icon" aria-hidden />
                Overview
              </button>
              <button 
                className={`q-nav-item ${activeTab === 'analytics' ? 'q-active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <span className="q-nav-icon" aria-hidden />
                Analytics
              </button>
              <button 
                className={`q-nav-item ${activeTab === 'brand-audiences' ? 'q-active' : ''}`}
                onClick={() => setActiveTab('brand-audiences')}
              >
                <span className="q-nav-icon" aria-hidden />
                Brand Audiences
              </button>
              <button 
                className={`q-nav-item ${activeTab === 'users' ? 'q-active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <span className="q-nav-icon" aria-hidden />
                Users
              </button>
              <button 
                className={`q-nav-item ${activeTab === 'settings' ? 'q-active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <span className="q-nav-icon" aria-hidden />
                Settings
              </button>
            </nav>

            <div className="q-sidebar-foot">
              <div className="q-pill">Status: Online</div>
              <div className="q-muted">v0.1 test page</div>
            </div>
          </aside>

          {/* Main content */}
          <main className="q-main">
            {activeTab === 'overview' && (
              <>
                {/* Stats row */}
                <section className="q-grid q-grid-3">
                  <div className="q-card q-card-pad">
                    <div className="q-card-h">Active Sessions</div>
                    <div className="q-metric">1,284</div>
                    <div className="q-muted">+8% vs last 24h</div>
                  </div>
                  <div className="q-card q-card-pad">
                    <div className="q-card-h">Conversion</div>
                    <div className="q-metric">3.9%</div>
                    <div className="q-muted">stable</div>
                  </div>
                  <div className="q-card q-card-pad">
                    <div className="q-card-h">Errors</div>
                    <div className="q-metric">12</div>
                    <div className="q-muted">-4 from yesterday</div>
                  </div>
                </section>

                {/* Table card */}
                <section className="q-card q-card-pad">
                  <div className="q-card-row">
                    <div>
                      <div className="q-card-h">Recent Events</div>
                      <div className="q-muted">Compact, border-led table</div>
                    </div>
                    <div className="q-actions">
                      <button className="q-btn">Export</button>
                      <button className="q-btn">Filter</button>
                    </div>
                  </div>

                  <div className="q-table-wrap" role="region" aria-label="Recent events table">
                    <table className="q-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Event</th>
                          <th>Source</th>
                          <th className="q-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["10:21", "Checkout Completed", "Web", "OK"],
                          ["10:18", "Payment Retry", "API", "WARN"],
                          ["10:12", "Login Spike", "Web", "OK"],
                          ["10:05", "Webhook Timeout", "API", "FAIL"],
                          ["09:58", "Inventory Sync", "Worker", "OK"],
                        ].map((r, i) => (
                          <tr key={i}>
                            <td>{r[0]}</td>
                            <td>{r[1]}</td>
                            <td>{r[2]}</td>
                            <td className="q-right">
                              <span className={`q-tag q-tag-${r[3].toLowerCase()}`}>{r[3]}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'analytics' && (
              <div className="q-card q-card-pad">
                <div className="q-card-h">Analytics</div>
                <div className="q-muted" style={{ marginTop: '8px' }}>
                  Analytics content coming soon...
                </div>
              </div>
            )}

            {activeTab === 'brand-audiences' && <BrandAudiences />}

            {activeTab === 'users' && (
              <div className="q-card q-card-pad">
                <div className="q-card-h">Users</div>
                <div className="q-muted" style={{ marginTop: '8px' }}>
                  User management content coming soon...
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="q-card q-card-pad">
                <div className="q-card-h">Settings</div>
                <div className="q-muted" style={{ marginTop: '8px' }}>
                  Settings content coming soon...
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        :root {
          --q-bg: #070a10;
          --q-panel: #0b1020;
          --q-card: #0e1630;
          --q-border: rgba(255, 255, 255, 0.08);
          --q-border-strong: rgba(255, 255, 255, 0.14);
          --q-text: rgba(255, 255, 255, 0.92);
          --q-muted: rgba(255, 255, 255, 0.62);
          --q-accent: #2f6bff;
          --q-accent-soft: rgba(47, 107, 255, 0.18);
          --q-radius: 6px;
          --q-glow: 0 0 0 1px var(--q-border), 0 0 24px rgba(47, 107, 255, 0.08);
        }

        body {
          background: var(--q-bg);
          color: var(--q-text);
          margin: 0;
          padding: 0;
        }

        .q-page {
          min-height: 100vh;
        }

        .q-topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-bottom: 1px solid var(--q-border);
          background: rgba(7, 10, 16, 0.72);
          backdrop-filter: blur(10px);
        }

        .q-title {
          font-weight: 800;
          letter-spacing: 0.2px;
          font-size: 14px;
        }

        .q-subtitle {
          font-size: 12px;
          color: var(--q-muted);
          margin-top: 2px;
        }

        .q-topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .q-input {
          width: 220px;
          padding: 10px 12px;
          border-radius: var(--q-radius);
          border: 1px solid var(--q-border);
          outline: none;
          background: rgba(255, 255, 255, 0.03);
          color: var(--q-text);
        }
        .q-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }
        .q-input:focus {
          border-color: rgba(47, 107, 255, 0.45);
          box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.15);
        }

        .q-btn {
          padding: 10px 12px;
          border-radius: var(--q-radius);
          border: 1px solid var(--q-border);
          background: rgba(255, 255, 255, 0.03);
          color: var(--q-text);
          cursor: pointer;
          font-size: 12px;
        }
        .q-btn:hover {
          border-color: var(--q-border-strong);
          background: rgba(255, 255, 255, 0.05);
        }
        .q-btn-primary {
          border-color: rgba(47, 107, 255, 0.35);
          background: rgba(47, 107, 255, 0.18);
          box-shadow: 0 0 0 1px rgba(47, 107, 255, 0.12);
        }

        .q-body {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: calc(100vh - 56px);
        }

        .q-sidebar {
          border-right: 1px solid var(--q-border);
          background: linear-gradient(180deg, var(--q-panel), rgba(11, 16, 32, 0.7));
          padding: 18px;
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: 16px;
        }

        .q-brand {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 12px;
          align-items: center;
          padding: 10px 12px;
          border: 1px solid var(--q-border);
          border-radius: var(--q-radius);
          box-shadow: var(--q-glow);
        }

        .q-mark {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--q-border-strong);
          background: radial-gradient(circle at 30% 30%, var(--q-accent-soft), transparent 60%);
        }

        .q-brand-title {
          font-weight: 800;
          font-size: 13px;
        }
        .q-brand-sub {
          color: var(--q-muted);
          font-size: 12px;
          margin-top: 2px;
        }

        .q-nav {
          display: grid;
          gap: 6px;
          align-content: start;
        }

        .q-nav-item {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 10px;
          align-items: center;
          padding: 10px 12px;
          border: 1px solid transparent;
          border-radius: var(--q-radius);
          color: var(--q-text);
          text-decoration: none;
          transition: border-color 160ms, background 160ms;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          font-family: inherit;
        }
        .q-nav-item:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--q-border);
        }
        .q-active {
          background: rgba(47, 107, 255, 0.08);
          border-color: rgba(47, 107, 255, 0.22);
        }

        .q-nav-icon {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid var(--q-border-strong);
          background: rgba(47, 107, 255, 0.06);
        }

        .q-sidebar-foot {
          display: grid;
          gap: 8px;
        }

        .q-pill {
          display: inline-flex;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid var(--q-border);
          background: rgba(255, 255, 255, 0.02);
          width: fit-content;
          font-size: 12px;
        }

        .q-main {
          padding: 18px;
          display: grid;
          gap: 14px;
          align-content: start;
        }

        .q-grid {
          display: grid;
          gap: 12px;
        }
        .q-grid-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .q-card {
          background: var(--q-card);
          border: 1px solid var(--q-border);
          border-radius: var(--q-radius);
          box-shadow: var(--q-glow);
        }

        .q-card-pad {
          padding: 14px;
        }

        .q-card-h {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        .q-metric {
          font-size: 26px;
          font-weight: 900;
          margin-top: 10px;
          margin-bottom: 6px;
        }

        .q-muted {
          color: var(--q-muted);
          font-size: 12px;
        }

        .q-card-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .q-actions {
          display: flex;
          gap: 8px;
        }

        .q-table-wrap {
          border: 1px solid var(--q-border);
          border-radius: var(--q-radius);
          overflow: hidden;
        }

        .q-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        .q-table thead th {
          text-align: left;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--q-border);
          color: rgba(255, 255, 255, 0.82);
          font-weight: 800;
        }

        .q-table tbody td {
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.86);
        }

        .q-table tbody tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .q-right {
          text-align: right;
        }

        .q-tag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid var(--q-border);
          font-weight: 800;
          letter-spacing: 0.2px;
          font-size: 11px;
        }
        .q-tag-ok {
          background: rgba(0, 255, 170, 0.06);
          border-color: rgba(0, 255, 170, 0.18);
          color: rgba(0, 255, 170, 0.9);
        }
        .q-tag-warn {
          background: rgba(255, 200, 0, 0.06);
          border-color: rgba(255, 200, 0, 0.18);
          color: rgba(255, 200, 0, 0.9);
        }
        .q-tag-fail {
          background: rgba(255, 80, 80, 0.06);
          border-color: rgba(255, 80, 80, 0.18);
          color: rgba(255, 80, 80, 0.9);
        }
      `}</style>
    </>
  )
}
