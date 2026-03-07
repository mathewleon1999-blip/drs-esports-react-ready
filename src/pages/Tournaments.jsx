import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Demo tournament data
const tournaments = [
  {
    id: 1,
    name: "DRS Pro League Season 5",
    game: "Valorant",
    prizePool: "₹5,00,000",
    date: "2025-02-15",
    endDate: "2025-02-28",
    status: "upcoming",
    teams: 16,
    registered: 12,
    image: "/tournament-pro.jpg",
    description: "The premier Valorant tournament featuring top teams from across India."
  },
  {
    id: 2,
    name: "DRS Championship 2025",
    game: "CS2",
    prizePool: "₹10,00,000",
    date: "2025-03-01",
    endDate: "2025-03-15",
    status: "upcoming",
    teams: 32,
    registered: 24,
    image: "/tournament-championship.jpg",
    description: "The biggest CS2 tournament of the year with teams from Asia."
  },
  {
    id: 3,
    name: "DRS Weekly Showdown",
    game: "PUBG",
    prizePool: "₹50,000",
    date: "2025-01-20",
    endDate: "2025-01-21",
    status: "live",
    teams: 20,
    registered: 20,
    image: "/tournament-weekly.jpg",
    description: "Weekly PUBG tournament open to all players."
  },
  {
    id: 4,
    name: "DRS Winter Cup",
    game: "Valorant",
    prizePool: "₹2,00,000",
    date: "2024-12-15",
    endDate: "2024-12-20",
    status: "completed",
    teams: 16,
    registered: 16,
    image: "/tournament-winter.jpg",
    description: "Winter special Valorant tournament."
  }
];

