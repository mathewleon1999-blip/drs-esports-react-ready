import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Demo teams data with real images
const teams = [
  {
    id: 1,
    name: "Team DRS",
    game: "PUBG Mobile",
    logo: "🎮",
    members: [
      { 
        name: "Shakiir", 
        role: "IGL", 
        avatar: "⚔️",
        image: "/DRS ESPORTS/SHAKKIR).jpg",
        ign: "Shakiir",
        realName: "Shakiir",
        age: 20,
        country: "🇮🇳",
        mainRole: "IGL",
        joinDate: "2023-02-20",
        stats: { kda: "2.8", hs: "45%", matches: 142 },
        social: { twitter: "@shakiir", discord: "Shakiir#5678" }
      },
      { 
        name: "Dream", 
        role: "Assaulter", 
        avatar: "🎯",
        image: "/DRS ESPORTS/Dream.jpg",
        ign: "Dream",
        realName: "Dream",
        age: 22,
        country: "🇮🇳",
        mainRole: "Assaulter",
        joinDate: "2023-01-15",
        stats: { kda: "2.4", hs: "32%", matches: 156 },
        social: { twitter: "@dream", discord: "Dream#1234" }
      },
      { 
        name: "Noisy", 
        role: "Entry Fragger", 
        avatar: "⚡",
        image: "/DRS ESPORTS/noisy n (3).png",
        ign: "Noisy",
        realName: "Noisy",
        age: 21,
        country: "🇮🇳",
        mainRole: "Entry Fragger",
        joinDate: "2023-03-10",
        stats: { kda: "2.1", hs: "30%", matches: 138 },
        social: { twitter: "@noisy", discord: "Noisy#9012" }
      },
      { 
        name: "Akoji", 
        role: "Support", 
        avatar: "🛡️",
        image: "/DRS ESPORTS/AKOS (3).png",
        ign: "Akoji",
        realName: "Akoji",
        age: 22,
        country: "🇮🇳",
        mainRole: "Support",
        joinDate: "2023-04-05",
        stats: { kda: "1.9", hs: "25%", matches: 125 },
        social: { twitter: "@akoji", discord: "Akoji#3456" }
      },
      { 
        name: "DRS ZEN", 
        role: "Sub", 
        avatar: "🧩",
        image: "/DRS ESPORTS/DRS ZEN (1).jpg",
        ign: "DRS ZEN",
        realName: "DRS ZEN",
        age: 21,
        country: "🇮🇳",
        mainRole: "Sub",
        joinDate: "2023-05-01",
        stats: { kda: "1.8", hs: "26%", matches: 80 },
        social: { twitter: "@drszen", discord: "DRS ZEN#0001" }
      }
    ],
    stats: { wins: 45, losses: 20, tournaments: 50 },
    achievements: ["PMNC UAE 2025 - #4 Position"],
    recruiting: false
  }
];

