// ENHANCED UI VERSION - To revert, restore from previous version
import React, { useState } from 'react';
import { issueApi } from '../api';
import { jwtDecode } from 'jwt-decode';

// Helper function to get user from token
const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

function IssueList({ issues, onDelete, onStatusChange }) {
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [votingId, setVotingId] = useState(null);
  const currentUser = getCurrentUser();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return '🔴';
      case 'In Progress': return '🟡';
      case 'Resolved': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open': return 'badge-open';
      case 'In Progress': return 'badge-progress';
      case 'Resolved': return 'badge-resolved';
      default: return 'badge-open';
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await issueApi.put(`/${id}/status`, { status });
      onStatusChange(); // This will refetch issues
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Error: ${err.response.data.message}`);
      } else if (err.response && err.response.status === 403) {
        alert('Error: You are not authorized to perform this action.');
      } else {
        alert('An error occurred while updating the status.');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVote = async (id, voteType) => {
    if (!currentUser) {
      alert('Please log in to vote.');
      return;
    }
    setVotingId(id);
    try {
      await issueApi.post(`/${id}/vote`, { voteType });
      onStatusChange();
    } catch (err) {
      alert('Failed to record vote. Please try again.');
    } finally {
      setVotingId(null);
    }
  };

  if (issues.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3 className="empty-title">No Issues Found</h3>
        <p className="empty-description">
          Great! It looks like there are no active issues at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="issues-container">
      {issues.map((issue, index) => (
        <div 
          key={issue._id} 
          className={`card issue-card fade-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="issue-header">
            <div className="issue-title-section">
              <h3 className="issue-title">{issue.title}</h3>
              <div className="issue-meta">
                <span className="issue-date">
                  {new Date(issue.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="issue-status">
              <span className={`badge ${getStatusBadgeClass(issue.status)}`}>
                <span className="status-icon">{getStatusIcon(issue.status)}</span>
                {issue.status}
              </span>
            </div>
          </div>

          <div className="issue-content">
            <p className="issue-description">{issue.description}</p>
            <div className="issue-location">
              <span className="location-icon">📍</span>
              <span>{issue.location}</span>
            </div>
          </div>
          
          <div className="issue-feedback">
            <button
              onClick={() => handleVote(issue._id, 'upvote')}
              className="btn btn-vote"
              disabled={votingId === issue._id || !currentUser}
              title={!currentUser ? 'Login to vote' : 'Upvote'}
            >
              <span role="img" aria-label="upvote">👍</span> {issue.upvotes}
            </button>
            <button
              onClick={() => handleVote(issue._id, 'downvote')}
              className="btn btn-vote"
              disabled={votingId === issue._id || !currentUser}
              title={!currentUser ? 'Login to vote' : 'Downvote'}
            >
              <span role="img" aria-label="downvote">👎</span> {issue.downvotes}
            </button>
          </div>

          <div className="issue-actions">
            {/* Admin status change */}
            {currentUser?.role === 'admin' && !['Resolved', 'Closed'].includes(issue.status) && (
              <select
                className="action-select"
                value={issue.status}
                onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                disabled={updatingId === issue._id}
              >
                <option value={issue.status} disabled>{issue.status}</option>
                {['In Progress', 'Under Review', 'Closed'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {/* Reporter status change */}
            {currentUser?.role === 'user' && issue.reportedBy?._id === currentUser?.userId && !['Resolved', 'Closed'].includes(issue.status) && (
               <button
                  onClick={() => handleStatusChange(issue._id, 'Resolved')}
                  className="btn btn-success action-btn"
                  disabled={updatingId === issue._id}
                >
                  <span className="btn-icon">✔️</span> Mark as Resolved
                </button>
            )}
            
            {/* Delete button for admin or reporter */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => handleDelete(issue._id)}
                className="btn btn-danger action-btn"
                disabled={deletingId === issue._id}
              >
                {deletingId === issue._id ? (
                  <>
                    <span className="loading-dots"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🗑️</span>
                    Delete
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default IssueList; 