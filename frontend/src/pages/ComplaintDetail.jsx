import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Timeline } from '../components/Timeline';
import { Toast } from '../components/Toast';
import { 
  ArrowLeft, 
  MapPin, 
  Tag, 
  AlertOctagon, 
  Calendar, 
  Send,
  Star,
  MessageSquare
} from 'lucide-react';

export const ComplaintDetail = ({ complaintId, onBack }) => {
  const { apiFetch, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Chat input state
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatEndRef = useRef(null);

  // Student Feedback state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchComplaintDetails = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const resData = await apiFetch(`/complaints/${complaintId}`);
      setData(resData);
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to load details', type: 'error' });
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Poll for new messages every 5 seconds
  useEffect(() => {
    fetchComplaintDetails(true);

    const interval = setInterval(() => {
      fetchComplaintDetails(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [complaintId]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMsg(true);
    try {
      const msg = await apiFetch(`/complaints/${complaintId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message: newMessage })
      });
      
      // Update local state immediately
      setData(prev => ({
        ...prev,
        messages: [...prev.messages, msg]
      }));
      setNewMessage('');
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to send message', type: 'error' });
    } finally {
      setSendingMsg(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      await apiFetch(`/complaints/${complaintId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ rating, feedback })
      });
      setToast({ message: 'Feedback submitted and ticket closed!', type: 'success' });
      
      // Reload ticket details
      fetchComplaintDetails(true);
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to submit feedback', type: 'error' });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading && !data) {
    return (
      <div className="loading-state" style={{ height: '70vh' }}>
        <div className="spinner"></div>
        <span>Retrieving ticket record...</span>
      </div>
    );
  }

  const { complaint, messages, timeline } = data;

  return (
    <div className="complaint-detail-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button className="back-btn btn btn-secondary btn-sm" onClick={onBack}>
        <ArrowLeft size={16} />
        <span>Back to Queue</span>
      </button>

      <div className="detail-grid">
        {/* Left Column: Complaint Details and Timeline */}
        <div className="detail-left-col">
          <div className="ticket-card-details glass-panel">
            <div className="detail-header">
              <div className="detail-meta-badges">
                <span className="badge-category">{complaint.category}</span>
                {getSeverityBadge(complaint.severity)}
              </div>
              {getStatusBadge(complaint.status)}
            </div>

            <h2 className="detail-title">{complaint.title}</h2>
            <p className="detail-description">{complaint.description}</p>

            <div className="detail-info-row">
              <div className="info-block">
                <MapPin size={18} className="info-icon" />
                <div>
                  <span className="info-label">Location</span>
                  <span className="info-value">{complaint.roomNumber} ({complaint.block})</span>
                </div>
              </div>

              <div className="info-block">
                <Calendar size={18} className="info-icon" />
                <div>
                  <span className="info-label">Lodged Date</span>
                  <span className="info-value">{formatDate(complaint.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Display photo if uploaded */}
            {complaint.imagePath && (
              <div className="uploaded-photo-section">
                <span className="info-label">Uploaded Image Attachment</span>
                <div className="attached-image-container">
                  <img 
                    src={`http://localhost:5000${complaint.imagePath}`} 
                    alt="Complaint attachment" 
                    className="attached-image"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Feedback Form for Student when ticket is Resolved */}
          {complaint.status === 'Resolved' && user.role === 'Student' && (
            <div className="feedback-panel glass-panel">
              <h4 className="feedback-title">Rate Resolution & Close Ticket</h4>
              <p className="feedback-subtitle">Your feedback helps us monitor and improve hostel maintenance services.</p>
              
              <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                <div className="star-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        size={28}
                        fill={(hoverRating || rating) >= star ? 'var(--color-pending)' : 'none'}
                        color={(hoverRating || rating) >= star ? 'var(--color-pending)' : 'var(--text-muted)'}
                      />
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Feedback Comments (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter review comments (e.g. Clean work, quick response)..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={submittingFeedback}>
                  {submittingFeedback ? 'Closing...' : 'Close Ticket'}
                </button>
              </form>
            </div>
          )}

          {/* If resolved/closed and feedback was already submitted */}
          {complaint.rating && (
            <div className="feedback-display-panel glass-panel">
              <h4 className="feedback-title">Student Review Feedback</h4>
              <div className="star-rating-display">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={complaint.rating >= star ? 'var(--color-pending)' : 'none'}
                    color={complaint.rating >= star ? 'var(--color-pending)' : 'var(--text-muted)'}
                  />
                ))}
              </div>
              {complaint.feedback && <p className="feedback-comments">"{complaint.feedback}"</p>}
            </div>
          )}

          <div className="timeline-card-wrapper glass-panel">
            <Timeline events={timeline} />
          </div>
        </div>

        {/* Right Column: Chat Discussion Thread */}
        <div className="detail-right-col">
          <div className="chat-card glass-panel">
            <div className="chat-header">
              <MessageSquare size={18} className="chat-header-icon" />
              <h3>Collaboration Channel</h3>
            </div>

            <div className="chat-messages-container">
              {messages.length === 0 ? (
                <div className="chat-empty">
                  <span>No comments posted yet. Start the coordination thread.</span>
                </div>
              ) : (
                messages.map(msg => {
                  const isSentByMe = msg.senderId === user.id;
                  return (
                    <div key={msg.id} className={`chat-message ${isSentByMe ? 'sent' : 'received'}`}>
                      <div className="message-meta">
                        {!isSentByMe && <span>{msg.senderName}</span>}
                      </div>
                      <div className="message-text">{msg.message}</div>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input form - only active if ticket not closed/rejected */}
            {!['Closed', 'Rejected'].includes(complaint.status) ? (
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  placeholder="Type a message to coordinate..."
                  className="form-control chat-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sendingMsg}
                />
                <button type="submit" className="btn btn-primary chat-send-btn" disabled={sendingMsg || !newMessage.trim()}>
                  <Send size={18} />
                </button>
              </form>
            ) : (
              <div className="chat-locked-alert">
                <span>Thread locked: Ticket is finalized.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .complaint-detail-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .back-btn {
          align-self: flex-start;
          margin-bottom: 8px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 24px;
          align-items: start;
        }

        .detail-left-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ticket-card-details {
          padding: 28px;
          border-radius: var(--radius-lg);
        }

        .detail-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .detail-meta-badges {
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

        .detail-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .detail-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .detail-info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          border-top: 1px solid var(--border-glass);
          padding-top: 20px;
        }

        .info-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .info-icon {
          color: var(--text-muted);
        }

        .info-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .info-value {
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .uploaded-photo-section {
          margin-top: 24px;
          border-top: 1px solid var(--border-glass);
          padding-top: 20px;
        }

        .attached-image-container {
          margin-top: 10px;
          border-radius: var(--radius-md);
          overflow: hidden;
          max-height: 320px;
          border: 1px solid var(--border-glass);
          background: rgba(0, 0, 0, 0.2);
          display: inline-block;
        }

        .attached-image {
          max-width: 100%;
          max-height: 320px;
          object-fit: contain;
          display: block;
        }

        .timeline-card-wrapper {
          border-radius: var(--radius-lg);
        }

        /* Feedback Panel */
        .feedback-panel, .feedback-display-panel {
          padding: 24px;
          border-radius: var(--radius-lg);
        }

        .feedback-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .feedback-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .star-rating-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          transition: transform 0.1s ease;
        }

        .star-btn:hover {
          transform: scale(1.1);
        }

        .star-rating-display {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }

        .feedback-comments {
          font-size: 0.9rem;
          font-style: italic;
          color: var(--text-secondary);
          border-left: 2px solid var(--border-glass);
          padding-left: 12px;
        }

        /* Chat Panel */
        .chat-card {
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          height: calc(100vh - 120px);
          max-height: 700px;
          min-height: 500px;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px;
          border-bottom: 1px solid var(--border-glass);
        }

        .chat-header-icon {
          color: var(--primary);
        }

        .chat-messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .chat-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
          font-size: 0.85rem;
          text-align: center;
          padding: 20px;
        }

        .chat-input-form {
          padding: 16px;
          border-top: 1px solid var(--border-glass);
          display: flex;
          gap: 10px;
        }

        .chat-input {
          flex: 1;
          font-size: 0.88rem;
          padding: 10px 14px;
        }

        .chat-send-btn {
          padding: 10px;
          border-radius: var(--radius-md);
        }

        .chat-locked-alert {
          padding: 16px;
          border-top: 1px solid var(--border-glass);
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 500;
          background: rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 992px) {
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .chat-card {
            height: 500px;
          }
        }
      `}</style>
    </div>
  );
};
