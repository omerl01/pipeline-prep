import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  ArrowLeft, PlusCircle, Lock, LogIn, LogOut, 
  CheckCircle, Search, BookOpen, Award, Sparkles, 
  Play, Check, X, AlertTriangle, Eye, EyeOff, Trash2
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 1. Brand Icons for DevOps Domains
const BrandIcon = ({ type, size = 36 }) => {
  const strokeColor = "currentColor";
  switch (type) {
    case 'networking':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" className="brand-svg">
          <rect x="16" y="1" width="7" height="5" rx="1" />
          <rect x="16" y="18" width="7" height="5" rx="1" />
          <rect x="1" y="9" width="7" height="5" rx="1" />
          <path d="M8 11.5h4m4 0h-4m0 0V3.5h4m-4 8v7h4" />
        </svg>
      );
    case 'linux':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-svg">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case 'k8s':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-svg">
          <path d="M12 2L2 5v6c0 5.5 4.5 10 10 11 5.5-1 10-5.5 10-11V5L12 2z" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="2" x2="12" y2="9" />
          <line x1="12" y1="15" x2="12" y2="22" />
          <line x1="2" y1="11" x2="9" y2="11" />
          <line x1="15" y1="11" x2="22" y2="11" />
        </svg>
      );
    case 'terraform':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-svg">
          <path d="M7 3h4v4H7zM13 3h4v4h-4zM10 9h4v4h-4zM13 15h4v4h-4zM4 15h4v4H4z"/>
        </svg>
      );
    case 'ci-cd':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-svg">
          <path d="M4 12a8 8 0 0 1 16 0A8 8 0 0 1 4 12z" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case 'aws':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-svg">
          <path d="M17.5 19A5.5 5.5 0 0 0 18 8h-1.26A8 8 0 1 0 4 15.25" />
          <path d="M22 19H2" />
        </svg>
      );
    case 'observability':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" className="brand-svg">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'devsecops':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" className="brand-svg">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'behavioral':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" className="brand-svg">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return null;
  }
};

const TOPICS_CONFIG = [
  { id: "networking", name: "Networking", desc: "Core routing, firewalls, and protocols." },
  { id: "linux", name: "Linux Internals", desc: "Kernel structures, shells, memory, and signals." },
  { id: "k8s", name: "Kubernetes", desc: "Pods, controllers, service meshes, and scheduling." },
  { id: "terraform", name: "Terraform", desc: "State management, variables, and cloud deployments." },
  { id: "ci-cd", name: "CI/CD Pipelines", desc: "Automation strategies, testing, and GitOps." },
  { id: "aws", name: "AWS Cloud", desc: "VPCs, IAM rules, high availability, and databases." },
  { id: "observability", name: "Observability", desc: "Logs, metrics, distributed tracing, and scraping." },
  { id: "devsecops", name: "DevSecOps", desc: "Vulnerability analysis, SAST/DAST, and secrets management." },
  { id: "behavioral", name: "Behavioral Skills", desc: "Conflict resolution, outages, and priorities." }
];

