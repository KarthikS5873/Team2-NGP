// App.jsx - Main router with protected routes
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GuidancePage from './pages/GuidancePage';
import SeniorConnectPage from './pages/SeniorConnectPage';
import CommunityPage from './pages/CommunityPage';
import KnowledgeVaultPage from './pages/KnowledgeVaultPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/guidance"
            element={<ProtectedRoute><GuidancePage /></ProtectedRoute>}
          />
          <Route
            path="/senior-connect"
            element={<ProtectedRoute><SeniorConnectPage /></ProtectedRoute>}
          />
          <Route
            path="/community"
            element={<ProtectedRoute><CommunityPage /></ProtectedRoute>}
          />
          <Route
            path="/vault"
            element={<ProtectedRoute><KnowledgeVaultPage /></ProtectedRoute>}
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
