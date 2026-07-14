import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/StudentDashboard';
import { WardenDashboard } from './pages/WardenDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { ComplaintDetail } from './pages/ComplaintDetail';

function AppContent() {
  const { user, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        color: 'var(--text-secondary)'
      }}>
        <div className="spinner"></div>
        <span style={{ fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.05em' }}>Resolving session profile...</span>
      </div>
    );
  }

  // Handle Unauthenticated State
  if (!user) {
    return isRegistering ? (
      <Register onNavigateToLogin={() => setIsRegistering(false)} />
    ) : (
      <Login onNavigateToRegister={() => setIsRegistering(true)} />
    );
  }

  // Handle Authenticated State
  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedComplaintId(null); // Clear selected complaint on tab switch
      }} />

      {/* Main viewport */}
      <main className="main-content">
        {selectedComplaintId ? (
          <ComplaintDetail 
            complaintId={selectedComplaintId} 
            onBack={() => setSelectedComplaintId(null)} 
          />
        ) : (
          <>
            {user.role === 'Student' && (
              <StudentDashboard 
                onViewDetails={setSelectedComplaintId}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
            {user.role === 'Warden' && (
              <WardenDashboard 
                onViewDetails={setSelectedComplaintId}
                activeTab={activeTab}
              />
            )}
            {user.role === 'Staff' && (
              <StaffDashboard 
                onViewDetails={setSelectedComplaintId}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
