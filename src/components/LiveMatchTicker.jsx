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
        setMatches([]);
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

  // If we don't have real match data, don't render placeholders.
  const hasTeams = Boolean(match?.team1 && match?.team2);
  if (!hasTeams) return null;

  const getStatusClass = () => {
    switch (match?.type) {
      case 'live': return 'live';
      case 'upcoming': return 'upcoming';
      default: return 'unknown';
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    if (time === 'Live Now') return time;
    if (typeof time === 'string' && time.includes(':')) {
      const [hours, minutes] = time.split(':');
      return `${hours}h ${minutes}m`;
    }
    return String(time);
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
            {match.team1} vs {match.team2}
          </span>
          <span className="match-details">
            {match?.tournament ? `${match.tournament} • ` : ''}{formatTime(match?.time)}
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

