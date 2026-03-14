import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Product categories
const categories = [
  { id: "all", name: "All Products", icon: "🛍️" },
  { id: "jersey", name: "Jerseys", icon: "👕" },
  { id: "accessories", name: "Accessories", icon: "🎮" },
  { id: "equipment", name: "Equipment", icon: "🖱️" },
  { id: "collectibles", name: "Collectibles", icon: "🏆" }
];

// Demo products with categories
const products = [
  { id: 1, name: "DRS Pro Edition Jersey", price: 1299, category: "jersey", rating: 4.8, reviews: 120, featured: true },
  { id: 2, name: "DRS Classic Jersey", price: 899, category: "jersey", rating: 4.5, reviews: 85, featured: false },
  { id: 3, name: "DRS Pro Jersey", price: 1599, category: "jersey", rating: 4.9, reviews: 200, featured: true },
  { id: 4, name: "DRS Training Jersey", price: 699, category: "jersey", rating: 4.3, reviews: 50, featured: false },
  { id: 5, name: "DRS Championship Jersey 2025", price: 1899, category: "jersey", rating: 5.0, reviews: 300, featured: true },
  { id: 6, name: "DRS Fan Jersey", price: 549, category: "jersey", rating: 4.2, reviews: 75, featured: false },
  { id: 7, name: "DRS Gaming Mousepad", price: 499, category: "accessories", rating: 4.6, reviews: 45, featured: false },
  { id: 8, name: "DRS Gaming Keycap Set", price: 399, category: "accessories", rating: 4.4, reviews: 30, featured: false },
  { id: 9, name: "DRS Phone Case", price: 299, category: "accessories", rating: 4.7, reviews: 60, featured: false },
  { id: 10, name: "DRS Gaming Mouse", price: 2499, category: "equipment", rating: 4.9, reviews: 150, featured: true },
  { id: 11, name: "DRS Gaming Headset", price: 2999, category: "equipment", rating: 4.8, reviews: 180, featured: true },
  { id: 12, name: "DRS Championship Trophy Replica", price: 4999, category: "collectibles", rating: 5.0, reviews: 25, featured: true },
  { id: 13, name: "DRS Team Poster Set", price: 399, category: "collectibles", rating: 4.5, reviews: 40, featured: false },
];

// Discount codes
const discountCodes = [
  { code: "NEWYEAR10", discount: 10, description: "New Year Special", minOrder: 999 },
  { code: "DRSLOYAL", discount: 15, description: "Loyalty Discount", minOrder: 1499 },
  { code: "FIRST50", discount: 50, description: "First Order Flat ₹50 Off", minOrder: 499 },
];

function ShopEnhanced() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState([]);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  const getCart = () => {
    const saved = localStorage.getItem("drs-cart");
    return saved ? JSON.parse(saved) : [];
  };

  const saveCart = (cart) => {
    localStorage.setItem("drs-cart", JSON.stringify(cart));
  };

  const [cart, setCart] = useState(getCart());

  const filteredProducts = products
    .filter(p => activeCategory === "all" || p.category === activeCategory)
    .sort((a, b) => {
      switch(sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        case "reviews": return b.reviews - a.reviews;
        default: return b.featured - a.featured;
      }
    });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    saveCart([...cart, { ...product, quantity: 1 }]);
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const applyDiscount = () => {
    const discount = discountCodes.find(d => d.code === discountCode.toUpperCase());
    if (discount) {
      setAppliedDiscount(discount);
      alert(`Discount applied: ${discount.discount}% off!`);
    } else {
      alert("Invalid discount code!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <section className="shop-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Shop <span className="highlight">DRS Merch</span></h1>
            <p>Official merchandise and gaming equipment</p>
          </motion.div>
        </section>

        <section className="shop-controls">
          <div className="category-bar">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="shop-actions">
            <div className="sort-box">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>

            <button className="discount-btn" onClick={() => setShowDiscountModal(true)}>
              🎟️ Discount Codes
            </button>

            <button className="wishlist-btn">
              ❤️ Wishlist ({wishlist.length})
            </button>
          </div>
        </section>

        <section className="products-section">
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="product-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="product-image" onClick={() => setSelectedProduct(product)}>
                  <div className="product-placeholder">
                    <span>🛍️</span>
                  </div>
                  {product.featured && <span className="featured-badge">Featured</span>}
                  <button 
                    className={`wishlist-toggle ${wishlist.includes(product.id) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                  >
                    {wishlist.includes(product.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    <span className="stars">⭐⭐⭐⭐⭐</span>
                    <span className="rating">({product.rating})</span>
                    <span className="reviews">{product.reviews} reviews</span>
                  </div>
                  <div className="product-price">
                    <span className="price">₹{product.price}</span>
                  </div>
                  <div className="product-actions">
                    <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                    <button className="quick-view-btn" onClick={() => setSelectedProduct(product)}>
                      Quick View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {showDiscountModal && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowDiscountModal(false)}
        >
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowDiscountModal(false)}>×</button>
            <h2>🎟️ Available Discount Codes</h2>
            <div className="discount-codes">
              {discountCodes.map((discount, idx) => (
                <div key={idx} className="discount-item">
                  <div className="discount-code">{discount.code}</div>
                  <div className="discount-details">
                    <span className="discount-percent">{discount.discount}% OFF</span>
                    <span className="discount-desc">{discount.description}</span>
                    <span className="min-order">Min order: ₹{discount.minOrder}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="apply-discount">
              <input
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button onClick={applyDiscount}>Apply</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedProduct && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div 
            className="modal-content product-modal"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="modal-product">
              <div className="modal-product-image">
                <div className="product-placeholder large">
                  <span>🛍️</span>
                </div>
              </div>
              <div className="modal-product-info">
                <span className="product-category">{selectedProduct.category}</span>
                <h2>{selectedProduct.name}</h2>
                <div className="product-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating">({selectedProduct.rating})</span>
                  <span className="reviews">{selectedProduct.reviews} reviews</span>
                </div>
                <p className="product-price large">₹{selectedProduct.price}</p>
                <div className="product-options">
                  <button className="add-to-cart-btn large" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
                    Add to Cart
                  </button>
                  <button className="wishlist-btn-large" onClick={() => toggleWishlist(selectedProduct.id)}>
                    {wishlist.includes(selectedProduct.id) ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </>
  );
}

export default ShopEnhanced;
