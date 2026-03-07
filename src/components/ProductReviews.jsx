import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Get reviews from localStorage
const getReviews = (productId) => {
  const saved = localStorage.getItem(`drs-reviews-${productId}`);
  return saved ? JSON.parse(saved) : [];
};

const saveReviews = (productId, reviews) => {
  localStorage.setItem(`drs-reviews-${productId}`, JSON.stringify(reviews));
};

// Demo reviews for initial products
const demoReviews = {
  1: [
    { id: 1, username: "GamerPro_99", rating: 5, date: "2025-01-15", comment: "Amazing quality jersey! The fabric is super comfortable and the print is vibrant. Highly recommended!", verified: true, helpful: 12 },
    { id: 2, username: "ShadowStrike", rating: 4, date: "2025-01-10", comment: "Great jersey, fits well. Size chart was accurate.", verified: true, helpful: 8 },
    { id: 3, username: "PUBG_Master", rating: 5, date: "2025-01-05", comment: "Best jersey I've bought! The DRS logo stands out beautifully.", verified: true, helpful: 15 }
  ],
  2: [
    { id: 1, username: "EsportsFan", rating: 5, date: "2025-01-18", comment: "The hoodie is incredibly warm and stylish. Perfect for gaming sessions!", verified: true, helpful: 20 },
    { id: 2, username: "NightOwl", rating: 4, date: "2025-01-12", comment: "Good quality, but the sizing runs slightly large.", verified: false, helpful: 5 }
  ]
};

function StarRating({ rating, interactive = false, onChange, size = 20 }) {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="star-rating" style={{ gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          style={{ 
            fontSize: `${size}px`,
            cursor: interactive ? 'pointer' : 'default',
            color: star <= (hover || rating) ? '#ffd700' : '#444',
            transition: 'color 0.2s ease'
          }}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review, onHelpful }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount(prev => prev + 1);
      setHasVoted(true);
      onHelpful(review.id);
    }
  };

  return (
    <motion.div 
      className="review-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">👤</div>
          <div>
            <div className="reviewer-name">
              {review.username}
              {review.verified && <span className="verified-badge">✓ Verified</span>}
            </div>
            <div className="review-date">{review.date}</div>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="review-comment">{review.comment}</p>
      <div className="review-footer">
        <button 
          className={`helpful-btn ${hasVoted ? 'voted' : ''}`}
          onClick={handleHelpful}
          disabled={hasVoted}
        >
          👍 Helpful ({helpfulCount})
        </button>
      </div>
    </motion.div>
  );
}

function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", username: "" });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Load reviews from localStorage or use demo reviews
    let storedReviews = getReviews(productId);
    if (storedReviews.length === 0 && demoReviews[productId]) {
      storedReviews = demoReviews[productId];
      saveReviews(productId, storedReviews);
    }
    setReviews(storedReviews);
  }, [productId]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? Math.round((reviews.filter(r => r.rating === rating).length / reviews.length) * 100)
      : 0
  }));

  const filteredReviews = filter === "all" 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filter));

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim() || !newReview.username.trim()) return;

    const review = {
      id: Date.now(),
      username: newReview.username,
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment,
      verified: false,
      helpful: 0
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    saveReviews(productId, updatedReviews);
    setNewReview({ rating: 5, comment: "", username: "" });
    setShowForm(false);
  };

  const handleHelpful = (reviewId) => {
    const updatedReviews = reviews.map(r => 
      r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
    );
    setReviews(updatedReviews);
    saveReviews(productId, updatedReviews);
  };

  return (
    <div className="product-reviews">
      {/* Reviews Summary */}
      <div className="reviews-summary">
        <div className="average-rating">
          <div className="rating-number">{averageRating}</div>
          <StarRating rating={parseFloat(averageRating)} size={24} />
          <div className="total-reviews">{reviews.length} reviews</div>
        </div>
        
        <div className="rating-distribution">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="distribution-row">
              <span className="star-label">{rating} ★</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="count-label">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="reviews-actions">
        <button 
          className="write-review-btn"
          onClick={() => setShowForm(!showForm)}
        >
          📝 Write a Review
        </button>
        
        <select 
          className="filter-reviews"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Reviews</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="review-form-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form onSubmit={handleSubmitReview} className="review-form">
              <h3>Write Your Review</h3>
              <p className="product-name-review">Reviewing: {productName}</p>
              
              <div className="form-group">
                <label>Your Rating</label>
                <StarRating 
                  rating={newReview.rating} 
                  interactive 
                  onChange={(rating) => setNewReview({ ...newReview, rating })} 
                  size={32}
                />
              </div>
              
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={newReview.username}
                  onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  placeholder="Share your experience with this product..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-review-btn">
                  Submit Review
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="no-reviews">
            <span>📝</span>
            <h3>No reviews yet</h3>
            <p>Be the first to review this product!</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onHelpful={handleHelpful}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductReviews;
export { StarRating };