function Teams() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredTeams = activeTab === "all" 
    ? teams 
    : teams.filter(t => t.game.toLowerCase() === activeTab);

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="teams-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Esports <span className="highlight">Teams</span></h1>
            <p>Meet our professional players</p>
          </motion.div>
        </section>

        {/* Teams Content */}
        <section className="teams-content">
          {/* Teams Grid */}
          <div className="teams-grid">
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                className="team-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedTeam(team)}
              >
                <div className="team-header">
                  <div className="team-logo-large">{team.logo}</div>
                  <div className="team-title">
                    <h3>{team.name}</h3>
                    <span className="team-game">{team.game}</span>
                  </div>
                  {team.recruiting && <span className="recruiting-badge">🔴 Recruiting</span>}
                </div>
                
                <div className="team-members">
                  <h4>Team Members ({team.members.length})</h4>
                  <div className="members-list">
                    {team.members.map((member, idx) => (
                      <div 
                        key={idx} 
                        className="member-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMember(member);
                        }}
                      >
                        <div className="member-image-container">
                          {member.image ? (
                            <img src={member.image} alt={member.name} className="member-image" />
                          ) : (
                            <span className="member-avatar">{member.avatar}</span>
                          )}
                        </div>
                        <div className="member-info">
                          <span className="member-name">{member.name}</span>
                          <span className="member-role">{member.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="team-stats">
                  <div className="stat">
                    <span className="stat-value">{team.stats.wins}</span>
                    <span className="stat-label">Wins</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{team.stats.losses}</span>
                    <span className="stat-label">Losses</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{team.stats.tournaments}</span>
                    <span className="stat-label">Tournaments</span>
                  </div>
                </div>

                {team.achievements.length > 0 && (
                  <div className="team-achievements">
                    <h4>Achievements</h4>
                    <div className="achievements-list">
                      {team.achievements.map((achievement, idx) => (
                        <span key={idx} className="achievement-badge">🏆 {achievement}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Player Profile Popup */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            className="modal-overlay player-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              className="player-profile-popup"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="popup-close" onClick={() => setSelectedMember(null)}>×</button>
              
              <div className="player-profile-header">
                <div className="player-avatar-large">
                  {selectedMember.image ? (
                    <img src={selectedMember.image} alt={selectedMember.name} className="player-profile-image" />
                  ) : (
                    selectedMember.avatar
                  )}
                </div>
                <div className="player-basic-info">
                  <h2>{selectedMember.ign}</h2>
                  <p className="player-real-name">{selectedMember.realName}</p>
                  <div className="player-tags">
                    <span className="player-country">{selectedMember.country}</span>
                    <span className="player-role-badge">{selectedMember.role}</span>
                  </div>
                </div>
              </div>

              <div className="player-profile-stats">
                <div className="player-stat-box">
                  <span className="stat-value">{selectedMember.stats.kda}</span>
                  <span className="stat-label">KDA</span>
                </div>
                <div className="player-stat-box">
                  <span className="stat-value">{selectedMember.stats.hs}</span>
                  <span className="stat-label">Headshot %</span>
                </div>
                <div className="player-stat-box">
                  <span className="stat-value">{selectedMember.stats.matches}</span>
                  <span className="stat-label">Matches</span>
                </div>
              </div>

              <div className="player-profile-details">
                <div className="detail-row">
                  <span className="detail-label">Main Role</span>
                  <span className="detail-value">{selectedMember.mainRole}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Age</span>
                  <span className="detail-value">{selectedMember.age} years</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Joined</span>
                  <span className="detail-value">{new Date(selectedMember.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="player-social-links">
                <a href={`https://twitter.com/${selectedMember.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-link">
                  <span>🐦</span> {selectedMember.social.twitter}
                </a>
                <span className="social-link discord">
                  <span>💬</span> {selectedMember.social.discord}
                </span>
              </div>

              <div className="player-profile-actions">
                <button className="primary-btn">Follow Player</button>
                <button className="secondary-btn">View Match History</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Details Modal */}
      {selectedTeam && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedTeam(null)}
        >
          <motion.div 
            className="modal-content team-modal"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedTeam(null)}>×</button>
            
            <div className="modal-team-header">
              <div className="team-logo-large">{selectedTeam.logo}</div>
              <div className="team-title">
                <h2>{selectedTeam.name}</h2>
                <span className="team-game">{selectedTeam.game}</span>
              </div>
            </div>

            <div className="modal-team-content">
              <div className="modal-section">
                <h3>Team Members</h3>
                <div className="members-grid">
                  {selectedTeam.members.map((member, idx) => (
                    <div 
                      key={idx} 
                      className="member-card clickable"
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="member-image-container large">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="member-image" />
                        ) : (
                          <span className="member-avatar large">{member.avatar}</span>
                        )}
                      </div>
                      <span className="member-name">{member.name}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h3>Team Statistics</h3>
                <div className="team-stats-grid">
                  <div className="stat-box">
                    <span className="stat-value">{selectedTeam.stats.wins}</span>
                    <span className="stat-label">Wins</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{selectedTeam.stats.losses}</span>
                    <span className="stat-label">Losses</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{selectedTeam.stats.tournaments}</span>
                    <span className="stat-label">Tournaments</span>
                  </div>
                </div>
              </div>

              {selectedTeam.achievements.length > 0 && (
                <div className="modal-section">
                  <h3>Trophy Cabinet</h3>
                  <div className="achievements-grid">
                    {selectedTeam.achievements.map((achievement, idx) => (
                      <div key={idx} className="trophy-item">
                        <span className="trophy-icon">🏆</span>
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button className="primary-btn">Apply to Join</button>
                <button className="secondary-btn">View Schedule</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </>
  );
}

export default Teams;
