import React, { useEffect } from 'react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const getStyle = () => {
    switch (type) {
      case 'error':
        return {
          borderLeft: '4px solid var(--sev-high)',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
          background: 'rgba(28, 15, 20, 0.95)'
        };
      case 'info':
        return {
          borderLeft: '4px solid var(--color-assigned)',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.25)',
          background: 'rgba(15, 23, 42, 0.95)'
        };
      case 'success':
      default:
        return {
          borderLeft: '4px solid var(--color-resolved)',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
          background: 'rgba(15, 28, 23, 0.95)'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg style={{ color: 'var(--sev-high)' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case 'info':
        return (
          <svg style={{ color: 'var(--color-assigned)' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case 'success':
      default:
        return (
          <svg style={{ color: 'var(--color-resolved)' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-glass)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        ...getStyle()
      }}
    >
      {getIcon()}
      <span style={{ fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '8px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Add inline CSS for animation */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
