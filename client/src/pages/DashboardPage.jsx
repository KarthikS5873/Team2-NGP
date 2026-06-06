// Dashboard Page - profile card + navigation cards
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const navCards = [
  {
    path: '/guidance',
    icon: '🤖',
    title: 'AI Guidance',
    desc: 'Get personalized career roadmap',
    color: 'rgba(99,102,241,0.15)',
  },
  {
    path: '/senior-connect',
    icon: '🤝',
    title: 'Senior Connect',
    desc: 'Get help from seniors & mentors',
    color: 'rgba(139,92,246,0.15)',
  },
  {
    path: '/community',
    icon: '💬',
    title: 'Community',
    desc: 'Share doubts and resources',
    color: 'rgba(34,211,238,0.1)',
  },
  {
    path: '/vault',
    icon: '📚',
    title: 'Knowledge Vault',
    desc: 'Explore curated senior resources',
    color: 'rgba(16,185,129,0.1)',
  },
];

const tips = [
  '💡 Use AI Guidance to get a personalized career roadmap.',
  '🤝 Post a help request to connect with seniors who\'ve been there.',
  '📚 Check the Knowledge Vault for interview tips and project notes.',
  '💬 Share your doubts in the Community — someone has the answer!',
];

const DashboardPage = () => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleBadgeClass = (role) => {
    const map = { junior: 'badge-junior', senior: 'badge-senior', mentor: 'badge-mentor' };
    return map[role] || 'badge-junior';
  };

  // Random daily tip
  const tip = tips[new Date().getDay() % tips.length];

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-container fade-in">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-lg">{getInitials(user?.name)}</div>
            <div className="profile-details">
              <h2>{getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h2>
              <p>{user?.email}</p>
              <div className="stats-row">
                <span className={`badge ${getRoleBadgeClass(user?.role)}`}>
                  {user?.role === 'junior' ? '🌱' : user?.role === 'senior' ? '🚀' : '🎯'} {user?.role}
                </span>
                {user?.department && (
                  <span className="stat-chip">🏛️ {user.department}</span>
                )}
                {user?.year && (
                  <span className="stat-chip">📅 {user.year}</span>
                )}
              </div>
            </div>
          </div>

          {/* Daily Tip */}
          <div className="card card-glass" style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--accent-tertiary)' }}>Daily Tip: </strong>
              {tip}
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="page-header">
            <h2>Quick Access</h2>
          </div>
          <div className="dashboard-grid">
            {navCards.map((card) => (
              <Link
                key={card.path}
                to={card.path}
                className="card nav-card"
                id={`nav-card-${card.title.toLowerCase().replace(/\s/g, '-')}`}
                style={{ background: card.color, border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="nav-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </Link>
            ))}
          </div>

          {/* Welcome message for new users */}
          <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>🚀 Start Your Journey</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Begin with AI Guidance to get a personalized career roadmap tailored to your goals.
            </p>
            <Link to="/guidance" className="btn btn-primary" id="get-started-btn">
              Get AI Guidance →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
