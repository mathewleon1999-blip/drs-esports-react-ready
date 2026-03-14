import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Demo order data for tracking
const demoOrders = [
  {
    id: "ORD001",
    customer: "John Doe",
    email: "john@example.com",
    items: [
      { name: "DRS Pro Edition Jersey", size: "M", color: "Black", price: 1299, quantity: 1 },
      { name: "DRS Training Jersey", size: "L", color: "Green", price: 699, quantity: 1 }
    ],
    total: 2298,
    status: "pending",
    date: "2025-01-15",
    estimatedDelivery: "2025-01-20",
    timeline: [
      { status: "Order Placed", date: "2025-01-15 10:30 AM", completed: true },
      { status: "Payment Confirmed", date: "2025-01-15 10:35 AM", completed: true },
      { status: "Processing", date: "", completed: false },
      { status: "Shipped", date: "", completed: false },
      { status: "Out for Delivery", date: "", completed: false },
      { status: "Delivered", date: "", completed: false }
    ]
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    email: "jane@example.com",
    items: [
      { name: "DRS Pro Jersey", size: "S", color: "Red", price: 1599, quantity: 1 }
    ],
    total: 1299,
    status: "shipped",
    date: "2025-01-14",
    estimatedDelivery: "2025-01-18",
    timeline: [
      { status: "Order Placed", date: "2025-01-14 02:15 PM", completed: true },
      { status: "Payment Confirmed", date: "2025-01-14 02:20 PM", completed: true },
      { status: "Processing", date: "2025-01-14 04:00 PM", completed: true },
      { status: "Shipped", date: "2025-01-15 09:00 AM", completed: true },
      { status: "Out for Delivery", date: "", completed: false },
      { status: "Delivered", date: "", completed: false }
    ]
  },
  {
    id: "ORD003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    items: [
      { name: "DRS Championship Jersey 2025", size: "XL", color: "Black", price: 1899, quantity: 1 },
      { name: "DRS Pro Edition Jersey", size: "M", color: "Navy Blue", price: 1299, quantity: 1 },
      { name: "DRS Classic Jersey", size: "L", color: "White", price: 899, quantity: 1 }
    ],
    total: 4197,
    status: "delivered",
    date: "2025-01-10",
    estimatedDelivery: "2025-01-15",
    timeline: [
      { status: "Order Placed", date: "2025-01-10 11:00 AM", completed: true },
      { status: "Payment Confirmed", date: "2025-01-10 11:05 AM", completed: true },
      { status: "Processing", date: "2025-01-10 02:00 PM", completed: true },
      { status: "Shipped", date: "2025-01-11 10:00 AM", completed: true },
      { status: "Out for Delivery", date: "2025-01-15 08:00 AM", completed: true },
      { status: "Delivered", date: "2025-01-15 02:30 PM", completed: true }
    ]
  }
];

function OrderTracking() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    setNotFound(false);
    setOrder(null);

    const found = demoOrders.find(o => o.id === orderId.toUpperCase());
    if (found) {
      setOrder(found);
    } else {
      setNotFound(true);
    }
  };

  const getStatusIcon = (completed) => {
    return completed ? "✅" : "⏳";
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="tracking-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Track <span className="highlight">Order</span></h1>
            <p>Enter your order ID to track your shipment</p>
          </motion.div>
        </section>

        {/* Search Section */}
        <section className="tracking-search">
          <div className="container">
            <motion.div
              className="search-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g., ORD001)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="order-input"
                />
                <button type="submit" className="search-btn">
                  Track Order
                </button>
              </form>
            </motion.div>

            {/* Demo Order IDs */}
            <div className="demo-orders">
              <p>Try these demo order IDs:</p>
              <div className="demo-buttons">
                <button onClick={() => { setOrderId("ORD001"); setSearched(true); setOrder(demoOrders[0]); setNotFound(false); }}>ORD001</button>
                <button onClick={() => { setOrderId("ORD002"); setSearched(true); setOrder(demoOrders[1]); setNotFound(false); }}>ORD002</button>
                <button onClick={() => { setOrderId("ORD003"); setSearched(true); setOrder(demoOrders[2]); setNotFound(false); }}>ORD003</button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {searched && (
          <section className="tracking-results">
            <div className="container">
              {notFound ? (
                <motion.div
                  className="not-found"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="not-found-icon">🔍</div>
                  <h2>Order Not Found</h2>
                  <p>We couldn't find an order with that ID. Please check and try again.</p>
                </motion.div>
              ) : order && (
                <motion.div
                  className="order-tracking-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Order Header */}
                  <div className="tracking-header">
                    <div className="order-info">
                      <h2>Order {order.id}</h2>
                      <p>Placed on {order.date}</p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge status-${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="tracking-items">
                    <h3>Order Items</h3>
                    <div className="items-list">
                      {order.items.map((item, index) => (
                        <div key={index} className="tracking-item">
                          <div className="item-image">
                            <div className="jersey-placeholder small">
                              <span>👕</span>
                            </div>
                          </div>
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>Size: {item.size} | Color: {item.color}</p>
                            <p>Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <div className="item-total">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      <span>Total:</span>
                      <span className="total-amount">₹{order.total}</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="delivery-info">
                    <div className="delivery-icon">🚚</div>
                    <div className="delivery-details">
                      <h3>Estimated Delivery</h3>
                      <p>{order.estimatedDelivery}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="tracking-timeline">
                    <h3>Order Timeline</h3>
                    <div className="timeline">
                      {order.timeline.map((step, index) => (
                        <div 
                          key={index} 
                          className={`timeline-step ${step.completed ? "completed" : ""}`}
                        >
                          <div className="step-icon">{getStatusIcon(step.completed)}</div>
                          <div className="step-content">
                            <h4>{step.status}</h4>
                            {step.date && <p>{step.date}</p>}
                          </div>
                          {index < order.timeline.length - 1 && (
                            <div className={`step-line ${step.completed ? "completed" : ""}`}></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OrderTracking;
