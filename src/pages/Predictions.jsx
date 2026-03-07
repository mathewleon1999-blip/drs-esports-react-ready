import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePredictions, PREDICTION_POINTS } from '../context/PredictionsContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Predictions() {
  const {
    matches,
    userPredictions,
    leaderboard,
    makePrediction,
    getUpcomingMatches,
    getCompletedMatches,
    getUserPrediction,
    canPredict,
    getUserPoints,
    getUserCorrectCount,
    calculateStreak,
    completeMatch
  } = usePredictions();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [showPredictionModal, setShowPredictionModal] = useState(null);
  const [prediction, setPrediction] = useState({ winner: 1, score1: 0, score2: 0 });

  const upcomingMatches = getUpcomingMatches();
  const completedMatches = getCompletedMatches();
  const userPoints = getUserPoints();
  const userCorrect = getUserCorrectCount();
  const userStreak = calculateStreak();

  const handleMakePrediction = (matchId) => {
    if (!canPredict(matchId)) return;
    makePrediction(matchId, prediction.winner, prediction.score1, prediction.score2);
    setShowPredictionModal(null);
    setPrediction({ winner: 1, score1: 0, score2: 0 });
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Starting soon';
  };

  return (
    <>
      <Navbar />
      <div className="predictions-page">
        <motion.div 
          className="predictions-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Header Stats */}
          <div className="predictions-header">
            <h1>🏆 Match Predictions</h1>
            <div className="user-stats">
              <div className="stat-card">
                <span className="stat-icon">🎯</span>
                <span className="stat-value">{userPoints}</span>
                <span className="stat-label">Your Points</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">✅</span>
                <span className="stat-value">{userCorrect}</span>
                <span className="stat-label">Correct</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🔥</span>
                <span className="stat-value">{userStreak}</span>
                <span className="stat-label">Streak</span>
              </div>
            </div>
          </div>

          {/* Points Info */}
          <div className="points-info">
            <span>🎯 Exact Score: <strong>{PREDICTION_POINTS.EXACT_SCORE} pts</strong></span>
            <span>✅ Correct Winner: <strong>{PREDICTION_POINTS.CORRECT_WINNER} pts</strong></span>
          </div>

          {/* Tab Navigation */}
          <div className="tabs-nav">
            <button 
              className={activeTab === 'upcoming' ? 'active' : ''}
              onClick={() => setActiveTab('upcoming')}
            >
              📅 Upcoming ({upcomingMatches.length})
            </button>
            <button 
              className={activeTab === 'completed' ? 'active' : ''}
              onClick={() => setActiveTab('completed')}
            >
              ✅ Results ({completedMatches.length})
            </button>
            <button 
              className={activeTab === 'leaderboard' ? 'active' : ''}
              onClick={() => setActiveTab('leaderboard')}
            >
              🏅 Leaderboard
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode='wait'>
            {activeTab === 'upcoming' && (
              <motion.div 
                key="upcoming"
                className="matches-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {upcomingMatches.length === 0 ? (
                  <div className="empty-state">
                    <p>No upcoming matches</p>
                  </div>
                ) : (
                  upcomingMatches.map((match, index) => {
                    const userPred = getUserPrediction(match.id);
                    const canPredictMatch = canPredict(match.id);
                    
                    return (
                      <motion.div 
                        key={match.id}
                        className="match-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="match-header">
                          <span className="tournament">{match.tournament}</span>
                          <span className="time-badge">{formatTime(match.scheduledTime)}</span>
                        </div>
                        
                        <div className="match-teams">
                          <div 
                            className={`team ${userPred?.predictedWinner === 1 ? 'predicted' : ''}`}
                          >
                            <span className="team-logo">{match.team1.logo}</span>
                            <span className="team-name">{match.team1.name}</span>
                          </div>
                          <div className="vs">VS</div>
                          <div 
                            className={`team ${userPred?.predictedWinner === 2 ? 'predicted' : ''}`}
                          >
                            <span className="team-logo">{match.team2.logo}</span>
                            <span className="team-name">{match.team2.name}</span>
                          </div>
                        </div>

                        <div className="match-footer">
                          <span className="prize-pool">💰 Prize: ₹{match.prizePool.toLocaleString()}</span>
                          {userPred ? (
                            <div className="prediction-status">
                              <span>✓ Predicted: {userPred.predictedScore1}-{userPred.predictedScore2}</span>
                              {canPredictMatch && (
                                <button 
                                  className="update-btn"
                                  onClick={() => {
                                    setShowPredictionModal(match);
                                    setPrediction({
                                      winner: userPred.predictedWinner,
                                      score1: userPred.predictedScore1,
                                      score2: userPred.predictedScore2
                                    });
                                  }}
                                >
                                  Update
                                </button>
                              )}
                            </div>
                          ) : (
                            canPredictMatch && (
                              <button 
                                className="predict-btn"
                                onClick={() => {
                                  setShowPredictionModal(match);
                                  setPrediction({ winner: 1, score1: 0, score2: 0 });
                                }}
                              >
                                Make Prediction
                              </button>
                            )
                          )}
                          {!canPredictMatch && !userPred && (
                            <span className="closed">Prediction Closed</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === 'completed' && (
              <motion.div 
                key="completed"
                className="matches-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {completedMatches.length === 0 ? (
                  <div className="empty-state">
                    <p>No completed matches yet</p>
                  </div>
                ) : (
                  completedMatches.map((match, index) => {
                    const userPred = getUserPrediction(match.id);
                    
                    return (
                      <motion.div 
                        key={match.id}
                        className="match-card completed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="match-header">
                          <span className="tournament">{match.tournament}</span>
                          <span className="status-badge completed">Completed</span>
                        </div>
                        
                        <div className="match-teams">
                          <div className={`team ${match.result?.winner === 1 ? 'winner' : ''}`}>
                            <span className="team-logo">{match.team1.logo}</span>
                            <span className="team-name">{match.team1.name}</span>
                            <span className="score">{match.result?.score1}</span>
                          </div>
                          <div className="vs">VS</div>
                          <div className={`team ${match.result?.winner === 2 ? 'winner' : ''}`}>
                            <span className="team-logo">{match.team2.logo}</span>
                            <span className="team-name">{match.team2.name}</span>
                            <span className="score">{match.result?.score2}</span>
                          </div>
                        </div>

                        {userPred && (
                          <div className="prediction-result">
                            <span>Your Prediction: {userPred.predictedScore1}-{userPred.predictedScore2}</span>
                            <span className={`points ${userPred.points > 0 ? 'correct' : 'wrong'}`}>
                              {userPred.points > 0 ? `+${userPred.points} pts` : '0 pts'}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === 'leaderboard' && (
              <motion.div 
                key="leaderboard"
                className="leaderboard-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="leaderboard-table">
                  <div className="leaderboard-header">
                    <span>Rank</span>
                    <span>Player</span>
                    <span>Points</span>
                    <span>Correct</span>
                  </div>
                  {leaderboard.map((entry, index) => (
                    <motion.div 
                      key={entry.id}
                      className={`leaderboard-row ${entry.username === 'You' ? 'current-user' : ''} ${index < 3 ? 'top-three' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className="rank">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                      <span className="username">{entry.username}</span>
                      <span className="points">{entry.points}</span>
                      <span className="correct">{entry.correct}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Prediction Modal */}
        <AnimatePresence>
          {showPredictionModal && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPredictionModal(null)}
            >
              <motion.div 
                className="modal-content prediction-modal"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={e => e.stopPropagation()}
              >
                <h2>🎯 Make Your Prediction</h2>
                
                <div className="modal-match">
                  <div className="team">
                    <span className="logo">{showPredictionModal.team1.logo}</span>
                    <span className="name">{showPredictionModal.team1.name}</span>
                  </div>
                  <span className="vs">VS</span>
                  <div className="team">
                    <span className="logo">{showPredictionModal.team2.logo}</span>
                    <span className="name">{showPredictionModal.team2.name}</span>
                  </div>
                </div>

                <div className="prediction-form">
                  <div className="winner-selection">
                    <label>Predict Winner:</label>
                    <div className="winner-buttons">
                      <button 
                        className={prediction.winner === 1 ? 'selected' : ''}
                        onClick={() => setPrediction({ ...prediction, winner: 1 })}
                      >
                        {showPredictionModal.team1.logo} {showPredictionModal.team1.name}
                      </button>
                      <button 
                        className={prediction.winner === 2 ? 'selected' : ''}
                        onClick={() => setPrediction({ ...prediction, winner: 2 })}
                      >
                        {showPredictionModal.team2.logo} {showPredictionModal.team2.name}
                      </button>
                    </div>
                  </div>

                  <div className="score-prediction">
                    <label>Score Prediction:</label>
                    <div className="score-inputs">
                      <input 
                        type="number"
                        min={0}
                        max={20}
                        value={prediction.score1}
                        onChange={(e) => setPrediction({ ...prediction, score1: parseInt(e.target.value) || 0 })}
                      />
                      <span>-</span>
                      <input 
                        type="number"
                        min={0}
                        max={20}
                        value={prediction.score2}
                        onChange={(e) => setPrediction({ ...prediction, score2: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                <div className="points-preview">
                  <p>Potential Points:</p>
                  <div className="points-options">
                    <span className="exact">Exact: {PREDICTION_POINTS.EXACT_SCORE} pts</span>
                    <span className="winner">Winner: {PREDICTION_POINTS.CORRECT_WINNER} pts</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setShowPredictionModal(null)}>
                    Cancel
                  </button>
                  <button className="submit-btn" onClick={() => handleMakePrediction(showPredictionModal.id)}>
                    Submit Prediction
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}

export default Predictions;

