import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchPlayerLeaderboard, fetchTeamLeaderboard } from "../lib/leaderboardRepo";

function Leaderboard() {
  const [activeTab, setActiveTab] = useState("players");
  const [gameFilter, setGameFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  const [playerRankings, setPlayerRankings] = useState([]);
  const [teamRankings, setTeamRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [players, teams] = await Promise.all([
          fetchPlayerLeaderboard({ game: gameFilter, region: regionFilter }),
          fetchTeamLeaderboard({ game: gameFilter, region: regionFilter }),
        ]);

        if (cancelled) return;
        setPlayerRankings(players);
        setTeamRankings(teams);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load leaderboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [gameFilter, regionFilter]);

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

          {loading && (
            <div className="loading-state" style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
              Loading leaderboard...
            </div>
          )}

          {error && (
            <div className="error-state" style={{ textAlign: "center", padding: 30, color: "#ff4444" }}>
              {error}
            </div>
          )}

          {/* Player Rankings */}
          {!loading && !error && activeTab === "players" && (
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
          {!loading && !error && activeTab === "teams" && (
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
