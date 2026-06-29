import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
    <rect width="32" height="32" rx="8" fill="url(#login-logo-grad)" />
    <path d="M10 22L16 10L22 22H10Z" fill="#ffffff" />
    <path d="M16 14L19 20H13L16 14Z" fill="#06b6d4" />
    <defs>
      <linearGradient id="login-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('venturizer_authenticated') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@venturizer.com' && password === 'venturizer123') {
      localStorage.setItem('venturizer_authenticated', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <div className="login-brand" onClick={() => navigate('/')}>
          <Logo />
          <span>Venturizer</span>
        </div>
      </header>

      <main className="login-card-wrapper">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome Back</h2>
            <p>Log in to access the administrator dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="login-error-msg">{error}</div>}

            <div className="login-form-group">
              <label htmlFor="email-input">Email</label>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="admin@venturizer.com"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="login-submit-btn">
              Login
            </button>
          </form>

          <div className="demo-credentials-box">
            <h4>Demo Credentials</h4>
            <div className="demo-credentials-row">
              <span className="demo-label">Email:</span>
              <span className="demo-val">admin@venturizer.com</span>
            </div>
            <div className="demo-credentials-row">
              <span className="demo-label">Password:</span>
              <span className="demo-val">venturizer123</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <p>&copy; {new Date().getFullYear()} Venturizer. All rights reserved.</p>
      </footer>
    </div>
  );
}
