import { createContext, useContext, useState, useEffect } from 'react';

const PredictionsContext = createContext();

// Points for correct predictions
export const PREDICTION_POINTS = {
  EXACT_SCORE: 30,    // Perfect score prediction
  CORRECT_WINNER: 10, // Just predicted the winner correctly
  WRONG: 0
};

// Default upcoming matches
const DEFAULT_MATCHES = [
  {
    id: 1,
    team1: { name: 'DRS Phoenix', logo: '🔥' },
    team2: { name: 'Team Velocity', logo: '⚡' },
    scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    tournament: 'DRS Championship 2025',
    status: 'upcoming',
    result: null,
    prizePool: 50000
  },
  {
    id: 2,
    team1: { name: 'Shadow Riders', logo: '🌑' },
    team2: { name: 'Thunder Wolves', logo: '🐺' },
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    tournament: 'Weekly Scrims',
    status: 'upcoming',
    result: null,
    prizePool: 5000
  },
  {
    id: 3,
    team1: { name: 'Night Hawks', logo: '🦅' },
    team2: { name: 'Iron Legion', logo: '🛡️' },
    scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    tournament: 'DRS Championship 2025',
    status: 'upcoming',
    result: null,
    prizePool: 50000
  },
  {
    id: 4,
    team1: { name: 'Cyber Dragons', logo: '🐉' },
    team2: { name: 'Pixel Warriors', logo: '👾' },
    scheduledTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tournament: 'Amateur League',
    status: 'upcoming',
    result: null,
    prizePool: 10000
  }
];

// Sample completed matches for leaderboard
const DEFAULT_COMPLETED_MATCHES = [
  {
    id: 101,
    team1: { name: 'DRS Phoenix', logo: '🔥' },
    team2: { name: 'Team Velocity', logo: '⚡' },
    scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tournament: 'DRS Championship 2025',
    status: 'completed',
    result: { winner: 1, score1: 2, score2: 1 },
    prizePool: 50000
  },
  {
    id: 102,
    team1: { name: 'Shadow Riders', logo: '🌑' },
    team2: { name: 'Thunder Wolves', logo: '🐺' },
    scheduledTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tournament: 'Weekly Scrims',
    status: 'completed',
    result: { winner: 2, score1: 0, score2: 2 },
    prizePool: 5000
  }
];

