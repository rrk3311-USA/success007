'use client'
import React from 'react';

function ActiveOperations({ projects, onToggleMilestone, fullWidth = false }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-emerald)'
      }}>
        <span className="ph ph-lightning" style={{ fontSize: '20px' }} aria-hidden />
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          color: 'var(--cyan)',
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>ACTIVE OPERATIONS</h2>
      </div>

      <div className="operations-list">
        {projects.map((project) => (
          <div key={project.id} className="operation-card">
            <div className="operation-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="ph ph-lightning" style={{ fontSize: '16px' }} aria-hidden />
                <span className="operation-name">{project.name}</span>
              </div>
              <span className="operation-progress">{project.progress}% COMPLETE</span>
            </div>

            <div className="progress-bar" style={{ marginBottom: '16px' }}>
              <div 
                className="progress-fill"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>

            <div className="milestones-grid">
              {project.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`milestone-item ${milestone.completed ? 'completed' : ''}`}
                  onClick={() => onToggleMilestone(project.id, milestone.id)}
                >
                  <div className="milestone-checkbox"></div>
                  <span className="milestone-text">{milestone.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveOperations;
