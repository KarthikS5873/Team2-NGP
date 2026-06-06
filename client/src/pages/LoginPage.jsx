// Login Page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">🎓</div>
          <h1 className="gradient-text">CampusBridge AI</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Your AI-powered career launchpad
          </p>
        </div>

        {/* Login Card */}
        <div className="auth-card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Welcome back</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@university.edu"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? '⏳ Signing in...' : '🚀 Sign In'}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