export function PredictionsProvider({ children }) {
  const [matches, setMatches] = useState(() => {
    const stored = localStorage.getItem('drs-matches');
    return stored ? JSON.parse(stored) : [...DEFAULT_MATCHES, ...DEFAULT_COMPLETED_MATCHES];
  });

  const [userPredictions, setUserPredictions] = useState(() => {
    const stored = localStorage.getItem('drs-predictions');
    return stored ? JSON.parse(stored) : {};
  });

  const [leaderboard, setLeaderboard] = useState(() => {
    const stored = localStorage.getItem('drs-prediction-leaderboard');
    return stored ? JSON.parse(stored) : [
      { id: 1, username: 'ProGamer123', points: 450, correct: 12, streak: 5 },
      { id: 2, username: 'EsportsKing', points: 380, correct: 10, streak: 3 },
      { id: 3, username: 'BattleMaster', points: 320, correct: 9, streak: 2 },
      { id: 4, username: 'ShadowNinja', points: 290, correct: 8, streak: 4 },
      { id: 5, username: 'PhoenixRise', points: 250, correct: 7, streak: 1 }
    ];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('drs-matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('drs-predictions', JSON.stringify(userPredictions));
  }, [userPredictions]);

  useEffect(() => {
    localStorage.setItem('drs-prediction-leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Get user's total points
  const getUserPoints = () => {
    return Object.values(userPredictions).reduce((sum, p) => sum + (p.points || 0), 0);
  };

  // Get user's correct predictions count
  const getUserCorrectCount = () => {
    return Object.values(userPredictions).filter(p => p.points > 0).length;
  };

  // Make a prediction
  const makePrediction = (matchId, predictedWinner, predictedScore1, predictedScore2) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || match.status !== 'upcoming') return;
    if (userPredictions[matchId]) return; // Already predicted

    setUserPredictions(prev => ({
      ...prev,
      [matchId]: {
        predictedWinner,
        predictedScore1,
        predictedScore2,
        timestamp: new Date().toISOString(),
        points: null // Will be calculated when match completes
      }
    }));
  };

  // Update prediction (if allowed)
  const updatePrediction = (matchId, predictedWinner, predictedScore1, predictedScore2) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || match.status !== 'upcoming') return;

    setUserPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        predictedWinner,
        predictedScore1,
        predictedScore2,
        timestamp: new Date().toISOString()
      }
    }));
  };

  // Calculate points for a prediction
  const calculatePoints = (prediction, matchResult) => {
    if (!prediction || !matchResult) return 0;

    const { predictedWinner, predictedScore1, predictedScore2 } = prediction;
    const { winner, score1, score2 } = matchResult;

    // Exact score
    if (predictedScore1 === score1 && predictedScore2 === score2) {
      return PREDICTION_POINTS.EXACT_SCORE;
    }

    // Correct winner
    if (
      (predictedWinner === 1 && winner === 1) ||
      (predictedWinner === 2 && winner === 2)
    ) {
      return PREDICTION_POINTS.CORRECT_WINNER;
    }

    return PREDICTION_POINTS.WRONG;
  };

  // Complete a match and calculate predictions
  const completeMatch = (matchId, result) => {
    // Update match result
    setMatches(prev => prev.map(m => 
      m.id === matchId 
        ? { ...m, status: 'completed', result } 
        : m
    ));

    // Calculate points for all predictions on this match
    const updatedPredictions = { ...userPredictions };
    
    Object.keys(updatedPredictions).forEach(predId => {
      if (parseInt(predId) === matchId && updatedPredictions[predId].points === null) {
        const points = calculatePoints(updatedPredictions[predId], result);
        updatedPredictions[predId] = {
          ...updatedPredictions[predId],
          points,
          actualResult: result
        };
      }
    });
    
    setUserPredictions(updatedPredictions);

    // Update leaderboard with user points
    updateLeaderboardWithUserPoints();
  };

  // Update leaderboard with current user's points
  const updateLeaderboardWithUserPoints = () => {
    const userPoints = getUserPoints();
    const userCorrect = getUserCorrectCount();
    
    setLeaderboard(prev => {
      const existingIndex = prev.findIndex(u => u.username === 'You');
      const userEntry = {
        id: 0,
        username: 'You',
        points: userPoints,
        correct: userCorrect,
        streak: calculateStreak()
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = userEntry;
        return updated.sort((a, b) => b.points - a.points);
      } else {
        return [...prev, userEntry].sort((a, b) => b.points - a.points);
      }
    });
  };

  // Calculate current streak
  const calculateStreak = () => {
    let streak = 0;
    const completedMatches = matches.filter(m => m.status === 'completed');
    
    for (let i = completedMatches.length - 1; i >= 0; i--) {
      const match = completedMatches[i];
      const prediction = userPredictions[match.id];
      
      if (prediction && prediction.points > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Get upcoming matches
  const getUpcomingMatches = () => {
    return matches.filter(m => m.status === 'upcoming');
  };

  // Get completed matches
  const getCompletedMatches = () => {
    return matches.filter(m => m.status === 'completed');
  };

  // Get user's prediction for a specific match
  const getUserPrediction = (matchId) => {
    return userPredictions[matchId] || null;
  };

  // Check if user can still predict
  const canPredict = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || match.status !== 'upcoming') return false;
    
    // Check if match is within 1 hour of start
    const matchTime = new Date(match.scheduledTime).getTime();
    const now = Date.now();
    const hoursUntilMatch = (matchTime - now) / (1000 * 60 * 60);
    
    return hoursUntilMatch > 1;
  };

  const value = {
    matches,
    userPredictions,
    leaderboard,
    getUserPoints,
    getUserCorrectCount,
    makePrediction,
    updatePrediction,
    completeMatch,
    getUpcomingMatches,
    getCompletedMatches,
    getUserPrediction,
    canPredict,
    calculateStreak,
    PREDICTION_POINTS
  };

  return (
    <PredictionsContext.Provider value={value}>
      {children}
    </PredictionsContext.Provider>
  );
}

export function usePredictions() {
  const context = useContext(PredictionsContext);
  if (!context) {
    throw new Error('usePredictions must be used within a PredictionsProvider');
  }
  return context;
}

export default PredictionsContext;

