import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ComplaintCard } from '../components/ComplaintCard';
import { Toast } from '../components/Toast';
import { Plus, ListFilter, Clipboard, AlertCircle } from 'lucide-react';

export const StudentDashboard = ({ onViewDetails, activeTab, setActiveTab }) => {
  const { apiFetch } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electrical');
  const [severity, setSeverity] = useState('Low');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/complaints');
      setComplaints(data);
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to fetch complaints', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setToast({ message: 'Title and description are required', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('severity', severity);
      if (image) {
        formData.append('image', image);
      }

      await apiFetch('/complaints', {
        method: 'POST',
        body: formData
      });

      setToast({ message: 'Complaint lodged successfully!', type: 'success' });
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Electrical');
      setSeverity('Low');
      setImage(null);
      
      // Redirect to list and reload
      setActiveTab('dashboard');
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Error submitting complaint', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return ['Pending', 'Assigned', 'In Progress'].includes(c.status);
    return c.status === filter;
  });

  const categories = ['Electrical', 'Plumbing', 'Carpentry', 'IT Support / Wi-Fi', 'Housekeeping', 'Others'];
  const severities = ['Low', 'Medium', 'High'];

  return (
    <div className="student-dashboard">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="dashboard-header-row">
        <div>
          <h1 className="page-title">Student Portal</h1>
          <p className="page-subtitle">Track, file, and coordinate maintenance for your hostel room</p>
        </div>
      </div>

      {activeTab === 'new' ? (
        <div className="form-panel-container glass-panel">
          <div className="panel-header">
            <Plus size={22} className="panel-icon" />
            <h3>Lodge a New Complaint</h3>
          </div>

          <form onSubmit={handleFormSubmit} className="complaint-form">
            <div className="form-group">
              <label className="form-label">Complaint Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Brief summary of the issue (e.g. Bathroom light flickering)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Severity Level</label>
                <select
                  className="form-control"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  {severities.map(sev => (
                    <option key={sev} value={sev}>{sev}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Please describe the issue in detail, including specific locations in the room or steps to reproduce..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attach Photo (Optional)</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="image-upload"
                  className="file-input-hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <label htmlFor="image-upload" className="file-upload-label">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{ marginBottom: '8px', color: 'var(--primary)' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  <span>{image ? image.name : 'Choose a file or drop here'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>PNG, JPG or WEBP up to 5MB</span>
                </label>
              </div>
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('dashboard')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="complaints-list-section">
          <div className="filter-bar-container">
            <div className="filter-title">
              <ListFilter size={16} />
              <span>Filter:</span>
            </div>
            <div className="filter-buttons">
              {['All', 'Active', 'Resolved', 'Closed'].map((btn) => (
                <button
                  key={btn}
                  className={`filter-btn ${filter === btn ? 'active' : ''}`}
                  onClick={() => setFilter(btn)}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <span>Fetching your complaints...</span>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="empty-state glass-panel">
              <Clipboard size={48} className="empty-icon" />
              <h3>No complaints found</h3>
              <p>You do not have any complaints in the "{filter}" category.</p>
              <button className="btn btn-primary" onClick={() => setActiveTab('new')} style={{ marginTop: '16px' }}>
                File a Complaint
              </button>
            </div>
          ) : (
            <div className="card-list">
              {filteredComplaints.map((c) => (
                <ComplaintCard key={c.id} complaint={c} onViewDetails={onViewDetails} />
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .student-dashboard {
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

        .form-panel-container {
          padding: 32px;
          border-radius: var(--radius-lg);
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 16px;
          margin-bottom: 24px;
        }

        .panel-icon {
          color: var(--primary);
        }

        .complaint-form textarea {
          resize: vertical;
        }

        .form-row {
          display: flex;
          gap: 16px;
        }

        .form-row .form-group {
          flex: 1;
        }

        .file-upload-wrapper {
          position: relative;
          width: 100%;
        }

        .file-input-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .file-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(15, 23, 42, 0.6);
          border: 2px dashed var(--border-glass);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
          text-align: center;
        }

        .file-upload-label:hover {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.03);
        }

        .file-upload-label span {
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .filter-bar-container {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .filter-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          padding: 6px 14px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: var(--transition);
        }

        .filter-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }

        .filter-btn.active {
          color: #fff;
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          gap: 16px;
          color: var(--text-secondary);
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255, 255, 255, 0.05);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          text-align: center;
          border-radius: var(--radius-lg);
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 320px;
        }

        @media (max-width: 576px) {
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          .filter-bar-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};
