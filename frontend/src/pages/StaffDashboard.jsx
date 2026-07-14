import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ComplaintCard } from '../components/ComplaintCard';
import { Toast } from '../components/Toast';
import { Wrench, CheckCircle2, ClipboardCheck, MessageSquare } from 'lucide-react';

export const StaffDashboard = ({ onViewDetails }) => {
  const { apiFetch } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Status transitions state
  const [processingId, setProcessingId] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState({});
  const [showNoteInputFor, setShowNoteInputFor] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/complaints');
      setTickets(data);
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to fetch your tasks', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketId, status, note = '') => {
    setProcessingId(ticketId);
    try {
      await apiFetch(`/complaints/${ticketId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note })
      });
      setToast({ message: `Task status marked as ${status}!`, type: 'success' });
      setShowNoteInputFor(null);
      
      // Reload tickets
      fetchTickets();
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to update task status', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleNoteChange = (ticketId, val) => {
    setResolutionNotes(prev => ({
      ...prev,
      [ticketId]: val
    }));
  };

  const activeTickets = tickets.filter(t => ['Assigned', 'In Progress'].includes(t.status));
  const completedTickets = tickets.filter(t => ['Resolved', 'Closed'].includes(t.status));

  if (loading && tickets.length === 0) {
    return (
      <div className="loading-state" style={{ height: '70vh' }}>
        <div className="spinner"></div>
        <span>Loading assigned tasks queue...</span>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="dashboard-header-row">
        <div>
          <h1 className="page-title">Technician Dashboard</h1>
          <p className="page-subtitle">Inspect tasks assigned to you, coordinate with students, and record resolution details</p>
        </div>
      </div>

      <div className="staff-sections-grid">
        {/* Active queue */}
        <div className="queue-column">
          <div className="column-header">
            <Wrench size={18} className="column-header-icon progress-color" />
            <h3>Active Queue ({activeTickets.length})</h3>
          </div>

          {activeTickets.length === 0 ? (
            <div className="empty-state glass-panel">
              <ClipboardCheck size={40} className="empty-icon" />
              <h3>All clear!</h3>
              <p>No pending jobs in your queue. Enjoy your time.</p>
            </div>
          ) : (
            <div className="queue-list">
              {activeTickets.map(ticket => (
                <div key={ticket.id} className="staff-job-card-wrapper glass-panel">
                  <ComplaintCard complaint={ticket} onViewDetails={onViewDetails} />

                  <div className="job-action-panel">
                    {ticket.status === 'Assigned' && (
                      <button 
                        className="btn btn-primary w-full"
                        disabled={processingId === ticket.id}
                        onClick={() => handleUpdateStatus(ticket.id, 'In Progress', 'Work started by technician')}
                        style={{ width: '100%' }}
                      >
                        Accept & Start Work
                      </button>
                    )}

                    {ticket.status === 'In Progress' && (
                      <>
                        {showNoteInputFor === ticket.id ? (
                          <div className="resolution-note-form">
                            <textarea
                              className="form-control"
                              rows="3"
                              placeholder="Describe actions taken to resolve (e.g. Replaced capacitor, tightened structural hinge)..."
                              value={resolutionNotes[ticket.id] || ''}
                              onChange={(e) => handleNoteChange(ticket.id, e.target.value)}
                              required
                            />
                            <div className="note-actions">
                              <button
                                className="btn btn-primary btn-sm"
                                disabled={processingId === ticket.id || !(resolutionNotes[ticket.id] || '').trim()}
                                onClick={() => handleUpdateStatus(ticket.id, 'Resolved', resolutionNotes[ticket.id])}
                              >
                                Submit Resolution
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setShowNoteInputFor(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="btn btn-secondary"
                            style={{ 
                              width: '100%', 
                              background: 'var(--bg-resolved)', 
                              color: 'var(--color-resolved)',
                              borderColor: 'rgba(16, 185, 129, 0.3)'
                            }}
                            onClick={() => setShowNoteInputFor(ticket.id)}
                          >
                            Mark as Resolved
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed list */}
        <div className="queue-column">
          <div className="column-header">
            <CheckCircle2 size={18} className="column-header-icon resolved-color" />
            <h3>History / Archive ({completedTickets.length})</h3>
          </div>

          {completedTickets.length === 0 ? (
            <div className="empty-state glass-panel">
              <ClipboardCheck size={40} className="empty-icon" />
              <h3>Archive is empty</h3>
              <p>Completed jobs will show up here.</p>
            </div>
          ) : (
            <div className="queue-list">
              {completedTickets.map(ticket => (
                <ComplaintCard key={ticket.id} complaint={ticket} onViewDetails={onViewDetails} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .staff-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-header-row {
          margin-bottom: 8px;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .page-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .staff-sections-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
          align-items: start;
        }

        .queue-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .column-header {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
        }

        .column-header-icon {
          padding: 2px;
        }

        .progress-color { color: var(--color-progress); }
        .resolved-color { color: var(--color-resolved); }

        .column-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .queue-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .staff-job-card-wrapper {
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-glass);
          overflow: hidden;
        }

        /* Override inner card borders when embedded */
        .staff-job-card-wrapper .complaint-card {
          border: none;
          background: none;
          box-shadow: none;
          backdrop-filter: none;
        }

        .job-action-panel {
          padding: 0 20px 20px 20px;
          border-top: 1px solid var(--border-glass);
          padding-top: 16px;
        }

        .resolution-note-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .note-actions {
          display: flex;
          gap: 8px;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        @media (max-width: 992px) {
          .staff-sections-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
};
