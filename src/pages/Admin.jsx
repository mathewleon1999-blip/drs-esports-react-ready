import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Demo admin credentials
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "drsadmin@123",
  email: "drsesports@.com"
};

function Admin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (
        formData.username.toLowerCase() === ADMIN_CREDENTIALS.username &&
        formData.password === ADMIN_CREDENTIALS.password
      ) {
        // Store admin session
        localStorage.setItem("drs-admin", JSON.stringify({
          username: formData.username,
          email: ADMIN_CREDENTIALS.email,
          loggedIn: true,
          loginTime: new Date().toISOString(),
        }));
        setLoading(false);
        navigate("/admin-dashboard");
      } else {
        setError("Invalid username or password");
        setLoading(false);
      }
    }, 1000);
  };

  const admin = JSON.parse(localStorage.getItem("drs-admin") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("drs-admin");
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="admin-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Admin <span className="highlight">Portal</span></h1>
            <p>Manage your DRS Esports platform</p>
          </motion.div>
        </section>

        {/* Admin Login */}
        <section className="admin-section">
          <div className="container">
            <motion.div
              className="admin-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {admin.loggedIn ? (
                <div className="admin-dashboard-preview">
                  <div className="admin-welcome">
                    <div className="admin-avatar">⚙️</div>
                    <h2>Welcome, Admin!</h2>
                    <p>You have access to the admin dashboard</p>
                    <div className="admin-info">
                      <p><strong>Username:</strong> {admin.username}</p>
                      <p><strong>Email:</strong> {admin.email}</p>
                      <p><strong>Login Time:</strong> {new Date(admin.loginTime).toLocaleString()}</p>
                    </div>
                    <div className="admin-actions">
                      <Link to="/admin-dashboard" className="admin-btn primary">
                        📦 Go to Dashboard
                      </Link>
                      <button className="admin-btn danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="admin-header">
                    <div className="lock-icon">🔐</div>
                    <h2>Admin Login</h2>
                    <p>Enter your credentials to access the admin panel</p>
                  </div>

                  <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                      />
                    </div>

                    {error && (
                      <motion.div 
                        className="error-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {error}
                      </motion.div>
                    )}

                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? "Authenticating..." : "Login"}
                    </button>
                  </form>

                  <div className="admin-footer">
                    <Link to="/login" className="back-link">
                      ← Back to Player Login
                    </Link>
                  </div>

                  <div className="demo-credentials">
                    <p><strong>Demo Credentials:</strong></p>
                    <p>Username: admin</p>
                    <p>Password: drsadmin@123</p>
                  </div>
                </>
              )}
            </motion.div>

            {/* Admin Features */}
            {!admin.loggedIn && (
              <motion.div
                className="admin-features"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3>Admin Features</h3>
                <div className="features-grid">
                  <div className="feature-item">
                    <span className="feature-icon">📦</span>
                    <h4>Order Management</h4>
                    <p>View and manage all customer orders</p>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">👥</span>
                    <h4>User Management</h4>
                    <p>Manage player accounts and permissions</p>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">👕</span>
                    <h4>Inventory</h4>
                    <p>Manage jersey stock and products</p>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🏆</span>
                    <h4>Achievements</h4>
                    <p>Update tournament achievements</p>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📊</span>
                    <h4>Analytics</h4>
                    <p>View website traffic and sales</p>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⚙️</span>
                    <h4>Settings</h4>
                    <p>Configure website settings</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Admin;

