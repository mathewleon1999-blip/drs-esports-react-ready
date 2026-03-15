import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchMatches } from "../lib/matchesRepo";

function Schedule() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedDate, setSelectedDate] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const rows = await fetchMatches();
        if (cancelled) return;

        const normalized = (rows ?? []).map((m) => {
          const start = m.start_time ? new Date(m.start_time) : null;
          const date = start ? start.toISOString().slice(0, 10) : (m.date ?? "");
          const time = start
            ? start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
            : (m.time ?? "00:00");

          return {
            id: m.id,
            team1: m.team1,
            team2: m.team2,
            game: m.game ?? "PUBG Mobile",
            date,
            time,
            tournament: m.tournament ?? "",
            status: m.status ?? "upcoming", // upcoming | live | completed
            stream: Boolean(m.stream_url),
            stream_url: m.stream_url ?? null,
            result: m.result ?? null,
          };
        });

        setMatches(normalized);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load schedule");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const upcomingMatches = useMemo(() => matches.filter((m) => m.status === "upcoming" || m.status === "live"), [matches]);
  const completedMatches = useMemo(() => matches.filter((m) => m.status === "completed"), [matches]);

  // Get unique dates for calendar
  const dates = useMemo(() => [...new Set(matches.map((m) => m.date).filter(Boolean))].sort(), [matches]);

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
          {loading && (
            <div className="loading-state" style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
              Loading schedule...
            </div>
          )}

          {error && (
            <div className="error-state" style={{ textAlign: "center", padding: 30, color: "#ff4444" }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="matches-list">
              {(activeTab === "upcoming" ? upcomingMatches : completedMatches)
                .filter((m) => !selectedDate || m.date === selectedDate)
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
                      {match.stream && match.stream_url && (
                        <a className="stream-btn" href={match.stream_url} target="_blank" rel="noreferrer">
                          🔴 Watch Live
                        </a>
                      )}
                      <button className="remind-btn" disabled>
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
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Schedule;
