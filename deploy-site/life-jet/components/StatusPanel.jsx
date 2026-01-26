'use client'
import React from 'react';

function StatusPanel({ deal, location }) {
  return (
    <div className="status-panel">
      <div className="status-section">
        <div className="section-title">SYSTEM STATUS</div>
        <div className="status-item">
          <span className="status-label">RADAR:</span>
          <span className="status-value" style={{ color: '#00ff88' }}>ONLINE</span>
        </div>
        <div className="status-item">
          <span className="status-label">NAVIGATION:</span>
          <span className="status-value" style={{ color: '#00ff88' }}>ACTIVE</span>
        </div>
        <div className="status-item">
          <span className="status-label">TARGETING:</span>
          <span className="status-value" style={{ color: deal ? '#00ff88' : '#ffb800' }}>
            {deal ? 'LOCKED' : 'STANDBY'}
          </span>
        </div>
      </div>

      {deal && (
        <div className="status-section">
          <div className="section-title">TARGET DATA</div>
          <div className="status-item">
            <span className="status-label">NAME:</span>
            <span className="status-value">{deal.name}</span>
          </div>
          <div className="status-item">
            <span className="status-label">RESTAURANT:</span>
            <span className="status-value">{deal.restaurant}</span>
          </div>
          <div className="status-item">
            <span className="status-label">DISTANCE:</span>
            <span className="status-value">{deal.distance} KM</span>
          </div>
          <div className="status-item">
            <span className="status-label">PRICE:</span>
            <span className="status-value" style={{ color: '#00ff88' }}>
              ${deal.price}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">SAVINGS:</span>
            <span className="status-value" style={{ color: '#ff4757' }}>
              ${(deal.originalPrice - deal.price).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="status-section">
        <div className="section-title">MISSION BRIEF</div>
        <div style={{
          fontSize: '0.85rem',
          color: 'rgba(0, 255, 136, 0.7)',
          lineHeight: '1.6'
        }}>
          Locate and acquire optimal meal deals within tactical range. 
          System scanning for best value propositions...
        </div>
      </div>
    </div>
  );
}

export default StatusPanel;
