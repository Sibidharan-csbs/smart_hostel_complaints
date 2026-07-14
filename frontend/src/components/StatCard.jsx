import React from 'react';

export const StatCard = ({ title, value, icon, color = 'var(--primary)', glowColor = 'var(--primary-glow)', description }) => {
  return (
    <div className="stat-card glass-panel" style={{ '--accent-color': color, '--glow-color': glowColor }}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-icon" style={{ color: color, boxShadow: `0 0 12px ${glowColor}` }}>
          {icon}
        </div>
      </div>
      <div className="stat-card-body">
        <h3 className="stat-card-value">{value}</h3>
        {description && <p className="stat-card-desc">{description}</p>}
      </div>

      <style>{`
        .stat-card {
          padding: 20px;
          border-radius: var(--radius-lg);
          position: relative;
          overflow: hidden;
        }

        .stat-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--accent-color);
        }

        .stat-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .stat-card-title {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: var(--font-display);
        }

        .stat-card-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
        }

        .stat-card-value {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
          font-family: var(--font-display);
          line-height: 1.1;
        }

        .stat-card-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
