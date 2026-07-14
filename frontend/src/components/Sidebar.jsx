import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Wrench, 
  LogOut, 
  User, 
  Activity,
  AlertCircle
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const renderNavLinks = () => {
    switch (user.role) {
      case 'Warden':
        return (
          <>
            <button 
              className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <Activity size={20} />
              <span>System Health</span>
            </button>
          </>
        );
      case 'Staff':
        return (
          <>
            <button 
              className={`sidebar-link ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <Wrench size={20} />
              <span>My Tasks</span>
            </button>
          </>
        );
      case 'Student':
      default:
        return (
          <>
            <button 
              className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <ClipboardList size={20} />
              <span>My Complaints</span>
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              <PlusCircleIcon size={20} />
              <span>File Complaint</span>
            </button>
          </>
        );
    }
  };

  return (
    <div className="sidebar-container glass-panel">
      <div className="sidebar-brand">
        <AlertCircle className="brand-icon" size={28} />
        <div>
          <h2>HostelHub</h2>
          <span className="brand-subtitle">Smart Complaints</span>
        </div>
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h4>{user.name}</h4>
          {user.role === 'Student' && (
            <span className="profile-detail">{user.room} • {user.block}</span>
          )}
          {user.role === 'Staff' && (
            <span className="profile-detail">{user.staffCategory} Staff</span>
          )}
          {user.role === 'Warden' && (
            <span className="profile-detail">Chief Warden</span>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {renderNavLinks()}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>

      <style>{`
        .sidebar-container {
          width: 280px;
          height: calc(100vh - 40px);
          margin: 20px 0 20px 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-glass);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-glass);
          margin-bottom: 24px;
        }

        .brand-icon {
          color: var(--primary);
          filter: drop-shadow(0 0 8px var(--primary-glow));
        }

        .brand-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .sidebar-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          margin-bottom: 24px;
        }

        .profile-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: bold;
          font-size: 1.2rem;
          color: #fff;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
        }

        .profile-info h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .profile-detail {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: none;
          border: none;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 500;
          text-align: left;
          transition: var(--transition);
          width: 100%;
        }

        .sidebar-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.04);
        }

        .sidebar-link.active {
          color: #fff;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.1));
          border: 1px solid var(--border-glow);
          box-shadow: inset 0 0 10px rgba(99, 102, 241, 0.05);
        }

        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: none;
          border: none;
          color: #fca5a5;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 500;
          text-align: left;
          transition: var(--transition);
          width: 100%;
          margin-top: auto;
        }

        .sidebar-logout:hover {
          background: rgba(239, 68, 68, 0.05);
          color: #f87171;
        }

        @media (max-width: 768px) {
          .sidebar-container {
            width: 100%;
            height: 60px;
            margin: 0;
            padding: 8px 16px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            border-radius: 0;
            border-bottom: 1px solid var(--border-glass);
            border-top: none;
            border-left: none;
            border-right: none;
          }

          .sidebar-brand {
            padding-bottom: 0;
            border-bottom: none;
            margin-bottom: 0;
          }

          .sidebar-brand h2, .brand-subtitle, .sidebar-profile, .sidebar-logout span {
            display: none;
          }

          .sidebar-profile {
            display: none;
          }

          .sidebar-nav {
            flex-direction: row;
            flex: none;
            gap: 4px;
          }

          .sidebar-link {
            padding: 8px 12px;
          }

          .sidebar-link span {
            display: none;
          }

          .sidebar-logout {
            margin-top: 0;
            width: auto;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

// Quick custom icon replacement since we want to avoid extra overhead if Lucide icons differ slightly
const PlusCircleIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
