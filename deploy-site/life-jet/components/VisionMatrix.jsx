'use client'
import React, { useState } from 'react';

function VisionMatrix({ photos, onPhotosChange, fullWidth = false }) {
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  const addPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const newPhoto = {
      id: Date.now().toString(),
      url: newPhotoUrl,
      caption: newPhotoCaption || 'NEW TARGET'
    };
    onPhotosChange([...photos, newPhoto]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setShowAddPhoto(false);
  };

  const deletePhoto = (id) => {
    onPhotosChange(photos.filter(p => p.id !== id));
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-emerald)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>👁️</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            color: 'var(--cyan)',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>VISION MATRIX</h2>
        </div>
        <button
          onClick={() => setShowAddPhoto(true)}
          style={{
            padding: '8px 16px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--border-emerald)',
            borderRadius: '4px',
            color: 'var(--emerald)',
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(16, 185, 129, 0.2)';
            e.target.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(16, 185, 129, 0.1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          + ADD TARGET
        </button>
      </div>

      <div className="vision-matrix">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="vision-photo"
            onClick={() => deletePhoto(photo.id)}
            title="Click to remove"
          >
            <img src={photo.url} alt={photo.caption} />
            <div className="vision-photo-overlay">
              <div className="vision-photo-caption">{photo.caption}</div>
            </div>
            <div className="vision-photo-label">
              TARGET-{String(index + 1).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>

      {showAddPhoto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--slate-800-alpha)',
            border: '1px solid var(--border-emerald)',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            backdropFilter: 'blur(12px)'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              color: 'var(--emerald)',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>Add New Target</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>Image URL</label>
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="search-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>Caption</label>
                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="TARGET: DESCRIPTION"
                  className="search-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={addPhoto}
                  className="search-btn"
                  style={{ flex: 1 }}
                >
                  Add Target
                </button>
                <button
                  onClick={() => setShowAddPhoto(false)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: 'var(--slate-700-alpha)',
                    border: '1px solid var(--border-slate)',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisionMatrix;
