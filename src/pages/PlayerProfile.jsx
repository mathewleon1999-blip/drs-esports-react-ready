import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Player data - in production this would come from an API
const playersData = {
  "shakiir": {
    ign: "Shakiir",
    realName: "Shakiir",
    age: 20,
    country: "🇮🇳",
    role: "IGL",
    mainRole: "In-Game Leader",
    avatar: "⚔️",
    image: "/DRS ESPORTS/SHAKKIR).jpg",
    joinDate: "2023-02-20",
    bio: "Team IGL and shot-caller. Known for strong leadership and rotation calls.",
    stats: {
      kda: "2.8",
      headshot: "45%",
      matches: 142,
      wins: 68,
      top10: 95,
      avgDamage: 520,
      longestKill: 890,
      gamesPlayed: 520
    },
    tournamentHistory: [
      { tournament: "PMNC UAE 2025", position: "#4", prize: "₹2,00,000", date: "2025-01" },
      { tournament: "DRS Championship", position: "#1", prize: "₹1,50,000", date: "2024-12" },
      { tournament: "Winter Cup 2024", position: "#2", prize: "₹75,000", date: "2024-12" },
      { tournament: "ESL India Qualifiers", position: "#3", prize: "₹50,000", date: "2024-11" },
      { tournament: "PUBG Mobile Pro Series", position: "#5", prize: "₹25,000", date: "2024-10" }
    ],
    achievements: [
      { title: "PMNC UAE 2025", subtitle: "4th Place", icon: "🏆" },
      { title: "DRS Championship", subtitle: "Champion", icon: "🥇" },
      { title: "Winter Cup", subtitle: "Runner-up", icon: "🥈" },
      { title: "100+ Tournament Wins", subtitle: "Career Achievement", icon: "⭐" }
    ],
    social: {
      twitter: "@shakiir",
      instagram: "@shakiir_drs",
      discord: "Shakiir#5678",
      youtube: "ShakiirTV"
    },
    equipment: {
      phone: "iPhone 15 Pro Max",
      earphones: "Samsung Galaxy Buds3 Pro",
      controller: "Mobile Controller",
      emulator: "Gameloop"
    }
  },
  "dream": {
    ign: "Dream",
    realName: "Dream",
    age: 22,
    country: "🇮🇳",
    role: "Assaulter",
    mainRole: "Assaulter",
    avatar: "🎯",
    image: "/DRS ESPORTS/Dream.jpg",
    joinDate: "2023-01-15",
    bio: "Aggressive assaulter known for clutch plays and high-impact engagements.",
    stats: {
      kda: "2.4",
      headshot: "32%",
      matches: 156,
      wins: 52,
      top10: 88,
      avgDamage: 480,
      longestKill: 920,
      gamesPlayed: 480
    },
    tournamentHistory: [
      { tournament: "PMNC UAE 2025", position: "#4", prize: "₹2,00,000", date: "2025-01" },
      { tournament: "DRS Championship", position: "#1", prize: "₹1,50,000", date: "2024-12" },
      { tournament: "Summer League 2024", position: "#1", prize: "₹1,00,000", date: "2024-08" }
    ],
    achievements: [
      { title: "PMNC UAE 2025", subtitle: "4th Place", icon: "🏆" },
      { title: "Summer League Champion", subtitle: "Winner", icon: "🥇" },
      { title: "Clutch King", subtitle: "Most Clutch Player", icon: "🦁" }
    ],
    social: {
      twitter: "@dream",
      instagram: "@dream_drs",
      discord: "Dream#1234",
      youtube: "DreamGaming"
    },
    equipment: {
      phone: "iPhone 14 Pro",
      earphones: "Sony WF-1000XM5",
      controller: "Mobile Controller",
      emulator: "Gameloop"
    }
  },
  "noisy": {
    ign: "Noisy",
    realName: "Noisy",
    age: 21,
    country: "🇮🇳",
    role: "Entry Fragger",
    mainRole: "Entry Fragger",
    avatar: "⚡",
    image: "/DRS ESPORTS/noisy n (3).png",
    joinDate: "2023-03-10",
    bio: "Explosive entry fragger focused on opening picks and creating space for the team.",
    stats: {
      kda: "2.1",
      headshot: "30%",
      matches: 138,
      wins: 48,
      top10: 82,
      avgDamage: 430,
      longestKill: 650,
      gamesPlayed: 420
    },
    tournamentHistory: [
      { tournament: "PMNC UAE 2025", position: "#4", prize: "₹2,00,000", date: "2025-01" },
      { tournament: "DRS Championship", position: "#1", prize: "₹1,50,000", date: "2024-12" }
    ],
    achievements: [
      { title: "PMNC UAE 2025", subtitle: "4th Place", icon: "🏆" },
      { title: "DRS Championship", subtitle: "Champion", icon: "🥇" }
    ],
    social: {
      twitter: "@noisy",
      instagram: "@noisy_drs",
      discord: "Noisy#9012",
      youtube: "NoisyGaming"
    },
    equipment: {
      phone: "Asus ROG Phone 8",
      earphones: "OnePlus Buds Pro 2",
      controller: "Mobile Controller",
      emulator: "Gameloop"
    }
  },
  "akoji": {
    ign: "Akoji",
    realName: "Akoji",
    age: 22,
    country: "🇮🇳",
    role: "Support",
    mainRole: "Support",
    avatar: "🛡️",
    image: "/DRS ESPORTS/AKOS (3).png",
    joinDate: "2023-04-05",
    bio: "Reliable support player focused on utility, revives, and setting up team plays.",
    stats: {
      kda: "1.9",
      headshot: "25%",
      matches: 125,
      wins: 42,
      top10: 75,
      avgDamage: 380,
      longestKill: 500,
      gamesPlayed: 380
    },
    tournamentHistory: [
      { tournament: "PMNC UAE 2025", position: "#4", prize: "₹2,00,000", date: "2025-01" },
      { tournament: "Winter Cup 2024", position: "#2", prize: "₹75,000", date: "2024-12" }
    ],
    achievements: [
      { title: "PMNC UAE 2025", subtitle: "4th Place", icon: "🏆" },
      { title: "Winter Cup", subtitle: "Runner-up", icon: "🥈" }
    ],
    social: {
      twitter: "@akoji",
      instagram: "@akoji_drs",
      discord: "Akoji#3456",
      youtube: "AkojiGaming"
    },
    equipment: {
      phone: "iPhone 15 Pro",
      earphones: "AirPods Pro 2",
      controller: "Mobile Controller",
      emulator: "Gameloop"
    }
  },
  "zen": {
    ign: "DRS ZEN",
    realName: "DRS ZEN",
    age: 21,
    country: "🇮🇳",
    role: "Sub",
    mainRole: "Sub",
    avatar: "🧩",
    image: "/DRS ESPORTS/DRS ZEN (1).jpg",
    joinDate: "2023-05-01",
    bio: "Substitute player ready to step in when needed.",
    stats: {
      kda: "1.8",
      headshot: "26%",
      matches: 80,
      wins: 28,
      top10: 45,
      avgDamage: 360,
      longestKill: 520,
      gamesPlayed: 200
    },
    tournamentHistory: [
      { tournament: "PMNC UAE 2025", position: "#4", prize: "₹2,00,000", date: "2025-01" }
    ],
    achievements: [
      { title: "PMNC UAE 2025", subtitle: "4th Place", icon: "🏆" }
    ],
    social: {
      twitter: "@drszen",
      instagram: "@drszen_drs",
      discord: "DRS ZEN#0001",
      youtube: "DRSZen"
    },
    equipment: {
      phone: "iPhone 15 Pro",
      earphones: "AirPods Pro 2",
      controller: "Mobile Controller",
      emulator: "Gameloop"
    }
  }
};

