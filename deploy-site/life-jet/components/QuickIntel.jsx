'use client'
import React from 'react';

function QuickIntel({ deals, projects, visionPhotos }) {
  return (
    <div className="quick-intel" style={{ marginTop: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border-clay)'
      }}>
        <span className="ph ph-chart-bar" style={{ fontSize: '18px' }} aria-hidden />
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          color: 'var(--cyan)',
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>QUICK INTEL</h2>
      </div>

      <div className="intel-item">
        <span className="intel-label">Active Targets</span>
        <span className="intel-value">{visionPhotos.length}</span>
      </div>
      <div className="intel-item">
        <span className="intel-label">Operations</span>
        <span className="intel-value" style={{ color: 'var(--cyan)' }}>{projects.length}</span>
      </div>
      <div className="intel-item status">
        <span className="intel-label">Status</span>
        <span className="intel-value">
          <span className="status-dot"></span>
          ACTIVE
        </span>
      </div>
      <div className="intel-item">
        <span className="intel-label">Deals Available</span>
        <span className="intel-value">{deals.length}</span>
      </div>
    </div>
  );
}

export default QuickIntel;
