export default function BrandAudiences() {
  return (
    <div className="q-section">
      <div className="q-section-header">
        <div>
          <h2 className="q-section-title">Brand Audiences</h2>
          <p className="q-section-subtitle">Manage and analyze your brand audience segments</p>
        </div>
        <div className="q-actions">
          <button className="q-btn">Export Data</button>
          <button className="q-btn q-btn-primary">Create Audience</button>
        </div>
      </div>

      {/* Audience Overview Stats */}
      <section className="q-grid q-grid-3">
        <div className="q-card q-card-pad">
          <div className="q-card-h">Total Audiences</div>
          <div className="q-metric">24</div>
          <div className="q-muted">+3 this month</div>
        </div>
        <div className="q-card q-card-pad">
          <div className="q-card-h">Active Users</div>
          <div className="q-metric">48.2K</div>
          <div className="q-muted">+12.5% growth</div>
        </div>
        <div className="q-card q-card-pad">
          <div className="q-card-h">Engagement Rate</div>
          <div className="q-metric">67.8%</div>
          <div className="q-muted">+4.2% vs last period</div>
        </div>
      </section>

      {/* Audience Segments Table */}
      <section className="q-card q-card-pad">
        <div className="q-card-row">
          <div>
            <div className="q-card-h">Audience Segments</div>
            <div className="q-muted">Active brand audience segments and their performance</div>
          </div>
          <div className="q-actions">
            <button className="q-btn">Filter</button>
            <button className="q-btn">Sort</button>
          </div>
        </div>

        <div className="q-table-wrap" role="region" aria-label="Audience segments table">
          <table className="q-table">
            <thead>
              <tr>
                <th>Segment Name</th>
                <th>Size</th>
                <th>Engagement</th>
                <th>Created</th>
                <th className="q-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Premium Buyers", "12,450", "82.4%", "Jan 15, 2026", "ACTIVE"],
                ["Newsletter Subscribers", "28,920", "71.2%", "Dec 10, 2025", "ACTIVE"],
                ["Cart Abandoners", "5,680", "45.8%", "Jan 20, 2026", "ACTIVE"],
                ["Loyalty Members", "8,340", "89.6%", "Nov 5, 2025", "ACTIVE"],
                ["First-Time Visitors", "15,230", "38.2%", "Jan 22, 2026", "ACTIVE"],
                ["High-Value Customers", "3,120", "94.1%", "Oct 18, 2025", "ACTIVE"],
              ].map((row, i) => (
                <tr key={i}>
                  <td>
                    <strong>{row[0]}</strong>
                  </td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td className="q-right">
                    <span className="q-tag q-tag-active">{row[4]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Audience Insights */}
      <section className="q-grid q-grid-2">
        <div className="q-card q-card-pad">
          <div className="q-card-h">Top Performing Segments</div>
          <div className="q-muted" style={{ marginTop: '8px', marginBottom: '12px' }}>
            Based on engagement and conversion
          </div>
          <div className="q-list">
            {[
              { name: "High-Value Customers", score: 94.1 },
              { name: "Loyalty Members", score: 89.6 },
              { name: "Premium Buyers", score: 82.4 },
              { name: "Newsletter Subscribers", score: 71.2 },
            ].map((item, i) => (
              <div key={i} className="q-list-item">
                <span>{item.name}</span>
                <span className="q-score">{item.score}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="q-card q-card-pad">
          <div className="q-card-h">Audience Growth Trend</div>
          <div className="q-muted" style={{ marginTop: '8px', marginBottom: '12px' }}>
            Last 6 months
          </div>
          <div className="q-chart-placeholder">
            <div className="q-chart-bars">
              <div className="q-bar" style={{ height: '45%' }}></div>
              <div className="q-bar" style={{ height: '52%' }}></div>
              <div className="q-bar" style={{ height: '58%' }}></div>
              <div className="q-bar" style={{ height: '71%' }}></div>
              <div className="q-bar" style={{ height: '68%' }}></div>
              <div className="q-bar" style={{ height: '85%' }}></div>
            </div>
            <div className="q-chart-labels">
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .q-section {
          display: grid;
          gap: 14px;
        }

        .q-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .q-section-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.2px;
          margin: 0;
        }

        .q-section-subtitle {
          font-size: 13px;
          color: var(--q-muted);
          margin: 4px 0 0 0;
        }

        .q-grid-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .q-tag-active {
          background: rgba(0, 255, 170, 0.06);
          border-color: rgba(0, 255, 170, 0.18);
          color: rgba(0, 255, 170, 0.9);
        }

        .q-list {
          display: grid;
          gap: 8px;
        }

        .q-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          border: 1px solid var(--q-border);
          border-radius: var(--q-radius);
          background: rgba(255, 255, 255, 0.02);
        }

        .q-score {
          font-weight: 800;
          color: rgba(0, 255, 170, 0.9);
        }

        .q-chart-placeholder {
          display: grid;
          gap: 12px;
          margin-top: 8px;
        }

        .q-chart-bars {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 140px;
        }

        .q-bar {
          flex: 1;
          background: linear-gradient(180deg, var(--q-accent), rgba(47, 107, 255, 0.3));
          border-radius: 4px 4px 0 0;
          border: 1px solid rgba(47, 107, 255, 0.3);
          border-bottom: none;
        }

        .q-chart-labels {
          display: flex;
          justify-content: space-around;
          font-size: 11px;
          color: var(--q-muted);
        }
      `}</style>
    </div>
  )
}