// Registration form component
function RegistrationForm({ tournament, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    teamName: "",
    captainName: "",
    email: "",
    phone: "",
    players: ["", "", "", "", ""],
    substitute: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = value;
    setFormData({ ...formData, players: newPlayers });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(tournament, formData);
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-content tournament-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Register for {tournament.name}</h2>
        <p className="modal-subtitle">{tournament.game} • {tournament.prizePool}</p>
        
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label>Team Name *</label>
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              placeholder="Enter your team name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Captain Name *</label>
            <input
              type="text"
              name="captainName"
              value={formData.captainName}
              onChange={handleChange}
              placeholder="Team captain name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="captain@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Team Players (5 required)</label>
            {formData.players.map((player, index) => (
              <input
                key={index}
                type="text"
                value={player}
                onChange={(e) => handlePlayerChange(index, e.target.value)}
                placeholder={`Player ${index + 1} name`}
                required={index < 5}
              />
            ))}
          </div>
          
          <div className="form-group">
            <label>Substitute Player (optional)</label>
            <input
              type="text"
              name="substitute"
              value={formData.substitute}
              onChange={handleChange}
              placeholder="Substitute player name"
            />
          </div>
          
          <button type="submit" className="submit-btn">
            Submit Registration
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Bracket component
function TournamentBracket({ tournament }) {
  const matches = [
    { round: "Quarter Finals", games: [
      { team1: "Team Alpha", team2: "Team Bravo", score: "2-0", winner: 1 },
      { team1: "Team Charlie", team2: "Team Delta", score: "1-2", winner: 2 },
      { team1: "Team Echo", team2: "Team Foxtrot", score: "2-1", winner: 1 },
      { team1: "Team Golf", team2: "Team Hotel", score: "0-2", winner: 2 }
    ]},
    { round: "Semi Finals", games: [
      { team1: "Team Alpha", team2: "Team Delta", score: "2-1", winner: 1 },
      { team1: "Team Echo", team2: "Team Hotel", score: "1-2", winner: 2 }
    ]},
    { round: "Finals", games: [
      { team1: "Team Alpha", team2: "Team Hotel", score: "3-2", winner: 1 }
    ]}
  ];

  return (
    <div className="tournament-bracket">
      {matches.map((round, roundIndex) => (
        <div key={roundIndex} className="bracket-round">
          <h3>{round.round}</h3>
          <div className="bracket-games">
            {round.games.map((game, gameIndex) => (
              <div key={gameIndex} className="bracket-game">
                <div className={`game-team ${game.winner === 1 ? 'winner' : ''}`}>
                  <span>{game.team1}</span>
                  {game.winner === 1 && <span className="winner-badge">🏆</span>}
                </div>
                <div className="game-score">{game.score}</div>
                <div className={`game-team ${game.winner === 2 ? 'winner' : ''}`}>
                  <span>{game.team2}</span>
                  {game.winner === 2 && <span className="winner-badge">🏆</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Tournaments() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showBracket, setShowBracket] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const filteredTournaments = tournaments.filter(t => 
    activeTab === "all" ? true : t.status === activeTab
  );

  const handleRegister = (tournament) => {
    setSelectedTournament(tournament);
    setShowRegistration(true);
  };

  const handleSubmitRegistration = (tournament, data) => {
    setRegistrations([...registrations, { tournament: tournament.name, ...data, date: new Date().toISOString() }]);
    setShowRegistration(false);
    setSelectedTournament(null);
    alert("Registration submitted successfully!");
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "live": return <span className="status-badge status-live">🔴 Live</span>;
      case "upcoming": return <span className="status-badge status-upcoming">📅 Upcoming</span>;
      case "completed": return <span className="status-badge status-completed">✅ Completed</span>;
      default: return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="tournaments-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Tournaments</h1>
            <p>Compete in the ultimate esports competitions</p>
          </motion.div>
        </section>

        {/* Tournament Tabs */}
        <section className="tournaments-content">
          <div className="tournament-tabs">
            <button 
              className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </button>
            <button 
              className={`tab-btn ${activeTab === "live" ? "active" : ""}`}
              onClick={() => setActiveTab("live")}
            >
              Live Now
            </button>
            <button 
              className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
            <button 
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
          </div>

          {/* Tournament Cards */}
          <div className="tournaments-grid">
            {filteredTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                className="tournament-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="tournament-image">
                  <div className="tournament-placeholder">
                    <span>🎮</span>
                  </div>
                  {getStatusBadge(tournament.status)}
                </div>
                <div className="tournament-info">
                  <div className="tournament-game">{tournament.game}</div>
                  <h3>{tournament.name}</h3>
                  <p className="tournament-description">{tournament.description}</p>
                  <div className="tournament-details">
                    <div className="detail">
                      <span className="detail-label">Prize Pool</span>
                      <span className="detail-value">{tournament.prizePool}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{tournament.date}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Teams</span>
                      <span className="detail-value">{tournament.registered}/{tournament.teams}</span>
                    </div>
                  </div>
                  <div className="tournament-actions">
                    {tournament.status !== "completed" && (
                      <button 
                        className="register-btn"
                        onClick={() => handleRegister(tournament)}
                      >
                        Register Now
                      </button>
                    )}
                    {(tournament.status === "completed" || tournament.status === "live") && (
                      <button 
                        className="bracket-btn"
                        onClick={() => setShowBracket(tournament.id)}
                      >
                        View Bracket
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bracket Modal */}
          {showBracket && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowBracket(null)}
            >
              <motion.div 
                className="modal-content bracket-modal"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={() => setShowBracket(null)}>×</button>
                <h2>Tournament Bracket</h2>
                <TournamentBracket tournament={tournaments.find(t => t.id === showBracket)} />
              </motion.div>
            </motion.div>
          )}
        </section>
      </div>
      <Footer />
      
      {/* Registration Modal */}
      {showRegistration && selectedTournament && (
        <RegistrationForm 
          tournament={selectedTournament}
          onClose={() => { setShowRegistration(false); setSelectedTournament(null); }}
          onSubmit={handleSubmitRegistration}
        />
      )}
    </>
  );
}

export default Tournaments;
