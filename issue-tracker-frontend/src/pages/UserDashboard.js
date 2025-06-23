import React, { useEffect, useState } from 'react';
import { issueApi, authApi } from '../api';

function UserDashboard() {
  const [issues, setIssues] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', ward: '' });
  const [msg, setMsg] = useState('');

  const fetchIssues = async () => {
    try {
      const res = await issueApi.get('/user/my-issues');
      setIssues(res.data.issues || []);
    } catch (err) {
      setIssues([]);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await authApi.get('/profile');
      setProfile(res.data);
      setProfileForm({
        name: res.data.name || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        ward: res.data.ward || ''
      });
    } catch (err) {
      setProfile(null);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await authApi.put('/profile', profileForm);
      setMsg('Profile updated!');
      setEditProfile(false);
      fetchProfile();
    } catch (err) {
      setMsg('Failed to update profile');
    }
  };

  return (
    <div className="user-dashboard-page">
      <div className="container">
        <h1 className="dashboard-title">My Dashboard <span role="img" aria-label="user">👤</span></h1>
        <div className="dashboard-section">
          <h2>My Issues <span role="img" aria-label="list">📋</span></h2>
          <div className="issues-table-wrapper">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Ward</th>
                  <th>Upvotes</th>
                  <th>Downvotes</th>
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue._id}>
                    <td>{issue.title}</td>
                    <td>{issue.category}</td>
                    <td>{issue.status}</td>
                    <td>{issue.priority}</td>
                    <td>{issue.ward}</td>
                    <td>{issue.upvotes}</td>
                    <td>{issue.downvotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {issues.length === 0 && <div>No issues reported yet.</div>}
          </div>
        </div>
        <div className="dashboard-section">
          <h2>Profile <span role="img" aria-label="profile">📝</span></h2>
          {msg && <div className="update-msg">{msg}</div>}
          {profile && !editProfile && (
            <div className="profile-view">
              <div><b>Name:</b> {profile.name}</div>
              <div><b>Email:</b> {profile.email}</div>
              <div><b>Phone:</b> {profile.phone}</div>
              <div><b>Address:</b> {profile.address}</div>
              <div><b>Ward:</b> {profile.ward}</div>
              <button className="btn btn-secondary" onClick={() => setEditProfile(true)}>Edit Profile</button>
            </div>
          )}
          {profile && editProfile && (
            <form className="profile-form" onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={profileForm.name} onChange={handleProfileChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={profileForm.phone} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" value={profileForm.address} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label>Ward</label>
                <input name="ward" value={profileForm.ward} onChange={handleProfileChange} />
              </div>
              <button className="btn btn-primary" type="submit">Save</button>
              <button className="btn btn-secondary" type="button" onClick={() => setEditProfile(false)}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard; 