function PlayerProfile() {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Find player by ID (case-insensitive)
    const foundPlayer = Object.values(playersData).find(
      p => p.ign.toLowerCase() === playerId?.toLowerCase()
    );
    setPlayer(foundPlayer || null);
  }, [playerId]);

  if (!player) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="player-not-found">
            <div className="not-found-icon">🔍</div>
            <h1>Player Not Found</h1>
            <p>The player you're looking for doesn't exist or has been removed.</p>
            <Link to="/teams" className="primary-btn">
              View All Players
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Player Hero */}
        <section className="player-profile-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="player-profile-cover">
              <div className="cover-gradient"></div>
            </div>
            <div className="player-profile-header-content">
              <div className="player-avatar-section">
                <div className="player-avatar-xl">
                  {player.image ? (
                    <img src={player.image} alt={player.ign} className="player-profile-img" />
                  ) : (
                    player.avatar
                  )}
                </div>
                <span className="player-country-lg">{player.country}</span>
              </div>
              <div className="player-info-section">
                <h1>{player.ign}</h1>
                <p className="player-real-name">{player.realName}</p>
                <div className="player-tags-section">
                  <span className="player-role-badge-lg">{player.role}</span>
                  <span className="player-team-badge">DRS Esports</span>
                </div>
                <div className="player-social-icons">
                  <a href={`https://twitter.com/${player.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                    🐦
                  </a>
                  <a href={`https://instagram.com/${player.social.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                    📷
                  </a>
                  <a href={`https://youtube.com/${player.social.youtube}`} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                    📺
                  </a>
                </div>
              </div>
              <div className="player-actions-section">
                <button 
                  className={`follow-btn ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Player Content */}
        <section className="player-profile-content">
          {/* Tabs */}
          <div className="player-tabs">
            <button 
              className={`player-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`player-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              Statistics
            </button>
            <button 
              className={`player-tab-btn ${activeTab === 'tournaments' ? 'active' : ''}`}
              onClick={() => setActiveTab('tournaments')}
            >
              Tournament History
            </button>
            <button 
              className={`player-tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
              onClick={() => setActiveTab('equipment')}
            >
              Equipment
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="player-tab-content"
              >
                <div className="overview-grid">
                  <div className="overview-main">
                    <div className="player-bio-card">
                      <h3>About</h3>
                      <p>{player.bio}</p>
                      <div className="player-meta">
                        <span>🎂 {player.age} years old</span>
                        <span>📅 Joined {new Date(player.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="overview-stats">
                    <div className="quick-stat-card">
                      <span className="quick-stat-value">{player.stats.matches}</span>
                      <span className="quick-stat-label">Matches</span>
                    </div>
                    <div className="quick-stat-card">
                      <span className="quick-stat-value">{player.stats.wins}</span>
                      <span className="quick-stat-label">Wins</span>
                    </div>
                    <div className="quick-stat-card">
                      <span className="quick-stat-value">{player.stats.kda}</span>
                      <span className="quick-stat-label">KDA</span>
                    </div>
                  </div>
                </div>

                <div className="achievements-section">
                  <h3>Achievements</h3>
                  <div className="achievements-grid">
                    {player.achievements.map((achievement, idx) => (
                      <div key={idx} className="achievement-card-compact">
                        <span className="achievement-icon">{achievement.icon}</span>
                        <div className="achievement-info">
                          <span className="achievement-title">{achievement.title}</span>
                          <span className="achievement-subtitle">{achievement.subtitle}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div 
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="player-tab-content"
              >
                <div className="stats-grid-detailed">
                  <div className="stat-card-detailed">
                    <span className="stat-icon">🎯</span>
                    <span className="stat-value-lg">{player.stats.kda}</span>
                    <span className="stat-label-lg">KDA Ratio</span>
                  </div>
                  <div className="stat-card-detailed">
                    <span className="stat-icon">💀</span>
                    <span className="stat-value-lg">{player.stats.headshot}</span>
                    <span className="stat-label-lg">Headshot %</span>
                  </div>
                  <div className="stat-card-detailed">
                    <span className="stat-icon">⚔️</span>
                    <span className="stat-value-lg">{player.stats.matches}</span>
                    <span className="stat-label-lg">Matches Played</span>
                  </div>
                  <div className="stat-card-detailed">
                    <span className="stat-icon">🏆</span>
                    <span className="stat-value-lg">{player.stats.wins}</span>
                    <span className="stat-label-lg">Victories</span>
                  </div>
                  <div className="stat-card-detailed">
                    <span className="stat-icon">🎯</span>
                    <span className="stat-value-lg">{player.stats.top10}</span>
                    <span className="stat-label-lg">Top 10 Finishes</span>
                  </div>
                  <div className="stat-card-detailed">
                    <span className="stat-icon">💥</span>
                    <span className="stat-value-lg">{player.stats.avgDamage}</span>
                    <span className="stat-label-lg">Avg Damage</span>
                  </div>
                  <div className="stat-card-detailed">
                    <span className="stat-icon">🔫</span>
                    <span className="stat-value-lg">{player.stats.longestKill}m</span>
                    <span className="stat-label-lg">Longest Kill</span>
                  </div>
                  <div className="stat-card-detailed">
                    <span className="stat-icon">🎮</span>
                    <span className="stat-value-lg">{player.stats.gamesPlayed}</span>
                    <span className="stat-label-lg">Games Played</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tournaments' && (
              <motion.div 
                key="tournaments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="player-tab-content"
              >
                <div className="tournament-history-list">
                  {player.tournamentHistory.map((tournament, idx) => (
                    <div key={idx} className="tournament-history-item">
                      <div className="tournament-position">
                        <span className="position-badge">{tournament.position}</span>
                      </div>
                      <div className="tournament-info">
                        <h4>{tournament.tournament}</h4>
                        <span className="tournament-date">{tournament.date}</span>
                      </div>
                      <div className="tournament-prize">
                        <span className="prize-amount">{tournament.prize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'equipment' && (
              <motion.div 
                key="equipment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="player-tab-content"
              >
                <div className="equipment-grid">
                  <div className="equipment-card">
                    <span className="equipment-icon">📱</span>
                    <span className="equipment-label">Phone</span>
                    <span className="equipment-value">{player.equipment.phone}</span>
                  </div>
                  <div className="equipment-card">
                    <span className="equipment-icon">🎧</span>
                    <span className="equipment-label">Earphones</span>
                    <span className="equipment-value">{player.equipment.earphones}</span>
                  </div>
                  <div className="equipment-card">
                    <span className="equipment-icon">🎮</span>
                    <span className="equipment-label">Controller</span>
                    <span className="equipment-value">{player.equipment.controller}</span>
                  </div>
                  <div className="equipment-card">
                    <span className="equipment-icon">💻</span>
                    <span className="equipment-label">Emulator</span>
                    <span className="equipment-value">{player.equipment.emulator}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <Footer />

      <style>{`
        .player-profile-hero {
          background: linear-gradient(180deg, rgba(0, 212, 255, 0.1) 0%, var(--dark-bg) 100%);
          padding-bottom: 40px;
        }

        .player-profile-cover {
          height: 200px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          position: relative;
          overflow: hidden;
        }

        .cover-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(transparent, var(--dark-bg));
        }

        .player-profile-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: flex-end;
          gap: 30px;
          margin-top: -60px;
          position: relative;
          z-index: 1;
        }

        .player-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .player-avatar-xl {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: var(--card-bg);
          border: 4px solid var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
        }

        .player-profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .player-country-lg {
          font-size: 32px;
          margin-top: 10px;
        }

        .player-info-section {
          flex: 1;
          padding-bottom: 10px;
        }

        .player-info-section h1 {
          font-family: 'Orbitron', sans-serif;
          font-size: 42px;
          margin-bottom: 5px;
        }

        .player-real-name {
          color: var(--text-muted);
          font-size: 18px;
          margin-bottom: 15px;
        }

        .player-tags-section {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .player-role-badge-lg {
          background: var(--gradient-primary);
          color: #000;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
        }

        .player-team-badge {
          background: rgba(255, 0, 110, 0.2);
          color: var(--secondary);
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
          border: 1px solid var(--secondary);
        }

        .player-social-icons {
          display: flex;
          gap: 10px;
        }

        .social-icon-btn {
          width: 40px;
          height: 40px;
          background: var(--card-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.3s ease;
        }

        .social-icon-btn:hover {
          background: var(--primary);
          transform: translateY(-3px);
        }

        .player-actions-section {
          padding-bottom: 10px;
        }

        .follow-btn {
          padding: 12px 30px;
          background: var(--gradient-primary);
          border: none;
          border-radius: 8px;
          color: #000;
          font-family: 'Orbitron', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .follow-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
        }

        .follow-btn.following {
          background: transparent;
          border: 2px solid var(--primary);
          color: var(--primary);
        }

        .player-profile-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .player-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
          padding-bottom: 20px;
        }

        .player-tab-btn {
          padding: 12px 24px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .player-tab-btn.active {
          color: var(--primary);
        }

        .player-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -21px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }

        .player-tab-content {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .player-bio-card {
          background: var(--card-bg);
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .player-bio-card h3 {
          margin-bottom: 15px;
          color: var(--primary);
        }

        .player-bio-card p {
          color: var(--text-light);
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .player-meta {
          display: flex;
          gap: 20px;
          color: var(--text-muted);
          font-size: 14px;
        }

        .overview-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .quick-stat-card {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          text-align: center;
        }

        .quick-stat-value {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: 28px;
          color: var(--primary);
          margin-bottom: 5px;
        }

        .quick-stat-label {
          color: var(--text-muted);
          font-size: 12px;
        }

        .achievements-section h3 {
          margin-bottom: 20px;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .achievement-card-compact {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .achievement-icon {
          font-size: 32px;
        }

        .achievement-info {
          display: flex;
          flex-direction: column;
        }

        .achievement-title {
          font-weight: 600;
          color: var(--text-light);
        }

        .achievement-subtitle {
          color: var(--text-muted);
          font-size: 14px;
        }

        .stats-grid-detailed {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card-detailed {
          background: var(--card-bg);
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card-detailed:hover {
          border-color: var(--primary);
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 32px;
          display: block;
          margin-bottom: 10px;
        }

        .stat-value-lg {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: 36px;
          color: var(--primary);
          margin-bottom: 5px;
        }

        .stat-label-lg {
          color: var(--text-muted);
          font-size: 14px;
        }

        .tournament-history-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .tournament-history-item {
          background: var(--card-bg);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .position-badge {
          background: var(--gradient-primary);
          color: #000;
          padding: 10px 20px;
          border-radius: 8px;
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
        }

        .tournament-info {
          flex: 1;
        }

        .tournament-info h4 {
          margin-bottom: 5px;
        }

        .tournament-date {
          color: var(--text-muted);
          font-size: 14px;
        }

        .prize-amount {
          font-family: 'Orbitron', sans-serif;
          font-size: 20px;
          color: var(--primary);
        }

        .equipment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .equipment-card {
          background: var(--card-bg);
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          text-align: center;
        }

        .equipment-icon {
          font-size: 40px;
          display: block;
          margin-bottom: 15px;
        }

        .equipment-label {
          display: block;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .equipment-value {
          font-family: 'Orbitron', sans-serif;
          color: var(--primary);
        }

        .player-not-found {
          text-align: center;
          padding: 100px 20px;
        }

        .not-found-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .player-profile-header-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-top: -40px;
          }

          .player-avatar-xl {
            width: 120px;
            height: 120px;
            font-size: 48px;
          }

          .player-info-section h1 {
            font-size: 32px;
          }

          .player-tags-section {
            justify-content: center;
          }

          .player-social-icons {
            justify-content: center;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .overview-stats {
            grid-template-columns: repeat(3, 1fr);
          }

          .player-tabs {
            flex-wrap: wrap;
          }

          .player-tab-btn {
            flex: 1;
            min-width: 100px;
          }

          .tournament-history-item {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}

export default PlayerProfile;

