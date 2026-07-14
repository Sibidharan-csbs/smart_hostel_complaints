import React from 'react';
import { Calendar, User, Star } from 'lucide-react';

export const ComplaintCard = ({ complaint, onViewDetails }) => {
  const {
    id,
    title,
    description,
    category,
    severity,
    status,
    roomNumber,
    block,
    createdAt,
    rating,
    studentName
  } = complaint;

  const formatDate = (dateStr) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const getSeverityBadge = (sev) => {
    switch (sev.toLowerCase()) {
      case 'high': return <span className="badge badge-severity badge-sev-high">High</span>;
      case 'medium': return <span className="badge badge-severity badge-sev-medium">Medium</span>;
      case 'low':
      default:
        return <span className="badge badge-severity badge-sev-low">Low</span>;
    }
  };

  const getStatusBadge = (stat) => {
    return <span className={`badge badge-${stat.toLowerCase().replace(' ', '')}`}>{stat}</span>;
  };

  return (
    <div className="complaint-card glass-panel">
      <div className="card-header-row">
        <div className="card-badges">
          <span className="badge-category">{category}</span>
          {getSeverityBadge(severity)}
        </div>
        {getStatusBadge(status)}
      </div>

      <h4 className="card-title">{title}</h4>
      <p className="card-desc">{description.length > 140 ? `${description.slice(0, 140)}...` : description}</p>

      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">Location:</span>
          <span>{roomNumber} ({block})</span>
        </div>
        <div className="meta-item">
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(createdAt)}</span>
        </div>
        {studentName && (
          <div className="meta-item">
            <User size={13} style={{ color: 'var(--text-muted)' }} />
            <span>{studentName}</span>
          </div>
        )}
      </div>

      <div className="card-footer">
        {rating && (
          <div className="card-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < rating ? 'var(--color-pending)' : 'none'}
                color={i < rating ? 'var(--color-pending)' : 'var(--text-muted)'}
              />
            ))}
          </div>
        )}
        <button className="btn btn-secondary btn-sm" onClick={() => onViewDetails(id)} style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}>
          Inspect Ticket
        </button>
      </div>

      <style>{`
        .complaint-card {
          padding: 20px;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 1px solid var(--border-glass);
        }

        .card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .badge-category {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 3px 8px;
          border-radius: 4px;
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .card-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .card-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-glass);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .meta-label {
          color: var(--text-muted);
          font-weight: 500;
        }

        .card-footer {
          display: flex;
          align-items: center;
          margin-top: 8px;
          gap: 12px;
        }

        .card-rating {
          display: flex;
          gap: 2px;
        }
      `}</style>
    </div>
  );
};
