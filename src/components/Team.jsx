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
    { name: "SHAKIIR", role: "IGL", image: "/DRS ESPORTS/SHAKKIR).jpg" },
    { name: "DREAM", role: "Assaulter", image: "/DRS ESPORTS/Dream.jpg" },
    { name: "NOISY", role: "Entry Fragger", image: "/DRS ESPORTS/noisy n (3).png" },
    { name: "AKOJI", role: "Support", image: "/DRS ESPORTS/AKOS (3).png" },
    { name: "DRS ZEN", role: "Sub", image: "/DRS ESPORTS/DRS ZEN (1).jpg" },
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
        DRS ESPORTS PUBG lineup
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

