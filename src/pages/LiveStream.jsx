import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Demo stream data
const streams = [
  {
    id: 1,
    title: "DRS Pro League Grand Finals",
    streamer: "DRS Esports",
    game: "Valorant",
    viewers: 12500,
    thumbnail: "/stream-1.jpg",
    live: true,
    platform: "twitch"
  },
  {
    id: 2,
    title: "Practice Session - Ranked Grind",
    streamer: "ProGamer_XYZ",
    game: "CS2",
    viewers: 3200,
    thumbnail: "/stream-2.jpg",
    live: true,
    platform: "youtube"
  },
  {
    id: 3,
    title: "Weekly Scrims",
    streamer: "Team DRS",
    game: "PUBG",
    viewers: 0,
    thumbnail: "/stream-3.jpg",
    live: false,
    scheduled: "2025-01-25 18:00",
    platform: "twitch"
  }
];

const upcomingStreams = [
  {
    id: 1,
    title: "DRS Championship Qualifiers",
    streamer: "DRS Esports",
    game: "Valorant",
    scheduledDate: "2025-01-25 15:00",
    thumbnail: "/stream-upcoming-1.jpg"
  },
  {
    id: 2,
    title: "Meet the Players Q&A",
    streamer: "DRS Esports",
    game: "General",
    scheduledDate: "2025-01-26 19:00",
    thumbnail: "/stream-upcoming-2.jpg"
  },
  {
    id: 3,
    title: "Tutorial: Advanced Strats",
    streamer: "Coach_DRS",
    game: "Valorant",
    scheduledDate: "2025-01-27 20:00",
    thumbnail: "/stream-upcoming-3.jpg"
  }
];

function LiveStream() {
  const [activeTab, setActiveTab] = useState("live");
  const [selectedStream, setSelectedStream] = useState(null);

  const liveStreams = streams.filter(s => s.live);

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="stream-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Live <span className="highlight">Streams</span></h1>
            <p>Watch DRS Esports live matches and highlights</p>
          </motion.div>
        </section>

        {/* Stream Tabs */}
        <section className="stream-content">
          <div className="stream-tabs">
            <button 
              className={`tab-btn ${activeTab === "live" ? "active" : ""}`}
              onClick={() => setActiveTab("live")}
            >
              🔴 Live Now
            </button>
            <button 
              className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              📅 Upcoming
            </button>
            <button 
              className={`tab-btn ${activeTab === "highlights" ? "active" : ""}`}
              onClick={() => setActiveTab("highlights")}
            >
              🎬 Highlights
            </button>
          </div>

          {/* Live Streams */}
          {activeTab === "live" && (
            <div className="live-section">
              {liveStreams.length > 0 ? (
                <>
                  {/* Featured Stream */}
                  <motion.div 
                    className="featured-stream"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="featured-player">
                      <div className="stream-placeholder large">
                        <div className="stream-embed">
                          <div className="live-indicator">🔴 LIVE</div>
                          <div className="stream-title">{liveStreams[0].title}</div>
                          <div className="streamer-info">
                            <span>🎮 {liveStreams[0].streamer}</span>
                            <span>👁️ {liveStreams[0].viewers.toLocaleString()} viewers</span>
                          </div>
                          <div className="stream-placeholder-content">
                            <span>📺</span>
                            <p>Stream Embed Area</p>
                            <p className="stream-platform">{liveStreams[0].platform.toUpperCase()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Other Live Streams */}
                  <h2 className="section-title">Other Live Streams</h2>
                  <div className="streams-grid">
                    {liveStreams.slice(1).map((stream, index) => (
                      <motion.div
                        key={stream.id}
                        className="stream-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedStream(stream)}
                      >
                        <div className="stream-thumbnail">
                          <div className="stream-placeholder small">
                            <span>🎮</span>
                          </div>
                          <div className="live-badge">🔴 LIVE</div>
                          <div className="viewer-count">👁️ {stream.viewers.toLocaleString()}</div>
                        </div>
                        <div className="stream-info">
                          <h3>{stream.title}</h3>
                          <p>{stream.streamer} • {stream.game}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-streams">
                  <span>📺</span>
                  <h3>No Live Streams</h3>
                  <p>Check back later for live content</p>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Streams */}
          {activeTab === "upcoming" && (
            <div className="upcoming-section">
              <h2 className="section-title">Scheduled Streams</h2>
              <div className="upcoming-grid">
                {upcomingStreams.map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    className="upcoming-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="upcoming-thumbnail">
                      <div className="stream-placeholder small">
                        <span>📅</span>
                      </div>
                    </div>
                    <div className="upcoming-info">
                      <h3>{stream.title}</h3>
                      <p>{stream.streamer} • {stream.game}</p>
                      <div className="schedule-time">
                        <span>🕐 {stream.scheduledDate}</span>
                      </div>
                      <button className="remind-btn">🔔 Set Reminder</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {activeTab === "highlights" && (
            <div className="highlights-section">
              <h2 className="section-title">Recent Highlights</h2>
              <div className="highlights-grid">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <motion.div
                    key={item}
                    className="highlight-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item * 0.05 }}
                  >
                    <div className="highlight-thumbnail">
                      <div className="video-placeholder">
                        <span>▶️</span>
                      </div>
                      <div className="video-duration">12:34</div>
                    </div>
                    <div className="highlight-info">
                      <h3>Amazing Plays - DRS Championship 2025</h3>
                      <p>DRS Esports • 25K views • 2 days ago</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}

export default LiveStream;
