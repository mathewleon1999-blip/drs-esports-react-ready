import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoyalty, LOYALTY_TIERS, REDEMPTION_RATE } from '../context/LoyaltyContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function LoyaltyDashboard() {
  const { 
    userLoyalty, 
    redeemPoints, 
    getTierDiscount, 
    getPointsToNextTier, 
    getTierProgress,
    generateReferralCode 
  } = useLoyalty();

  const [activeTab, setActiveTab] = useState('overview');
  const [redeemAmount, setRedeemAmount] = useState(100);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  const currentTier = LOYALTY_TIERS[userLoyalty.tier];
  const tierDiscount = getTierDiscount();
  const pointsToNextTier = getPointsToNextTier();
  const tierProgress = getTierProgress();
  
  // Calculate redemption value
  const redeemValue = Math.floor(redeemAmount / REDEMPTION_RATE) * 10;

  const handleRedeem = async () => {
    try {
      await redeemPoints(redeemAmount, redeemValue);
      setShowRedeemModal(false);
      alert(`Successfully redeemed ${redeemAmount} points for ₹${redeemValue} discount!`);
    } catch (error) {
      alert(error);
    }
  };

  const handleGenerateCode = () => {
    if (!userLoyalty.referralCode) {
      generateReferralCode();
    }
    setShowReferralModal(true);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userLoyalty.referralCode);
    alert('Referral code copied to clipboard!');
  };

  return (
    <>
      <Navbar />
      <div className="loyalty-page">
        <motion.div 
          className="loyalty-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Header with Tier */}
          <div className="loyalty-header" style={{ background: `linear-gradient(135deg, ${currentTier.color}22, ${currentTier.color}44)` }}>
            <div className="tier-badge" style={{ borderColor: currentTier.color }}>
              <span className="tier-icon">{currentTier.icon}</span>
              <span className="tier-name" style={{ color: currentTier.color }}>{currentTier.name}</span>
            </div>
            <div className="points-display">
              <h1>{userLoyalty.points.toLocaleString()}</h1>
              <p>Available Points</p>
            </div>
            <div className="tier-benefits">
              <span className="benefit">{currentTier.discount}% Discount on all orders</span>
              {userLoyalty.tier !== 'PLATINUM' && (
                <span className="next-tier">{pointsToNextTier} points to {LOYALTY_TIERS[userLoyalty.tier === 'BRONZE' ? 'SILVER' : userLoyalty.tier === 'SILVER' ? 'GOLD' : 'PLATINUM'].name}</span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="tier-progress-container">
            <div className="tier-progress">
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${tierProgress}%` }}
                  style={{ background: currentTier.color }}
                />
              </div>
              <div className="tier-markers">
                {Object.entries(LOYALTY_TIERS).map(([key, tier], index) => (
                  <div 
                    key={key} 
                    className={`tier-marker ${userLoyalty.tier === key ? 'active' : ''} ${['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'].indexOf(userLoyalty.tier) > index ? 'completed' : ''}`}
                    style={{ borderColor: tier.color }}
                  >
                    <span>{tier.icon}</span>
                    <span>{tier.minPoints}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <motion.button 
              className="action-btn redeem"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRedeemModal(true)}
              disabled={userLoyalty.points < REDEMPTION_RATE}
            >
              🎁 Redeem Points
            </motion.button>
            <motion.button 
              className="action-btn refer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateCode}
            >
              📢 Refer a Friend
            </motion.button>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">💰</span>
              <div className="stat-content">
                <h3>₹{userLoyalty.totalSpent.toLocaleString()}</h3>
                <p>Total Spent</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📦</span>
              <div className="stat-content">
                <h3>{userLoyalty.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <div className="stat-content">
                <h3>{userLoyalty.referrals}</h3>
                <p>Successful Referrals</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🎯</span>
              <div className="stat-content">
                <h3>{userLoyalty.achievements.length}</h3>
                <p>Achievements Unlocked</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tabs-nav">
            <button 
              className={activeTab === 'overview' ? 'active' : ''} 
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={activeTab === 'transactions' ? 'active' : ''} 
              onClick={() => setActiveTab('transactions')}
            >
              📜 History
            </button>
            <button 
              className={activeTab === 'rewards' ? 'active' : ''} 
              onClick={() => setActiveTab('rewards')}
            >
              🎁 Rewards
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode='wait'>
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                className="tab-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="benefits-section">
                  <h2>🏆 Your {currentTier.name} Benefits</h2>
                  <div className="benefits-list">
                    <div className="benefit-item">
                      <span className="check">✓</span>
                      <span>{currentTier.discount}% discount on all purchases</span>
                    </div>
                    <div className="benefit-item">
                      <span className="check">✓</span>
                      <span>Early access to new product launches</span>
                    </div>
                    <div className="benefit-item">
                      <span className="check">✓</span>
                      <span>Exclusive {currentTier.name} member events</span>
                    </div>
                    {userLoyalty.tier === 'PLATINUM' && (
                      <>
                        <div className="benefit-item">
                          <span className="check">✓</span>
                          <span>Free shipping on all orders</span>
                        </div>
                        <div className="benefit-item">
                          <span className="check">✓</span>
                          <span>Priority customer support</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="earn-points-section">
                  <h2>💎 How to Earn More Points</h2>
                  <div className="earn-methods">
                    <div className="earn-method">
                      <span className="earn-icon">🛒</span>
                      <span className="earn-amount">1 point/₹</span>
                      <span className="earn-desc">Earn points on every purchase</span>
                    </div>
                    <div className="earn-method">
                      <span className="earn-icon">📝</span>
                      <span className="earn-amount">50 points</span>
                      <span className="earn-desc">Write a product review</span>
                    </div>
                    <div className="earn-method">
                      <span className="earn-icon">👥</span>
                      <span className="earn-amount">200 points</span>
                      <span className="earn-desc">Refer a friend (they get 100 too!)</span>
                    </div>
                    <div className="earn-method">
                      <span className="earn-icon">🎂</span>
                      <span className="earn-amount">100 points</span>
                      <span className="earn-desc">Birthday bonus</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div 
                key="transactions"
                className="tab-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2>📜 Points History</h2>
                {userLoyalty.transactions.length === 0 ? (
                  <div className="empty-state">
                    <p>No transactions yet. Start earning points!</p>
                  </div>
                ) : (
                  <div className="transactions-list">
                    {userLoyalty.transactions.map(transaction => (
                      <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                        <div className="transaction-info">
                          <span className="transaction-reason">{transaction.reason}</span>
                          <span className="transaction-date">
                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="transaction-amount">
                          {transaction.type === 'earn' ? '+' : ''}{transaction.amount} points
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'rewards' && (
              <motion.div 
                key="rewards"
                className="tab-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2>🎁 Redeem Your Points</h2>
                <div className="rewards-grid">
                  <div className="reward-card">
                    <span className="reward-icon">🎫</span>
                    <h3>₹10 Discount</h3>
                    <p>100 points</p>
                    <button 
                      disabled={userLoyalty.points < 100}
                      onClick={() => { setRedeemAmount(100); setShowRedeemModal(true); }}
                    >
                      Redeem
                    </button>
                  </div>
                  <div className="reward-card">
                    <span className="reward-icon">🎟️</span>
                    <h3>₹25 Discount</h3>
                    <p>250 points</p>
                    <button 
                      disabled={userLoyalty.points < 250}
                      onClick={() => { setRedeemAmount(250); setShowRedeemModal(true); }}
                    >
                      Redeem
                    </button>
                  </div>
                  <div className="reward-card">
                    <span className="reward-icon">🎪</span>
                    <h3>₹50 Discount</h3>
                    <p>500 points</p>
                    <button 
                      disabled={userLoyalty.points < 500}
                      onClick={() => { setRedeemAmount(500); setShowRedeemModal(true); }}
                    >
                      Redeem
                    </button>
                  </div>
                  <div className="reward-card">
                    <span className="reward-icon">🏆</span>
                    <h3>₹100 Discount</h3>
                    <p>1000 points</p>
                    <button 
                      disabled={userLoyalty.points < 1000}
                      onClick={() => { setRedeemAmount(1000); setShowRedeemModal(true); }}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Redeem Modal */}
        <AnimatePresence>
          {showRedeemModal && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRedeemModal(false)}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={e => e.stopPropagation()}
              >
                <h2>🎁 Redeem Points</h2>
                <p>You have <strong>{userLoyalty.points.toLocaleString()}</strong> points</p>
                <div className="redeem-preview">
                  <span className="points">{redeemAmount}</span>
                  <span className="arrow">→</span>
                  <span className="rupees">₹{redeemValue}</span>
                </div>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min={100} 
                    max={Math.floor(userLoyalty.points / 100) * 100} 
                    step={100}
                    value={redeemAmount}
                    onChange={e => setRedeemAmount(Number(e.target.value))}
                  />
                </div>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setShowRedeemModal(false)}>
                    Cancel
                  </button>
                  <button 
                    className="confirm-btn" 
                    onClick={handleRedeem}
                    disabled={redeemAmount > userLoyalty.points}
                  >
                    Confirm Redemption
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Referral Modal */}
        <AnimatePresence>
          {showReferralModal && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReferralModal(false)}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={e => e.stopPropagation()}
              >
                <h2>📢 Refer a Friend</h2>
                <p>Share your referral code and earn 200 points when they make their first purchase!</p>
                <div className="referral-code-display">
                  <span className="code">{userLoyalty.referralCode}</span>
                  <button onClick={copyReferralCode}>Copy</button>
                </div>
                <div className="referral-share">
                  <p>Share via:</p>
                  <div className="share-buttons">
                    <button className="share-btn whatsapp">WhatsApp</button>
                    <button className="share-btn twitter">Twitter</button>
                    <button className="share-btn facebook">Facebook</button>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setShowReferralModal(false)}>
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}

export default LoyaltyDashboard;

