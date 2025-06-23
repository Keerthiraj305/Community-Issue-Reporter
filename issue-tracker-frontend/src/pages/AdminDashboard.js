import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';

const statusOptions = [
  'Open',
  'In Progress',
  'Under Review',
  'Resolved',
  'Closed'
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchStats = async () => {
    try {
      const res = await adminApi.get('/statistics');
      setStats(res.data);
    } catch (err) {
      setStats(null);
    }
  };

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/issues');
      setIssues(res.data.issues || []);
    } catch (err) {
      setIssues([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    fetchIssues();
    // eslint-disable-next-line
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdateMsg('');
    try {
      await adminApi.put(`/issues/${id}`, { status });
      setUpdateMsg('Status updated!');
      fetchIssues();
    } catch (err) {
      setUpdateMsg('Failed to update status');
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="container">
        <h1 className="dashboard-title">Admin Dashboard <span role="img" aria-label="admin">🛡️</span></h1>
        {/* Stats Section */}
        <div className="dashboard-section">
          <h2>Statistics <span role="img" aria-label="bar chart">📊</span></h2>
          {stats ? (
            <div className="stats-cards">
              <div className="stat-card"><span>All Issues</span><b>{stats.totalIssues}</b></div>
              <div className="stat-card"><span>Urgent</span><b>{stats.urgentIssues}</b></div>
              <div className="stat-card"><span>Today</span><b>{stats.todayIssues}</b></div>
              {stats.statusStats.map(s => (
                <div className="stat-card" key={s._id}><span>{s._id}</span><b>{s.count}</b></div>
              ))}
            </div>
          ) : <div>Loading stats...</div>}
        </div>
        {/* Issues Table Section */}
        <div className="dashboard-section">
          <h2>Manage Issues <span role="img" aria-label="tools">🛠️</span></h2>
          {updateMsg && <div className="update-msg">{updateMsg}</div>}
          {loading ? <div>Loading issues...</div> : (
            <div className="issues-table-wrapper">
              <table className="issues-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Ward</th>
                    <th>Reported By</th>
                    <th>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map(issue => (
                    <tr key={issue._id}>
                      <td>{issue.title}</td>
                      <td>{issue.category}</td>
                      <td>{issue.priority}</td>
                      <td>{issue.status}</td>
                      <td>{issue.ward}</td>
                      <td>{issue.reportedBy?.name}</td>
                      <td>
                        <select
                          value={issue.status}
                          onChange={e => handleStatusChange(issue._id, e.target.value)}
                        >
                          {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 