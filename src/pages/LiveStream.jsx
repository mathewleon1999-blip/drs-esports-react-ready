import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const toYouTubeEmbedUrl = (urlOrId) => {
  if (!urlOrId) return null;

  // If it's already an embed URL
  if (/youtube\.com\/embed\//.test(urlOrId)) return urlOrId;

  // Extract ID from common YouTube formats
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - VIDEO_ID
  let id = urlOrId;

  const watchMatch = urlOrId.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) id = watchMatch[1];

  const shortMatch = urlOrId.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch?.[1]) id = shortMatch[1];

  // Basic sanity
  if (!/^[a-zA-Z0-9_-]{6,}$/.test(id)) return null;

  return `https://www.youtube.com/embed/${id}`;
};

// Demo stream data (YouTube items include a playable videoId/url)
const streams = [
  {
    id: 1,
    title: "DRS Pro League Grand Finals",
    streamer: "DRS Esports",
    game: "Valorant",
    viewers: 12500,
    thumbnail: "/stream-1.jpg",
    live: true,
    platform: "twitch",
  },
  {
    id: 2,
    title: "Practice Session - Ranked Grind",
    streamer: "ProGamer_XYZ",
    game: "CS2",
    viewers: 3200,
    thumbnail: "/stream-2.jpg",
    live: true,
    platform: "youtube",
    // Replace this with your real YouTube Live / Video ID or URL
    youtube: {
      url: "https://www.youtube.com/live/PQxomB2-C34?si=MvfCgQpPSPkHJ4vp",
    },
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
    platform: "twitch",
  },
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

  const liveStreams = useMemo(() => streams.filter((s) => s.live), []);

  const featuredStream = useMemo(() => {
    // Prefer a YouTube stream as featured so it actually plays on-site.
    return liveStreams.find((s) => s.platform === "youtube") || liveStreams[0] || null;
  }, [liveStreams]);

  const featuredEmbedUrl = useMemo(() => {
    if (!featuredStream || featuredStream.platform !== "youtube") return null;
    return toYouTubeEmbedUrl(featuredStream.youtube?.videoId || featuredStream.youtube?.url);
  }, [featuredStream]);

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
                      <div
                        style={{
                          width: "100%",
                          maxWidth: 1100,
                          margin: "0 auto",
                          borderRadius: 16,
                          overflow: "hidden",
                          border: "1px solid rgba(0, 212, 255, 0.18)",
                          background: "rgba(10, 14, 20, 0.6)",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                        }}
                      >
                        {/* 16:9 responsive player */}
                        <div style={{ position: "relative", paddingTop: "56.25%" }}>
                          {featuredEmbedUrl ? (
                            <iframe
                              title={featuredStream?.title || "YouTube Live"}
                              src={featuredEmbedUrl}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: 0,
                              }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          ) : (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                gap: 10,
                                color: "var(--text-muted)",
                                padding: 20,
                                textAlign: "center",
                              }}
                            >
                              <div style={{ fontSize: 42 }}>📺</div>
                              <div style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--text-light)" }}>
                                {featuredStream?.title}
                              </div>
                              <div>
                                This featured stream is on {featuredStream?.platform?.toUpperCase()}. Only YouTube streams can be embedded and played directly on this page.
                              </div>
                            </div>
                          )}

                          {/* Live badge */}
                          <div
                            style={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              background: "rgba(255, 0, 110, 0.9)",
                              color: "#fff",
                              padding: "6px 10px",
                              borderRadius: 10,
                              fontFamily: "'Orbitron', sans-serif",
                              fontSize: 12,
                              letterSpacing: 1,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              boxShadow: "0 10px 25px rgba(255,0,110,0.25)",
                            }}
                          >
                            🔴 LIVE
                          </div>
                        </div>

                        {/* Meta */}
                        {featuredStream && (
                          <div style={{ padding: "14px 16px" }}>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                gap: 10,
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    color: "var(--text-light)",
                                    fontSize: 14,
                                    marginBottom: 4,
                                  }}
                                >
                                  {featuredStream.title}
                                </div>
                                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                                  🎮 {featuredStream.streamer} • {featuredStream.game}
                                </div>
                              </div>
                              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                                👁️ {featuredStream.viewers.toLocaleString()} watching
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Other Live Streams */}
                  <h2 className="section-title">Other Live Streams</h2>
                  <div className="streams-grid">
                    {liveStreams
                      .filter((s) => s.id !== featuredStream?.id)
                      .map((stream, index) => (
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
