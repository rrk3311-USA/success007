'use client'
import React from 'react';

function LocationTracker({ location }) {
  if (!location) {
    return (
      <div className="location-tracker">
        <div style={{ color: '#ff4757' }}>LOCATION: ACQUIRING...</div>
      </div>
    );
  }

  return (
    <div className="location-tracker">
      <div style={{ marginBottom: '5px', color: '#00ff88' }}>POSITION LOCKED</div>
      <div style={{ fontSize: '0.7rem', color: 'rgba(0, 255, 136, 0.7)' }}>
        LAT: {location.lat.toFixed(4)}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'rgba(0, 255, 136, 0.7)' }}>
        LNG: {location.lng.toFixed(4)}
      </div>
    </div>
  );
}

export default LocationTracker;
