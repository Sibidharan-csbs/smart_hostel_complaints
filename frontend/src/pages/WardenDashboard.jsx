import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { ComplaintCard } from '../components/ComplaintCard';
import { Toast } from '../components/Toast';
import { 
  ClipboardList, 
  AlertTriangle, 
  Wrench, 
  CheckCircle, 
  Hourglass, 
  UserCheck, 
  Search,
  Filter,
  BarChart3
} from 'lucide-react';

export const WardenDashboard = ({ onViewDetails, activeTab }) => {
  const { apiFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  // Local state for assignments to avoid full reload
  const [assigningId, setAssigningId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsData = await apiFetch('/admin/stats');
      setStats(statsData);

      const complaintsData = await apiFetch('/complaints');
      setComplaints(complaintsData);

      const staffData = await apiFetch('/auth/staff');
      setStaff(staffData);
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to load system data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAssign = async (complaintId, staffId) => {
    if (!staffId) return;
    setAssigningId(complaintId);
    try {
      await apiFetch(`/complaints/${complaintId}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ staffId })
      });
      setToast({ message: 'Task assigned successfully!', type: 'success' });
      
      // Reload stats and list
      const statsData = await apiFetch('/admin/stats');
      setStats(statsData);
      const complaintsData = await apiFetch('/complaints');
      setComplaints(complaintsData);
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to assign task', type: 'error' });
    } finally {
      setAssigningId(null);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    // Search filter
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.rollNumber && c.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    // Category filter
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;

    // Severity filter
    const matchesSeverity = severityFilter === 'All' || c.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesSeverity;
  });

  const categories = ['Electrical', 'Plumbing', 'Carpentry', 'IT Support / Wi-Fi', 'Housekeeping', 'Others'];
  const severities = ['Low', 'Medium', 'High'];
  const statuses = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected', 'Closed'];

  if (loading && !stats) {
    return (
      <div className="loading-state" style={{ height: '70vh' }}>
        <div className="spinner"></div>
        <span>Loading Warden console...</span>
      </div>
    );
  }

  return (
    <div className="warden-dashboard">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="dashboard-header-row">
        <div>
          <h1 className="page-title">Warden Console</h1>
          <p className="page-subtitle">Oversee lodging requests, assign staff, and analyze resolution flow</p>
        </div>
      </div>

      {activeTab === 'analytics' && stats ? (
        <div className="analytics-section">
          <div className="stats-grid">
            <StatCard 
              title="Total Raised" 
              value={stats.summary.total} 
              icon={<ClipboardList size={22} />}
              color="var(--primary)"
              glowColor="var(--primary-glow)"
            />
            <StatCard 
              title="Pending Action" 
              value={stats.summary.pending} 
              icon={<AlertTriangle size={22} />}
              color="var(--color-pending)"
              glowColor="rgba(245, 158, 11, 0.4)"
            />
            <StatCard 
              title="In Progress" 
              value={stats.summary.inProgress + stats.summary.assigned} 
              icon={<Wrench size={22} />}
              color="var(--color-progress)"
              glowColor="rgba(139, 92, 246, 0.4)"
            />
            <StatCard 
              title="Avg Resolution" 
              value={`${stats.summary.averageResolutionHours}h`} 
              icon={<Hourglass size={22} />}
              color="var(--accent)"
              glowColor="rgba(236, 72, 153, 0.4)"
              description="From filing to resolve"
            />
          </div>

          <div className="analytics-charts glass-panel">
            <div className="charts-header">
              <BarChart3 size={20} className="charts-icon" />
              <h3>Complaints by Category</h3>
            </div>
            
            <div className="custom-bar-chart">
              {categories.map(cat => {
                const count = stats.categories[cat] || 0;
                const percent = stats.summary.total > 0 ? (count / stats.summary.total) * 100 : 0;
                return (
                  <div key={cat} className="chart-row">
                    <span className="chart-label">{cat}</span>
                    <div className="chart-bar-container">
                      <div 
                        className="chart-bar" 
                        style={{ 
                          width: `${percent || 2}%`, 
                          background: `linear-gradient(90deg, var(--primary), var(--secondary))`
                        }}
                      />
                    </div>
                    <span className="chart-value">{count} ticket{count !== 1 ? 's' : ''}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="tickets-section">
          {/* Stats Bar */}
          {stats && (
            <div className="stats-grid">
              <StatCard 
                title="Pending Action" 
                value={stats.summary.pending} 
                icon={<AlertTriangle size={20} />}
                color="var(--color-pending)"
                glowColor="rgba(245, 158, 11, 0.2)"
              />
              <StatCard 
                title="Active Issues" 
                value={stats.summary.pending + stats.summary.assigned + stats.summary.inProgress} 
                icon={<Hourglass size={20} />}
                color="var(--color-assigned)"
                glowColor="rgba(59, 130, 246, 0.2)"
              />
              <StatCard 
                title="Resolved Tickets" 
                value={stats.summary.resolved} 
                icon={<CheckCircle size={20} />}
                color="var(--color-resolved)"
                glowColor="rgba(16, 185, 129, 0.2)"
              />
            </div>
          )}

          {/* Filtering Console */}
          <div className="filter-console glass-panel">
            <div className="search-bar-row">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by student, roll number, room, or title..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filters-row">
              <div className="filter-select-group">
                <Filter size={14} className="filter-label-icon" />
                <span>Status:</span>
                <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="filter-select-group">
                <Filter size={14} className="filter-label-icon" />
                <span>Category:</span>
                <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="filter-select-group">
                <Filter size={14} className="filter-label-icon" />
                <span>Severity:</span>
                <select className="filter-select" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                  <option value="All">All Severities</option>
                  {severities.map(sev => <option key={sev} value={sev}>{sev}</option>)}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <span>Fetching tickets queue...</span>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="empty-state glass-panel">
              <ClipboardList size={48} className="empty-icon" />
              <h3>No tickets match criteria</h3>
              <p>Try modifying your search queries or filter selections above.</p>
            </div>
          ) : (
            <div className="warden-cards-list">
              {filteredComplaints.map(c => (
                <div key={c.id} className="warden-ticket-row-wrapper">
                  <ComplaintCard complaint={c} onViewDetails={onViewDetails} />
                  
                  {/* Assignment Control for Pending or Re-assigning */}
                  {(c.status === 'Pending' || c.status === 'Assigned') && (
                    <div className="assignment-panel glass-panel">
                      <div className="assign-header">
                        <UserCheck size={16} className="assign-icon" />
                        <span>{c.status === 'Pending' ? 'Assign Technician:' : 'Reassign Technician:'}</span>
                      </div>
                      <select
                        className="form-control assign-select"
                        disabled={assigningId === c.id}
                        value={c.assignedTo || ''}
                        onChange={(e) => handleAssign(c.id, e.target.value)}
                      >
                        <option value="">-- Choose Staff Member --</option>
                        {staff
                          .filter(s => s.staffCategory === c.category || c.category === 'Others')
                          .map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.staffCategory})
                            </option>
                          ))
                        }
                        {/* Fallback to show all staff if no category match */}
                        {staff.filter(s => s.staffCategory === c.category).length === 0 && 
                          staff.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.staffCategory})
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .warden-dashboard {
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

        /* Charts section */
        .analytics-charts {
          padding: 28px;
          border-radius: var(--radius-lg);
          margin-top: 12px;
        }

        .charts-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 14px;
        }

        .charts-icon {
          color: var(--primary);
        }

        .custom-bar-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chart-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .chart-label {
          width: 140px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-align: right;
        }

        .chart-bar-container {
          flex: 1;
          height: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--border-glass);
        }

        .chart-bar {
          height: 100%;
          border-radius: 6px;
          transition: width 1s ease-in-out;
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .chart-value {
          width: 80px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Filtering console */
        .filter-console {
          padding: 20px;
          border-radius: var(--radius-lg);
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .search-input-wrapper {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input-wrapper .form-control {
          padding-left: 44px;
        }

        .filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .filter-select-group {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .filter-label-icon {
          color: var(--text-muted);
        }

        .filter-select {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          color: var(--text-primary);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          outline: none;
          cursor: pointer;
        }

        .filter-select:focus {
          border-color: var(--primary);
        }

        /* Ticket rows & assignment */
        .warden-cards-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .warden-ticket-row-wrapper {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 16px;
        }

        .assignment-panel {
          padding: 20px;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
        }

        .assign-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .assign-icon {
          color: var(--primary);
        }

        .assign-select {
          font-size: 0.85rem;
          padding: 10px;
        }

        @media (max-width: 992px) {
          .warden-ticket-row-wrapper {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .assignment-panel {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};
