import { createContext, useContext, useState, useEffect } from 'react';

const LoyaltyContext = createContext();

// Loyalty tiers configuration
export const LOYALTY_TIERS = {
  BRONZE: { name: 'Bronze', minPoints: 0, color: '#CD7F32', discount: 0, icon: '🥉' },
  SILVER: { name: 'Silver', minPoints: 500, color: '#C0C0C0', discount: 5, icon: '🥈' },
  GOLD: { name: 'Gold', minPoints: 2000, color: '#FFD700', discount: 10, icon: '🥇' },
  PLATINUM: { name: 'Platinum', minPoints: 5000, color: '#E5E4E2', discount: 15, icon: '💎' }
};

// Points earning rules
export const POINTS_RULES = {
  PER_RUPEE: 1, // 1 point per rupee spent
  REVIEW: 50, // Points for writing a review
  REFERRAL: 200, // Points for referring a friend
  BIRTHDAY: 100, // Birthday bonus
  FIRST_PURCHASE: 100, // First purchase bonus
};

// Redemption rates
export const REDEMPTION_RATE = 100; // 100 points = ₹10 discount

const defaultUser = {
  points: 0,
  tier: 'BRONZE',
  totalSpent: 0,
  totalOrders: 0,
  referralCode: '',
  referrals: 0,
  achievements: [],
  joinedDate: new Date().toISOString(),
  birthday: null,
  transactions: []
};

// Safe localStorage helper
const getLocalStorage = (key, defaultValue) => {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail if localStorage is not available
  }
};

export function LoyaltyProvider({ children }) {
  const [userLoyalty, setUserLoyalty] = useState(() => {
    return getLocalStorage('drs-loyalty', defaultUser);
  });

  // Save to localStorage whenever loyalty data changes
  useEffect(() => {
    setLocalStorage('drs-loyalty', userLoyalty);
  }, [userLoyalty]);

  // Calculate user's tier based on points
  const calculateTier = (points) => {
    if (points >= LOYALTY_TIERS.PLATINUM.minPoints) return 'PLATINUM';
    if (points >= LOYALTY_TIERS.GOLD.minPoints) return 'GOLD';
    if (points >= LOYALTY_TIERS.SILVER.minPoints) return 'SILVER';
    return 'BRONZE';
  };

  // Add points to user account
  const addPoints = (amount, reason) => {
    setUserLoyalty(prev => {
      const newPoints = prev.points + amount;
      const newTier = calculateTier(newPoints);
      const tierUpgrade = newTier !== prev.tier;
      
      return {
        ...prev,
        points: newPoints,
        tier: newTier,
        transactions: [
          {
            id: Date.now(),
            type: 'earn',
            amount,
            reason,
            date: new Date().toISOString()
          },
          ...prev.transactions
        ]
      };
    });
  };

  // Redeem points for discount
  const redeemPoints = (points, discountAmount) => {
    return new Promise((resolve, reject) => {
      if (points > userLoyalty.points) {
        reject('Insufficient points');
        return;
      }
      
      const maxRedeemable = Math.floor(userLoyalty.points / REDEMPTION_RATE) * REDEMPTION_RATE;
      if (points > maxRedeemable) {
        reject('Cannot redeem more than available balance');
        return;
      }

      setUserLoyalty(prev => ({
        ...prev,
        points: prev.points - points,
        transactions: [
          {
            id: Date.now(),
            type: 'redeem',
            amount: -points,
            discount: discountAmount,
            reason: 'Points redemption',
            date: new Date().toISOString()
          },
          ...prev.transactions
        ]
      }));
      
      resolve(points);
    });
  };

  // Update total spent (call after order completion)
  const addPurchase = (orderTotal) => {
    const pointsEarned = Math.floor(orderTotal * POINTS_RULES.PER_RUPEE);
    
    setUserLoyalty(prev => {
      const newTotalSpent = prev.totalSpent + orderTotal;
      const newTotalOrders = prev.totalOrders + 1;
      const newPoints = prev.points + pointsEarned;
      const newTier = calculateTier(newPoints);
      
      return {
        ...prev,
        totalSpent: newTotalSpent,
        totalOrders: newTotalOrders,
        points: newPoints,
        tier: newTier,
        transactions: [
          {
            id: Date.now(),
            type: 'earn',
            amount: pointsEarned,
            reason: `Purchase reward (₹${orderTotal})`,
            date: new Date().toISOString()
          },
          ...prev.transactions
        ]
      };
    });
    
    return pointsEarned;
  };

  // Add bonus points
  const addBonus = (amount, reason) => {
    addPoints(amount, reason);
  };

  // Generate referral code
  const generateReferralCode = () => {
    const code = 'DRS' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setUserLoyalty(prev => ({
      ...prev,
      referralCode: code
    }));
    return code;
  };

  // Track referral (when someone uses a referral code)
  const trackReferral = () => {
    setUserLoyalty(prev => ({
      ...prev,
      referrals: prev.referrals + 1,
      points: prev.points + POINTS_RULES.REFERRAL,
      transactions: [
        {
          id: Date.now(),
          type: 'earn',
          amount: POINTS_RULES.REFERRAL,
          reason: 'Referral bonus',
          date: new Date().toISOString()
        },
        ...prev.transactions
      ]
    }));
  };

  // Get available discount based on tier
  const getTierDiscount = () => {
    const tier = LOYALTY_TIERS[userLoyalty.tier];
    return tier.discount;
  };

  // Get points needed for next tier
  const getPointsToNextTier = () => {
    const currentTierIndex = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'].indexOf(userLoyalty.tier);
    if (currentTierIndex >= 3) return 0; // Already at highest tier
    
    const nextTier = ['SILVER', 'GOLD', 'PLATINUM'][currentTierIndex];
    const nextTierMinPoints = LOYALTY_TIERS[nextTier].minPoints;
    return nextTierMinPoints - userLoyalty.points;
  };

  // Get progress to next tier (0-100)
  const getTierProgress = () => {
    const currentTierIndex = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'].indexOf(userLoyalty.tier);
    if (currentTierIndex >= 3) return 100; // Already at highest tier
    
    const currentTier = LOYALTY_TIERS[userLoyalty.tier];
    const nextTier = ['SILVER', 'GOLD', 'PLATINUM'][currentTierIndex];
    const nextTierMinPoints = LOYALTY_TIERS[nextTier].minPoints;
    
    const pointsInCurrentTier = userLoyalty.points - currentTier.minPoints;
    const tierRange = nextTierMinPoints - currentTier.minPoints;
    
    return Math.min(100, Math.floor((pointsInCurrentTier / tierRange) * 100));
  };

  // Check if user has achievement
  const hasAchievement = (achievementId) => {
    return userLoyalty.achievements.includes(achievementId);
  };

  // Add achievement
  const addAchievement = (achievementId) => {
    if (!hasAchievement(achievementId)) {
      setUserLoyalty(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementId]
      }));
    }
  };

  const value = {
    userLoyalty,
    addPoints,
    redeemPoints,
    addPurchase,
    addBonus,
    generateReferralCode,
    trackReferral,
    getTierDiscount,
    getPointsToNextTier,
    getTierProgress,
    hasAchievement,
    addAchievement,
    LOYALTY_TIERS,
    POINTS_RULES,
    REDEMPTION_RATE
  };

  return (
    <LoyaltyContext.Provider value={value}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
}

export default LoyaltyContext;

