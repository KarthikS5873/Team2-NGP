// Navbar (Sidebar) component with navigation links and user info
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/guidance', label: 'AI Guidance', icon: '🤖' },
  { path: '/senior-connect', label: 'Senior Connect', icon: '🤝' },
  { path: '/community', label: 'Community', icon: '💬' },
  { path: '/vault', label: 'Knowledge Vault', icon: '📚' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadgeClass = (role) => {
    const map = { junior: 'badge-junior', senior: 'badge-senior', mentor: 'badge-mentor' };
    return map[role] || 'badge-junior';
  };

  return (
    <nav className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <h2>🎓 CampusBridge AI</h2>
        <p>Your career launchpad</p>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* User Info & Logout */}
      <div className="sidebar-footer">
        {user && (
          <div className="user-info">
            <div className="user-avatar">{getInitials(user.name)}</div>
            <div>
              <div className="user-name">{user.name}</div>
              <span className={`badge ${getRoleBadgeClass(user.role)}`} style={{ marginTop: '2px' }}>
                {user.role}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm btn-full"
          id="logout-btn"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
