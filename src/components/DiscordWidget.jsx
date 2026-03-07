import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DISCORD_INVITE_LINK = 'https://discord.gg/drs-esports';
const DISCORD_SERVER_ID = '1234567890'; // Replace with actual server ID

function DiscordWidget() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [memberCount, setMemberCount] = useState({
    online: 156,
    total: 2450
  });

  const copyInviteLink = () => {
    navigator.clipboard.writeText(DISCORD_INVITE_LINK);
    alert('Discord invite link copied to clipboard!');
  };

  const openDiscord = () => {
    window.open(DISCORD_INVITE_LINK, '_blank');
  };

  return (
    <>
      <motion.div 
        className="discord-widget"
        whileHover={{ scale: 1.02 }}
        onClick={() => setShowInviteModal(true)}
      >
        <div className="discord-header">
          <div className="discord-logo">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
          <div className="discord-title">
            <h3>Join Our Discord</h3>
            <p>Connect with the DRS Community</p>
          </div>
        </div>
        
        <div className="discord-stats">
          <div className="stat">
            <span className="online-indicator"></span>
            <span className="count">{memberCount.online} Online</span>
          </div>
          <div className="stat">
            <span className="total-icon">👥</span>
            <span className="count">{memberCount.total.toLocaleString()} Members</span>
          </div>
        </div>
        
        <div className="discord-features">
          <div className="feature">💬 Chat with fans</div>
          <div className="feature">🎮 Team scrims</div>
          <div className="feature">🏆 Tournaments</div>
        </div>
        
        <button className="join-button">
          Join Discord Server
        </button>
      </motion.div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div 
              className="modal-content discord-modal"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="discord-icon-large">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <h2>Join DRS Esports Discord</h2>
                <p>Connect with thousands of other fans!</p>
              </div>

              <div className="server-info">
                <div className="info-row">
                  <span className="label">Server Name</span>
                  <span className="value">DRS Esports Community</span>
                </div>
                <div className="info-row">
                  <span className="label">Members</span>
                  <span className="value">{memberCount.total.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Online Now</span>
                  <span className="value online">{memberCount.online}</span>
                </div>
              </div>

              <div className="invite-link-box">
                <input 
                  type="text" 
                  value={DISCORD_INVITE_LINK} 
                  readOnly 
                  className="invite-input"
                />
                <button onClick={copyInviteLink} className="copy-btn">
                  📋 Copy
                </button>
              </div>

              <div className="discord-channels">
                <h3>Popular Channels</h3>
                <div className="channels-list">
                  <div className="channel">
                    <span className="channel-icon">#</span>
                    <span className="channel-name">announcements</span>
                  </div>
                  <div className="channel">
                    <span className="channel-icon">#</span>
                    <span className="channel-name">general-chat</span>
                  </div>
                  <div className="channel">
                    <span className="channel-icon">#</span>
                    <span className="channel-name">tournaments</span>
                  </div>
                  <div className="channel">
                    <span className="channel-icon">#</span>
                    <span className="channel-name">scrims</span>
                  </div>
                  <div className="channel">
                    <span className="channel-icon">#</span>
                    <span className="channel-name">merch-discuss</span>
                  </div>
                </div>
              </div>

              <div className="discord-roles">
                <h3>Roles Available</h3>
                <div className="roles-list">
                  <span className="role" style={{ background: '#7289da' }}>🎮 Player</span>
                  <span className="role" style={{ background: '#f04747' }}>🔥 Fan</span>
                  <span className="role" style={{ background: '#43b581' }}>⭐ VIP</span>
                  <span className="role" style={{ background: '#faa61a' }}>📢 Content Creator</span>
                </div>
              </div>

              <div className="modal-actions">
                <button className="discord-join-btn" onClick={openDiscord}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                  Open Discord
                </button>
                <button className="close-btn" onClick={() => setShowInviteModal(false)}>
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default DiscordWidget;

