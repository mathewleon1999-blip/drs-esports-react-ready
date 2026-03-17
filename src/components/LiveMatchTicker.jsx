import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchUpcomingMatches, fetchLiveMatches } from '../lib/matchesRepo';

function LiveMatchTicker() {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('loading'); // loading, live, upcoming, error

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const [upcoming, live] = await Promise.all([
          fetchUpcomingMatches({ limit: 5 }),
          fetchLiveMatches()
        ]);

        const allMatches = [
          ...live.map(match => ({ ...match, type: 'live' })),
          ...upcoming.slice(0, 5).map(match => ({ ...match, type: 'upcoming' }))
        ];

        setMatches(allMatches);
        setStatus(allMatches.length ? 'success' : 'empty');
      } catch (error) {
        console.error('Live ticker error:', error);
        setStatus('error');
        // Fallback demo data
        setMatches([
          {
            id: 'demo1',
            team1: 'DRS Esports',
            team2: 'Rivals',
            time: 'Live Now',
            tournament: 'UAE 2025 Qualifier',
            type: 'live'
          },
          {
            id: 'demo2',
            team1: 'DRS Esports',
            team2: 'Elite Squad',
            time: '2h 15m',
            tournament: 'PMNC India',
            type: 'upcoming'
          }
        ]);
      }
    };

    loadMatches();

    // Poll every 30s for live updates
    const interval = setInterval(loadMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate every 8s
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(matches.length, 1));
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentIndex, matches.length]);

  if (status === 'loading') {
    return (
      <div className="live-ticker loading">
        <div className="ticker-content">
          <div className="live-dot loading"></div>
          <span>Loading matches...</span>
        </div>
      </div>
    );
  }

  if (status === 'empty') {
    return null; // Hide if no matches
  }

  const match = matches[currentIndex] || matches[0];

  const getStatusClass = () => {
    switch (match?.type) {
      case 'live': return 'live';
      case 'upcoming': return 'upcoming';
      default: return 'unknown';
    }
  };

  const formatTime = (time) => {
    if (time === 'Live Now') return time;
    const [hours, minutes] = time.split(':');
    return `${hours}h ${minutes}m`;
  };

  return (
    <motion.div
      className="live-ticker"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="ticker-content">
        <div className="live-dot live"></div>
        <div className="match-info">
          <span className={`status-badge ${getStatusClass()}`}>
            {match?.type === 'live' ? '🔴 LIVE' : '📅 Soon'}
          </span>
          <span className="match-teams">
            {match?.team1 || 'DRS Esports'} vs {match?.team2 || 'Rivals'}
          </span>
          <span className="match-details">
            {match?.tournament || 'Major Tournament'} • {formatTime(match?.time || 'Soon')}
          </span>
        </div>
        <Link to="/schedule" className="view-all-btn">
          View Schedule →
        </Link>
      </div>

      {/* Progress dots */}
      {matches.length > 1 && (
        <div className="ticker-dots">
          {matches.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Match ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default LiveMatchTicker;

