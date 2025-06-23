import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', ward: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authApi.post('/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title"><span role="img" aria-label="user">👤</span> Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Ward</label>
            <input name="ward" value={form.ward} onChange={handleChange} />
          </div>
          {error && <div className="error-msg" style={{color: 'red', marginTop: '10px', padding: '10px', border: '1px solid red', borderRadius: '5px'}}>{error}</div>}
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <div className="auth-footer">
          <span>Already have an account? <a href="/login">Login</a></span>
        </div>
      </div>
    </div>
  );
}

export default Register; 