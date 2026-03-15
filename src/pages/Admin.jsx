import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAdminAuth } from "../context/AdminAuthContext";

// Local, client-side auth configuration.
// IMPORTANT: This is not secure like a backend; it’s a practical step before adding Firebase/Supabase.
// Change these in production and move to server-side auth.
const ADMIN_AUTH = {
  // Allow logging in with username OR email.
  username: "admin",
  email: "drsesports@gmail.com",
  // Password is checked on the client only.
  password: "admin",
};

function Admin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, isAuthenticated, login, logout } = useAdminAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side check (upgrade later to real backend auth)
    setTimeout(() => {
      const input = formData.username.trim().toLowerCase();
      const isValidIdentity =
        input === ADMIN_AUTH.username.toLowerCase() || input === ADMIN_AUTH.email.toLowerCase();

      const isValidPassword = formData.password === ADMIN_AUTH.password;

      if (isValidIdentity && isValidPassword) {
        login({ username: formData.username.trim() || "admin", email: ADMIN_AUTH.email });
        setLoading(false);
        const redirectTo = location.state?.from || "/admin-dashboard";
        navigate(redirectTo);
      } else {
        setError("Invalid username or password");
        setLoading(false);
      }
    }, 400);
  };

  const handleLogout = () => {
    logout();
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
              {isAuthenticated ? (
                <div className="admin-dashboard-preview">
                  <div className="admin-welcome">
                    <div className="admin-avatar">⚙️</div>
                    <h2>Welcome, Admin!</h2>
                    <p>You have access to the admin dashboard</p>
                    <div className="admin-info">
                      <p><strong>Username:</strong> {admin?.username}</p>
                      <p><strong>Email:</strong> {admin?.email}</p>
                      <p><strong>Login Time:</strong> {admin?.loginTime ? new Date(admin.loginTime).toLocaleString() : "-"}</p>
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
                    <p><strong>Admin Credentials:</strong></p>
                    <p>Username: admin (or {ADMIN_AUTH.email})</p>
                    <p>Password: admin</p>
                    <p style={{ opacity: 0.8, marginTop: 6 }}>
                      Note: this is client-side auth. For real security, we will move this to Firebase/Supabase.
                    </p>
                  </div>
                </>
              )}
            </motion.div>

            {/* Admin Features */}
            {!isAuthenticated && (
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

