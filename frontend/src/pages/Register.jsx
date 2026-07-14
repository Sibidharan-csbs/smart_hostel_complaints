import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Key, Home, Hash, FileText } from 'lucide-react';

export const Register = ({ onNavigateToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [block, setBlock] = useState('Kaveri Block');
  const [room, setRoom] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !rollNumber || !block || !room || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    const result = await register(name, email, password, rollNumber, block, room);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
  };

  const blocks = [
    'Kaveri Block',
    'Ganga Block',
    'Yamuna Block',
    'Narmada Block',
    'Sindhu Block'
  ];

  return (
    <div className="register-wrapper">
      <div className="register-card glass-panel">
        <div className="register-header">
          <div className="register-logo">
            <UserPlus size={36} />
          </div>
          <h2>Student Registration</h2>
          <p>Create your profile to log maintenance tickets</p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Adithya Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-control"
                  placeholder="student@hostel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <div className="input-with-icon">
                <Hash className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="717821C201"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hostel Block</label>
              <div className="input-with-icon">
                <Home className="input-icon" size={18} />
                <select
                  className="form-control"
                  style={{ appearance: 'none', paddingLeft: '44px' }}
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  required
                >
                  {blocks.map(b => (
                    <option key={b} value={b} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Room Number</label>
              <div className="input-with-icon">
                <FileText className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="304-B"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Key className="input-icon" size={18} />
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ width: '100%', marginTop: '12px' }}>
            {loading ? 'Registering Account...' : (
              <>
                <UserPlus size={18} />
                <span>Create Profile</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <button className="auth-link-btn" onClick={onNavigateToLogin}>
            Sign In Here
          </button>
        </div>
      </div>

      <style>{`
        .register-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }

        .register-card {
          width: 100%;
          max-width: 600px;
          padding: 40px;
          border-radius: var(--radius-lg);
        }

        .register-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .register-logo {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          margin-bottom: 16px;
          box-shadow: 0 0 20px var(--primary-glow);
        }

        .register-header h2 {
          font-size: 1.8rem;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .register-header p {
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        .form-row {
          display: flex;
          gap: 16px;
        }

        .form-row .form-group {
          flex: 1;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon .form-control {
          padding-left: 44px;
        }

        .auth-error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: var(--radius-md);
          color: #fca5a5;
          font-size: 0.88rem;
          margin-bottom: 24px;
        }

        .auth-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        .auth-link-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font-body);
          text-decoration: underline;
        }

        .auth-link-btn:hover {
          color: var(--secondary);
        }

        @media (max-width: 576px) {
          .form-row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};
