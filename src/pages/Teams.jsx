import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { teams } from "../data/teams";

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
                {selectedMember?.social?.instagramUrl ? (
                  <a
                    href={selectedMember.social.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <span>📷</span> Instagram
                  </a>
                ) : null}

                {selectedMember?.social?.discord ? (
                  <span className="social-link discord">
                    <span>💬</span> {selectedMember.social.discord}
                  </span>
                ) : null}
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
