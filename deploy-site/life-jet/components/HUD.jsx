'use client'
import React, { useState, useEffect } from 'react';

function HUD({ systemStatus }) {
  const [time, setTime] = useState(new Date());
  const [dealsCount, setDealsCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Animate deals count
    const dealsTimer = setTimeout(() => {
      setDealsCount(5);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(dealsTimer);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="hud-container">
      <div className="hud-logo">LIFE JET</div>
      
      <div className="hud-stats">
        <div className="hud-stat">
          <div className="hud-stat-label">DEALS</div>
          <div className="hud-stat-value">{dealsCount}</div>
        </div>
        <div className="hud-stat">
          <div className="hud-stat-label">TIME</div>
          <div className="hud-stat-value">{formatTime(time)}</div>
        </div>
        <div className="hud-stat">
          <div className="hud-stat-label">RANGE</div>
          <div className="hud-stat-value">2.0KM</div>
        </div>
      </div>

      <div className="hud-status">
        <div className="status-indicator"></div>
        <span>{systemStatus}</span>
      </div>
    </div>
  );
}

export default HUD;
