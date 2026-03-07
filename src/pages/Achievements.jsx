import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const achievements = [
  {
    id: 1,
    title: "PMNC UAE 2025",
    tournament: "PUBG Mobile Nations Cup UAE",
    date: "2025",
    prize: "Official Achievement",
    position: "#4 Place",
    badge: "🎯",
  },
];

const records = [
  { label: "Total Matches Played", value: "2,500+" },
  { label: "Total Wins", value: "1,250+" },
  { label: "Win Rate", value: "68%" },
  { label: "Average K/D", value: "4.8" },
  { label: "Total Earnings", value: "₹5Cr+" },
  { label: "Tournaments Won", value: "45+" },
];

const trophies = [
  { name: "PMNC UAE 2025", year: "2025", type: "gold" },
];

function Achievements() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="achievements-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Our <span className="highlight">Achievements</span></h1>
            <p>A legacy of victories and excellence</p>
          </motion.div>
        </section>

        {/* Stats Overview */}
        <section className="achievements-stats">
          <div className="container">
            <motion.div
              className="records-grid"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {records.map((record, index) => (
                <motion.div
                  key={index}
                  className="record-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="record-value">{record.value}</div>
                  <div className="record-label">{record.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Tournament Achievements */}
        <section className="tournament-achievements">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Tournament <span className="highlight">Wins</span>
            </motion.h2>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className="achievement-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="achievement-badge">{achievement.badge}</div>
                  <div className="achievement-content">
                    <h3>{achievement.title}</h3>
                    <p className="achievement-tournament">{achievement.tournament}</p>
                    <div className="achievement-meta">
                      <span className="achievement-date">{achievement.date}</span>
                      <span className="achievement-position">{achievement.position}</span>
                    </div>
                    <div className="achievement-prize">{achievement.prize}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trophy Cabinet */}
        <section className="trophy-cabinet">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Trophy <span className="highlight">Cabinet</span>
            </motion.h2>
            <motion.div
              className="trophies-display"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {trophies.map((trophy, index) => (
                <motion.div
                  key={index}
                  className={`trophy-item ${trophy.type}`}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="trophy-icon">
                    {trophy.type === "gold" ? "🏆" : "🥈"}
                  </div>
                  <div className="trophy-info">
                    <span className="trophy-name">{trophy.name}</span>
                    <span className="trophy-year">{trophy.year}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Records Section */}
        <section className="records-section">
          <div className="container">
            <motion.div
              className="records-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Our <span className="highlight">Records</span></h2>
              <div className="records-list">
                <div className="record-item">
                  <span className="record-icon">🔥</span>
                  <div className="record-text">
                    <h4>Longest Win Streak</h4>
                    <p>15 consecutive tournament wins</p>
                  </div>
                </div>
                <div className="record-item">
                  <span className="record-icon">💀</span>
                  <div className="record-text">
                    <h4>Highest K/D in a Match</h4>
                    <p>32 kills with 0 deaths</p>
                  </div>
                </div>
                <div className="record-item">
                  <span className="record-icon">💰</span>
                  <div className="record-text">
                    <h4>Biggest Prize Pool Won</h4>
                    <p>₹10,00,000 in a single tournament</p>
                  </div>
                </div>
                <div className="record-item">
                  <span className="record-icon">🎯</span>
                  <div className="record-text">
                    <h4>Most Headshots in Match</h4>
                    <p>28 headshots in ESL Championship</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="achievements-cta">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Want to Create History?</h2>
            <p>Join DRS Esports and be part of our winning legacy</p>
            <div className="cta-buttons">
              <a href="/shop" className="primary-btn">Get Our Jersey</a>
              <a href="/login" className="secondary-btn">Join Now</a>
            </div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Achievements;