export default function App() {
  const [view, setView] = useState('home'); // home | questions | submit | admin
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  // Data lists
  const [questions, setQuestions] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [allApprovedQuestions, setAllApprovedQuestions] = useState([]);
  
  // Progress states (localStorage)
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const stored = localStorage.getItem('pipeline_prep_mastered_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Quiz States
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('adminToken');
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form Submission State
  const [formTopic, setFormTopic] = useState('networking');
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync Mastered IDs to LocalStorage
  useEffect(() => {
    localStorage.setItem('pipeline_prep_mastered_ids', JSON.stringify(masteredIds));
  }, [masteredIds]);

  // Load all live questions once on home mount to show total project stats
  const fetchAllApprovedQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/questions`);
      if (res.ok) {
        const data = await res.json();
        setAllApprovedQuestions(data);
      }
    } catch (err) {
      console.error("Error loading stats database:", err);
    }
  };

  useEffect(() => {
    fetchAllApprovedQuestions();
  }, [view]);

  // Fetch Questions for selected Domain
  const loadQuestions = async (topicId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/questions?topic=${topicId}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error("Error loading questions:", err);
    }
  };

  const handleTopicClick = (topicObj) => {
    setSelectedTopic(topicObj);
    setSearchQuery('');
    setIsQuizMode(false);
    loadQuestions(topicObj.id);
    setView('questions');
  };

  // Admin JWT API Calls Helper
  const getAdminHeaders = () => {
    const token = sessionStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/pending`, {
        headers: getAdminHeaders()
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPendingQuestions(data);
      }
    } catch (err) {
      console.error("Error loading moderation queue:", err);
    }
  };

  useEffect(() => {
    if (view === 'admin' && isAdminAuthenticated) {
      fetchPending();
    }
  }, [view, isAdminAuthenticated]);

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem('adminToken', data.token);
        setIsAdminAuthenticated(true);
        setUsernameInput('');
        setPasswordInput('');
        fetchPending();
      } else {
        setLoginError(data.detail || "Access Denied: Invalid credentials.");
      }
    } catch (err) {
      setLoginError("Could not reach backend API. Make sure the backend server is running.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAdminAuthenticated(false);
    setView('home');
  };

  // Submit new candidate question
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = { topic: formTopic, question_text: formQuestion, answer_text: formAnswer };
    try {
      const res = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Thank you! Your question has been submitted for moderation.');
        setFormQuestion('');
        setFormAnswer('');
        setView('home');
      } else {
        alert('Failed to submit question. Please verify all inputs.');
      }
    } catch (err) {
      alert('Could not connect to the backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Approve pending question
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/questions/${id}/approve`, {
        method: 'PUT',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        fetchPending();
      } else {
        alert('Failed to approve question.');
      }
    } catch (err) {
      alert('Error communicating with backend.');
    }
  };

  // Reject / Delete question
  const handleReject = async (id) => {
    if (!window.confirm("Delete this submission permanently?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/questions/${id}/reject`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        fetchPending();
      } else {
        alert('Failed to delete question.');
      }
    } catch (err) {
      alert('Error communicating with backend.');
    }
  };

  // Toggle state of a question
  const toggleMastered = (id) => {
    if (masteredIds.includes(id)) {
      setMasteredIds(masteredIds.filter(mid => mid !== id));
    } else {
      setMasteredIds([...masteredIds, id]);
    }
  };

  // Search logic
  const filteredQuestions = questions.filter(q => {
    const query = searchQuery.toLowerCase();
    return q.question_text.toLowerCase().includes(query) || q.answer_text.toLowerCase().includes(query);
  });

  // Calculate percentages
  const totalLiveCount = allApprovedQuestions.length;
  const totalMasteredCount = allApprovedQuestions.filter(q => masteredIds.includes(q.id)).length;
  const overallPercentage = totalLiveCount > 0 ? Math.round((totalMasteredCount / totalLiveCount) * 100) : 0;

  const getTopicStats = (topicId) => {
    const topicQs = allApprovedQuestions.filter(q => q.topic === topicId);
    const completed = topicQs.filter(q => masteredIds.includes(q.id)).length;
    return {
      total: topicQs.length,
      completed: completed,
      pct: topicQs.length > 0 ? Math.round((completed / topicQs.length) * 100) : 0
    };
  };

  // Quiz helper functions
  const startQuiz = () => {
    if (filteredQuestions.length === 0) return;
    setQuizIndex(0);
    setShowQuizAnswer(false);
    setQuizScore(0);
    setIsQuizMode(true);
  };

  const handleQuizChoice = (wasCorrect) => {
    const currentQ = filteredQuestions[quizIndex];
    if (wasCorrect) {
      setQuizScore(prev => prev + 1);
      // Mark as mastered automatically
      if (!masteredIds.includes(currentQ.id)) {
        setMasteredIds(prev => [...prev, currentQ.id]);
      }
    } else {
      // Unmark from mastered if they missed it
      setMasteredIds(prev => prev.filter(id => id !== currentQ.id));
    }

    if (quizIndex + 1 < filteredQuestions.length) {
      setQuizIndex(prev => prev + 1);
      setShowQuizAnswer(false);
    } else {
      // Completed last question
      setQuizIndex(filteredQuestions.length);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="header-glass">
        <div className="header-container">
          <div className="logo-area" onClick={() => setView('home')}>
            <span className="logo-sparkle"><Sparkles size={20} /></span>
            <span className="logo-text">PipelinePrep</span>
          </div>
          
          <div className="header-nav">
            <button onClick={() => setView('submit')} className="btn-secondary nav-action-btn">
              <PlusCircle size={16} /> Contribute
            </button>
            
            {isAdminAuthenticated ? (
              <button onClick={handleLogout} className="btn-danger nav-action-btn">
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <button onClick={() => setView('admin')} className="btn-outline nav-action-btn">
                <Lock size={16} /> Admin Portal
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        
        {/* 1. HOME DASHBOARD */}
        {view === 'home' && (
          <div className="fade-in">
            <div className="hero-section">
              <h1 className="gradient-text">Master Your DevOps & SRE Interviews</h1>
              <p className="hero-subtitle">Elevate your pipeline knowledge with curated real-world system questions, dynamic progress tracking, and interactive quizzes.</p>
              
              <div className="stats-dashboard">
                <div className="stat-card">
                  <span className="stat-value">{TOPICS_CONFIG.length}</span>
                  <span className="stat-label">Domains</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{totalLiveCount || 27}</span>
                  <span className="stat-label">Verified Questions</span>
                </div>
                <div className="stat-card featured-stat">
                  <div className="circular-progress-bar">
                    <span className="stat-value">{overallPercentage}%</span>
                  </div>
                  <span className="stat-label font-bold">Preparation Progress</span>
                </div>
              </div>
              
              <div className="global-progress-bar-container">
                <div className="progress-labels">
                  <span>Overall Mastery Status</span>
                  <span>{totalMasteredCount} of {totalLiveCount || 27} Completed</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${overallPercentage}%` }}></div>
                </div>
              </div>
            </div>

            <div className="domain-header-container">
              <h2 className="section-title"><BookOpen size={22} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Select a Domain</h2>
              <p className="section-subtitle">Deep dive into standard platforms, patterns, and architectural workflows.</p>
            </div>

            <div className="topics-grid">
              {TOPICS_CONFIG.map(topic => {
                const stats = getTopicStats(topic.id);
                return (
                  <div key={topic.id} className="topic-card-fancy" onClick={() => handleTopicClick(topic)}>
                    <div className="topic-card-glow"></div>
                    <div className="topic-card-body">
                      <div className="topic-icon-ring">
                        <BrandIcon type={topic.id} size={28} />
                      </div>
                      <h3 className="topic-title">{topic.name}</h3>
                      <p className="topic-desc">{topic.desc}</p>
                      
                      <div className="topic-card-footer">
                        <span className="questions-count-badge">
                          {stats.total > 0 ? `${stats.total} Questions` : 'Loading...'}
                        </span>
                        
                        {stats.total > 0 && (
                          <div className="topic-progress-mini">
                            <div className="mini-progress-track">
                              <div className="mini-progress-fill" style={{ width: `${stats.pct}%` }}></div>
                            </div>
                            <span className="mini-progress-text">{stats.pct}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. QUESTIONS DETAIL VIEW */}
        {view === 'questions' && (
          <div className="fade-in">
            <div className="view-header">
              <button className="back-link-btn" onClick={() => setView('home')}>
                <ArrowLeft size={16} /> Back to Domains
              </button>
              
              <div className="topic-header-hero">
                <div className="topic-header-icon-box">
                  <BrandIcon type={selectedTopic?.id} size={40} />
                </div>
                <div className="topic-header-text">
                  <h1 className="topic-hero-title">{selectedTopic?.name}</h1>
                  <p className="topic-hero-subtitle">
                    Progress: {getTopicStats(selectedTopic?.id).completed} of {getTopicStats(selectedTopic?.id).total} Mastered
                  </p>
                </div>
              </div>
            </div>

            {/* Quiz Mode and Search Bar */}
            {!isQuizMode && (
              <div className="controls-panel">
                <div className="search-box">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search keywords, terms, or patterns..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={() => setSearchQuery('')}><X size={14} /></button>
                  )}
                </div>
                
                {filteredQuestions.length > 0 && (
                  <button onClick={startQuiz} className="btn-primary quiz-launch-btn">
                    <Play size={16} /> Practice Flashcards
                  </button>
                )}
              </div>
            )}

            {/* Render Quiz Engine or Question Cards */}
            {isQuizMode ? (
              // FLASHCARD QUIZ ENGINE
              <div className="quiz-container-card">
                <div className="quiz-header">
                  <span className="quiz-title-badge">Flashcard Practice Mode</span>
                  <button onClick={() => setIsQuizMode(false)} className="quiz-close-btn"><X size={20} /></button>
                </div>
                
                {quizIndex < filteredQuestions.length ? (
                  // Quiz Question Slide
                  <div className="quiz-slide-content">
                    <div className="quiz-progress-text">
                      Question {quizIndex + 1} of {filteredQuestions.length}
                    </div>
                    <div className="quiz-progress-bar">
                      <div className="quiz-progress-fill" style={{ width: `${((quizIndex + 1) / filteredQuestions.length) * 100}%` }}></div>
                    </div>
                    
                    <div className="quiz-card-body">
                      <div className="quiz-card-icon">?</div>
                      <h2 className="quiz-question-text">{filteredQuestions[quizIndex].question_text}</h2>
                      
                      {!showQuizAnswer ? (
                        <button 
                          onClick={() => setShowQuizAnswer(true)} 
                          className="btn-primary quiz-reveal-btn"
                        >
                          <Eye size={18} /> Reveal Solution
                        </button>
                      ) : (
                        <div className="quiz-answer-fade-in">
                          <div className="quiz-solution-box">
                            <h4 className="solution-title">Suggested Answer</h4>
                            <p className="solution-text">{filteredQuestions[quizIndex].answer_text}</p>
                          </div>
                          
                          <div className="quiz-action-buttons">
                            <button 
                              onClick={() => handleQuizChoice(true)} 
                              className="btn-success quiz-choice-btn"
                            >
                              <Check size={18} /> I Know This!
                            </button>
                            <button 
                              onClick={() => handleQuizChoice(false)} 
                              className="btn-outline quiz-choice-btn"
                            >
                              <X size={18} /> Need to Review
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Quiz Complete Results Screen
                  <div className="quiz-results-screen">
                    <div className="results-icon-ring">
                      <Award size={48} className="results-sparkle-icon" />
                    </div>
                    <h2 className="results-title">Quiz Session Completed!</h2>
                    <p className="results-subtitle">Great job reviewing. Your mastery is climbing!</p>
                    
                    <div className="results-score-display">
                      <span className="results-score-value">{quizScore} / {filteredQuestions.length}</span>
                      <span className="results-score-label">Questions Solved Correctly</span>
                    </div>

                    <div className="results-buttons">
                      <button onClick={startQuiz} className="btn-primary">
                        <Play size={16} /> Restart Session
                      </button>
                      <button onClick={() => setIsQuizMode(false)} className="btn-outline">
                        Return to List
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // STANDALONE LIST OF QUESTIONS
              <div className="questions-container-list">
                {filteredQuestions.length === 0 ? (
                  <div className="empty-results-box">
                    <AlertTriangle size={32} className="warning-empty-icon" />
                    <h3>No Questions Found</h3>
                    <p>Try searching for different terms or adjust your search filter.</p>
                  </div>
                ) : (
                  filteredQuestions.map(q => {
                    const isMastered = masteredIds.includes(q.id);
                    return (
                      <InteractiveQuestionCard 
                        key={q.id} 
                        q={q} 
                        isMastered={isMastered} 
                        onToggleMastered={() => toggleMastered(q.id)} 
                      />
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. CONTRIBUTE QUESTION FORM */}
        {view === 'submit' && (
          <div className="fade-in max-w-form">
            <button className="back-link-btn" onClick={() => setView('home')} style={{ marginBottom: '1.5rem' }}>
              <ArrowLeft size={16} /> Cancel Contribution
            </button>
            
            <div className="form-card">
              <div className="form-card-header">
                <h2>Contribute a DevOps Question</h2>
                <p>Help other engineers prepare by submitting a standard technical interview question. Once approved by our team, it goes live immediately.</p>
              </div>
              
              <form onSubmit={handleQuestionSubmit}>
                <div className="form-group">
                  <label htmlFor="topic-select">DevOps Domain</label>
                  <select 
                    id="topic-select"
                    value={formTopic} 
                    onChange={(e) => setFormTopic(e.target.value)}
                  >
                    {TOPICS_CONFIG.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="question-textarea">Interview Question</label>
                  <textarea 
                    id="question-textarea"
                    rows="3" 
                    value={formQuestion} 
                    onChange={(e) => setFormQuestion(e.target.value)} 
                    placeholder="e.g., Explain the difference between a Pod and a Deployment in Kubernetes." 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="answer-textarea">Verified Ideal Answer</label>
                  <textarea 
                    id="answer-textarea"
                    rows="5" 
                    value={formAnswer} 
                    onChange={(e) => setFormAnswer(e.target.value)} 
                    placeholder="Provide the step-by-step optimal engineering explanation..." 
                    required 
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary submit-form-btn">
                  {isSubmitting ? 'Submitting to Queue...' : 'Submit to Moderation Queue'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 4. ADMIN PORTAL (SECURE VIA JWT BACKEND AUTH) */}
        {view === 'admin' && (
          <div className="fade-in">
            <div className="view-header">
              <button className="back-link-btn" onClick={() => setView('home')}>
                <ArrowLeft size={16} /> Return Home
              </button>
            </div>

            {!isAdminAuthenticated ? (
              // SECURE LOGIN INTERFACE
              <div className="login-card-container">
                <div className="login-card">
                  <div className="login-icon-box">
                    <Lock size={32} />
                  </div>
                  <h2>Administrator Portal</h2>
                  <p>Authenticate securely using server-configured credentials to access the submission queue.</p>
                  
                  {loginError && (
                    <div className="error-alert-box">
                      <AlertTriangle size={16} />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <label htmlFor="admin-username">Admin Username</label>
                      <input 
                        id="admin-username"
                        type="text" 
                        value={usernameInput} 
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="username"
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="admin-password">Secure Password</label>
                      <input 
                        id="admin-password"
                        type="password" 
                        value={passwordInput} 
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        required 
                      />
                    </div>

                    <button type="submit" className="btn-primary login-btn">
                      <LogIn size={16} /> Authenticate Session
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              // MODERATION CONTROL PANEL
              <div className="admin-moderation-panel">
                <div className="moderation-header">
                  <div>
                    <h1 className="moderation-title">Moderation Queue</h1>
                    <p className="moderation-subtitle">Review, approve, or reject community contributions.</p>
                  </div>
                  <span className="pending-badge">
                    {pendingQuestions.length} Submissions Pending
                  </span>
                </div>

                <div className="moderation-list-container">
                  {pendingQuestions.length === 0 ? (
                    <div className="moderation-empty-card">
                      <CheckCircle size={40} className="success-icon" />
                      <h3>Queue Cleared!</h3>
                      <p>All submitted questions have been reviewed.</p>
                    </div>
                  ) : (
                    pendingQuestions.map(q => (
                      <div key={q.id} className="moderation-review-card">
                        <div className="review-card-header">
                          <span className="review-topic-badge">
                            {(q.topic || 'General').toUpperCase()}
                          </span>
                          <span className="review-id-badge">ID: #{q.id}</span>
                        </div>
                        <h3 className="review-question">{q.question_text}</h3>
                        <div className="review-answer-block">
                          <strong>Suggested Solution:</strong>
                          <p>{q.answer_text}</p>
                        </div>
                        <div className="review-actions">
                          <button 
                            onClick={() => handleApprove(q.id)} 
                            className="btn-success action-review-btn"
                          >
                            <Check size={16} /> Approve & Publish
                          </button>
                          <button 
                            onClick={() => handleReject(q.id)} 
                            className="btn-danger action-review-btn"
                          >
                            <Trash2 size={16} /> Reject & Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// 5. Dynamic Sub-Component for Individual Questions
function InteractiveQuestionCard({ q, isMastered, onToggleMastered }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`question-card-view ${isOpen ? 'is-expanded' : ''} ${isMastered ? 'is-mastered' : ''}`}>
      <div className="card-top-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="question-header-layout">
          <div 
            className="mastered-toggle-hitbox"
            onClick={(e) => {
              e.stopPropagation(); // Avoid expanding card when clicking progress checkbox
              onToggleMastered();
            }}
          >
            <div className={`custom-checkbox-ring ${isMastered ? 'active' : ''}`}>
              {isMastered && <Check size={14} className="checkbox-tick" />}
            </div>
          </div>
          
          <span className="question-card-text">{q.question_text}</span>
        </div>
        
        <button className="card-toggle-view-arrow">
          {isOpen ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {isOpen && (
        <div className="card-expansion-body">
          <div className="expansion-solution-title">Suggested Solution</div>
          <p className="expansion-answer-paragraph">{q.answer_text}</p>
          <div className="expansion-footer-action">
            <button 
              className={`btn-sub-action ${isMastered ? 'btn-unmaster' : 'btn-master'}`}
              onClick={onToggleMastered}
            >
              {isMastered ? <X size={14} /> : <Check size={14} />}
              {isMastered ? 'Mark for Review' : 'Mark as Mastered'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}