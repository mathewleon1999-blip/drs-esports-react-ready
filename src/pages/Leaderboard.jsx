import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Demo leaderboard data
const playerRankings = [
  { rank: 1, username: "ShadowStrike", team: "Team DRS", points: 2500, wins: 45, kills: 1250, games: 52 },
  { rank: 2, username: "PhantomX", team: "Team DRS", points: 2350, wins: 42, kills: 1180, games: 50 },
  { rank: 3, username: "ViperPro", team: "Team Venom", points: 2200, wins: 38, kills: 1100, games: 48 },
  { rank: 4, username: "StormRider", team: "Team Thunder", points: 2100, wins: 36, kills: 1050, games: 46 },
  { rank: 5, username: "NightHawk", team: "Team Shadow", points: 2000, wins: 34, kills: 980, games: 44 },
  { rank: 6, username: "DragonSlayer", team: "Team Dragon", points: 1900, wins: 32, kills: 950, games: 42 },
  { rank: 7, username: "CyberWolf", team: "Team Wolf", points: 1850, wins: 30, kills: 920, games: 40 },
  { rank: 8, username: "BlazeFury", team: "Team Blaze", points: 1800, wins: 28, kills: 880, games: 38 },
  { rank: 9, username: "IceBreaker", team: "Team Frost", points: 1750, wins: 26, kills: 850, games: 36 },
  { rank: 10, username: "ThunderBolt", team: "Team Thunder", points: 1700, wins: 24, kills: 820, games: 34 },
];

const teamRankings = [
  { rank: 1, name: "Team DRS", wins: 45, losses: 5, points: 135, kd: 1.45 },
  { rank: 2, name: "Team Venom", wins: 40, losses: 10, points: 120, kd: 1.35 },
  { rank: 3, name: "Team Thunder", wins: 38, losses: 12, points: 114, kd: 1.28 },
  { rank: 4, name: "Team Shadow", wins: 35, losses: 15, points: 105, kd: 1.22 },
  { rank: 5, name: "Team Dragon", wins: 32, losses: 18, points: 96, kd: 1.18 },
  { rank: 6, name: "Team Wolf", wins: 30, losses: 20, points: 90, kd: 1.12 },
  { rank: 7, name: "Team Blaze", wins: 28, losses: 22, points: 84, kd: 1.08 },
  { rank: 8, name: "Team Frost", wins: 25, losses: 25, points: 75, kd: 1.02 },
];

function Leaderboard() {
  const [activeTab, setActiveTab] = useState("players");
  const [gameFilter, setGameFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="leaderboard-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Leaderboard</h1>
            <p>Top players and teams rankings</p>
          </motion.div>
        </section>

        {/* Leaderboard Content */}
        <section className="leaderboard-content">
          {/* Filters */}
          <div className="leaderboard-filters">
            <div className="filter-group">
              <label>Game</label>
              <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value)}>
                <option value="all">All Games</option>
                <option value="valorant">Valorant</option>
                <option value="cs2">CS2</option>
                <option value="pubg">PUBG</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Region</label>
              <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
                <option value="all">All Regions</option>
                <option value="india">India</option>
                <option value="asia">Asia</option>
                <option value="global">Global</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="leaderboard-tabs">
            <button 
              className={`tab-btn ${activeTab === "players" ? "active" : ""}`}
              onClick={() => setActiveTab("players")}
            >
              👥 Players
            </button>
            <button 
              className={`tab-btn ${activeTab === "teams" ? "active" : ""}`}
              onClick={() => setActiveTab("teams")}
            >
              🏆 Teams
            </button>
          </div>

          {/* Player Rankings */}
          {activeTab === "players" && (
            <motion.div 
              className="rankings-table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Team</th>
                    <th>Points</th>
                    <th>Wins</th>
                    <th>Kills</th>
                    <th>Games</th>
                  </tr>
                </thead>
                <tbody>
                  {playerRankings.map((player) => (
                    <tr key={player.rank} className={player.rank <= 3 ? `top-${player.rank}` : ''}>
                      <td>
                        <div className="rank-cell">
                          {player.rank === 1 && <span className="medal gold">🥇</span>}
                          {player.rank === 2 && <span className="medal silver">🥈</span>}
                          {player.rank === 3 && <span className="medal bronze">🥉</span>}
                          {player.rank > 3 && <span className="rank-number">#{player.rank}</span>}
                        </div>
                      </td>
                      <td>
                        <div className="player-cell">
                          <span className="player-avatar">🎮</span>
                          <span className="player-name">{player.username}</span>
                        </div>
                      </td>
                      <td>{player.team}</td>
                      <td className="points">{player.points.toLocaleString()}</td>
                      <td>{player.wins}</td>
                      <td>{player.kills.toLocaleString()}</td>
                      <td>{player.games}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* Team Rankings */}
          {activeTab === "teams" && (
            <motion.div 
              className="rankings-table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>Points</th>
                    <th>K/D</th>
                  </tr>
                </thead>
                <tbody>
                  {teamRankings.map((team) => (
                    <tr key={team.rank} className={team.rank <= 3 ? `top-${team.rank}` : ''}>
                      <td>
                        <div className="rank-cell">
                          {team.rank === 1 && <span className="medal gold">🥇</span>}
                          {team.rank === 2 && <span className="medal silver">🥈</span>}
                          {team.rank === 3 && <span className="medal bronze">🥉</span>}
                          {team.rank > 3 && <span className="rank-number">#{team.rank}</span>}
                        </div>
                      </td>
                      <td>
                        <div className="team-cell">
                          <span className="team-logo">🏴</span>
                          <span className="team-name">{team.name}</span>
                        </div>
                      </td>
                      <td>{team.wins}</td>
                      <td>{team.losses}</td>
                      <td className="points">{team.points}</td>
                      <td>{team.kd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Leaderboard;
