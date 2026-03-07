import { motion } from "framer-motion";

function PlayerCard({ name, role, image }) {
  return (
    <motion.div
      className="player-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="player-avatar">
        {image && <img src={image} alt={name} className="player-image" />}
      </div>
      <h3 className="player-name">{name}</h3>
      <span className="player-role">{role}</span>
    </motion.div>
  );
}

function Team() {
  const players = [
    { name: "SHAKKIR", role: "IGL / Captain", image: "/DRS ESPORTS/SHAKKIR).jpg" },
    { name: "DREAM", role: "Duelist", image: "/DRS ESPORTS/Dream.jpg" },
    { name: "SHYNO", role: "Controller", image: "/DRS ESPORTS/SHYNO.jpg" },
    { name: "XANDER", role: "Sentinel", image: "/DRS ESPORTS/XANDER-WA0043.jpg" },
  ];

  return (
    <section className="team" id="team">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Our Roster
      </motion.h2>
      <motion.p
        className="team-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Elite players dominating the arena
      </motion.p>
      <div className="team-grid">
        {players.map((player, index) => (
          <PlayerCard key={index} {...player} />
        ))}
      </div>
    </section>
  );
}

export default Team;

