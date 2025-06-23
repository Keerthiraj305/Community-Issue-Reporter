import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <span className="logo-icon" role="img" aria-label="logo">🏛️</span>
          <span className="logo-text">Community Issue Reporter</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/" className={getLinkClass('/')}>Home</Link></li>
        <li><Link to="/about" className={getLinkClass('/about')}>About Us</Link></li>
        <li><Link to="/contact" className={getLinkClass('/contact')}>Contact Us</Link></li>
        {user ? (
          <>
            {user.role === 'admin' ? (
              <li><Link to="/admin" className={getLinkClass('/admin')}>Admin Dashboard</Link></li>
            ) : (
              <li><Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link></li>
            )}
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className={getLinkClass('/login')}>Login</Link></li>
            <li><Link to="/register" className={getLinkClass('/register')}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar; 