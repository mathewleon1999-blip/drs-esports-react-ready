import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Get stored messages from localStorage
const getMessages = () => {
  const saved = localStorage.getItem("drs-contact-messages");
  return saved ? JSON.parse(saved) : [];
};

const saveMessage = (message) => {
  const messages = getMessages();
  messages.push(message);
  localStorage.setItem("drs-contact-messages", JSON.stringify(messages));
};

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields");
      return;
    }

    // Save to localStorage for demo
    saveMessage({
      id: Date.now(),
      ...formData,
      date: new Date().toISOString(),
      status: "unread",
    });

    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Contact <span className="highlight">Us</span></h1>
            <p>Get in touch with the DRS Esports team</p>
          </motion.div>
        </section>

        <section className="contact-content">
          <div className="container">
            <div className="contact-grid">
              {/* Contact Form */}
              <motion.div
                className="contact-form-container"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {submitted ? (
                  <div className="success-message-box">
                    <div className="success-icon">✅</div>
                    <h2>Message Sent!</h2>
                    <p>Thank you for contacting us. We'll get back to you within 24-48 hours.</p>
                    <button 
                      className="primary-btn"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2>Send us a <span className="highlight">Message</span></h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                      <div className="form-group">
                        <label>Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Subject</label>
                        <select name="subject" value={formData.subject} onChange={handleChange}>
                          <option value="">Select a topic</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Customer Support</option>
                          <option value="sponsorship">Sponsorship</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Message *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          rows={5}
                          required
                        />
                      </div>
                      {error && <div className="error-message">{error}</div>}
                      <button type="submit" className="submit-btn">
                        Send Message
                      </button>
                    </form>
                  </>
                )}
              </motion.div>

              {/* Contact Information */}
              <motion.div
                className="contact-info-container"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2>Contact <span className="highlight">Information</span></h2>
                
                <div className="contact-info-item">
                  <div className="info-icon">📍</div>
                  <div className="info-content">
                    <h3>Address</h3>
                    <p>DRS Esports Arena</p>
                    <p>123 Gaming Street</p>
                    <p>Bangalore, Karnataka 560001</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-icon">📧</div>
                  <div className="info-content">
                    <h3>Email</h3>
                    <p>contact@drsesports.com</p>
                    <p>support@drsesports.com</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-icon">📱</div>
                  <div className="info-content">
                    <h3>Phone</h3>
                    <p>+91 98765 43210</p>
                    <p>+91 80 1234 5678</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-icon">🕐</div>
                  <div className="info-content">
                    <h3>Hours</h3>
                    <p>Monday - Friday: 9AM - 6PM</p>
                    <p>Saturday: 10AM - 4PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>

                <div className="social-links">
                  <h3>Follow Us</h3>
                  <div className="social-icons">
                    <a href="https://www.instagram.com/ig.dikkaris_esports?utm_source=qr&igsh=MWFncHlsZXI1c21mMw==" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">📸</a>
                    <a href="https://www.youtube.com/@dikkarisesports" target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube">📺</a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Map Section */}
            <motion.div
              className="map-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2>Find <span className="highlight">Us</span></h2>
              <div className="map-placeholder">
                <div className="map-icon">🗺️</div>
                <p>DRS Esports Arena Location</p>
                <p className="map-address">123 Gaming Street, Bangalore, Karnataka</p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
