import React, { useState } from 'react';

function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="contact-title">Contact Us <span role="img" aria-label="phone">☎️</span></h1>
        <p className="contact-desc">Get in touch with us for any questions or support you need.</p>
        <div className="contact-info">
          <ul>
            <li><b>Email:</b> support@communityissuereporter.com</li>
            <li><b>Phone:</b> +91 80 2222 1111</li>
            <li><b>Address:</b> BBMP Head Office, NR Square, Bangalore</li>
            <li><b>Timings:</b> Monday - Friday, 9:00 AM - 6:00 PM</li>
            <li><b>City:</b> Bangalore, Karnataka</li>
          </ul>
        </div>
        <div className="contact-form-section">
          <h2>Send us a message <span role="img" aria-label="mail">✉️</span></h2>
          {submitted ? (
            <div className="success-msg">Thank you for contacting us! We will get back to you soon.</div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactUs; 