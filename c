// AdminDashboard - Fixed version
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("drs-admin") || "{}");
    if (!adminData.loggedIn) {
      navigate("/admin");
    } else {
      setAdmin(adminData);
    }
  }, [navigate]);

  if (!admin) return null;

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <aside className="dashboard-sidebar">
          <h2>Admin Panel</h2>
          <p>Welcome, {admin.username}</p>
          <button onClick={() => setActiveTab("overview")}>Overview</button>
          <button onClick={() => setActiveTab("orders")}>Orders</button>
          <button onClick={() => setActiveTab("products")}>Products</button>
          <button onClick={() => setActiveTab("users")}>Users</button>
          <button onClick={() => setActiveTab("tournaments")}>Tournaments</button>
          <button onClick={() => setActiveTab("newsletter")}>Newsletter</button>
          <button onClick={() => setActiveTab("analytics")}>Analytics</button>
          <button onClick={() => setActiveTab("settings")}>Settings</button>
          <button onClick={() => { localStorage.removeItem("drs-admin"); navigate("/admin"); }}>Logout</button>
        </aside>
        <main className="dashboard-content">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Dashboard Overview</h1>
            </motion.div>
          )}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Order Management</h1>
            </motion.div>
          )}
          {activeTab === "products" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Product Management</h1>
            </motion.div>
          )}
          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>User Management</h1>
            </motion.div>
          )}
          {activeTab === "tournaments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Tournament Management</h1>
            </motion.div>
          )}
          {activeTab === "newsletter" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Newsletter Management</h1>
            </motion.div>
          )}
          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Analytics</h1>
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Settings</h1>
            </motion.div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
