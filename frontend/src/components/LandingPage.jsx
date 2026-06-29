import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
    <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
    <path d="M10 22L16 10L22 22H10Z" fill="#ffffff" />
    <path d="M16 14L19 20H13L16 14Z" fill="#06b6d4" />
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

const AIIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#feature-grad-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-card-icon">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6v12M6 12h12" />
    <circle cx="12" cy="12" r="3" fill="#6366f1" fillOpacity="0.2" />
    <defs>
      <linearGradient id="feature-grad-1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" strokeWidth="2" />
        <stop offset="1" stopColor="#06b6d4" strokeWidth="2" />
      </linearGradient>
    </defs>
  </svg>
);

const ScoringIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#feature-grad-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-card-icon">
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
    <circle cx="19" cy="9" r="1" fill="#06b6d4" />
    <circle cx="14" cy="14" r="1" fill="#06b6d4" />
    <defs>
      <linearGradient id="feature-grad-2" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

const DashboardIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#feature-grad-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-card-icon">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
    <defs>
      <linearGradient id="feature-grad-3" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="workflow-arrow">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    const isAuthed = localStorage.getItem('venturizer_authenticated') === 'true';
    if (isAuthed) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="landing-brand" onClick={() => navigate('/')}>
          <Logo />
          <span>Venturizer</span>
        </div>
        <nav className="landing-nav">
          <button className="landing-nav-link" onClick={() => navigate('/chat')}>
            Start Qualification
          </button>
          <button className="landing-nav-btn" onClick={handleDashboardClick}>
            Dashboard
          </button>
        </nav>
      </header>

      <main className="landing-hero-section">
        <div className="hero-content">
          <div className="hero-badge">Next-Gen Qualification</div>
          <h1 className="hero-title">
            AI-Powered Founder &amp; Investor Qualification
          </h1>
          <p className="hero-subtitle">
            Qualify startup founders and investors through an AI-driven conversational workflow with intelligent validation and scoring.
          </p>
          <div className="hero-actions">
            <button className="landing-primary-btn" onClick={() => navigate('/chat')}>
              Start Qualification
            </button>
            <button className="landing-secondary-btn" onClick={handleDashboardClick}>
              Dashboard
            </button>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <AIIcon />
            </div>
            <h3 className="feature-card-title">AI Qualification</h3>
            <p className="feature-card-desc">
              Every answer is validated using Gemini AI before submission.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <ScoringIcon />
            </div>
            <h3 className="feature-card-title">Hybrid Scoring</h3>
            <p className="feature-card-desc">
              Rule-based scoring enhanced with AI quality analysis.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <DashboardIcon />
            </div>
            <h3 className="feature-card-title">Admin Dashboard</h3>
            <p className="feature-card-desc">
              Review, search and manage qualified founder and investor leads.
            </p>
          </div>
        </div>

        <div className="workflow-section">
          <h2 className="workflow-title">Qualification Workflow</h2>
          <div className="workflow-track">
            <div className="workflow-step">
              <div className="workflow-step-num">1</div>
              <span className="workflow-step-text">Founder / Investor</span>
            </div>
            <ArrowRightIcon />
            <div className="workflow-step">
              <div className="workflow-step-num">2</div>
              <span className="workflow-step-text">AI Conversation</span>
            </div>
            <ArrowRightIcon />
            <div className="workflow-step">
              <div className="workflow-step-num">3</div>
              <span className="workflow-step-text">Gemini Validation</span>
            </div>
            <ArrowRightIcon />
            <div className="workflow-step">
              <div className="workflow-step-num">4</div>
              <span className="workflow-step-text">Hybrid Scoring</span>
            </div>
            <ArrowRightIcon />
            <div className="workflow-step">
              <div className="workflow-step-num">5</div>
              <span className="workflow-step-text">Dashboard Review</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Logo />
            <span>Venturizer</span>
          </div>
          <p className="footer-tagline">AI-powered lead qualification platform.</p>
          <p className="footer-copy">&copy; {new Date().getFullYear()} Venturizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
