import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Get donation history from localStorage
const getDonationHistory = () => {
  const saved = localStorage.getItem("drs-donations");
  return saved ? JSON.parse(saved) : [];
};

// Save donation to localStorage
const saveDonation = (donation) => {
  const history = getDonationHistory();
  history.unshift({ ...donation, id: Date.now(), date: new Date().toISOString() });
  // Keep only last 50 donations
  const trimmed = history.slice(0, 50);
  localStorage.setItem("drs-donations", JSON.stringify(trimmed));
  return trimmed;
};

// Simulated recent donors (for demo)
const simulatedRecentDonors = [
  { name: "Anonymous", amount: 500, message: "Keep up the great work! 🔥" },
  { name: "GamingFan2024", amount: 200, message: "DRS forever! 💪" },
  { name: "PUBG_Pro", amount: 1000, message: "Support from Northeast India! 🇮🇳" },
  { name: "Anonymous", amount: 100, message: "GLHF! 🎮" },
  { name: "EsportsLover", amount: 250, message: "Win the next tournament! 🏆" },
];

function Donation() {
  const [selectedAmount, setSelectedAmount] = useState(200);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    anonymous: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [recentDonors, setRecentDonors] = useState(simulatedRecentDonors);

  const presetAmounts = [50, 100, 200, 500, 1000];

  const donationAmount = useCustomAmount ? (parseInt(customAmount) || 0) : selectedAmount;

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setUseCustomAmount(false);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(value);
    setUseCustomAmount(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (donationAmount < 10) {
      alert("Minimum donation amount is ₹10");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const donorName = formData.anonymous ? "Anonymous" : (formData.name || "Supporter");
    
    const donation = {
      amount: donationAmount,
      paymentMethod,
      donorName,
      donorEmail: formData.email,
      message: formData.message,
      anonymous: formData.anonymous,
    };

    // Save donation
    saveDonation(donation);

    // Update recent donors display
    const newDonor = { name: donorName, amount: donationAmount, message: formData.message };
    setRecentDonors([newDonor, ...recentDonors.slice(0, 4)]);

    setIsProcessing(false);
    setDonationSuccess(true);
  };

  const resetForm = () => {
    setDonationSuccess(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      anonymous: false,
    });
    setSelectedAmount(200);
    setCustomAmount("");
    setUseCustomAmount(false);
  };

  if (donationSuccess) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <motion.div
            className="donation-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="success-animation"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            >
              🎉
            </motion.div>
            <h1>Thank You for Your Support!</h1>
            <p className="success-message">
              Your generous donation of <span className="highlight">₹{donationAmount}</span> will help us continue our esports journey and represent India on the global stage.
            </p>
            <div className="success-details">
              <p>📧 A confirmation email has been sent to {formData.email || "your email"}</p>
              <p>🆔 Transaction ID: DRS-{Date.now().toString().slice(-8)}</p>
            </div>
            <div className="success-actions">
              <button onClick={resetForm} className="primary-btn">
                Make Another Donation
              </button>
              <Link to="/" className="secondary-btn">
                Back to Home
              </Link>
            </div>
            <div className="share-donation">
              <p>Share your support:</p>
              <div className="share-buttons">
                <button className="share-btn twitter" title="Share on Twitter">
                  𝕏
                </button>
                <button className="share-btn facebook" title="Share on Facebook">
                  f
                </button>
                <button className="share-btn whatsapp" title="Share on WhatsApp">
                  💬
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="donation-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Support <span className="highlight">DRS Esports</span></h1>
            <p>Help us continue our journey to glory</p>
          </motion.div>
        </section>

        <section className="donation-content">
          <div className="container">
            <div className="donation-grid">
              {/* Donation Form */}
              <motion.div
                className="donation-form-container"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="form-card">
                  <h2>Make a Donation</h2>
                  
                  {/* Amount Selection */}
                  <div className="amount-section">
                    <label>Select Amount</label>
                    <div className="preset-amounts">
                      {presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          className={`amount-btn ${!useCustomAmount && selectedAmount === amount ? "selected" : ""}`}
                          onClick={() => handleAmountSelect(amount)}
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                    <div className="custom-amount">
                      <input
                        type="text"
                        placeholder="Custom Amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className={useCustomAmount ? "active" : ""}
                      />
                      {useCustomAmount && (
                        <span className="selected-custom">✓</span>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="payment-section">
                    <label>Payment Method</label>
                    <div className="payment-methods">
                      <button
                        className={`payment-btn ${paymentMethod === "upi" ? "selected" : ""}`}
                        onClick={() => setPaymentMethod("upi")}
                      >
                        📱 UPI
                      </button>
                      <button
                        className={`payment-btn ${paymentMethod === "card" ? "selected" : ""}`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        💳 Card
                      </button>
                      <button
                        className={`payment-btn ${paymentMethod === "paytm" ? "selected" : ""}`}
                        onClick={() => setPaymentMethod("paytm")}
                      >
                        🟡 Paytm
                      </button>
                      <button
                        className={`payment-btn ${paymentMethod === "netbanking" ? "selected" : ""}`}
                        onClick={() => setPaymentMethod("netbanking")}
                      >
                        🏦 Net Banking
                      </button>
                    </div>
                  </div>

                  {/* Donor Details */}
                  <form onSubmit={handleSubmit} className="donor-form">
                    <div className="form-group">
                      <label>Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        disabled={formData.anonymous}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone (Optional)</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="form-group">
                      <label>Message (Optional)</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Leave a message of support..."
                        rows={2}
                      />
                    </div>
                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="anonymous"
                          checked={formData.anonymous}
                          onChange={handleInputChange}
                        />
                        <span>Make this donation anonymous</span>
                      </label>
                    </div>

                    <div className="donation-summary">
                      <div className="summary-row">
                        <span>Donation Amount</span>
                        <span className="amount">₹{donationAmount}</span>
                      </div>
                      <div className="summary-row">
                        <span>Processing Fee</span>
                        <span>₹0</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total</span>
                        <span className="amount">₹{donationAmount}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="donate-btn"
                      disabled={isProcessing || donationAmount < 10}
                    >
                      {isProcessing ? (
                        <span className="processing">
                          <span className="spinner"></span>
                          Processing...
                        </span>
                      ) : (
                        <>Donate ₹{donationAmount}</>
                      )}
                    </button>

                    <p className="secure-notice">
                      🔒 Secure payment powered by encrypted connection
                    </p>
                  </form>
                </div>
              </motion.div>

              {/* Sidebar - Info & Recent Donors */}
              <motion.div
                className="donation-sidebar"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Why Donate */}
                <div className="info-card">
                  <h3>Why Donate?</h3>
                  <ul>
                    <li>🏆 Help us compete in international tournaments</li>
                    <li>🎮 Support talented players from underprivileged backgrounds</li>
                    <li>🇮🇳 Represent India on the global esports stage</li>
                    <li>👕 Get exclusive DRS supporter badge</li>
                    <li>🎁 Early access to merchandise drops</li>
                  </ul>
                </div>

                {/* Tax Benefits */}
                <div className="info-card tax-card">
                  <h3>📋 Tax Benefits</h3>
                  <p>All donations to DRS Esports Foundation are eligible for tax deduction under Section 80G of the Income Tax Act.</p>
                  <p className="tax-note">* 50% of your donation is tax-deductible</p>
                </div>

                {/* Recent Donors */}
                <div className="recent-donors-card">
                  <h3>Recent Supporters</h3>
                  <div className="donors-list">
                    {recentDonors.map((donor, index) => (
                      <motion.div
                        key={index}
                        className="donor-item"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="donor-avatar">
                          {donor.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="donor-info">
                          <span className="donor-name">{donor.name}</span>
                          {donor.message && (
                            <span className="donor-message">"{donor.message}"</span>
                          )}
                        </div>
                        <span className="donor-amount">₹{donor.amount}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="info-card contact-card">
                  <h3>Contact Us</h3>
                  <p>📧 support@drsesports.com</p>
                  <p>📱 +91 98765 43210</p>
                  <p>📍 Mumbai, Maharashtra, India</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Donation;

