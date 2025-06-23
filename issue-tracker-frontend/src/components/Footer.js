import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-branding">
          <span className="footer-logo" role="img" aria-label="logo">🏛️</span>
          <span className="footer-title">Community Issue Reporter</span>
        </div>
        <div className="footer-info">
          <span>Bangalore, Karnataka, India</span>
          <span>Contact: <a href="mailto:support@communityreporter.com">support@communityreporter.com</a></span>
        </div>
        <div className="footer-social">
          <a href="/" target="_blank" rel="noopener noreferrer" title="Website">🌐</a>
          <a href="mailto:support@communityreporter.com" title="Email">✉️</a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Community Issue Reporter. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer; 