import { motion } from "framer-motion";

function TournamentCard({ date, name, game, participants, prize }) {
  return (
    <motion.div
      className="tournament-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="tournament-date">{date}</div>
      <h3 className="tournament-name">{name}</h3>
      <p className="tournament-info">🎮 {game}</p>
      <p className="tournament-info">👥 {participants} Teams</p>
      <div className="tournament-prize">{prize}</div>
    </motion.div>
  );
}

function Tournaments() {
  const tournaments = [
    {
      date: "March 15, 2026",
      name: "DRS Championship Season 5",
      game: "PUBG Mobile",
      participants: "32",
      prize: "₹2,00,000",
    },
    {
      date: "April 20, 2026",
      name: "Winter Clash 2026",
      game: "PUBG Mobile",
      participants: "64",
      prize: "₹5,00,000",
    },
    {
      date: "May 25, 2026",
      name: "DRS Pro League",
      game: "PUBG Mobile",
      participants: "16",
      prize: "₹10,00,000",
    },
  ];

  return (
    <section className="tournaments" id="tournaments">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Upcoming Tournaments
      </motion.h2>
      <motion.p
        className="tournaments-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Compete for glory and massive prizes
      </motion.p>
      <div className="tournaments-grid">
        {tournaments.map((tournament, index) => (
          <TournamentCard key={index} {...tournament} />
        ))}
      </div>
    </section>
  );
}

export default Tournaments;

