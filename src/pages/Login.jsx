import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      // For demo purposes, accept any credentials
      if (formData.email && formData.password) {
        // Store player session
        localStorage.setItem("drs-player", JSON.stringify({
          email: formData.email,
          username: formData.email.split("@")[0],
          loggedIn: true,
        }));
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError("Please enter email and password");
      }
    } else {
      // Register logic
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      
      // Store player registration
      localStorage.setItem("drs-player", JSON.stringify({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        registered: true,
      }));
      setSuccess("Registration successful! Please login.");
      setIsLogin(true);
      setFormData({ ...formData, password: "", confirmPassword: "" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("drs-player");
    setFormData({ email: "", password: "", confirmPassword: "", username: "", phone: "" });
  };

  const player = JSON.parse(localStorage.getItem("drs-player") || "{}");

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="login-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>{isLogin ? "Player" : "New Player"} <span className="highlight">Login</span></h1>
            <p>{isLogin ? "Access your DRS account" : "Join the DRS family"}</p>
          </motion.div>
        </section>

        {/* Login Form */}
        <section className="login-section">
          <div className="container">
            <motion.div
              className="login-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {player.loggedIn ? (
                <div className="logged-in-box">
                  <div className="user-avatar">👤</div>
                  <h2>Welcome back, {player.username || "Player"}!</h2>
                  <p>You are logged in to your DRS account</p>
                  <div className="user-details">
                    <p><strong>Email:</strong> {player.email}</p>
                  </div>
                  <div className="login-actions">
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                    <Link to="/" className="home-btn">Go to Home</Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="login-tabs">
                    <button
                      className={`tab-btn ${isLogin ? "active" : ""}`}
                      onClick={() => setIsLogin(true)}
                    >
                      Login
                    </button>
                    <button
                      className={`tab-btn ${!isLogin ? "active" : ""}`}
                      onClick={() => setIsLogin(false)}
                    >
                      Register
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                      <>
                        <div className="form-group">
                          <label>Username *</label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                          />
                        </div>
                      </>
                    )}
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
                      <label>Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {!isLogin && (
                      <div className="form-group">
                        <label>Confirm Password *</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                        />
                      </div>
                    )}

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="submit-btn">
                      {isLogin ? "Login" : "Register"}
                    </button>
                  </form>

<div className="login-footer">
                    <p>
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <button
                        type="button"
                        className="switch-btn"
                        onClick={() => setIsLogin(!isLogin)}
                      >
                        {isLogin ? "Register" : "Login"}
                      </button>
                    </p>
                    {isLogin && (
                      <p>
                        <Link to="/password-reset" className="forgot-password-link">
                          Forgot Password?
                        </Link>
                      </p>
                    )}
                    <Link to="/admin" className="admin-link">
                      Admin Login →
                    </Link>
                  </div>
                </>
              )}
            </motion.div>

            {/* Benefits Section */}
            {!player.loggedIn && (
              <motion.div
                className="login-benefits"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3>Benefits of Joining DRS</h3>
                <ul className="benefits-list">
                  <li>🎮 Access to exclusive tournaments</li>
                  <li>👕 Member-only merchandise discounts</li>
                  <li>🏆 Priority registration for events</li>
                  <li>💬 Private Discord community</li>
                  <li>🎯 Training sessions with pro players</li>
                  <li>🌟 Represent DRS in matches</li>
                </ul>
              </motion.div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Login;

