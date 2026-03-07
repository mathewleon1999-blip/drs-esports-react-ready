import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  const milestones = [
    { year: "2020", title: "Foundation", description: "DRS Esports was established by a group of passionate PUBG Mobile players" },
    { year: "2021", title: "Beginning the Journey", description: "Started competing in local and regional PUBG Mobile tournaments" },
    { year: "2022", title: "Growing Stronger", description: "Built our team and gained experience in competitive PUBG Mobile" },
    { year: "2023", title: "Regional Recognition", description: "Established presence in the Indian PUBG Mobile competitive scene" },
    { year: "2024", title: "International Exposure", description: "Participated in international competitions and built reputation" },
    { year: "2025", title: "PMNC UAE 2025", description: "Represented India at PUBG Mobile Nations Cup UAE - Achieved #4 Position" },
  ];

  const values = [
    { icon: "🎯", title: "Excellence", description: "We strive for perfection in every match" },
    { icon: "🤝", title: "Teamwork", description: "Unity and coordination are our strengths" },
    { icon: "🔥", title: "Passion", description: "Love for the game drives us forward" },
    { icon: "💪", title: "Discipline", description: "Practice and dedication lead to victory" },
  ];

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="about-hero">
          <motion.div
            className="about-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About <span className="highlight">DRS ESPORTS</span></h1>
            <p className="about-tagline">Rising Through Fire. Winning With Precision.</p>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="about-section">
          <div className="container">
            <motion.div
              className="about-content-grid"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="about-text">
                <h2>Our <span className="highlight">Mission</span></h2>
                <p>
                  DRS Esports is a professional PUBG Mobile competitive clan dedicated to excellence 
                  in esports. We aim to nurture talent, promote fair play, and compete at the highest 
                  level of mobile gaming. Our mission is to bring glory to Indian esports on the 
                  global stage.
                </p>
              </div>
              <div className="about-image">
                <div className="image-placeholder">🎮</div>
              </div>
            </motion.div>

            <motion.div
              className="about-content-grid reverse"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="about-text">
                <h2>Our <span className="highlight">Vision</span></h2>
                <p>
                  To become one of the most recognized and respected esports organizations in Asia, 
                  known for producing world-class players, maintaining ethical standards, and 
                  contributing to the growth of mobile esports gaming.
                </p>
              </div>
              <div className="about-image">
                <div className="image-placeholder">🏆</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Core Values
            </motion.h2>
            <div className="values-grid">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="value-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our <span className="highlight">Journey</span>
            </motion.h2>
            <div className="timeline">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="timeline-content">
                    <div className="timeline-year">{milestone.year}</div>
                    <h3>{milestone.title}</h3>
                    <p>{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Join the Elite?</h2>
            <p>Become part of the DRS family and rise to glory</p>
            <div className="cta-buttons">
              <Link to="/shop" className="primary-btn">Get Our Jersey</Link>
              <Link to="/login" className="secondary-btn">Login</Link>
            </div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default About;

