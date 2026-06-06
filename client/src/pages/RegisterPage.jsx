// Register Page with role selection
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const roles = [
  { value: 'junior', label: 'Junior', icon: '🌱', desc: '1st or 2nd year' },
  { value: 'senior', label: 'Senior', icon: '🚀', desc: '3rd or final year' },
  { value: 'mentor', label: 'Mentor', icon: '🎯', desc: 'Alumni / Professional' },
];

const years = ['1st Year', '2nd Year', '3rd Year', 'Final Year'];

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'junior', department: '', year: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRoleSelect = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <div className="auth-logo">🎓</div>
          <h1 className="gradient-text">Join CampusBridge</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Start your AI-powered career journey
          </p>
        </div>

        <div className="auth-card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Create Account</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@university.edu"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div className="role-grid">
                {roles.map((role) => (
                  <div
                    key={role.value}
                    className={`role-card ${form.role === role.value ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect(role.value)}
                    id={`role-${role.value}`}
                  >
                    <div className="role-card-icon">{role.icon}</div>
                    <div className="role-card-label">{role.label}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {role.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-department">Department</label>
                <input
                  id="reg-department"
                  name="department"
                  type="text"
                  className="form-input"
                  placeholder="e.g. CSE, AI, ECE"
                  value={form.department}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-year">Current Year</label>
                <select
                  id="reg-year"
                  name="year"
                  className="form-select"
                  value={form.year}
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? '⏳ Creating account...' : '✨ Create Account'}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
