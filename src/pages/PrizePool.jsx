import { useState } from 'react';
import { motion } from 'framer-motion';
import PrizePoolTracker from '../components/PrizePoolTracker';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PrizePool() {
  const [selectedTournament, setSelectedTournament] = useState(null);

  const tournaments = [
    { id: 1, name: 'DRS Championship 2025', prizePool: 50000, status: 'upcoming' },
    { id: 2, name: 'Weekly Scrims', prizePool: 5000, status: 'ongoing' },
    { id: 3, name: 'Amateur League', prizePool: 10000, status: 'upcoming' }
  ];

  return (
    <>
      <Navbar />
      <div className="prize-pool-page">
        <motion.div 
          className="page-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="page-header">
            <h1>🏆 Prize Pool Tracker</h1>
            <p>Track tournament prize pools and sponsor contributions</p>
          </div>

          {/* Tournament Selector */}
          <div className="tournament-selector">
            {tournaments.map(tournament => (
              <motion.button
                key={tournament.id}
                className={`tournament-btn ${selectedTournament?.id === tournament.id ? 'active' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTournament(tournament)}
              >
                <span className="tournament-name">{tournament.name}</span>
                <span className="tournament-prize">₹{tournament.prizePool.toLocaleString()}</span>
                <span className={`status ${tournament.status}`}>{tournament.status}</span>
              </motion.button>
            ))}
          </div>

          {/* Prize Pool Tracker */}
          <PrizePoolTracker tournament={selectedTournament || tournaments[0]} />
        </motion.div>
      </div>
      <Footer />
    </>
  );
}

export default PrizePool;

