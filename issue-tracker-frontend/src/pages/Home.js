import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IssueForm from '../components/IssueForm';
import IssueList from '../components/IssueList';
import { issueApi } from '../api';

function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await issueApi.get('/');
      setIssues(res.data.issues || res.data);
      
      // Calculate stats
      const total = res.data.issues ? res.data.issues.length : res.data.length;
      const open = (res.data.issues || res.data).filter(i => i.status === 'Open').length;
      const inProgress = (res.data.issues || res.data).filter(i => i.status === 'In Progress').length;
      const resolved = (res.data.issues || res.data).filter(i => i.status === 'Resolved').length;
      
      setStats({ total, open, inProgress, resolved });
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="home-page">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="main-headline">
              <span className="logo-icon">🏛️</span>
              Community Issue Reporter
            </h1>
            <p className="hero-subtitle">
              Help us make your neighborhood better by reporting civic issues. 
              Together, we can create a cleaner, safer, and more efficient community.
            </p>
            <div className="hero-stats">
              <div className="stat-card">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total Issues</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.open}</span>
                <span className="stat-label">Open Issues</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.inProgress}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.resolved}</span>
                <span className="stat-label">Resolved</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="city-illustration">
              🏙️
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Issue Form Section */}
            <div className="form-section">
              <div className="card form-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <span className="icon">📝</span>
                    Report New Issue
                  </h2>
                  <p className="card-subtitle">
                    Help us improve your neighborhood by reporting issues you encounter
                  </p>
                </div>
                <IssueForm onIssueAdded={fetchIssues} />
              </div>
            </div>

            {/* Issues List Section */}
            <div className="list-section">
              <div className="list-header">
                <h2 className="list-title">
                  <span className="icon">📋</span>
                  Recent Issues
                </h2>
                <Link to="/issues" className="view-all-btn">
                  View All Issues →
                </Link>
              </div>
              
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading issues...</p>
                </div>
              ) : (
                <IssueList 
                  issues={issues.slice(0, 5)} 
                  onDelete={() => fetchIssues()} 
                  onStatusChange={() => fetchIssues()} 
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Report Issues?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Quick Resolution</h3>
              <p>Issues are prioritized and assigned to the right departments for faster resolution</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community Driven</h3>
              <p>Your reports help improve the quality of life for everyone in your neighborhood</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Transparent Tracking</h3>
              <p>Track the status of your reported issues in real-time with detailed updates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Better Bangalore</h3>
              <p>Contribute to making Bangalore a world-class city with better infrastructure</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home; 