// Knowledge Vault Page - Resource links upload and browsing
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const categories = ['notes', 'interview', 'hackathon', 'project', 'roadmap', 'other'];

const categoryIcons = {
  notes: '📝',
  interview: '🎤',
  hackathon: '🏆',
  project: '💻',
  roadmap: '🗺️',
  other: '📌',
};

const categoryColors = {
  notes: 'rgba(34,211,238,0.1)',
  interview: 'rgba(139,92,246,0.1)',
  hackathon: 'rgba(245,158,11,0.1)',
  project: 'rgba(99,102,241,0.1)',
  roadmap: 'rgba(16,185,129,0.1)',
  other: 'rgba(148,163,184,0.08)',
};

const KnowledgeVaultPage = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', link: '', category: 'other',
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/vault/resources');
      setResources(data.resources || []);
    } catch (err) {
      setError('Failed to load resources.');
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
      await api.post('/vault/resource', form);
      setSuccess('Resource added to vault!');
      setForm({ title: '', description: '', link: '', category: 'other' });
      setShowForm(false);
      loadResources();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this resource?')) return;
    try {
      await api.delete(`/vault/resource/${id}`);
      setResources(resources.filter(r => r._id !== id));
    } catch (err) {
      setError('Failed to delete resource.');
    }
  };

  const filteredResources = filterCat === 'all'
    ? resources
    : resources.filter(r => r.category === filterCat);

  const isValidUrl = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-container fade-in">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1>📚 Knowledge Vault</h1>
              <p>Curated resources shared by seniors — interview tips, project notes, hackathon guides, and more.</p>
            </div>
            <button
              className="btn btn-primary"
              id="add-resource-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancel' : '+ Add Resource'}
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Add Resource Form */}
          {showForm && (
            <div className="card fade-in" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>📤 Share a Resource</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="v-title">Title</label>
                    <input
                      id="v-title"
                      name="title"
                      type="text"
                      className="form-input"
                      placeholder="e.g. FAANG Interview Prep Guide"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="v-category">Category</label>
                    <select
                      id="v-category"
                      name="category"
                      className="form-select"
                      value={form.category}
                      onChange={handleChange}
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>
                          {categoryIcons[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="v-link">Resource Link</label>
                  <input
                    id="v-link"
                    name="link"
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={form.link}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="v-desc">Description</label>
                  <textarea
                    id="v-desc"
                    name="description"
                    className="form-textarea"
                    placeholder="Briefly describe what this resource contains and who it's useful for..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={3}
                  />
                </div>

                <button
                  id="submit-resource-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? '⏳ Adding...' : '📤 Add to Vault'}
                </button>
              </form>
            </div>
          )}

          {/* Category Filter */}
          <div className="tabs">
            <button
              className={`tab-btn ${filterCat === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCat('all')}
              id="filter-all-vault"
            >
              All ({resources.length})
            </button>
            {categories.map(c => (
              <button
                key={c}
                className={`tab-btn ${filterCat === c ? 'active' : ''}`}
                onClick={() => setFilterCat(c)}
                id={`filter-vault-${c}`}
              >
                {categoryIcons[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          {loading ? (
            <div className="card loading-spinner">
              <div className="spinner" />
              <p>Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-icon">📚</div>
              <h3>No resources yet</h3>
              <p>Be the first to share a useful resource with the community!</p>
            </div>
          ) : (
            <div className="vault-grid">
              {filteredResources.map((resource) => (
                <div
                  key={resource._id}
                  className="card"
                  id={`resource-${resource._id}`}
                  style={{ background: categoryColors[resource.category], position: 'relative' }}
                >
                  <div className="vault-card-icon">{categoryIcons[resource.category]}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', flex: 1 }}>{resource.title}</h3>
                    {resource.uploadedBy === user?.id && (
                      <button
                        className="btn btn-danger btn-sm"
                        id={`delete-resource-${resource._id}`}
                        onClick={() => handleDelete(resource._id)}
                        title="Delete resource"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  <span className="category-chip" style={{ margin: '0.5rem 0' }}>
                    {categoryIcons[resource.category]} {resource.category}
                  </span>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', margin: '0.5rem 0' }}>
                    {resource.description}
                  </p>

                  <div className="divider" />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      by {resource.uploaderName}
                    </div>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vault-link"
                      id={`visit-${resource._id}`}
                    >
                      Visit Resource →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default KnowledgeVaultPage;
