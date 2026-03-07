import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoyalty } from '../context/LoyaltyContext';

// Achievement definitions
export const ACHIEVEMENTS = {
  // Purchase achievements
  FIRST_PURCHASE: { id: 'FIRST_PURCHASE', name: 'First Steps', description: 'Complete your first purchase', icon: '🛒', points: 50, category: 'shopping' },
  FIVE_PURCHASES: { id: 'FIVE_PURCHASES', name: 'Regular Shopper', description: 'Complete 5 purchases', icon: '🛍️', points: 100, category: 'shopping' },
  TEN_PURCHASES: { id: 'TEN_PURCHASES', name: 'Dedicated Fan', description: 'Complete 10 purchases', icon: '💝', points: 200, category: 'shopping' },
  
  // Spending achievements
  SPEND_5000: { id: 'SPEND_5000', name: 'Big Spender', description: 'Spend ₹5,000 or more', icon: '💰', points: 75, category: 'spending' },
  SPEND_10000: { id: 'SPEND_10000', name: 'Premium Member', description: 'Spend ₹10,000 or more', icon: '👑', points: 150, category: 'spending' },
  SPEND_25000: { id: 'SPEND_25000', name: 'VIP Customer', description: 'Spend ₹25,000 or more', icon: '💎', points: 300, category: 'spending' },
  
  // Loyalty achievements
  REACH_SILVER: { id: 'REACH_SILVER', name: 'Silver Status', description: 'Reach Silver tier', icon: '🥈', points: 100, category: 'loyalty' },
  REACH_GOLD: { id: 'REACH_GOLD', name: 'Golden Glory', description: 'Reach Gold tier', icon: '🥇', points: 200, category: 'loyalty' },
  REACH_PLATINUM: { id: 'REACH_PLATINUM', name: 'Platinum Elite', description: 'Reach Platinum tier', icon: '💎', points: 500, category: 'loyalty' },
  
  // Social achievements
  FIRST_REFERRAL: { id: 'FIRST_REFERRAL', name: 'Influencer', description: 'Refer your first friend', icon: '📢', points: 100, category: 'social' },
  FIVE_REFERRALS: { id: 'FIVE_REFERRALS', name: 'Networker', description: 'Refer 5 friends', icon: '🌐', points: 250, category: 'social' },
  
  // Community achievements
  JOIN_DISCORD: { id: 'JOIN_DISCORD', name: 'Discord Member', description: 'Join our Discord server', icon: '💬', points: 25, category: 'community' },
  FOLLOW_SOCIAL: { id: 'FOLLOW_SOCIAL', name: 'Social Butterfly', description: 'Follow us on social media', icon: '📱', points: 25, category: 'community' },
  
  // Tournament achievements
  WATCH_LIVE: { id: 'WATCH_LIVE', name: 'Live Fan', description: 'Watch a live stream', icon: '📺', points: 30, category: 'tournament' },
  PREDICT_CORRECT: { id: 'PREDICT_CORRECT', name: 'Pro Tipster', description: 'Get a correct match prediction', icon: '🎯', points: 50, category: 'tournament' },
  PREDICT_STREAK_5: { id: 'PREDICT_STREAK_5', name: 'Predictor Prime', description: 'Get 5 correct predictions in a row', icon: '🔥', points: 150, category: 'tournament' },
  
  // Engagement achievements
  WRITE_REVIEW: { id: 'WRITE_REVIEW', name: 'Reviewer', description: 'Write your first product review', icon: '✍️', points: 40, category: 'engagement' },
  FIVE_REVIEWS: { id: 'FIVE_REVIEWS', name: 'Critic', description: 'Write 5 product reviews', icon: '📝', points: 100, category: 'engagement' },
  
  // Special achievements
  EARLY_BIRD: { id: 'EARLY_BIRD', name: 'Early Bird', description: 'Be among first 100 customers', icon: '🐦', points: 50, category: 'special' },
  LOYALTY_STREAK: { id: 'LOYALTY_STREAK', name: 'Loyalty Champion', description: 'Maintain loyalty for 1 year', icon: '🏆', points: 500, category: 'special' }
};

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🏆' },
  { id: 'shopping', name: 'Shopping', icon: '🛒' },
  { id: 'spending', name: 'Spending', icon: '💰' },
  { id: 'loyalty', name: 'Loyalty', icon: '⭐' },
  { id: 'social', name: 'Social', icon: '👥' },
  { id: 'community', name: 'Community', icon: '💬' },
  { id: 'tournament', name: 'Tournament', icon: '🎮' },
  { id: 'engagement', name: 'Engagement', icon: '📝' },
  { id: 'special', name: 'Special', icon: '🌟' }
];

