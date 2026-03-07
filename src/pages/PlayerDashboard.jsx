import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Get orders from localStorage
const getOrders = () => {
  const saved = localStorage.getItem("drs-orders");
  return saved ? JSON.parse(saved) : [];
};

function PlayerDashboard() {
  const [player, setPlayer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const playerData = JSON.parse(localStorage.getItem("drs-player") || "{}");
    if (!playerData.loggedIn) {
      navigate("/login");
    } else {
      setPlayer(playerData);
      setOrders(getOrders());
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("drs-player");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "status-pending";
      case "processing": return "status-processing";
      case "shipped": return "status-shipped";
      case "delivered": return "status-delivered";
      default: return "";
    }
  };

  if (!player) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="player-dashboard">
        {/* Dashboard Header */}
        <section className="dashboard-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="user-avatar-large">👤</div>
            <h1>Welcome back, <span className="highlight">{player.username || "Player"}!</span></h1>
            <p>Manage your account and view your activity</p>
          </motion.div>
        </section>

        {/* Dashboard Content */}
        <section className="dashboard-body">
          <div className="container">
            {/* Tabs */}
            <div className="dashboard-tabs">
              <button
                className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                👤 Profile
              </button>
              <button
                className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                📦 Orders
              </button>
              <button
                className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                ⚙️ Settings
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                className="tab-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="profile-card">
                  <h2>Profile <span className="highlight">Information</span></h2>
                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="detail-label">Username:</span>
                      <span className="detail-value">{player.username || "Not set"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{player.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{player.phone || "Not set"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Member Since:</span>
                      <span className="detail-value">{player.registered ? "2025" : "Today"}</span>
                    </div>
                  </div>
                  <button className="edit-profile-btn">Edit Profile</button>
                </div>

                <div className="membership-card">
                  <h2>DRS <span className="highlight">Membership</span></h2>
                  <div className="membership-tier">
                    <span className="tier-badge">Silver Member</span>
                  </div>
                  <p className="membership-points">You have <strong>500</strong> loyalty points</p>
                  <div className="membership-benefits">
                    <ul>
                      <li>🎮 Access to exclusive tournaments</li>
                      <li>👕 5% off on merchandise</li>
                      <li>🏆 Priority registration for events</li>
                      <li>💬 Private Discord community</li>
                    </ul>
                  </div>
                  <Link to="/shop" className="primary-btn">Earn More Points</Link>
                </div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <motion.div
                className="tab-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>My <span className="highlight">Orders</span></h2>
                {orders.length === 0 ? (
                  <div className="no-orders">
                    <div className="empty-icon">📦</div>
                    <h3>No orders yet</h3>
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/shop" className="primary-btn">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <span className="order-id">{order.id}</span>
                          <span className={`status-badge ${getStatusColor(order.status)}`}>{order.status}</span>
                        </div>
                        <div className="order-details">
                          <p><strong>Items:</strong> {order.items}</p>
                          <p><strong>Total:</strong> ₹{order.total}</p>
                          <p><strong>Date:</strong> {order.date}</p>
                        </div>
                        <Link to={`/order-tracking?id=${order.id}`} className="track-order-btn">
                          Track Order
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <motion.div
                className="tab-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Account <span className="highlight">Settings</span></h2>
                
                <div className="settings-section">
                  <h3>Notification Preferences</h3>
                  <div className="setting-item">
                    <label className="toggle-label">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-text">Email notifications for orders</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label className="toggle-label">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-text">Tournament updates</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label className="toggle-label">
                      <input type="checkbox" />
                      <span className="toggle-text">Marketing emails</span>
                    </label>
                  </div>
                </div>

                <div className="settings-section">
                  <h3>Security</h3>
                  <button className="settings-btn">Change Password</button>
                  <button className="settings-btn">Enable Two-Factor Auth</button>
                </div>

                <div className="settings-section danger-zone">
                  <h3>Danger Zone</h3>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                  <button className="delete-account-btn">Delete Account</button>
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

export default PlayerDashboard;
