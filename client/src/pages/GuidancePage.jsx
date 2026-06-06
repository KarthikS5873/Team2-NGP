// Guidance Page - Scenario input form + AI-generated output display
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const years = ['1st Year', '2nd Year', '3rd Year', 'Final Year'];

const GuidancePage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    year: user?.year || '',
    department: user?.department || '',
    careerGoal: '',
    problemStatement: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('generate');

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data } = await api.get('/guidance/history');
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/guidance/generate', form);
      setResult(data.guidance);
      loadHistory(); // Refresh history
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate guidance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setResult(item);
    setActiveTab('generate');
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-container fade-in">
          <div className="page-header">
            <h1>🤖 AI Guidance Engine</h1>
            <p>Describe your situation and get a personalized career roadmap powered by AI.</p>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
              onClick={() => setActiveTab('generate')}
              id="tab-generate"
            >
              ✨ Generate Guidance
            </button>
            <button
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              id="tab-history"
            >
              📋 History ({history.length})
            </button>
          </div>

          {activeTab === 'history' ? (
            <div>
              {history.length === 0 ? (
                <div className="empty-state card">
                  <div className="empty-icon">📋</div>
                  <h3>No guidance history yet</h3>
                  <p>Generate your first guidance to see it here.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item._id}
                    className="history-item"
                    onClick={() => { setResult(item); setActiveTab('generate'); }}
                    id={`history-${item._id}`}
                  >
                    <h4>🎯 {item.scenario?.careerGoal}</h4>
                    <p>{item.scenario?.department} • {item.scenario?.year}</p>
                    <p style={{ marginTop: '2px' }}>{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="guidance-layout">
              {/* Input Form */}
              <div>
                <div className="card">
                  <h3 style={{ marginBottom: '1.5rem' }}>📝 Your Scenario</h3>
                  {error && <div className="alert alert-error">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="g-year">Current Year</label>
                      <select
                        id="g-year"
                        name="year"
                        className="form-select"
                        value={form.year}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select your year</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="g-dept">Department</label>
                      <input
                        id="g-dept"
                        name="department"
                        type="text"
                        className="form-input"
                        placeholder="e.g. Computer Science, AI, ECE"
                        value={form.department}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="g-goal">Career Goal</label>
                      <input
                        id="g-goal"
                        name="careerGoal"
                        type="text"
                        className="form-input"
                        placeholder="e.g. Machine Learning Engineer, Software Developer"
                        value={form.careerGoal}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="g-problem">Problem Statement</label>
                      <textarea
                        id="g-problem"
                        name="problemStatement"
                        className="form-textarea"
                        placeholder="Describe your situation... e.g. 'I am a 2nd year AI student who wants a machine learning internship but doesn't know where to start.'"
                        value={form.problemStatement}
                        onChange={handleChange}
                        required
                        rows={5}
                      />
                    </div>

                    <button
                      id="generate-btn"
                      type="submit"
                      className="btn btn-primary btn-full btn-lg"
                      disabled={loading}
                    >
                      {loading ? '⏳ Generating...' : '🚀 Generate Guidance'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Result Panel */}
              <div className="guidance-result">
                {loading && (
                  <div className="card loading-spinner">
                    <div className="spinner" />
                    <h3>AI is crafting your roadmap...</h3>
                    <p>This may take a few seconds</p>
                  </div>
                )}

                {!loading && !result && (
                  <div className="card empty-state">
                    <div className="empty-icon">🤖</div>
                    <h3>Your guidance will appear here</h3>
                    <p>Fill in the form and click Generate to get your personalized AI career roadmap.</p>
                  </div>
                )}

                {!loading && result && (
                  <div className="card fade-in">
                    <h3 style={{ marginBottom: '0.5rem' }}>✨ Your Personalized Roadmap</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                      For: {result.scenario?.careerGoal} • {result.scenario?.department} • {result.scenario?.year}
                    </p>

                    {/* Summary */}
                    {result.generatedOutput?.summary && (
                      <div className="result-section">
                        <div className="result-section-title">💬 AI Summary</div>
                        <div className="summary-box">{result.generatedOutput.summary}</div>
                      </div>
                    )}

                    {/* Skills */}
                    {result.generatedOutput?.skillsToLearn?.length > 0 && (
                      <div className="result-section">
                        <div className="result-section-title">🛠️ Skills to Learn</div>
                        <ul className="result-list">
                          {result.generatedOutput.skillsToLearn.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Projects */}
                    {result.generatedOutput?.recommendedProjects?.length > 0 && (
                      <div className="result-section">
                        <div className="result-section-title">💡 Recommended Projects</div>
                        <ul className="result-list">
                          {result.generatedOutput.recommendedProjects.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Resources */}
                    {result.generatedOutput?.suggestedResources?.length > 0 && (
                      <div className="result-section">
                        <div className="result-section-title">📚 Suggested Resources</div>
                        <ul className="result-list">
                          {result.generatedOutput.suggestedResources.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Roadmap */}
                    {result.generatedOutput?.roadmap?.length > 0 && (
                      <div className="result-section">
                        <div className="result-section-title">🗺️ Step-by-Step Roadmap</div>
                        <ul className="result-list">
                          {result.generatedOutput.roadmap.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Mentor Type */}
                    {result.generatedOutput?.mentorType && (
                      <div className="result-section">
                        <div className="result-section-title">👤 Mentor Type Needed</div>
                        <div className="summary-box">{result.generatedOutput.mentorType}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GuidancePage;