function AchievementSystem({ standalone = false }) {
  const { userLoyalty, hasAchievement, addAchievement, addPoints } = useLoyalty();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnlockModal, setShowUnlockModal] = useState(null);
  const [recentUnlocks, setRecentUnlocks] = useState([]);

  // Check and unlock achievements based on user progress
  useEffect(() => {
    const unlocked = [];
    
    // Check purchase achievements
    if (userLoyalty.totalOrders >= 1 && !hasAchievement('FIRST_PURCHASE')) {
      addAchievement('FIRST_PURCHASE');
      addPoints(ACHIEVEMENTS.FIRST_PURCHASE.points, 'Achievement: First Steps');
      unlocked.push(ACHIEVEMENTS.FIRST_PURCHASE);
    }
    if (userLoyalty.totalOrders >= 5 && !hasAchievement('FIVE_PURCHASES')) {
      addAchievement('FIVE_PURCHASES');
      addPoints(ACHIEVEMENTS.FIVE_PURCHASES.points, 'Achievement: Regular Shopper');
      unlocked.push(ACHIEVEMENTS.FIVE_PURCHASES);
    }
    if (userLoyalty.totalOrders >= 10 && !hasAchievement('TEN_PURCHASES')) {
      addAchievement('TEN_PURCHASES');
      addPoints(ACHIEVEMENTS.TEN_PURCHASES.points, 'Achievement: Dedicated Fan');
      unlocked.push(ACHIEVEMENTS.TEN_PURCHASES);
    }
    
    // Check spending achievements
    if (userLoyalty.totalSpent >= 5000 && !hasAchievement('SPEND_5000')) {
      addAchievement('SPEND_5000');
      addPoints(ACHIEVEMENTS.SPEND_5000.points, 'Achievement: Big Spender');
      unlocked.push(ACHIEVEMENTS.SPEND_5000);
    }
    if (userLoyalty.totalSpent >= 10000 && !hasAchievement('SPEND_10000')) {
      addAchievement('SPEND_10000');
      addPoints(ACHIEVEMENTS.SPEND_10000.points, 'Achievement: Premium Member');
      unlocked.push(ACHIEVEMENTS.SPEND_10000);
    }
    if (userLoyalty.totalSpent >= 25000 && !hasAchievement('SPEND_25000')) {
      addAchievement('SPEND_25000');
      addPoints(ACHIEVEMENTS.SPEND_25000.points, 'Achievement: VIP Customer');
      unlocked.push(ACHIEVEMENTS.SPEND_25000);
    }
    
    // Check loyalty tier achievements
    if (['SILVER', 'GOLD', 'PLATINUM'].includes(userLoyalty.tier) && !hasAchievement('REACH_SILVER')) {
      addAchievement('REACH_SILVER');
      addPoints(ACHIEVEMENTS.REACH_SILVER.points, 'Achievement: Silver Status');
      unlocked.push(ACHIEVEMENTS.REACH_SILVER);
    }
    if (['GOLD', 'PLATINUM'].includes(userLoyalty.tier) && !hasAchievement('REACH_GOLD')) {
      addAchievement('REACH_GOLD');
      addPoints(ACHIEVEMENTS.REACH_GOLD.points, 'Achievement: Golden Glory');
      unlocked.push(ACHIEVEMENTS.REACH_GOLD);
    }
    if (userLoyalty.tier === 'PLATINUM' && !hasAchievement('REACH_PLATINUM')) {
      addAchievement('REACH_PLATINUM');
      addPoints(ACHIEVEMENTS.REACH_PLATINUM.points, 'Achievement: Platinum Elite');
      unlocked.push(ACHIEVEMENTS.REACH_PLATINUM);
    }
    
    // Check referral achievements
    if (userLoyalty.referrals >= 1 && !hasAchievement('FIRST_REFERRAL')) {
      addAchievement('FIRST_REFERRAL');
      addPoints(ACHIEVEMENTS.FIRST_REFERRAL.points, 'Achievement: Influencer');
      unlocked.push(ACHIEVEMENTS.FIRST_REFERRAL);
    }
    if (userLoyalty.referrals >= 5 && !hasAchievement('FIVE_REFERRALS')) {
      addAchievement('FIVE_REFERRALS');
      addPoints(ACHIEVEMENTS.FIVE_REFERRALS.points, 'Achievement: Networker');
      unlocked.push(ACHIEVEMENTS.FIVE_REFERRALS);
    }
    
    // Show unlock notifications
    if (unlocked.length > 0) {
      setRecentUnlocks(unlocked);
      setShowUnlockModal(unlocked[0]);
    }
  }, []);

  // Filter achievements by category
  const filteredAchievements = Object.values(ACHIEVEMENTS).filter(
    a => selectedCategory === 'all' || a.category === selectedCategory
  );

  // Calculate progress for achievements
  const getProgress = (achievement) => {
    switch (achievement.id) {
      case 'FIRST_PURCHASE':
        return { current: userLoyalty.totalOrders >= 1 ? 1 : 0, target: 1 };
      case 'FIVE_PURCHASES':
        return { current: Math.min(userLoyalty.totalOrders, 5), target: 5 };
      case 'TEN_PURCHASES':
        return { current: Math.min(userLoyalty.totalOrders, 10), target: 10 };
      case 'SPEND_5000':
        return { current: Math.min(userLoyalty.totalSpent, 5000), target: 5000 };
      case 'SPEND_10000':
        return { current: Math.min(userLoyalty.totalSpent, 10000), target: 10000 };
      case 'SPEND_25000':
        return { current: Math.min(userLoyalty.totalSpent, 25000), target: 25000 };
      case 'FIRST_REFERRAL':
        return { current: userLoyalty.referrals >= 1 ? 1 : 0, target: 1 };
      case 'FIVE_REFERRALS':
        return { current: Math.min(userLoyalty.referrals, 5), target: 5 };
      default:
        return { current: 0, target: 1 };
    }
  };

  const unlockedCount = userLoyalty.achievements.length;
  const totalCount = Object.keys(ACHIEVEMENTS).length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <>
      <div className="achievement-system">
        {/* Header Stats */}
        <div className="achievement-header">
          <div className="achievement-progress">
            <div className="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8"
                  strokeDasharray={`${progressPercent * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="progress-text">
                <span className="count">{unlockedCount}/{totalCount}</span>
                <span className="label">Unlocked</span>
              </div>
            </div>
          </div>
          <div className="achievement-stats">
            <h2>🏆 Achievements</h2>
            <p className="subtitle">Complete challenges to earn rewards!</p>
            <div className="total-points">
              <span className="label">Points from Achievements:</span>
              <span className="points">+{Object.values(ACHIEVEMENTS).reduce((sum, a) => 
                hasAchievement(a.id) ? sum + a.points : sum, 0
              )}</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={selectedCategory === cat.id ? 'active' : ''}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="icon">{cat.icon}</span>
              <span className="name">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="achievements-grid">
          {filteredAchievements.map((achievement, index) => {
            const isUnlocked = hasAchievement(achievement.id);
            const progress = getProgress(achievement);
            
            return (
              <motion.div
                key={achievement.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="achievement-icon">
                  {isUnlocked ? (
                    <span className="unlocked-icon">{achievement.icon}</span>
                  ) : (
                    <span className="locked-icon">🔒</span>
                  )}
                </div>
                <div className="achievement-info">
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                  <span className="points-badge">+{achievement.points} pts</span>
                </div>
                {!isUnlocked && (
                  <div className="achievement-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(progress.current / progress.target) * 100}%` }}
                      />
                    </div>
                    <span className="progress-text">{progress.current}/{progress.target}</span>
                  </div>
                )}
                {isUnlocked && (
                  <div className="unlocked-badge">
                    ✓ Unlocked
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Unlock Modal */}
      <AnimatePresence>
        {showUnlockModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUnlockModal(null)}
          >
            <motion.div 
              className="modal-content unlock-modal"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="confetti">🎉</div>
              <h2>Achievement Unlocked!</h2>
              <div className="unlock-icon">{showUnlockModal.icon}</div>
              <h3>{showUnlockModal.name}</h3>
              <p>{showUnlockModal.description}</p>
              <div className="points-earned">
                +{showUnlockModal.points} Points!
              </div>
              {recentUnlocks.length > 1 && (
                <p className="more-unlocked">And {recentUnlocks.length - 1} more!</p>
              )}
              <button onClick={() => setShowUnlockModal(null)}>
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AchievementSystem;

