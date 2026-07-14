import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, Shield } from 'lucide-react';

export const Login = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    const result = await login(identifier, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="login-logo">
            <Shield size={36} />
          </div>
          <h2>HostelHub Login</h2>
          <p>Access your student, staff, or warden portal</p>
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
          <div className="form-group">
            <label className="form-label">Email or Roll Number</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="text"
                className="form-control"
                placeholder="student@hostel.com or 717821C201"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ width: '100%', marginTop: '12px' }}>
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Are you a student with no account? </span>
          <button className="auth-link-btn" onClick={onNavigateToRegister}>
            Register Here
          </button>
        </div>
      </div>

      <style>{`
        .login-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 40px;
          border-radius: var(--radius-lg);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo {
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

        .login-header h2 {
          font-size: 1.8rem;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .login-header p {
          font-size: 0.88rem;
          color: var(--text-secondary);
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
      `}</style>
    </div>
  );
};
