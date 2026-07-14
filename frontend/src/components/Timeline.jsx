import React from 'react';
import { CheckCircle2, Clock, Wrench, FileText, CheckCircle } from 'lucide-react';

export const Timeline = ({ events }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FileText size={16} />;
      case 'Assigned':
        return <Clock size={16} />;
      case 'In Progress':
        return <Wrench size={16} />;
      case 'Resolved':
        return <CheckCircle2 size={16} />;
      case 'Closed':
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'var(--color-pending)';
      case 'Assigned': return 'var(--color-assigned)';
      case 'In Progress': return 'var(--color-progress)';
      case 'Resolved': return 'var(--color-resolved)';
      case 'Closed': return 'var(--color-closed)';
      default: return 'var(--primary)';
    }
  };

  // Sort events chronologically (oldest first for timeline flow)
  const sortedEvents = [...events].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="timeline-container">
      <h4 className="timeline-title">Audit Trail & Status Timeline</h4>
      <div className="timeline-list">
        {sortedEvents.map((event, index) => (
          <div key={event.id} className="timeline-item">
            <div className="timeline-left">
              <div 
                className="timeline-badge" 
                style={{ 
                  backgroundColor: getStatusColor(event.status),
                  boxShadow: `0 0 10px ${getStatusColor(event.status)}40`,
                  color: '#fff'
                }}
              >
                {getStatusIcon(event.status)}
              </div>
              {index < sortedEvents.length - 1 && <div className="timeline-line" />}
            </div>
            <div className="timeline-right">
              <div className="timeline-header-row">
                <span className="timeline-status-name" style={{ color: getStatusColor(event.status) }}>{event.status}</span>
                <span className="timeline-time">{formatDate(event.createdAt)}</span>
              </div>
              <p className="timeline-desc">{event.description}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .timeline-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .timeline-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
        }

        .timeline-list {
          display: flex;
          flex-direction: column;
        }

        .timeline-item {
          display: flex;
          gap: 16px;
          min-height: 80px;
        }

        .timeline-left {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .timeline-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .timeline-line {
          width: 2px;
          flex: 1;
          background: var(--border-glass);
          margin: 4px 0;
        }

        .timeline-right {
          flex: 1;
          padding-bottom: 20px;
        }

        .timeline-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .timeline-status-name {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .timeline-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .timeline-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};
