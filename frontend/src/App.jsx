import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import StateBlock from './components/StateBlock';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const Dashboard = lazy(() => import('./components/Dashboard'));

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleDashboardClick = () => {
    const isAuthed = localStorage.getItem('venturizer_authenticated') === 'true';
    if (isAuthed) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          type="button"
          onClick={() => navigate('/')}
          aria-label="Venturizer home"
        >
          Venturizer
        </button>
        <nav className="nav-tabs" aria-label="Primary navigation">
          <button
            className={currentPath === '/chat' ? 'active' : ''}
            type="button"
            aria-current={currentPath === '/chat' ? 'page' : undefined}
            onClick={() => navigate('/chat')}
          >
            Assistant
          </button>
          <button
            className={currentPath === '/dashboard' ? 'active' : ''}
            type="button"
            aria-current={currentPath === '/dashboard' ? 'page' : undefined}
            onClick={handleDashboardClick}
          >
            Dashboard
          </button>
        </nav>
      </header>

      <main id="main-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Existing Chatbot */}
        <Route
          path="/chat"
          element={
            <Layout>
              <Chatbot />
            </Layout>
          }
        />

        {/* Existing Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<StateBlock title="Loading dashboard" message="Preparing lead data…" />}>
                  <Dashboard />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
