import React from 'react';

function AboutUs() {
  return (
    <div className="about-page">
      <div className="container">
        <h1 className="about-title">About Us <span role="img" aria-label="info">ℹ️</span></h1>
        <p className="about-desc">
          Community Issue Reporter is a platform that connects citizens with local government authorities 
          to report and track civic issues in their neighborhoods. Our mission is to make cities more 
          livable and responsive to citizen needs.
        </p>
        <div className="about-bbmp-card">
          <h2>About BBMP <span role="img" aria-label="building">🏛️</span></h2>
          <ul>
            <li><b>Name:</b> Bruhat Bengaluru Mahanagara Palike</li>
            <li><b>Website:</b> <a href="https://bbmp.gov.in" target="_blank" rel="noopener noreferrer">https://bbmp.gov.in</a></li>
            <li><b>Address:</b> BBMP Head Office, NR Square, Bangalore</li>
            <li><b>Contact:</b> +91 80 2222 1111</li>
            <li><b>City:</b> Bangalore, Karnataka</li>
          </ul>
        </div>
        <div className="about-highlights">
          <h3>Highlights <span role="img" aria-label="star">⭐</span></h3>
          <ul>
            <li>Real-time issue tracking and status updates</li>
            <li>Direct communication with government departments</li>
            <li>Community-driven problem resolution</li>
            <li>Transparent and accountable governance</li>
            <li>Mobile-friendly interface for easy reporting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutUs; 