import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Mock player data for demonstration (since we don't have a real API key)
const mockPlayers = {
  "SHAKKIR": {
    id: "account.xxxxxx",
    name: "SHAKKIR",
    platform: "PC",
    region: "AS",
    seasonStats: {
      kills: 2847,
      deaths: 1023,
      wins: 156,
      matches: 892,
      headshotRate: 42,
      avgDamage: 485,
      kdRatio: 2.78,
      winRate: 17.5,
      top10Rate: 68.2
    },
    careerStats: {
      totalKills: 15420,
      totalWins: 487,
      totalMatches: 3240,
      highestKills: 28,
      longestKill: 1240,
      avgSurvivalTime: "12:45"
    },
    recentMatches: [
      { id: 1, mode: "Squad", map: "Erangel", kills: 12, deaths: 1, damage: 1850, rank: 1, date: "2026-03-08" },
      { id: 2, mode: "Squad", map: "Sanhok", kills: 8, deaths: 0, damage: 1240, rank: 1, date: "2026-03-07" },
      { id: 3, mode: "Duo", map: "Erangel", kills: 6, deaths: 2, damage: 890, rank: 3, date: "2026-03-07" },
      { id: 4, mode: "Squad", map: "Vikendi", kills: 14, deaths: 1, damage: 2100, rank: 1, date: "2026-03-06" },
      { id: 5, mode: "Squad", map: "Miramar", kills: 4, deaths: 3, damage: 620, rank: 8, date: "2026-03-06" }
    ],
    weapons: {
      "M416": { kills: 845, headshots: 380, avgDistance: 180 },
      "AKM": { kills: 620, headshots: 245, avgDistance: 150 },
      "Mini14": { kills: 480, headshots: 290, avgDistance: 320 },
      "Kar98k": { kills: 380, headshots: 310, avgDistance: 450 },
      "SKS": { kills: 290, headshots: 175, avgDistance: 380 }
    }
  },
  "DREAM": {
    id: "account.yyyyyy",
    name: "DREAM",
    platform: "PC",
    region: "AS",
    seasonStats: {
      kills: 2156,
      deaths: 892,
      wins: 98,
      matches: 654,
      headshotRate: 38,
      avgDamage: 420,
      kdRatio: 2.42,
      winRate: 15.0,
      top10Rate: 58.5
    },
    careerStats: {
      totalKills: 12340,
      totalWins: 312,
      totalMatches: 2560,
      highestKills: 22,
      longestKill: 980,
      avgSurvivalTime: "10:30"
    },
    recentMatches: [
      { id: 1, mode: "Squad", map: "Erangel", kills: 9, deaths: 0, damage: 1450, rank: 1, date: "2026-03-08" },
      { id: 2, mode: "Squad", map: "Sanhok", kills: 6, deaths: 2, damage: 920, rank: 4, date: "2026-03-07" },
      { id: 3, mode: "Duo", map: "Erangel", kills: 8, deaths: 1, damage: 1100, rank: 2, date: "2026-03-07" },
      { id: 4, mode: "Squad", map: "Vikendi", kills: 11, deaths: 2, damage: 1680, rank: 2, date: "2026-03-06" },
      { id: 5, mode: "Squad", map: "Miramar", kills: 3, deaths: 4, damage: 480, rank: 12, date: "2026-03-06" }
    ],
    weapons: {
      "M416": { kills: 680, headshots: 245, avgDistance: 160 },
      "SCAR-L": { kills: 520, headshots: 180, avgDistance: 145 },
      "M24": { kills: 340, headshots: 275, avgDistance: 420 },
      "QBZ": { kills: 280, headshots: 95, avgDistance: 135 },
      "UMP45": { kills: 220, headshots: 65, avgDistance: 85 }
    }
  },
  "SHYNO": {
    id: "account.zzzzz",
    name: "SHYNO",
    platform: "PC",
    region: "AS",
    seasonStats: {
      kills: 1890,
      deaths: 1056,
      wins: 72,
      matches: 520,
      headshotRate: 35,
      avgDamage: 380,
      kdRatio: 1.79,
      winRate: 13.8,
      top10Rate: 52.0
    },
    careerStats: {
      totalKills: 9870,
      totalWins: 245,
      totalMatches: 1890,
      highestKills: 16,
      longestKill: 720,
      avgSurvivalTime: "11:15"
    },
    recentMatches: [
      { id: 1, mode: "Squad", map: "Erangel", kills: 7, deaths: 1, damage: 980, rank: 2, date: "2026-03-08" },
      { id: 2, mode: "Squad", map: "Sanhok", kills: 5, deaths: 0, damage: 720, rank: 1, date: "2026-03-07" },
      { id: 3, mode: "Duo", map: "Erangel", kills: 4, deaths: 2, damage: 580, rank: 5, date: "2026-03-07" },
      { id: 4, mode: "Squad", map: "Vikendi", kills: 8, deaths: 3, damage: 1120, rank: 3, date: "2026-03-06" },
      { id: 5, mode: "Squad", map: "Miramar", kills: 2, deaths: 2, damage: 340, rank: 15, date: "2026-03-06" }
    ],
    weapons: {
      "M416": { kills: 580, headshots: 175, avgDistance: 155 },
      "Beryl": { kills: 420, headshots: 120, avgDistance: 140 },
      "M762": { kills: 380, headshots: 145, avgDistance: 130 },
      "S12K": { kills: 245, headshots: 45, avgDistance: 45 },
      "Crossbow": { kills: 85, headshots: 75, avgDistance: 120 }
    }
  },
  "XANDER": {
    id: "account.aaaaa",
    name: "XANDER",
    platform: "PC",
    region: "AS",
    seasonStats: {
      kills: 1650,
      deaths: 980,
      wins: 58,
      matches: 445,
      headshotRate: 48,
      avgDamage: 520,
      kdRatio: 1.68,
      winRate: 13.0,
      top10Rate: 48.5
    },
    careerStats: {
      totalKills: 8920,
      totalWins: 198,
      totalMatches: 1560,
      highestKills: 19,
      longestKill: 1450,
      avgSurvivalTime: "9:45"
    },
    recentMatches: [
      { id: 1, mode: "Squad", map: "Erangel", kills: 8, deaths: 2, damage: 1350, rank: 3, date: "2026-03-08" },
      { id: 2, mode: "Squad", map: "Sanhok", kills: 5, deaths: 1, damage: 780, rank: 2, date: "2026-03-07" },
      { id: 3, mode: "Duo", map: "Erangel", kills: 6, deaths: 3, damage: 920, rank: 4, date: "2026-03-07" },
      { id: 4, mode: "Squad", map: "Vikendi", kills: 10, deaths: 2, damage: 1480, rank: 2, date: "2026-03-06" },
      { id: 5, mode: "Squad", map: "Miramar", kills: 4, deaths: 4, damage: 620, rank: 10, date: "2026-03-06" }
    ],
    weapons: {
      "Kar98k": { kills: 520, headshots: 420, avgDistance: 520 },
      "M24": { kills: 380, headshots: 310, avgDistance: 480 },
      "AWM": { kills: 245, headshots: 220, avgDistance: 680 },
      "Mini14": { kills: 280, headshots: 165, avgDistance: 350 },
      "Win94": { kills: 125, headshots: 95, avgDistance: 280 }
    }
  }
};

function PUBGTracker() {
  const [searchName, setSearchName] = useState("");
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    setLoading(true);
    setError("");
    setPlayer(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const playerData = mockPlayers[searchName.toUpperCase()];
    
    if (playerData) {
      setPlayer(playerData);
    } else {
      setError("Player not found. Try: SHAKKIR, DREAM, SHYNO, or XANDER");
    }
    
    setLoading(false);
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "#ffd700";
    if (rank === 2) return "#c0c0c0";
    if (rank === 3) return "#cd7f32";
    return "var(--text-muted)";
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="pubg-tracker-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>PUBG <span className="highlight">Stats</span></h1>
            <p>Track player statistics and match history</p>
          </motion.div>
        </section>

        {/* Search Section */}
        <section className="pubg-search-section">
          <div className="container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter player name..."
                  className="pubg-search-input"
                />
                <button type="submit" className="search-btn" disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
            <p className="search-hint">Try: SHAKKIR, DREAM, SHYNO, or XANDER</p>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <section className="pubg-error">
            <div className="container">
              <div className="error-message-box">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
          </section>
        )}

        {/* Player Stats */}
        {player && (
          <section className="pubg-stats-section">
            <div className="container">
              {/* Player Header */}
              <motion.div 
                className="player-stats-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="player-avatar-section">
                  <div className="player-avatar-large">🎮</div>
                  <div className="player-info">
                    <h2>{player.name}</h2>
                    <div className="player-badges">
                      <span className="platform-badge">{player.platform}</span>
                      <span className="region-badge">{player.region}</span>
                    </div>
                </div>
                <div className="player-kd-highlight">
                  <span className="kd-value">{player.seasonStats.kdRatio}</span>
                  <span className="kd-label">K/D Ratio</span>
                </div>
              </motion.div>

              {/* Stats Tabs */}
              <div className="stats-tabs">
                <button 
                  className={`stats-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`stats-tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
                  onClick={() => setActiveTab('matches')}
                >
                  Match History
                </button>
                <button 
                  className={`stats-tab-btn ${activeTab === 'weapons' ? 'active' : ''}`}
                  onClick={() => setActiveTab('weapons')}
                >
                  Weapons
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <motion.div 
                  className="stats-tab-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Season Stats Grid */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <span className="stat-icon">💀</span>
                      <span className="stat-value">{player.seasonStats.kills.toLocaleString()}</span>
                      <span className="stat-label">Kills</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">🏆</span>
                      <span className="stat-value">{player.seasonStats.wins}</span>
                      <span className="stat-label">Wins</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">🎯</span>
                      <span className="stat-value">{player.seasonStats.kdRatio}</span>
                      <span className="stat-label">K/D</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">💥</span>
                      <span className="stat-value">{player.seasonStats.avgDamage}</span>
                      <span className="stat-label">Avg Damage</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">🎯</span>
                      <span className="stat-value">{player.seasonStats.headshotRate}%</span>
                      <span className="stat-label">Headshot %</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">⚔️</span>
                      <span className="stat-value">{player.seasonStats.matches}</span>
                      <span className="stat-label">Matches</span>
                    </div>

                  {/* Win Rate & Top 10 */}
                  <div className="rate-stats">
                    <div className="rate-card">
                      <div className="rate-header">
                        <span>Win Rate</span>
                        <span className="rate-value">{player.seasonStats.winRate}%</span>
                      </div>
                      <div className="rate-bar">
                        <div className="rate-fill" style={{ width: `${player.seasonStats.winRate}%` }}></div>
                    </div>
                    <div className="rate-card">
                      <div className="rate-header">
                        <span>Top 10 Rate</span>
                        <span className="rate-value">{player.seasonStats.top10Rate}%</span>
                      </div>
                      <div className="rate-bar">
                        <div className="rate-fill" style={{ width: `${player.seasonStats.top10Rate}%` }}></div>
                    </div>

                  {/* Career Stats */}
                  <div className="career-stats">
                    <h3>Career Statistics</h3>
                    <div className="career-grid">
                      <div className="career-item">
                        <span className="career-label">Total Kills</span>
                        <span className="career-value">{player.careerStats.totalKills.toLocaleString()}</span>
                      </div>
                      <div className="career-item">
                        <span className="career-label">Total Wins</span>
                        <span className="career-value">{player.careerStats.totalWins}</span>
                      </div>
                      <div className="career-item">
                        <span className="career-label">Total Matches</span>
                        <span className="career-value">{player.careerStats.totalMatches.toLocaleString()}</span>
                      </div>
                      <div className="career-item">
                        <span className="career-label">Highest Kills</span>
                        <span className="career-value">{player.careerStats.highestKills}</span>
                      </div>
                      <div className="career-item">
                        <span className="career-label">Longest Kill</span>
                        <span className="career-value">{player.careerStats.longestKill}m</span>
                      </div>
                      <div className="career-item">
                        <span className="career-label">Avg Survival</span>
                        <span className="career-value">{player.careerStats.avgSurvivalTime}</span>
                      </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'matches' && (
                <motion.div 
                  className="stats-tab-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="matches-list">
                    {player.recentMatches.map(match => (
                      <div key={match.id} className="match-card">
                        <div className="match-rank" style={{ color: getRankColor(match.rank) }}>
                          #{match.rank}
                        </div>
                        <div className="match-info">
                          <div className="match-header">
                            <span className="match-mode">{match.mode}</span>
                            <span className="match-map">{match.map}</span>
                            <span className="match-date">{match.date}</span>
                          </div>
                          <div className="match-stats">
                            <div className="match-stat">
                              <span className="stat-num">{match.kills}</span>
                              <span className="stat-lbl">Kills</span>
                            </div>
                            <div className="match-stat">
                              <span className="stat-num">{match.deaths}</span>
                              <span className="stat-lbl">Deaths</span>
                            </div>
                            <div className="match-stat">
                              <span className="stat-num">{match.damage}</span>
                              <span className="stat-lbl">Damage</span>
                            </div>
                        </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'weapons' && (
                <motion.div 
                  className="stats-tab-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="weapons-list">
                    {Object.entries(player.weapons).map(([weapon, stats], index) => (
                      <div key={weapon} className="weapon-card">
                        <div className="weapon-rank">#{index + 1}</div>
                        <div className="weapon-info">
                          <h4>{weapon}</h4>
                          <div className="weapon-stats">
                            <span>{stats.kills} kills</span>
                            <span>{stats.headshots} headshots</span>
                            <span>~{stats.avgDistance}m avg</span>
                          </div>
                        <div className="weapon-bar">
                          <div 
                            className="weapon-fill" 
                            style={{ width: `${(stats.kills / 845) * 100}%` }}
                          ></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        )}
      </div>
      <Footer />

      <style>{`
        .pubg-tracker-hero {
          padding: 100px 20px 60px;
          text-align: center;
          background: radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                      var(--gradient-dark);
        }

        .pubg-tracker-hero h1 {
          font-size: clamp(36px, 8vw, 72px);
          margin-bottom: 15px;
        }

        .pubg-tracker-hero p {
          color: var(--text-muted);
          font-size: 20px;
        }

        .pubg-search-section {
          padding: 40px 20px;
          background: var(--dark-bg);
        }

        .search-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .search-input-group {
          display: flex;
          gap: 15px;
        }

        .pubg-search-input {
          flex: 1;
          padding: 16px 24px;
          background: var(--card-bg);
          border: 2px solid rgba(0, 212, 255, 0.2);
          border-radius: 12px;
          color: var(--text-light);
          font-size: 18px;
          font-family: 'Rajdhani', sans-serif;
        }

        .pubg-search-input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .search-btn {
          padding: 16px 32px;
          background: var(--gradient-primary);
          border: none;
          border-radius: 12px;
          color: #000;
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-btn:hover:not(:disabled) {
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
        }

        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .search-hint {
          text-align: center;
          color: var(--text-muted);
          margin-top: 15px;
          font-size: 14px;
        }

        .pubg-error {
          padding: 20px;
          background: var(--dark-bg);
        }

        .error-message-box {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: rgba(255, 68, 68, 0.1);
          border: 1px solid rgba(255, 68, 68, 0.3);
          border-radius: 12px;
          max-width: 600px;
          margin: 0 auto;
        }

        .error-icon {
          font-size: 32px;
        }

        .pubg-stats-section {
          padding: 40px 20px 80px;
          background: var(--dark-bg);
        }

        .player-stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--card-bg);
          padding: 30px;
          border-radius: 16px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          margin-bottom: 30px;
        }

        .player-avatar-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .player-avatar-large {
          font-size: 64px;
          width: 80px;
          height: 80px;
          background: var(--dark-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--primary);
        }

        .player-info h2 {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .player-badges {
          display: flex;
          gap: 10px;
        }

        .platform-badge, .region-badge {
          padding: 4px 12px;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid var(--primary);
          border-radius: 20px;
          font-size: 12px;
          color: var(--primary);
        }

        .player-kd-highlight {
          text-align: center;
        }

        .kd-value {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: 48px;
          color: var(--primary);
          font-weight: 700;
        }

        .kd-label {
          color: var(--text-muted);
          font-size: 14px;
        }

        .stats-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
          padding-bottom: 15px;
        }

        .stats-tab-btn {
          padding: 12px 24px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .stats-tab-btn.active {
          color: var(--primary);
          background: rgba(0, 212, 255, 0.1);
          border-radius: 8px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: var(--card-bg);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          text-align: center;
        }

        .stat-card .stat-icon {
          font-size: 28px;
          display: block;
          margin-bottom: 10px;
        }

        .stat-card .stat-value {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: 28px;
          color: var(--primary);
          font-weight: 700;
        }

        .stat-card .stat-label {
          color: var(--text-muted);
          font-size: 13px;
        }

        .rate-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .rate-card {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .rate-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: var(--text-muted);
        }

        .rate-value {
          font-family: 'Orbitron', sans-serif;
          color: var(--primary);
        }

        .rate-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .rate-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: 4px;
        }

        .career-stats {
          background: var(--card-bg);
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .career-stats h3 {
          margin-bottom: 20px;
          color: var(--primary);
        }

        .career-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
        }

        .career-item {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: var(--dark-bg);
          border-radius: 8px;
        }

        .career-label {
          color: var(--text-muted);
          font-size: 14px;
        }

        .career-value {
          font-family: 'Orbitron', sans-serif;
          color: var(--primary);
        }

        .matches-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .match-card {
          display: flex;
          gap: 20px;
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .match-rank {
          font-family: 'Orbitron', sans-serif;
          font-size: 24px;
          font-weight: 700;
          min-width: 60px;
          display: flex;
          align-items: center;
        }

        .match-info {
          flex: 1;
        }

        .match-header {
          display: flex;
          gap: 15px;
          margin-bottom: 12px;
          color: var(--text-muted);
          font-size: 14px;
        }

        .match-mode {
          color: var(--primary);
          font-weight: 600;
        }

        .match-stats {
          display: flex;
          gap: 30px;
        }

        .match-stat {
          text-align: center;
        }

        .match-stat .stat-num {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: 20px;
          color: var(--text-light);
        }

        .match-stat .stat-lbl {
          color: var(--text-muted);
          font-size: 12px;
        }

        .weapons-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .weapon-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .weapon-rank {
          font-family: 'Orbitron', sans-serif;
          font-size: 20px;
          color: var(--primary);
          min-width: 40px;
        }

        .weapon-info {
          flex: 1;
        }

        .weapon-info h4 {
          margin-bottom: 8px;
        }

        .weapon-stats {
          display: flex;
          gap: 20px;
          color: var(--text-muted);
          font-size: 14px;
        }

        .weapon-bar {
          width: 150px;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .weapon-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .player-stats-header {
            flex-direction: column;
            text-align: center;
          }

          .player-avatar-section {
            flex-direction: column;
          }

          .rate-stats {
            grid-template-columns: 1fr;
          }

          .match-card {
            flex-direction: column;
          }

          .weapon-card {
            flex-wrap: wrap;
          }

          .weapon-bar {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default PUBGTracker;
