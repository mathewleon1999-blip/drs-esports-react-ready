import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../components/WishlistContext";

const getCart = () => {
  const saved = localStorage.getItem("drs-cart");
  return saved ? JSON.parse(saved) : [];
};

const saveCart = (cart) => {
  localStorage.setItem("drs-cart", JSON.stringify(cart));
};

function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [cart, setCart] = useState(getCart());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const moveToCart = (product) => {
    const newItem = {
      ...product,
      cartId: Date.now(),
      size: "M",
      color: product.colors?.[0] || "Default"
    };
    const newCart = [...cart, newItem];
    setCart(newCart);
    saveCart(newCart);
    
    // Remove from wishlist
    removeFromWishlist(product.id);
    
    setToastMessage(`${product.name} moved to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="wishlist-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>My <span className="highlight">Wishlist</span></h1>
            <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
          </motion.div>
        </section>

        {wishlist.length === 0 ? (
          <section className="empty-wishlist">
            <div className="container">
              <motion.div
                className="empty-wishlist-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="empty-wishlist-icon">❤️</div>
                <h2>Your wishlist is empty</h2>
                <p>Save items you love by clicking the heart icon on any product.</p>
                <Link to="/shop" className="primary-btn">Browse Products</Link>
              </motion.div>
            </div>
          </section>
        ) : (
          <section className="wishlist-content">
            <div className="container">
              <div className="wishlist-header">
                <button className="clear-wishlist-btn" onClick={clearWishlist}>
                  Clear All
                </button>
              </div>
              
              <div className="wishlist-grid">
                {wishlist.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="wishlist-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="wishlist-item-image">
                      <img src={item.images?.[0]} alt={item.name} />
                    </div>
                    <div className="wishlist-item-info">
                      <h3>{item.name}</h3>
                      <p className="wishlist-item-description">{item.description}</p>
                      <div className="wishlist-item-price">
                        <span className="price">₹{item.price}</span>
                        {item.colors && (
                          <span className="colors">{item.colors.length} colors</span>
                        )}
                      </div>
                      <div className="wishlist-item-actions">
                        <button 
                          className="move-to-cart-btn"
                          onClick={() => moveToCart(item)}
                        >
                          🛒 Move to Cart
                        </button>
                        <button 
                          className="remove-wishlist-btn"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="wishlist-summary">
                <div className="summary-card">
                  <h3>Wishlist Summary</h3>
                  <div className="summary-row">
                    <span>Total Items</span>
                    <span>{wishlist.length}</span>
                  </div>
                  <div className="summary-row">
                    <span>Estimated Value</span>
                    <span>₹{wishlist.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</span>
                  </div>
                  <Link to="/shop" className="continue-shopping-btn">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <motion.div 
          className="toast-notification"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          {toastMessage}
        </motion.div>
      )}

      <Footer />
    </>
  );
}

export default Wishlist;

