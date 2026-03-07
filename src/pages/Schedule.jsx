import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Demo matches data
const matches = [
  {
    id: 1,
    team1: "Team DRS",
    team2: "Team Venom",
    game: "PUBG Mobile",
    date: "2025-01-25",
    time: "18:00",
    tournament: "DRS Pro League",
    status: "upcoming",
    stream: true
  },
  {
    id: 2,
    team1: "Team DRS",
    team2: "Team Dragon",
    game: "PUBG Mobile",
    date: "2025-01-26",
    time: "15:00",
    tournament: "DRS Championship",
    status: "upcoming",
    stream: true
  },
  {
    id: 3,
    team1: "Team Wolf",
    team2: "Team Frost",
    game: "PUBG Mobile",
    date: "2025-01-24",
    time: "20:00",
    tournament: "Weekly Showdown",
    status: "completed",
    result: "Team Wolf won 2-1",
    stream: false
  },
  {
    id: 4,
    team1: "Team DRS",
    team2: "Team Shadow",
    game: "PUBG Mobile",
    date: "2025-01-23",
    time: "17:00",
    tournament: "PMNC UAE 2025",
    status: "completed",
    result: "Team DRS achieved #4 Position",
    stream: true
  },
  {
    id: 5,
    team1: "Team DRS",
    team2: "Team Blaze",
    game: "PUBG Mobile",
    date: "2025-01-27",
    time: "19:00",
    tournament: "DRS Championship Qualifiers",
    status: "upcoming",
    stream: false
  },
  {
    id: 6,
    team1: "Team DRS",
    team2: "Team Storm",
    game: "PUBG Mobile",
    date: "2025-01-28",
    time: "16:00",
    tournament: "DRS Pro League",
    status: "upcoming",
    stream: true
  }
];

function Schedule() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedDate, setSelectedDate] = useState(null);

  const upcomingMatches = matches.filter(m => m.status === "upcoming");
  const completedMatches = matches.filter(m => m.status === "completed");

  // Get unique dates for calendar
  const dates = [...new Set(matches.map(m => m.date))].sort();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="schedule-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Match <span className="highlight">Schedule</span></h1>
            <p>Upcoming matches and past results</p>
          </motion.div>
        </section>

        {/* Schedule Content */}
        <section className="schedule-content">
          {/* Calendar Preview */}
          <div className="calendar-section">
            <h2 className="section-title">This Month</h2>
            <div className="calendar-grid">
              {dates.map((date, index) => {
                const dateMatches = matches.filter(m => m.date === date);
                const hasLive = dateMatches.some(m => m.status === "live");
                return (
                  <motion.div
                    key={date}
                    className={`calendar-day ${selectedDate === date ? 'selected' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedDate(selectedDate === date ? null : date)}
                  >
                    <span className="day-name">{formatDate(date).split(',')[0]}</span>
                    <span className="day-number">{new Date(date).getDate()}</span>
                    {hasLive && <span className="live-dot">🔴</span>}
                    <span className="match-count">{dateMatches.length} matches</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tabs */}
          <div className="schedule-tabs">
            <button 
              className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              📅 Upcoming Matches
            </button>
            <button 
              className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              ✅ Completed
            </button>
          </div>

          {/* Matches List */}
          <div className="matches-list">
            {(activeTab === "upcoming" ? upcomingMatches : completedMatches)
              .filter(m => !selectedDate || m.date === selectedDate)
              .map((match, index) => (
              <motion.div
                key={match.id}
                className="match-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="match-header">
                  <span className="match-tournament">{match.tournament}</span>
                  <span className="match-game">{match.game}</span>
                </div>

                <div className="match-teams">
                  <div className="team team1">
                    <span className="team-logo">🎮</span>
                    <span className="team-name">{match.team1}</span>
                  </div>
                  <div className="match-vs">VS</div>
                  <div className="team team2">
                    <span className="team-logo">🎮</span>
                    <span className="team-name">{match.team2}</span>
                  </div>
                </div>

                {match.status === "upcoming" ? (
                  <div className="match-schedule">
                    <div className="schedule-info">
                      <span className="match-date">📅 {formatDate(match.date)}</span>
                      <span className="match-time">🕐 {formatTime(match.time)}</span>
                    </div>
                    <div className="match-actions">
                      {match.stream && (
                        <button className="stream-btn">
                          🔴 Watch Live
                        </button>
                      )}
                      <button className="remind-btn">
                        🔔 Remind Me
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="match-result">
                    <span className="result-text">{match.result}</span>
                    {match.stream && (
                      <button className="watch-btn">
                        🎬 Watch Replay
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Schedule;
