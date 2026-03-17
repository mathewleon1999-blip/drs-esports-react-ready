import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from './WishlistContext';

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart, onFullDetails }) {
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');

  // Close on ESC key
  useEffect(() => {
    const handleESC = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleESC);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleESC);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!product || !isOpen) return null;

  const imageCount = product.images?.length || 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="quick-view-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="quick-view-modal"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="quick-view-close" onClick={onClose} aria-label="Close Quick View">
              ×
            </button>

            <div className="quick-view-content">
              <div className="quick-view-image-section">
                <div className="quick-view-image">
                  <img 
                    src={product.images?.[selectedImageIndex] || '/placeholder-product.jpg'} 
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
                
                {imageCount > 1 && (
                  <div className="image-toggle">
                    <button
                      className={`toggle-btn ${selectedImageIndex === 0 ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(0)}
                    >
                      Front
                    </button>
                    <button
                      className={`toggle-btn ${selectedImageIndex === 1 ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(1)}
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>

              <div className="quick-view-details">
                <div className="quick-view-header">
                  <h3>{product.name}</h3>
                  {product.featured && <span className="featured-badge">Featured</span>}
                </div>

                <div className="quick-view-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-score">{product.rating || 4.5}</span>
                  <span className="review-count">({product.reviews || 0} reviews)</span>
                </div>

                <div className="quick-view-price">
                  <span className="price">₹{Number(product.price).toLocaleString()}</span>
                </div>

                <p className="quick-view-description">{product.description}</p>

                <div className="quick-view-options">
                  <div className="option-group">
                    <label>Color:</label>
                    <div className="color-options">
                      {product.colors?.map(color => (
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
                      {product.sizes?.map(size => (
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
                </div>

                <div className="quick-view-actions">
                  <button 
                    className="add-to-cart-quick"
                    onClick={() => onAddToCart(product, { size: selectedSize, color: selectedColor })}
                  >
                    Add to Cart
                  </button>
                  
                  <button 
                    className={`wishlist-quick ${isInWishlist(product.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                  >
                    {isInWishlist(product.id) ? '❤️ In Wishlist' : 'Add to Wishlist'}
                  </button>
                  
                  <button className="full-details-btn" onClick={() => onFullDetails(product)}>
                    Full Details →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
