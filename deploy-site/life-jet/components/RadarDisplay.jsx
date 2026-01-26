'use client'
import React, { useEffect, useRef } from 'react';

function RadarDisplay({ location, deals, onDealSelect }) {
  const radarRef = useRef(null);

  useEffect(() => {
    // Radar sweep animation is handled by CSS
  }, []);

  const handleBlipClick = (deal) => {
    onDealSelect(deal);
  };

  // Calculate blip positions (simplified - in production would use actual coordinates)
  const getBlipPosition = (index, total) => {
    const angle = (index / total) * 360;
    const radius = 40; // percentage from center
    const x = 50 + radius * Math.cos((angle - 90) * Math.PI / 180);
    const y = 50 + radius * Math.sin((angle - 90) * Math.PI / 180);
    return { x, y };
  };

  return (
    <div className="radar-container">
      <div className="radar-title">TACTICAL RADAR</div>
      <div className="radar-display" ref={radarRef}>
        <div className="radar-sweep"></div>
        
        {/* Center crosshair */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '2px',
          height: '20px',
          background: '#00ff88',
          opacity: 0.5
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '2px',
          background: '#00ff88',
          opacity: 0.5
        }}></div>

        {/* Deal blips */}
        {deals.map((deal, index) => {
          const pos = getBlipPosition(index, deals.length);
          return (
            <div
              key={deal.id}
              className="radar-blip"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`
              }}
              onClick={() => handleBlipClick(deal)}
              title={deal.name}
            ></div>
          );
        })}
      </div>
      
      <div style={{
        marginTop: '15px',
        fontSize: '0.8rem',
        color: 'rgba(0, 255, 136, 0.5)',
        textAlign: 'center',
        fontFamily: 'Share Tech Mono, monospace'
      }}>
        {deals.length} TARGETS ACQUIRED
      </div>
    </div>
  );
}

export default RadarDisplay;
