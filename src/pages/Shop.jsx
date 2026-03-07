import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../components/WishlistContext";

// Jersey and Hoodie product data with front and back images
const jerseys = [
  // Jersey - 2 images (front and back)
  {
    id: 1,
    name: "DRS Official Jersey",
    price: 1299,
    images: [
      "/JERSEY/WhatsApp Image 2026-03-03 at 5.36.51 PM.jpeg",
      "/JERSEY/WhatsApp Image 2026-03-03 at 5.36.52 PM.jpeg"
    ],
    colors: ["Black", "Navy Blue"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Official DRS tournament jersey with premium fabric",
    featured: true,
    category: "Jersey",
  },
  // Hoodie - 2 images (front and back)
  {
    id: 2,
    name: "DRS Official Hoodie",
    price: 2499,
    images: [
      "/HODIE/WhatsApp Image 2026-03-03 at 5.36.53 PM.jpeg",
      "/HODIE/HODIE BACK.jpeg"
    ],
    colors: ["Black", "Grey"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Premium DRS hoodie with front pocket",
    featured: true,
    category: "Hoodie",
  },
];

// Cart state stored in localStorage
const getCart = () => {
  const saved = localStorage.getItem("drs-cart");
  return saved ? JSON.parse(saved) : [];
};

const saveCart = (cart) => {
  localStorage.setItem("drs-cart", JSON.stringify(cart));
};

function Shop() {
  const [cart, setCart] = useState(getCart());
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [selectedJersey, setSelectedJersey] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Enhanced shop features
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sortBy, setSortBy] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredJerseys = useMemo(() => {
    let result = [...jerseys];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(jersey => 
        jersey.name.toLowerCase().includes(query) ||
        jersey.description.toLowerCase().includes(query)
      );
    }
    
    // Price filter
    result = result.filter(jersey => 
      jersey.price >= priceRange[0] && jersey.price <= priceRange[1]
    );
    
    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(jersey => jersey.category === categoryFilter);
    }
    
    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }
    
    return result;
  }, [searchQuery, priceRange, sortBy, categoryFilter]);

  const categories = ["all", ...new Set(jerseys.map(j => j.category))];

  const addToCart = (jersey) => {
    const newItem = {
      ...jersey,
      cartId: Date.now(),
      size: selectedSize,
      color: selectedColor || jersey.colors[0],
    };
    const newCart = [...cart, newItem];
    setCart(newCart);
    saveCart(newCart);
    
    setToastMessage(`${jersey.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToCart = (jersey) => {
    setSelectedJersey(jersey);
    setSelectedColor(jersey.colors[0]);
    setSelectedSize("M");
    setSelectedImageIndex(0);
  };

  const handleConfirmAdd = () => {
    if (selectedJersey) {
      addToCart(selectedJersey);
      setSelectedJersey(null);
    }
  };

  // Toggle wishlist using context
  const handleToggleWishlist = (jersey) => {
    const inWishlist = isInWishlist(jersey.id);
    toggleWishlist(jersey);
    
    if (inWishlist) {
      setToastMessage(`${jersey.name} removed from wishlist`);
    } else {
      setToastMessage(`${jersey.name} added to wishlist!`);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="shop-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>DRS <span className="highlight">Merch</span></h1>
            <p>Wear the pride. Represent the elite.</p>
          </motion.div>
        </section>

        {/* Filter Section */}
        <section className="shop-filters">
          <div className="container">
            <div className="filters-bar">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search jerseys & hoodies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <button 
                className="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                ⚙️ Filters {showFilters ? "▲" : "▼"}
              </button>
              
              <div className="sort-box">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="featured">Featured First</option>
                </select>
              </div>
              
              <div className="filter-info">
                <span>{filteredJerseys.length} Products</span>
              </div>
            </div>
            
            {/* Expanded Filters */}
            {showFilters && (
              <motion.div 
                className="filters-expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="filter-group">
                  <label>Category:</label>
                  <div className="category-filters">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        className={`category-btn ${categoryFilter === cat ? "active" : ""}`}
                        onClick={() => setCategoryFilter(cat)}
                      >
                        {cat === "all" ? "All" : cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="filter-group">
                  <label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
                  <div className="price-range-slider">
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="range-input"
                    />
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="range-input"
                    />
                  </div>
                  <div className="price-inputs">
                    <input
                      type="number"
                      min="0"
                      max="3000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      placeholder="Min"
                      className="price-input"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      min="0"
                      max="3000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 3000])}
                      placeholder="Max"
                      className="price-input"
                    />
                  </div>
                </div>
                
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange([0, 3000]);
                    setSortBy("default");
                    setCategoryFilter("all");
                  }}
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="shop-products">
          <div className="container">
            {filteredJerseys.length === 0 ? (
              <div className="no-products">
                <div className="no-products-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button 
                  className="primary-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange([0, 3000]);
                    setSortBy("default");
                    setCategoryFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
            <div className="products-grid">
              {filteredJerseys.map((jersey, index) => (
                <motion.div
                  key={jersey.id}
                  className={`product-card ${jersey.featured ? 'featured' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  {jersey.featured && <div className="featured-badge">Featured</div>}
                  <button 
                    className={`wishlist-btn ${isInWishlist(jersey.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(jersey);
                    }}
                    title={isInWishlist(jersey.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isInWishlist(jersey.id) ? "❤️" : "🤍"}
                  </button>
                  <div className="product-image">
                    <img src={jersey.images[0]} alt={jersey.name} />
                  </div>
                  <div className="product-info">
                    <h3>{jersey.name}</h3>
                    <p className="product-description">{jersey.description}</p>
                    <div className="product-colors">
                      {jersey.colors.map((color) => (
                        <span 
                          key={color} 
                          className="color-dot"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
                      <span className="color-count">{jersey.colors.length} colors</span>
                    </div>
                    <div className="product-price">
                      <span className="price">₹{jersey.price}</span>
                      <span className="sizes">Sizes: {jersey.sizes.join(", ")}</span>
                    </div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(jersey)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* Size Guide */}
        <section className="size-guide">
          <div className="container">
            <h2>Size <span className="highlight">Guide</span></h2>
            <div className="size-table">
              <table>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (inches)</th>
                    <th>Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>S</td><td>36-38</td><td>26</td></tr>
                  <tr><td>M</td><td>38-40</td><td>27</td></tr>
                  <tr><td>L</td><td>40-42</td><td>28</td></tr>
                  <tr><td>XL</td><td>42-44</td><td>29</td></tr>
                  <tr><td>XXL</td><td>44-46</td><td>30</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Product Modal */}
      {selectedJersey && (
        <div className="modal-overlay" onClick={() => setSelectedJersey(null)}>
          <motion.div 
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button className="modal-close" onClick={() => setSelectedJersey(null)}>×</button>
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedJersey.images[selectedImageIndex]} alt={selectedJersey.name} />
                {/* Image navigation for products with multiple images */}
                {selectedJersey.images.length > 1 && (
                  <div className="image-nav">
                    {selectedJersey.images.map((img, idx) => (
                      <button
                        key={idx}
                        className={`image-nav-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(idx);
                        }}
                      >
                        {idx === 0 ? "Front" : "Back"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-details">
                <h2>{selectedJersey.name}</h2>
                <p className="modal-description">{selectedJersey.description}</p>
                <div className="modal-price">₹{selectedJersey.price}</div>
                
                <div className="option-group">
                  <label>Color:</label>
                  <div className="color-options">
                    {selectedJersey.colors.map((color) => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="option-group">
                  <label>Size:</label>
                  <div className="size-options">
                    {selectedJersey.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="confirm-add-btn" onClick={handleConfirmAdd}>
                  Add to Cart - ₹{selectedJersey.price}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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

export default Shop;
