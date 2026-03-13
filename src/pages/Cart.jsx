import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Safe localStorage helpers
const getLocalStorage = (key, defaultValue) => {
  try {
    if (typeof window === "undefined") return defaultValue;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail
  }
};

const getCart = () => {
  return getLocalStorage("drs-cart", []);
};

const saveCart = (cart) => {
  setLocalStorage("drs-cart", cart);
};

function Cart() {
  const [cart, setCart] = useState(() => getCart());
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  const removeFromCart = (cartId) => {
    const newCart = cart.filter((item) => item.cartId !== cartId);
    setCart(newCart);
    saveCart(newCart);
  };

  const updateQuantity = (cartId, change) => {
    const newCart = cart
      .map((item) => {
        if (item.cartId === cartId) {
          return { ...item, quantity: Math.max(1, (item.quantity || 1) + change) };
        }
        return item;
      })
      .filter(Boolean);
    setCart(newCart);
    saveCart(newCart);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create order object
    const newOrder = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity || 1
      })),
      itemCount: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
      subtotal: subtotal,
      shipping: shipping,
      total: total,
      status: "pending",
      date: new Date().toISOString(),
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode
      },
      paymentMethod: formData.paymentMethod,
      createdAt: new Date().toLocaleString()
    };
    
    // Get existing orders and add new one
    const existingOrders = getOrders();
    const updatedOrders = [newOrder, ...existingOrders];
    saveOrders(updatedOrders);
    
    // Simulate order placement
    setOrderPlaced(true);
    // Clear cart
    setCart([]);
    saveCart([]);
  };

  // Get orders from localStorage
  const getOrders = () => {
    return getLocalStorage("drs-orders", []);
  };

  const saveOrders = (orders) => {
    setLocalStorage("drs-orders", orders);
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <motion.div 
            className="order-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon">✅</div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your order. You will receive a confirmation email shortly.</p>
            <div className="success-actions">
              <Link to="/shop" className="primary-btn">Continue Shopping</Link>
              <Link to="/" className="secondary-btn">Back to Home</Link>
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
        <section className="cart-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Your <span className="highlight">Cart</span></h1>
            <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
          </motion.div>
        </section>

        {cart.length === 0 ? (
          <section className="empty-cart">
            <div className="container">
              <motion.div
                className="empty-cart-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any jerseys yet.</p>
                <Link to="/shop" className="primary-btn">Browse Jerseys</Link>
              </motion.div>
            </div>
          </section>
        ) : (
          <section className="cart-content">
            <div className="container">
              <div className="cart-grid">
                {/* Cart Items */}
                <div className="cart-items">
                  <div className="cart-header">
                    <h2>Cart Items</h2>
                    <button className="clear-cart-btn" onClick={clearCart}>
                      Clear All
                    </button>
                  </div>
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.cartId}
                      className="cart-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="item-image">
                        <div className="jersey-placeholder small">
                          <span>👕</span>
                        </div>
                      </div>
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-variant">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="item-price">₹{item.price}</p>
                      </div>
                      <div className="item-actions">
                        <div className="quantity-controls" style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end", marginBottom: 8 }}>
                          <button className="tab-btn" type="button" onClick={() => updateQuantity(item.cartId, -1)}>
                            -
                          </button>
                          <span style={{ minWidth: 24, textAlign: "center" }}>{item.quantity || 1}</span>
                          <button className="tab-btn" type="button" onClick={() => updateQuantity(item.cartId, 1)}>
                            +
                          </button>
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(item.cartId)}
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="free-shipping-note">
                        Add ₹{1000 - subtotal} more for free shipping!
                      </p>
                    )}
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                    <button 
                      className="checkout-btn"
                      onClick={() => setShowCheckout(true)}
                    >
                      Proceed to Checkout
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
          <motion.div 
            className="checkout-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <button className="modal-close" onClick={() => setShowCheckout(false)}>×</button>
            <div className="checkout-content">
              <h2>Checkout</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Full delivery address"
                    rows={2}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      placeholder="6-digit pincode"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                      />
                      <span>Cash on Delivery</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === "upi"}
                        onChange={handleInputChange}
                      />
                      <span>UPI</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleInputChange}
                      />
                      <span>Debit/Credit Card</span>
                    </label>
                  </div>
                </div>
                <div className="checkout-total">
                  <span>Total to Pay:</span>
                  <span className="total-amount">₹{total}</span>
                </div>
                <button type="submit" className="place-order-btn">
                  Place Order
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Cart;

