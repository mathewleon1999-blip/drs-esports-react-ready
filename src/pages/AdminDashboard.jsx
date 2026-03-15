import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";
import {
  fetchUsers as fetchUsersFromSupabase,
  updateUser as updateUserInSupabase,
  deleteUser as deleteUserInSupabase,
} from "../lib/usersRepo";
import { fetchLiveSettings } from "../lib/liveSettingsRepo";

// Transaction categories
const TRANSACTION_CATEGORIES = [
  "Player Salary",
  "Device Sponsor",
  "UC Sponsor",
  "Rename Card",
  "Tournament Expense",
  "Other"
];

// Default products data
const defaultProducts = [
  { id: 1, name: "DRS Official Jersey", price: 1299, stock: 50, category: "Jersey", featured: true, images: ["/JERSEY/WhatsApp Image 2026-03-03 at 5.36.51 PM.jpeg"], colors: ["Black", "Navy Blue"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 2, name: "DRS Official Hoodie", price: 2499, stock: 35, category: "Hoodie", featured: true, images: ["/HODIE/WhatsApp Image 2026-03-03 at 5.36.53 PM.jpeg"], colors: ["Black", "Grey"], sizes: ["S", "M", "L", "XL", "XXL"] },
];

// Default users
const defaultUsers = [
  { id: 1, username: "player1", email: "player1@drs.com", role: "player", joined: "2025-01-15" },
  { id: 2, username: "pro_gamer", email: "progamer@drs.com", role: "player", joined: "2025-02-20" },
];

// Default tournaments
const defaultTournaments = [
  { id: 1, name: "DRS Championship 2025", date: "2025-06-15", prizePool: 50000, status: "upcoming", registrations: 16 },
  { id: 2, name: "Weekly Scrims", date: "2025-03-20", prizePool: 5000, status: "ongoing", registrations: 8 },
];

// Default news
const defaultNews = [
  { id: 1, title: "DRS Wins PUBG Mobile Championship", category: "Tournament", date: "2025-02-10", featured: true },
  { id: 2, title: "New Merch Collection Launch", category: "Merchandise", date: "2025-02-05", featured: false },
];

// Default discount codes
const defaultDiscounts = [
  { id: 1, code: "WELCOME10", discount: 10, type: "percentage", validUntil: "2025-12-31", active: true, usage: 45 },
  { id: 2, code: "NEWYEAR20", discount: 20, type: "percentage", validUntil: "2025-01-31", active: false, usage: 120 },
];

// LocalStorage helpers
const getStoredData = (key, defaultData) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultData;
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [news, setNews] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [liveSettings, setLiveSettings] = useState(null);
  const [liveForm, setLiveForm] = useState({ is_live: false, title: "DRS Live", stream_url: "" });
  const [savingLive, setSavingLive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [financeFilters, setFinanceFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    player: "",
    sponsor: ""
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function fetchTransactionsFromSupabase() {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase transactions fetch failed:", error);
        // fall back to local data if any exists
        setTransactions(getStoredData("drs-transactions", []));
        showToast("Transactions sync failed (Supabase)", "error");
        return;
      }

      setTransactions(data || []);
    } catch (err) {
      console.error("Supabase transactions fetch crashed:", err);
      setTransactions(getStoredData("drs-transactions", []));
      showToast("Transactions sync error (Supabase)", "error");
    }
  }

  // Initialize data
  useEffect(() => {
    // Auth is enforced by route guard (RequireAdmin). We only read session for display.
    const session = JSON.parse(localStorage.getItem("drs-admin-session") || "{}");
    setAdmin(session?.loggedIn ? session : { username: "Admin" });

    // Load all other data (still local for now)
    setOrders(getStoredData("drs-orders", []));
    setProducts(getStoredData("drs-products", defaultProducts));
    // Users: Supabase (sync across devices)
    (async () => {
      try {
        const { data, error } = await fetchUsersFromSupabase();
        if (error) {
          console.error("Supabase users fetch failed:", error);
          setUsers(getStoredData("drs-users", defaultUsers));
          return;
        }
        setUsers(data || []);
      } catch (err) {
        console.error("Supabase users fetch crashed:", err);
        setUsers(getStoredData("drs-users", defaultUsers));
      }
    })();
    setTournaments(getStoredData("drs-tournaments-admin", defaultTournaments));
    setNews(getStoredData("drs-news-admin", defaultNews));
    setDiscounts(getStoredData("drs-discounts", defaultDiscounts));

    // Transactions: Supabase (sync across devices)
    fetchTransactionsFromSupabase();

    // Live settings: Supabase
    (async () => {
      try {
        const { data } = await fetchLiveSettings("main");
        setLiveSettings(data || null);
        setLiveForm({
          is_live: Boolean(data?.is_live),
          title: data?.title || "DRS Live",
          stream_url: data?.stream_url || "",
        });
      } catch {
        // ignore
      }
    })();
  }, []);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("drs-admin-session");
    navigate("/admin");
  };

  // Order functions
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setStoredData("drs-orders", updatedOrders);
    showToast("Order status updated!");
  };

  const deleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    setStoredData("drs-orders", updatedOrders);
    showToast("Order deleted!");
  };

  // Product functions
  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    setStoredData("drs-products", updatedProducts);
    showToast("Product added successfully!");
    setShowModal(false);
  };

  const updateProduct = (productId, updates) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, ...updates } : p
    );
    setProducts(updatedProducts);
    setStoredData("drs-products", updatedProducts);
    showToast("Product updated successfully!");
    setShowModal(false);
    setEditingItem(null);
  };

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    setStoredData("drs-products", updatedProducts);
    showToast("Product deleted!");
  };

  // User functions
  const toggleUserStatus = async (userId) => {
    const current = users.find((u) => u.id === userId);
    const nextStatus = current?.status === "active" ? "suspended" : "active";

    try {
      const { data, error } = await updateUserInSupabase(userId, { status: nextStatus });
      if (error) {
        console.error("Supabase user update failed:", error);
        showToast(`Failed to update user: ${error.message}`, "error");
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)));
      showToast("User status updated!");
    } catch (err) {
      console.error("Supabase user update crashed:", err);
      showToast("Failed to update user", "error");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { error } = await deleteUserInSupabase(userId);
      if (error) {
        console.error("Supabase user delete failed:", error);
        showToast(`Failed to delete user: ${error.message}`, "error");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast("User deleted!");
    } catch (err) {
      console.error("Supabase user delete crashed:", err);
      showToast("Failed to delete user", "error");
    }
  };

  // Tournament functions
  const addTournament = (tournament) => {
    const newTournament = { ...tournament, id: Date.now(), registrations: 0 };
    const updatedTournaments = [...tournaments, newTournament];
    setTournaments(updatedTournaments);
    setStoredData("drs-tournaments-admin", updatedTournaments);
    showToast("Tournament added!");
    setShowModal(false);
  };

  const updateTournament = (tournamentId, updates) => {
    const updatedTournaments = tournaments.map(t => 
      t.id === tournamentId ? { ...t, ...updates } : t
    );
    setTournaments(updatedTournaments);
    setStoredData("drs-tournaments-admin", updatedTournaments);
    showToast("Tournament updated!");
    setShowModal(false);
    setEditingItem(null);
  };

  const deleteTournament = (tournamentId) => {
    const updatedTournaments = tournaments.filter(t => t.id !== tournamentId);
    setTournaments(updatedTournaments);
    setStoredData("drs-tournaments-admin", updatedTournaments);
    showToast("Tournament deleted!");
  };

  // News functions
  const addNews = (item) => {
    const newNews = { ...item, id: Date.now(), date: new Date().toISOString().split("T")[0] };
    const updatedNews = [...news, newNews];
    setNews(updatedNews);
    setStoredData("drs-news-admin", updatedNews);
    showToast("News article added!");
    setShowModal(false);
  };

  const updateNews = (newsId, updates) => {
    const updatedNews = news.map(n => 
      n.id === newsId ? { ...n, ...updates } : n
    );
    setNews(updatedNews);
    setStoredData("drs-news-admin", updatedNews);
    showToast("News article updated!");
    setShowModal(false);
    setEditingItem(null);
  };

  const deleteNews = (newsId) => {
    const updatedNews = news.filter(n => n.id !== newsId);
    setNews(updatedNews);
    setStoredData("drs-news-admin", updatedNews);
    showToast("News article deleted!");
  };

  // Discount functions
  const addDiscount = (discount) => {
    const newDiscount = { ...discount, id: Date.now(), usage: 0 };
    const updatedDiscounts = [...discounts, newDiscount];
    setDiscounts(updatedDiscounts);
    setStoredData("drs-discounts", updatedDiscounts);
    showToast("Discount code created!");
    setShowModal(false);
  };

  const toggleDiscountStatus = (discountId) => {
    const updatedDiscounts = discounts.map(d => 
      d.id === discountId ? { ...d, active: !d.active } : d
    );
    setDiscounts(updatedDiscounts);
    setStoredData("drs-discounts", updatedDiscounts);
    showToast("Discount status updated!");
  };

