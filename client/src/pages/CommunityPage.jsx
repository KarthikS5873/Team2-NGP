// Community Page - Post feed with create/delete
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const postTypes = ['discussion', 'doubt', 'resource', 'announcement'];

const typeColors = {
  doubt: 'type-doubt',
  resource: 'type-resource',
  discussion: 'type-discussion',
  announcement: 'type-announcement',
};

const typeIcons = {
  doubt: '❓',
  resource: '📎',
  discussion: '💬',
  announcement: '📢',
};

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('discussion');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/community/posts');
      setPosts(data.posts || []);
    } catch (err) {
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/community/post', { content, type: postType });
      setPosts([data.post, ...posts]);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/community/post/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredPosts = filterType === 'all' ? posts : posts.filter(p => p.type === filterType);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-container fade-in">
          <div className="page-header">
            <h1>💬 Community</h1>
            <p>Share doubts, resources, and insights with your peers.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Create Post Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <form onSubmit={handlePost}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {postTypes.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`tab-btn ${postType === t ? 'active' : ''}`}
                    id={`post-type-${t}`}
                    onClick={() => setPostType(t)}
                    style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
                  >
                    {typeIcons[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <textarea
                id="post-content"
                className="form-textarea"
                placeholder={
                  postType === 'doubt' ? 'Ask your question here...' :
                  postType === 'resource' ? 'Share a useful resource or link...' :
                  postType === 'announcement' ? 'Make an announcement...' :
                  'Start a discussion...'
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                style={{ marginBottom: '0.75rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  id="post-submit-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !content.trim()}
                >
                  {submitting ? '⏳ Posting...' : '🚀 Post'}
                </button>
              </div>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="tabs">
            <button
              className={`tab-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
              id="filter-all"
            >
              All ({posts.length})
            </button>
            {postTypes.map(t => (
              <button
                key={t}
                className={`tab-btn ${filterType === t ? 'active' : ''}`}
                onClick={() => setFilterType(t)}
                id={`filter-${t}`}
              >
                {typeIcons[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="card loading-spinner">
              <div className="spinner" />
              <p>Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-icon">💬</div>
              <h3>No posts yet</h3>
              <p>Be the first to share something with the community!</p>
            </div>
          ) : (
            <div className="posts-feed">
              {filteredPosts.map((post) => (
                <div key={post._id} className="card post-card" id={`post-${post._id}`}>
                  <div className="post-header">
                    <div className="post-author-info">
                      <div className="author-avatar">{getInitials(post.authorName)}</div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{post.authorName}</div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <span className={`badge badge-${post.authorRole}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem' }}>
                            {post.authorRole}
                          </span>
                          <span className="post-time">{timeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`post-type-badge ${typeColors[post.type]}`}>
                        {typeIcons[post.type]} {post.type}
                      </span>
                      {/* Delete only own posts */}
                      {(post.author === user?.id || post.author?._id === user?.id) && (
                        <button
                          className="btn btn-danger btn-sm"
                          id={`delete-post-${post._id}`}
                          onClick={() => handleDelete(post._id)}
                          title="Delete post"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="post-content">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
