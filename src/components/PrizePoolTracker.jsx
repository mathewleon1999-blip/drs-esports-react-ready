import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Default sponsors
const DEFAULT_SPONSORS = [
  { id: 1, name: 'TechGear Pro', logo: '💻', tier: 'platinum', contribution: 25000 },
  { id: 2, name: 'EnergyFuel', logo: '⚡', tier: 'platinum', contribution: 20000 },
  { id: 3, name: 'GameStore India', logo: '🎮', tier: 'gold', contribution: 10000 },
  { id: 4, name: 'MobileZone', logo: '📱', tier: 'gold', contribution: 8000 },
  { id: 5, name: 'Esports Cafe', logo: '☕', tier: 'silver', contribution: 3000 },
  { id: 6, name: 'StreamGear', logo: '🎥', tier: 'silver', contribution: 2500 }
];

// Prize distribution percentages
const PRIZE_DISTRIBUTION = [
  { place: 1, percentage: 50, title: 'Champion' },
  { place: 2, percentage: 25, title: 'Runner-up' },
  { place: 3, percentage: 12, title: 'Third Place' },
  { place: 4, percentage: 5, title: 'Fourth Place' },
  { place: 5, percentage: 4, title: 'Fifth Place' },
  { place: 6, percentage: 2, title: 'Sixth Place' },
  { place: 7, percentage: 1, title: 'Seventh Place' },
  { place: 8, percentage: 1, title: 'Eighth Place' }
];

function PrizePoolTracker({ tournament }) {
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [sponsors, setSponsors] = useState(DEFAULT_SPONSORS);

  // Calculate total prize pool
  const totalPrizePool = sponsors.reduce((sum, s) => sum + s.contribution, 0);

  // Calculate prize for each place
  const getPrizeAmount = (percentage) => {
    return Math.floor(totalPrizePool * (percentage / 100));
  };

  // Get tier color
  const getTierColor = (tier) => {
    switch (tier) {
      case 'platinum': return '#E5E4E2';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      default: return '#CD7F32';
    }
  };

  return (
    <>
      <div className="prize-pool-tracker">
        {/* Main Prize Pool Display */}
        <motion.div 
          className="prize-pool-display"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="prize-pool-header">
            <h3>🏆 Prize Pool</h3>
            <span className="tournament-name">{tournament?.name || 'DRS Championship 2025'}</span>
          </div>
          
          <div className="prize-amount">
            <motion.span 
              className="amount"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ₹{totalPrizePool.toLocaleString()}
            </motion.span>
          </div>

          <div className="prize-pool-stats">
            <div className="stat">
              <span className="value">{sponsors.length}</span>
              <span className="label">Sponsors</span>
            </div>
            <div className="stat">
              <span className="value">
                {sponsors.filter(s => s.tier === 'platinum').length}
              </span>
              <span className="label">Platinum</span>
            </div>
            <div className="stat">
              <span className="value">₹{Math.max(...sponsors.map(s => s.contribution)).toLocaleString()}</span>
              <span className="label">Top Contribution</span>
            </div>
          </div>
        </motion.div>

        {/* Prize Distribution */}
        <div className="prize-distribution">
          <h4>💰 Prize Distribution</h4>
          <div className="distribution-list">
            {PRIZE_DISTRIBUTION.map((prize, index) => (
              <motion.div 
                key={prize.place}
                className={`prize-item place-${prize.place}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="place-info">
                  <span className="place-number">
                    {prize.place === 1 ? '🥇' : prize.place === 2 ? '🥈' : prize.place === 3 ? '🥉' : `#${prize.place}`}
                  </span>
                  <span className="place-title">{prize.title}</span>
                </div>
                <div className="prize-info">
                  <span className="percentage">{prize.percentage}%</span>
                  <span className="amount">₹{getPrizeAmount(prize.percentage).toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sponsors Showcase */}
        <div className="sponsors-section">
          <div className="sponsors-header">
            <h4>🎯 Our Sponsors</h4>
            <button onClick={() => setShowSponsorModal(true)}>
              Become a Sponsor
            </button>
          </div>
          
          <div className="sponsors-grid">
            {sponsors.map((sponsor, index) => (
              <motion.div 
                key={sponsor.id}
                className={`sponsor-card ${sponsor.tier}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="sponsor-logo">{sponsor.logo}</span>
                <span className="sponsor-name">{sponsor.name}</span>
                <span className="sponsor-contribution">
                  ₹{sponsor.contribution.toLocaleString()}
                </span>
                <span 
                  className="sponsor-tier"
                  style={{ color: getTierColor(sponsor.tier) }}
                >
                  {sponsor.tier.toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsor Modal */}
      <AnimatePresence>
        {showSponsorModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSponsorModal(false)}
          >
            <motion.div 
              className="modal-content sponsor-modal"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <h2>🎯 Become a Sponsor</h2>
              <p>Support the DRS Esports community and get maximum exposure!</p>
              
              <div className="sponsor-tiers">
                <div className="tier-option platinum">
                  <span className="tier-badge">💎 Platinum</span>
                  <span className="tier-price">₹25,000+</span>
                  <ul>
                    <li>Logo on all tournament materials</li>
                    <li>Premium banner placement</li>
                    <li>Social media shoutouts</li>
                    <li>Website recognition</li>
                  </ul>
                </div>
                <div className="tier-option gold">
                  <span className="tier-badge">🥇 Gold</span>
                  <span className="tier-price">₹10,000+</span>
                  <ul>
                    <li>Logo on website</li>
                    <li>Social media mentions</li>
                    <li>Tournament stream mentions</li>
                  </ul>
                </div>
                <div className="tier-option silver">
                  <span className="tier-badge">🥈 Silver</span>
                  <span className="tier-price">₹5,000+</span>
                  <ul>
                    <li>Website acknowledgment</li>
                    <li>Community mentions</li>
                  </ul>
                </div>
              </div>

              <div className="contact-info">
                <p>Interested? Contact us at:</p>
                <a href="mailto:sponsors@drsesports.com">sponsors@drsesports.com</a>
              </div>

              <button className="close-btn" onClick={() => setShowSponsorModal(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PrizePoolTracker;

