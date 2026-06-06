// Senior Connect Page - Help request creation and browsing
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const categories = ['career', 'project', 'internship', 'skills', 'academics', 'other'];

const SeniorConnectPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(user?.role === 'junior' ? 'my-requests' : 'all-requests');
  const [form, setForm] = useState({ title: '', description: '', category: 'other' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      // Seniors/mentors see all open requests
      const endpoint = (user?.role === 'senior' || user?.role === 'mentor')
        ? '/help/all'
        : '/help/requests';
      const { data } = await api.get(endpoint);
      setRequests(data.requests || []);
    } catch (err) {
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/help/request', form);
      setSuccess('Help request posted successfully!');
      setForm({ title: '', description: '', category: 'other' });
      setShowForm(false);
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.put(`/help/accept/${id}`);
      setSuccess('Request accepted! Connect with the student.');
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await api.delete(`/help/request/${id}`);
      loadRequests();
    } catch (err) {
      setError('Failed to delete request.');
    }
  };

  const myRequests = requests.filter(r => r.studentId === user?.id || r.studentId?._id === user?.id || r.studentId === user?._id);
  const allOpen = requests.filter(r => r.status === 'open');
  const displayRequests = activeTab === 'my-requests' ? myRequests : allOpen;

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-container fade-in">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1>🤝 Senior Connect</h1>
              <p>Get help from seniors and mentors who've walked the path before.</p>
            </div>
            {user?.role === 'junior' && (
              <button
                className="btn btn-primary"
                id="create-request-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? '✕ Cancel' : '+ Post Request'}
              </button>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="help-layout">
            {/* Left: Form (juniors) or Info (seniors) */}
            <div>
              {user?.role === 'junior' && showForm && (
                <div className="card fade-in">
                  <h3 style={{ marginBottom: '1.5rem' }}>📝 Post a Help Request</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="req-title">Title</label>
                      <input
                        id="req-title"
                        name="title"
                        type="text"
                        className="form-input"
                        placeholder="e.g. How to prepare for ML internship?"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="req-category">Category</label>
                      <select
                        id="req-category"
                        name="category"
                        className="form-select"
                        value={form.category}
                        onChange={handleChange}
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="req-desc">Description</label>
                      <textarea
                        id="req-desc"
                        name="description"
                        className="form-textarea"
                        placeholder="Describe what you need help with in detail..."
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={5}
                      />
                    </div>

                    <button
                      id="submit-request-btn"
                      type="submit"
                      className="btn btn-primary btn-full"
                      disabled={submitting}
                    >
                      {submitting ? '⏳ Posting...' : '📮 Post Request'}
                    </button>
                  </form>
                </div>
              )}

              {/* Info card for seniors */}
              {(user?.role === 'senior' || user?.role === 'mentor') && (
                <div className="card card-glass">
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
                  <h3>Help Fellow Students</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: '1.7' }}>
                    As a {user?.role}, you can make a huge difference. Browse open requests and accept the ones where you can help.
                    Your experience is invaluable to juniors finding their path.
                  </p>
                  <div className="divider" />
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div>📊 Open Requests: <strong style={{ color: 'var(--text-primary)' }}>{allOpen.length}</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Requests List */}
            <div>
              {/* Tabs for junior */}
              {user?.role === 'junior' && (
                <div className="tabs">
                  <button
                    className={`tab-btn ${activeTab === 'my-requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-requests')}
                    id="tab-my-requests"
                  >
                    My Requests ({myRequests.length})
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'all-requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all-requests')}
                    id="tab-all-requests"
                  >
                    Open Requests ({allOpen.length})
                  </button>
                </div>
              )}

              {loading ? (
                <div className="card loading-spinner">
                  <div className="spinner" />
                  <p>Loading requests...</p>
                </div>
              ) : displayRequests.length === 0 ? (
                <div className="card empty-state">
                  <div className="empty-icon">🤝</div>
                  <h3>No requests yet</h3>
                  <p>
                    {user?.role === 'junior'
                      ? 'Post your first help request to connect with seniors!'
                      : 'No open requests right now. Check back soon!'}
                  </p>
                </div>
              ) : (
                <div className="requests-list">
                  {displayRequests.map((req) => (
                    <div key={req._id} className="card request-card" id={`request-${req._id}`}>
                      <div className="request-header">
                        <h4 className="request-title">{req.title}</h4>
                        <span className={`badge badge-${req.status}`}>{req.status}</span>
                      </div>

                      <div className="request-meta">
                        <span className="category-chip">{req.category}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          by {req.studentName}
                        </span>
                      </div>

                      <p className="request-desc">{req.description}</p>

                      <div className="request-footer">
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {/* Accept button for seniors/mentors */}
                          {(user?.role === 'senior' || user?.role === 'mentor') && req.status === 'open' && (
                            <button
                              className="btn btn-success btn-sm"
                              id={`accept-${req._id}`}
                              onClick={() => handleAccept(req._id)}
                            >
                              ✓ Accept
                            </button>
                          )}
                          {/* Delete button for own requests */}
                          {req.studentId === user?.id && (
                            <button
                              className="btn btn-danger btn-sm"
                              id={`delete-req-${req._id}`}
                              onClick={() => handleDelete(req._id)}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Show who accepted */}
                      {req.status === 'accepted' && req.acceptedByName && (
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          background: 'rgba(16,185,129,0.1)',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          color: 'var(--accent-emerald)',
                        }}>
                          ✓ Accepted by {req.acceptedByName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeniorConnectPage;
