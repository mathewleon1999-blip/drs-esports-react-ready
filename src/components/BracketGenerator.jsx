import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BRACKET_TYPES = {
  SINGLE_ELIMINATION: 'single',
  DOUBLE_ELIMINATION: 'double'
};

const DEFAULT_TEAMS = [
  { id: 1, name: 'DRS Phoenix', seed: 1, logo: '🔥' },
  { id: 2, name: 'Team Velocity', seed: 2, logo: '⚡' },
  { id: 3, name: 'Shadow Riders', seed: 3, logo: '🌑' },
  { id: 4, name: 'Thunder Wolves', seed: 4, logo: '🐺' },
  { id: 5, name: 'Night Hawks', seed: 5, logo: '🦅' },
  { id: 6, name: 'Iron Legion', seed: 6, logo: '🛡️' },
  { id: 7, name: 'Cyber Dragons', seed: 7, logo: '🐉' },
  { id: 8, name: 'Pixel Warriors', seed: 8, logo: '👾' }
];

function BracketGenerator({ tournament }) {
  const [bracketType, setBracketType] = useState(BRACKET_TYPES.SINGLE_ELIMINATION);
  const [teams, setTeams] = useState(DEFAULT_TEAMS);
  const [matches, setMatches] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [showSetup, setShowSetup] = useState(true);
  const [editingMatch, setEditingMatch] = useState(null);

  // Generate initial bracket structure
  const generateBracket = () => {
    const numTeams = teams.length;
    const numRounds = Math.ceil(Math.log2(numTeams));
    const newMatches = [];
    
    // Create matches for each round
    for (let round = 1; round <= numRounds; round++) {
      const matchesInRound = Math.pow(2, numRounds - round);
      
      for (let match = 0; match < matchesInRound; match++) {
        const matchId = `${round}-${match}`;
        
        // Determine teams for first round
        let team1 = null;
        let team2 = null;
        
        if (round === 1) {
          const team1Index = match * 2;
          const team2Index = match * 2 + 1;
          team1 = teams[team1Index] || null;
          team2 = teams[team2Index] || null;
        }
        
        newMatches.push({
          id: matchId,
          round,
          matchNumber: match,
          team1,
          team2,
          score1: 0,
          score2: 0,
          winner: null,
          status: round === 1 ? 'scheduled' : 'pending',
          scheduledTime: null
        });
      }
    }
    
    setMatches(newMatches);
    setShowSetup(false);
    setCurrentRound(1);
  };

  // Update match result
  const updateMatchResult = (matchId, score1, score2) => {
    const matchIndex = matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;
    
    const match = matches[matchIndex];
    const winner = score1 > score2 ? match.team1 : match.team2;
    
    const updatedMatches = [...matches];
    updatedMatches[matchIndex] = {
      ...match,
      score1,
      score2,
      winner,
      status: 'completed'
    };
    
    // Advance winner to next round
    if (match.round < Math.log2(teams.length)) {
      const nextRound = match.round + 1;
      const nextMatchNumber = Math.floor(match.matchNumber / 2);
      const nextMatchId = `${nextRound}-${nextMatchNumber}`;
      const nextMatchIndex = updatedMatches.findIndex(m => m.id === nextMatchId);
      
      if (nextMatchIndex !== -1) {
        const isTopSeed = match.matchNumber % 2 === 0;
        updatedMatches[nextMatchIndex] = {
          ...updatedMatches[nextMatchIndex],
          [isTopSeed ? 'team1' : 'team2']: winner,
          status: updatedMatches[nextMatchIndex].team1 && updatedMatches[nextMatchIndex].team2 
            ? 'scheduled' 
            : 'pending'
        };
      }
    }
    
    setMatches(updatedMatches);
  };

  // Get matches for a specific round
  const getRoundMatches = (round) => {
    return matches.filter(m => m.round === round);
  };

  // Get round name
  const getRoundName = (round) => {
    const totalRounds = Math.log2(teams.length);
    const roundsLeft = totalRounds - round;
    
    if (roundsLeft === 0) return 'Finals';
    if (roundsLeft === 1) return 'Semi Finals';
    if (roundsLeft === 2) return 'Quarter Finals';
    return `Round ${round}`;
  };

  // Add custom team
  const addTeam = (team) => {
    if (teams.length >= 16) return;
    setTeams([...teams, { ...team, id: Date.now() }]);
  };

  // Remove team
  const removeTeam = (teamId) => {
    setTeams(teams.filter(t => t.id !== teamId));
  };

  // Reset bracket
  const resetBracket = () => {
    setShowSetup(true);
    setMatches([]);
    setTeams(DEFAULT_TEAMS);
  };

  // Shuffle teams randomly
  const shuffleTeams = () => {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    setTeams(shuffled);
  };

  if (showSetup) {
    return (
      <div className="bracket-setup">
        <h2>🏆 Tournament Bracket Setup</h2>
        
        <div className="setup-section">
          <h3>Select Teams ({teams.length}/16)</h3>
          <div className="teams-list">
            {teams.map((team, index) => (
              <motion.div 
                key={team.id}
                className="team-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="team-logo">{team.logo}</span>
                <span className="team-seed">#{team.seed}</span>
                <span className="team-name">{team.name}</span>
                <button 
                  className="remove-btn"
                  onClick={() => removeTeam(team.id)}
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
          
          <div className="add-team-form">
            <input 
              type="text"
              placeholder="Team Name"
              id="newTeamName"
            />
            <input 
              type="text"
              placeholder="Emoji Logo"
              id="newTeamLogo"
              maxLength={2}
            />
            <button onClick={() => {
              const name = document.getElementById('newTeamName').value;
              const logo = document.getElementById('newTeamLogo').value || '🎮';
              if (name) {
                addTeam({ name, logo, seed: teams.length + 1 });
                document.getElementById('newTeamName').value = '';
                document.getElementById('newTeamLogo').value = '';
              }
            }}>
              Add Team
            </button>
          </div>
          
          <button className="shuffle-btn" onClick={shuffleTeams}>
            🔀 Shuffle Seeds
          </button>
        </div>

        <div className="setup-section">
          <h3>Bracket Type</h3>
          <div className="bracket-types">
            <button 
              className={bracketType === BRACKET_TYPES.SINGLE_ELIMINATION ? 'active' : ''}
              onClick={() => setBracketType(BRACKET_TYPES.SINGLE_ELIMINATION)}
            >
              Single Elimination
            </button>
            <button 
              className={bracketType === BRACKET_TYPES.DOUBLE_ELIMINATION ? 'active' : ''}
              onClick={() => setBracketType(BRACKET_TYPES.DOUBLE_ELIMINATION)}
              disabled
            >
              Double Elimination (Coming Soon)
            </button>
          </div>
        </div>

        <div className="setup-actions">
          <button 
            className="generate-btn"
            onClick={generateBracket}
            disabled={teams.length < 2}
          >
            Generate Bracket
          </button>
        </div>
      </div>
    );
  }

  const totalRounds = Math.log2(teams.length);

  return (
    <div className="bracket-generator">
      <div className="bracket-header">
        <h2>🏆 Tournament Bracket</h2>
        <div className="bracket-controls">
          <button onClick={resetBracket}>Reset Bracket</button>
        </div>
      </div>

      <div className="bracket-container">
        <div className="bracket-rounds">
          {Array.from({ length: totalRounds }, (_, roundIndex) => {
            const round = roundIndex + 1;
            const roundMatches = getRoundMatches(round);
            
            return (
              <div key={round} className="round-column">
                <h3 className="round-title">{getRoundName(round)}</h3>
                <div className="round-matches">
                  {roundMatches.map((match, matchIndex) => (
                    <motion.div 
                      key={match.id}
                      className={`match-card ${match.status}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: matchIndex * 0.1 }}
                    >
                      <div 
                        className={`team ${match.winner?.id === match.team1?.id ? 'winner' : ''} ${!match.team1 ? 'empty' : ''}`}
                        onClick={() => match.team1 && setEditingMatch(match)}
                      >
                        {match.team1 ? (
                          <>
                            <span className="team-logo">{match.team1.logo}</span>
                            <span className="team-name">{match.team1.name}</span>
                            <span className="team-score">{match.score1}</span>
                          </>
                        ) : (
                          <span className="tbd">TBD</span>
                        )}
                      </div>
                      <div 
                        className={`team ${match.winner?.id === match.team2?.id ? 'winner' : ''} ${!match.team2 ? 'empty' : ''}`}
                        onClick={() => match.team2 && setEditingMatch(match)}
                      >
                        {match.team2 ? (
                          <>
                            <span className="team-logo">{match.team2.logo}</span>
                            <span className="team-name">{match.team2.name}</span>
                            <span className="team-score">{match.score2}</span>
                          </>
                        ) : (
                          <span className="tbd">TBD</span>
                        )}
                      </div>
                      {match.status === 'completed' && (
                        <div className="match-status">✓ Completed</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Match Modal */}
      <AnimatePresence>
        {editingMatch && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingMatch(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
            >
              <h2>Update Match Result</h2>
              <div className="match-teams">
                <div className="team-edit">
                  <span>{editingMatch.team1?.logo} {editingMatch.team1?.name}</span>
                  <input 
                    type="number"
                    min={0}
                    value={editingMatch.score1}
                    onChange={(e) => {
                      const newMatch = { ...editingMatch, score1: parseInt(e.target.value) || 0 };
                      setEditingMatch(newMatch);
                    }}
                  />
                </div>
                <div className="vs">VS</div>
                <div className="team-edit">
                  <span>{editingMatch.team2?.logo} {editingMatch.team2?.name}</span>
                  <input 
                    type="number"
                    min={0}
                    value={editingMatch.score2}
                    onChange={(e) => {
                      const newMatch = { ...editingMatch, score2: parseInt(e.target.value) || 0 };
                      setEditingMatch(newMatch);
                    }}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setEditingMatch(null)}
                >
                  Cancel
                </button>
                <button 
                  className="save-btn"
                  onClick={() => {
                    updateMatchResult(
                      editingMatch.id, 
                      editingMatch.score1, 
                      editingMatch.score2
                    );
                    setEditingMatch(null);
                  }}
                >
                  Save Result
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BracketGenerator;