const deleteDiscount = (discountId) => {
    const updatedDiscounts = discounts.filter(d => d.id !== discountId);
    setDiscounts(updatedDiscounts);
    setStoredData("drs-discounts", updatedDiscounts);
    showToast("Discount code deleted!");
  };

  // Transaction functions (Supabase-backed)
  const addTransaction = async (transaction) => {
    try {
      const payload = {
        // enforce required fields and types
        date: transaction?.date || new Date().toISOString().slice(0, 10),
        category: String(transaction?.category || "").trim(),
        player_name: transaction?.player_name ? String(transaction.player_name).trim() : null,
        paid_by: String(transaction?.paid_by || "").trim(),
        amount: Number(transaction?.amount),
        currency: transaction?.currency ? String(transaction.currency).trim() : "AED",
        payment_method: transaction?.payment_method ? String(transaction.payment_method).trim() : null,
        description: transaction?.description ? String(transaction.description).trim() : null,
        created_by: admin?.username || "admin",
      };

      if (!payload.category || !payload.paid_by || !Number.isFinite(payload.amount)) {
        showToast("Please fill Category, Paid By and Amount", "error");
        return;
      }

      const { data, error } = await supabase.from("transactions").insert(payload).select().single();

      if (error) {
        console.error("Supabase insert failed:", error);
        showToast(`Failed to add transaction (Supabase): ${error.message}`, "error");
        return;
      }

      setTransactions((prev) => [data, ...prev]);
      showToast("Transaction added successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Supabase insert crashed:", err);
      showToast("Failed to add transaction (Supabase)", "error");
    }
  };

  const updateTransaction = async (transactionId, updates) => {
    try {
      const normalizedUpdates = {
        ...updates,
        // normalize amount if present
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "amount")
          ? { amount: Number(updates.amount) }
          : {}),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("transactions")
        .update(normalizedUpdates)
        .eq("id", transactionId)
        .select()
        .single();

      if (error) {
        console.error("Supabase update failed:", error);
        showToast(`Failed to update transaction (Supabase): ${error.message}`, "error");
        return;
      }

      setTransactions((prev) => prev.map((t) => (t.id === transactionId ? data : t)));
      showToast("Transaction updated successfully!");
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Supabase update crashed:", err);
      showToast("Failed to update transaction (Supabase)", "error");
    }
  };

  const deleteTransaction = async (transactionId) => {
    try {
      const { error } = await supabase.from("transactions").delete().eq("id", transactionId);

      if (error) {
        console.error("Supabase delete failed:", error);
        showToast(`Failed to delete transaction (Supabase): ${error.message}`, "error");
        return;
      }

      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      showToast("Transaction deleted!");
    } catch (err) {
      console.error("Supabase delete crashed:", err);
      showToast("Failed to delete transaction (Supabase)", "error");
    }
  };

  // Excel export function
  const exportToExcel = () => {
    // Prepare data for Excel
    const data = filteredTransactions.map(t => ({
      Date: t.date,
      Category: t.category,
      Player: t.player_name || "",
      "Paid By": t.paid_by,
      Amount: t.amount,
      Currency: t.currency || "AED",
      Method: t.payment_method,
      Notes: t.description || ""
    }));

    // Create worksheet from JSON data
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // Date
      { wch: 20 }, // Category
      { wch: 20 }, // Player
      { wch: 20 }, // Paid By
      { wch: 12 }, // Amount
      { wch: 10 }, // Currency
      { wch: 15 }, // Method
      { wch: 30 }  // Notes
    ];

    // Create new workbook
    const workbook = XLSX.utils.book_new();
    
    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Generate and download file
    XLSX.writeFile(workbook, `transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast("Excel exported successfully!");
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesDate = !financeFilters.dateFrom || t.date >= financeFilters.dateFrom;
    const matchesDateTo = !financeFilters.dateTo || t.date <= financeFilters.dateTo;
    const matchesCategory = !financeFilters.category || t.category === financeFilters.category;
    const matchesPlayer = !financeFilters.player || t.player_name?.toLowerCase().includes(financeFilters.player.toLowerCase());
    const matchesSponsor = !financeFilters.sponsor || t.paid_by?.toLowerCase().includes(financeFilters.sponsor.toLowerCase());
    return matchesDate && matchesDateTo && matchesCategory && matchesPlayer && matchesSponsor;
  });

  // Finance calculations
  const totalSalary = transactions.filter(t => t.category === "Player Salary").reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const totalSponsor = transactions.filter(t => ["Device Sponsor", "UC Sponsor"].includes(t.category)).reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const totalExpenses = transactions.filter(t => ["Tournament Expense", "Other"].includes(t.category)).reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const netBalance = totalSponsor - totalSalary - totalExpenses;

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  // Filtered data
  const filteredOrders = orders.filter(order => 
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!admin) return null;

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setModalType("");
  };

  return (
    <>
      <Navbar />
      
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <button 
          className="admin-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
        <h2>⚙️ Admin Panel</h2>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`admin-sidebar-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className="admin-dashboard">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button 
            className="sidebar-close-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕
          </button>
          <div className="sidebar-header">
            <h2>⚙️ Admin Panel</h2>
            <p className="welcome-text">Welcome, {admin.username}</p>
          </div>
          <nav className="sidebar-nav">
            <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
              📊 Overview
            </button>
            <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
              📦 Orders <span className="badge">{pendingOrders}</span>
            </button>
            <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
              👕 Products
            </button>
            <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
              👥 Users
            </button>
            <button className={activeTab === "tournaments" ? "active" : ""} onClick={() => setActiveTab("tournaments")}>
              🏆 Tournaments
            </button>
            <button className={activeTab === "news" ? "active" : ""} onClick={() => setActiveTab("news")}>
              📰 News
            </button>
<button className={activeTab === "discounts" ? "active" : ""} onClick={() => setActiveTab("discounts")}>
              🎟️ Discounts
            </button>
            <button className={activeTab === "finance" ? "active" : ""} onClick={() => setActiveTab("finance")}>
              💵 Finance
            </button>
            <button className={activeTab === "live" ? "active" : ""} onClick={() => setActiveTab("live")}>
              📺 Live
            </button>
            <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
              ⚙️ Settings
            </button>
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          {/* Toast Notification */}
          <AnimatePresence>
            {toast.show && (
              <motion.div 
                className={`admin-toast ${toast.type}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1>Dashboard Overview</h1>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>{totalOrders}</h3>
                    <p>Total Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>₹{totalRevenue.toLocaleString()}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>{pendingOrders}</h3>
                    <p>Pending Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👕</div>
                  <div className="stat-info">
                    <h3>{totalProducts}</h3>
                    <p>Products</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>{totalUsers}</h3>
                    <p>Registered Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-info">
                    <h3>{tournaments.length}</h3>
                    <p>Tournaments</p>
                  </div>
                </div>
              </div>

              <div className="recent-section">
                <h2>Recent Orders</h2>
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer?.name || "N/A"}</td>
                            <td>₹{order.total}</td>
                            <td>
                              <span className={`status-badge ${order.status}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Order Management</h1>
                <div className="search-box">
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {filteredOrders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="orders-list">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="order-card-admin">
                      <div className="order-header">
                        <span className="order-id">{order.id}</span>
                        <span className={`status-badge ${order.status}`}>{order.status}</span>
                      </div>
                      <div className="order-body">
                        <div className="order-info">
                          <p><strong>Customer:</strong> {order.customer?.name}</p>
                          <p><strong>Email:</strong> {order.customer?.email}</p>
                          <p><strong>Phone:</strong> {order.customer?.phone}</p>
                          <p><strong>Address:</strong> {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}</p>
                        </div>
                        <div className="order-items">
                          <p><strong>Items:</strong></p>
                          {order.items?.map((item, idx) => (
                            <p key={idx} className="item-row">
                              {item.name} - {item.size}/{item.color} × {item.quantity} = ₹{item.price * item.quantity}
                            </p>
                          ))}
                        </div>
                        <div className="order-total">
                          <p><strong>Subtotal:</strong> ₹{order.subtotal}</p>
                          <p><strong>Shipping:</strong> ₹{order.shipping}</p>
                          <p><strong>Total:</strong> ₹{order.total}</p>
                          <p><strong>Payment:</strong> {order.paymentMethod?.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="order-actions">
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button className="delete-btn" onClick={() => deleteOrder(order.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Product Management</h1>
                <button className="add-btn" onClick={() => openModal("addProduct")}>
                  + Add Product
                </button>
              </div>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="products-grid-admin">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card-admin">
                    <div className="product-image">
                      <img src={product.images?.[0] || "/JERSEY/WhatsApp Image 2026-03-03 at 5.36.51 PM.jpeg"} alt={product.name} />
                    </div>
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <p className="product-price">₹{product.price}</p>
                      <p className="product-stock">Stock: {product.stock}</p>
                      <p className="product-category">{product.category}</p>
                    </div>
                    <div className="product-actions">
                      <button className="edit-btn" onClick={() => openModal("editProduct", product)}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => deleteProduct(product.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>User Management</h1>
                <button className="add-btn" onClick={() => openModal("addUser")}>
                  + Add User
                </button>
              </div>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.joined}</td>
                        <td>
                          <button className="edit-btn" onClick={() => openModal("editUser", user)}>✏️</button>
                          <button className="delete-btn" onClick={() => deleteUser(user.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Tournaments Tab */}
          {activeTab === "tournaments" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Tournament Management</h1>
                <button className="add-btn" onClick={() => openModal("addTournament")}>
                  + Add Tournament
                </button>
              </div>
              <div className="tournaments-list">
                {tournaments.map(tournament => (
                  <div key={tournament.id} className="tournament-card-admin">
                    <div className="tournament-info">
                      <h3>{tournament.name}</h3>
                      <p><strong>Date:</strong> {tournament.date}</p>
                      <p><strong>Prize Pool:</strong> ₹{tournament.prizePool?.toLocaleString()}</p>
                      <p><strong>Registrations:</strong> {tournament.registrations}</p>
                      <span className={`status-badge ${tournament.status}`}>{tournament.status}</span>
                    </div>
                    <div className="tournament-actions">
                      <button className="edit-btn" onClick={() => openModal("editTournament", tournament)}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => deleteTournament(tournament.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* News Tab */}
          {activeTab === "news" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>News Management</h1>
                <button className="add-btn" onClick={() => openModal("addNews")}>
                  + Add News
                </button>
              </div>
              <div className="news-list">
                {news.map(item => (
                  <div key={item.id} className="news-card-admin">
                    <div className="news-info">
                      <h3>{item.title}</h3>
                      <p><strong>Category:</strong> {item.category}</p>
                      <p><strong>Date:</strong> {item.date}</p>
                      <span className={`status-badge ${item.featured ? "featured" : "normal"}`}>
                        {item.featured ? "Featured" : "Normal"}
                      </span>
                    </div>
                    <div className="news-actions">
                      <button className="edit-btn" onClick={() => openModal("editNews", item)}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => deleteNews(item.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

{/* Discounts Tab */}
          {activeTab === "discounts" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Discount Codes</h1>
                <button className="add-btn" onClick={() => openModal("addDiscount")}>
                  + Add Discount
                </button>
              </div>
              <div className="discounts-list">
                {discounts.map(discount => (
                  <div key={discount.id} className="discount-card-admin">
                    <div className="discount-info">
                      <h3>{discount.code}</h3>
                      <p><strong>Discount:</strong> {discount.discount}{discount.type === "percentage" ? "%" : "₹"}</p>
                      <p><strong>Valid Until:</strong> {discount.validUntil}</p>
                      <p><strong>Usage:</strong> {discount.usage} times</p>
                      <span className={`status-badge ${discount.active ? "active" : "inactive"}`}>
                        {discount.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="discount-actions">
                      <button 
                        className={`toggle-btn ${discount.active ? "deactivate" : "activate"}`}
                        onClick={() => toggleDiscountStatus(discount.id)}
                      >
                        {discount.active ? "Deactivate" : "Activate"}
                      </button>
                      <button className="delete-btn" onClick={() => deleteDiscount(discount.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Finance Tab */}
          {activeTab === "finance" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Finance Manager</h1>
                <div className="header-actions">
                  <button className="add-btn export-btn" onClick={exportToExcel}>
                    📊 Export Excel
                  </button>
                  <button className="add-btn" onClick={() => openModal("addTransaction")}>
                    + Add Transaction
                  </button>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="finance-summary">
                <div className="summary-card salary">
                  <div className="summary-icon">💵</div>
                  <div className="summary-info">
                    <h3>₹{totalSalary.toLocaleString()}</h3>
                    <p>Total Salary Paid</p>
                  </div>
                </div>
                <div className="summary-card sponsor">
                  <div className="summary-icon">🎁</div>
                  <div className="summary-info">
                    <h3>₹{totalSponsor.toLocaleString()}</h3>
                    <p>Total Sponsor Money</p>
                  </div>
                </div>
                <div className="summary-card expenses">
                  <div className="summary-icon">📤</div>
                  <div className="summary-info">
                    <h3>₹{totalExpenses.toLocaleString()}</h3>
                    <p>Total Expenses</p>
                  </div>
                </div>
                <div className={`summary-card ${netBalance >= 0 ? "positive" : "negative"}`}>
                  <div className="summary-icon">{netBalance >= 0 ? "📈" : "📉"}</div>
                  <div className="summary-info">
                    <h3>₹{netBalance.toLocaleString()}</h3>
                    <p>Net Balance</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="finance-filters">
                <div className="filter-group">
                  <label>From Date</label>
                  <input 
                    type="date" 
                    value={financeFilters.dateFrom}
                    onChange={(e) => setFinanceFilters({...financeFilters, dateFrom: e.target.value})}
                  />
                </div>
                <div className="filter-group">
                  <label>To Date</label>
                  <input 
                    type="date" 
                    value={financeFilters.dateTo}
                    onChange={(e) => setFinanceFilters({...financeFilters, dateTo: e.target.value})}
                  />
                </div>
                <div className="filter-group">
                  <label>Category</label>
                  <select 
                    value={financeFilters.category}
                    onChange={(e) => setFinanceFilters({...financeFilters, category: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    {TRANSACTION_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Player</label>
                  <input 
                    type="text" 
                    placeholder="Search player..."
                    value={financeFilters.player}
                    onChange={(e) => setFinanceFilters({...financeFilters, player: e.target.value})}
                  />
                </div>
                <div className="filter-group">
                  <label>Sponsor</label>
                  <input 
                    type="text" 
                    placeholder="Search sponsor..."
                    value={financeFilters.sponsor}
                    onChange={(e) => setFinanceFilters({...financeFilters, sponsor: e.target.value})}
                  />
                </div>
                <button 
                  className="clear-filters-btn"
                  onClick={() => setFinanceFilters({ dateFrom: "", dateTo: "", category: "", player: "", sponsor: "" })}
                >
                  Clear Filters
                </button>
              </div>

              {/* Transactions Table */}
              {filteredTransactions.length === 0 ? (
                <div className="empty-state">
                  <p>No transactions found</p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Player</th>
                        <th>Paid By</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Notes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td>{transaction.date}</td>
                          <td>{transaction.category}</td>
                          <td>{transaction.player_name || "-"}</td>
                          <td>{transaction.paid_by}</td>
                          <td className="amount-cell">₹{parseFloat(transaction.amount).toLocaleString()}</td>
                          <td>{transaction.payment_method}</td>
                          <td>{transaction.description || "-"}</td>
                          <td>
                            <button className="edit-btn" onClick={() => openModal("editTransaction", transaction)}>✏️</button>
                            <button className="delete-btn" onClick={() => deleteTransaction(transaction.id)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Live Tab */}
          {activeTab === "live" && (
            <motion.div
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1>Live Stream Settings</h1>
              <p style={{ color: "var(--text-muted)", marginTop: -10, marginBottom: 20 }}>
                Paste your YouTube Live URL here. When you set Live = ON, it will play on the Live page.
              </p>

              <div className="settings-section" style={{ maxWidth: 720 }}>
                <div className="form-group">
                  <label>Live Status</label>
                  <select
                    value={liveForm.is_live ? "true" : "false"}
                    onChange={(e) => setLiveForm((p) => ({ ...p, is_live: e.target.value === "true" }))}
                  >
                    <option value="false">OFFLINE</option>
                    <option value="true">LIVE</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={liveForm.title}
                    onChange={(e) => setLiveForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="DRS Live"
                  />
                </div>

                <div className="form-group">
                  <label>YouTube URL</label>
                  <input
                    type="text"
                    value={liveForm.stream_url}
                    onChange={(e) => setLiveForm((p) => ({ ...p, stream_url: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <button
                  className="save-btn"
                  disabled={savingLive}
                  onClick={async () => {
                    try {
                      setSavingLive(true);
                      const payload = {
                        slug: "main",
                        platform: "youtube",
                        is_live: Boolean(liveForm.is_live),
                        title: String(liveForm.title || "DRS Live"),
                        stream_url: String(liveForm.stream_url || "").trim(),
                        updated_at: new Date().toISOString(),
                      };

                      const { data, error } = await supabase
                        .from("live_settings")
                        .upsert(payload, { onConflict: "slug" })
                        .select()
                        .single();

                      if (error) {
                        console.error("Supabase live_settings upsert failed:", error);
                        showToast(`Failed to save live settings: ${error.message}`, "error");
                        return;
                      }

                      setLiveSettings(data);
                      showToast("Live settings saved!");
                    } catch (err) {
                      console.error("Supabase live_settings upsert crashed:", err);
                      showToast("Failed to save live settings", "error");
                    } finally {
                      setSavingLive(false);
                    }
                  }}
                >
                  {savingLive ? "Saving…" : "Save Live Settings"}
                </button>

                {liveSettings?.updated_at ? (
                  <p style={{ marginTop: 12, color: "var(--text-muted)", fontSize: 13 }}>
                    Last updated: {new Date(liveSettings.updated_at).toLocaleString()}
                  </p>
                ) : null}
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1>Settings</h1>
              <div className="settings-section">
                <h2>Site Settings</h2>
                <div className="form-group">
                  <label>Site Name</label>
                  <input type="text" defaultValue="DRS Esports" />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input type="email" defaultValue="admin@drsesports.com" />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select defaultValue="INR">
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Free Shipping Threshold</label>
                  <input type="number" defaultValue="1000" />
                </div>
                <button className="save-btn" onClick={() => showToast("Settings saved!")}>
                  Save Settings
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="admin-modal"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal}>×</button>
              
              {/* Add/Edit Product Modal */}
              {(modalType === "addProduct" || modalType === "editProduct") && (
                <ProductForm 
                  product={editingItem} 
                  onSave={(data) => editingItem ? updateProduct(editingItem.id, data) : addProduct(data)}
                  onCancel={closeModal}
                />
              )}

              {/* Add/Edit User Modal */}
              {(modalType === "addUser" || modalType === "editUser") && (
                <UserForm 
                  user={editingItem}
                  onSave={(data) => {
                    if (editingItem) {
                      setUsers(users.map(u => u.id === editingItem.id ? { ...u, ...data } : u));
                    } else {
                      setUsers([...users, { ...data, id: Date.now() }]);
                    }
                    showToast(editingItem ? "User updated!" : "User added!");
                    closeModal();
                  }}
                  onCancel={closeModal}
                />
              )}

              {/* Add/Edit Tournament Modal */}
              {(modalType === "addTournament" || modalType === "editTournament") && (
                <TournamentForm 
                  tournament={editingItem}
                  onSave={(data) => editingItem ? updateTournament(editingItem.id, data) : addTournament(data)}
                  onCancel={closeModal}
                />
              )}

              {/* Add/Edit News Modal */}
              {(modalType === "addNews" || modalType === "editNews") && (
                <NewsForm 
                  news={editingItem}
                  onSave={(data) => editingItem ? updateNews(editingItem.id, data) : addNews(data)}
                  onCancel={closeModal}
                />
              )}

              {/* Add Discount Modal */}
              {modalType === "addDiscount" && (
                <DiscountForm 
                  onSave={addDiscount}
                  onCancel={closeModal}
                />
              )}

              {/* Add/Edit Transaction Modal */}
              {(modalType === "addTransaction" || modalType === "editTransaction") && (
                <TransactionForm 
                  transaction={editingItem}
                  onSave={(data) => editingItem ? updateTransaction(editingItem.id, data) : addTransaction(data)}
                  onCancel={closeModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

// Product Form Component
function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    category: product?.category || "Jersey",
    featured: product?.featured || false,
    description: product?.description || "",
    colors: product?.colors || ["Black"],
    sizes: product?.sizes || ["S", "M", "L", "XL"]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{product ? "Edit Product" : "Add New Product"}</h2>
      <div className="form-group">
        <label>Product Name</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Price (₹)</label>
          <input 
            type="number" 
            value={formData.price} 
            onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input 
            type="number" 
            value={formData.stock} 
            onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
            required 
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Jersey">Jersey</option>
            <option value="Hoodie">Hoodie</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div className="form-group">
          <label>Featured</label>
          <select 
            value={formData.featured ? "true" : "false"} 
            onChange={(e) => setFormData({...formData, featured: e.target.value === "true"})}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

// User Form Component
function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "player"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{user ? "Edit User" : "Add New User"}</h2>
      <div className="form-group">
        <label>Username</label>
        <input 
          type="text" 
          value={formData.username} 
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required 
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input 
          type="email" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
        />
      </div>
      <div className="form-group">
        <label>Role</label>
        <select 
          value={formData.role} 
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="player">Player</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

// Tournament Form Component
function TournamentForm({ tournament, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: tournament?.name || "",
    date: tournament?.date || "",
    prizePool: tournament?.prizePool || 0,
    status: tournament?.status || "upcoming"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{tournament ? "Edit Tournament" : "Add New Tournament"}</h2>
      <div className="form-group">
        <label>Tournament Name</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Prize Pool (₹)</label>
          <input 
            type="number" 
            value={formData.prizePool} 
            onChange={(e) => setFormData({...formData, prizePool: parseInt(e.target.value)})}
            required 
          />
        </div>
      </div>
      <div className="form-group">
        <label>Status</label>
        <select 
          value={formData.status} 
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

// News Form Component
function NewsForm({ news, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: news?.title || "",
    category: news?.category || "Tournament",
    featured: news?.featured || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{news ? "Edit News" : "Add New News"}</h2>
      <div className="form-group">
        <label>Title</label>
        <input 
          type="text" 
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required 
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Tournament">Tournament</option>
            <option value="Merchandise">Merchandise</option>
            <option value="Team">Team</option>
            <option value="General">General</option>
          </select>
        </div>
        <div className="form-group">
          <label>Featured</label>
          <select 
            value={formData.featured ? "true" : "false"} 
            onChange={(e) => setFormData({...formData, featured: e.target.value === "true"})}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

// Discount Form Component
function DiscountForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    code: "",
    discount: 0,
    type: "percentage",
    validUntil: "",
    active: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>Create Discount Code</h2>
      <div className="form-group">
        <label>Code</label>
        <input 
          type="text" 
          placeholder="e.g., SUMMER20"
          value={formData.code} 
          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
          required 
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Discount Value</label>
          <input 
            type="number" 
            value={formData.discount} 
            onChange={(e) => setFormData({...formData, discount: parseInt(e.target.value)})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select 
            value={formData.type} 
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Valid Until</label>
        <input 
          type="date" 
          value={formData.validUntil} 
          onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
          required 
        />
      </div>
      <div className="form-group">
        <label>Active</label>
        <select 
          value={formData.active ? "true" : "false"} 
          onChange={(e) => setFormData({...formData, active: e.target.value === "true"})}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Create</button>
      </div>
    </form>
  );
}

// Transaction Form Component
function TransactionForm({ transaction, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    category: transaction?.category || "Player Salary",
    player_name: transaction?.player_name || "",
    paid_by: transaction?.paid_by || "",
    amount: transaction?.amount || 0,
    currency: transaction?.currency || "AED",
    payment_method: transaction?.payment_method || "Bank Transfer",
    description: transaction?.description || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{transaction ? "Edit Transaction" : "Add New Transaction"}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {TRANSACTION_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Player Name</label>
          <input 
            type="text" 
            placeholder="Enter player name"
            value={formData.player_name} 
            onChange={(e) => setFormData({...formData, player_name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Paid By</label>
          <input 
            type="text" 
            placeholder="Owner / Sponsor Name"
            value={formData.paid_by} 
            onChange={(e) => setFormData({...formData, paid_by: e.target.value})}
            required 
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Amount</label>
          <input 
            type="number" 
            value={formData.amount} 
            onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select 
            value={formData.currency} 
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
          >
            <option value="AED">AED</option>
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Payment Method</label>
        <select 
          value={formData.payment_method} 
          onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
        >
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="UPI">UPI</option>
          <option value="PayPal">PayPal</option>
          <option value="Crypto">Crypto</option>
        </select>
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea 
          placeholder="Additional notes..."
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">{transaction ? "Update" : "Add Transaction"}</button>
      </div>
    </form>
  );
}

export default AdminDashboard;

