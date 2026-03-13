import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Meta from "../components/Meta";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [consent, setConsent] = useState(false);

  const interests = [
    { id: "tournaments", label: "Tournament Updates", icon: "🏆" },
    { id: "merchandise", label: "Merchandise & Sales", icon: "👕" },
    { id: "news", label: "Esports News", icon: "📰" },
    { id: "events", label: "Events & Meetups", icon: "🎉" },
    { id: "streams", label: "Live Streams", icon: "📺" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && consent) {
      // Save to localStorage for demo
      const subscribers = JSON.parse(
        localStorage.getItem("drs-subscribers") || "[]"
      );
      subscribers.push({
        email,
        interests: selectedInterests,
        date: new Date().toISOString(),
        consent: true,
      });
      localStorage.setItem("drs-subscribers", JSON.stringify(subscribers));
      setSubscribed(true);
    }
  };

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  return (
    <>
      <Meta
        title="Newsletter | DRS ESPORTS"
        description="Subscribe to DRS Esports for tournament updates, offers, streams, and announcements."
        canonicalPath="/newsletter"
      />
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="newsletter-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Subscribe to Our <span className="highlight">Newsletter</span></h1>
            <p>Stay updated with the latest news, tournaments, and exclusive offers</p>
          </motion.div>
        </section>

        {/* Newsletter Content */}
        <section className="newsletter-content">
          {subscribed ? (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="success-icon">✅</div>
              <h2>You're Subscribed!</h2>
              <p>Thank you for subscribing to the DRS Esports newsletter.</p>
              <p>You'll receive updates at: <strong>{email}</strong></p>
              <button className="primary-btn" onClick={() => setSubscribed(false)}>
                Subscribe Another Email
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className="newsletter-form-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="benefits-section">
                <h2>What You'll Get</h2>
                <div className="benefits-grid">
                  <div className="benefit-card">
                    <span className="benefit-icon">🏆</span>
                    <h3>Tournament Updates</h3>
                    <p>Be the first to know about upcoming tournaments and competitions</p>
                  </div>
                  <div className="benefit-card">
                    <span className="benefit-icon">🎁</span>
                    <h3>Exclusive Offers</h3>
                    <p>Get special discounts and early access to new merchandise</p>
                  </div>
                  <div className="benefit-card">
                    <span className="benefit-icon">📰</span>
                    <h3>Esports News</h3>
                    <p>Stay informed with the latest news from the gaming world</p>
                  </div>
                  <div className="benefit-card">
                    <span className="benefit-icon">🎁</span>
                    <h3>Giveaways</h3>
                    <p>Enter exclusive giveaways and win prizes</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="newsletter-form">
                <h2>Subscribe Now</h2>
                
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    inputMode="email"
                    aria-label="Email address"
                  />
                </div>

                <div className="form-group">
                  <label>Select Your Interests</label>
                  <div className="interests-grid">
                    {interests.map(interest => (
                      <button
                        key={interest.id}
                        type="button"
                        className={`interest-btn ${selectedInterests.includes(interest.id) ? 'active' : ''}`}
                        onClick={() => toggleInterest(interest.id)}
                      >
                        <span>{interest.icon}</span>
                        <span>{interest.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                      aria-label="Consent to receive emails"
                    />
                    <span>
                      I agree to receive emails from DRS Esports and accept the{" "}
                      <a href="/privacy-policy">Privacy Policy</a>.
                    </span>
                  </label>
                </div>

                <button type="submit" className="submit-btn" disabled={!consent}>
                  Subscribe
                </button>

                <p className="privacy-note">
                  You can unsubscribe at any time.
                </p>
              </form>
            </motion.div>
          )}

          {/* Social Subscription */}
          <div className="social-subscribe">
            <h2>Follow Us</h2>
            <p>Connect with us on social media for instant updates</p>
            <div className="social-links">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                🐦 Twitter
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                📸 Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                📺 YouTube
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                💬 Discord
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Newsletter;
