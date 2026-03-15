import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Meta from "../components/Meta";
import { fetchTournaments, mapTournamentRow } from "../lib/tournamentsRepo";
import {
  createIndividualRegistration,
  createTeamRegistration,
  fetchClanMembersByTeamSlug,
} from "../lib/tournamentRegistrationsRepo";

// Registration form component
function RegistrationForm({ tournament, onClose, onSubmit }) {
  const [mode, setMode] = useState("team"); // team | individual
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [clanMembers, setClanMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [formData, setFormData] = useState({
    teamName: "",
    captainName: "",
    email: "",
    phone: "",
    players: ["", "", "", "", ""],
    substitute: "",
    // individual
    memberId: "",
    ign: "",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingMembers(true);
        const { data, error } = await fetchClanMembersByTeamSlug("drs-esports");
        if (!mounted) return;
        if (error) {
          console.error("Supabase clan_members fetch failed:", error);
          setClanMembers([]);
          return;
        }
        setClanMembers(data || []);
      } finally {
        if (!mounted) return;
        setLoadingMembers(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = value;
    setFormData({ ...formData, players: newPlayers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "team") {
      try {
        setSaving(true);
        setToast(null);

        const payload = {
          tournament_id: tournament.id,
          tournament_name: tournament.name,
          registration_type: "team",
          team_slug: null,
          team_name: String(formData.teamName || "").trim(),
          captain_name: String(formData.captainName || "").trim(),
          players: (formData.players || []).map((p) => String(p || "").trim()).filter(Boolean),
          substitute: formData.substitute ? String(formData.substitute).trim() : null,
          email: formData.email || null,
          phone: formData.phone || null,
        };

        if (!payload.team_name || !payload.captain_name || !payload.email || !payload.phone) {
          setToast({ type: "error", message: "Team name, captain, email and phone are required" });
          return;
        }

        if (!payload.players || payload.players.length < 5) {
          setToast({ type: "error", message: "Please add at least 5 players" });
          return;
        }

        const { error } = await createTeamRegistration(payload);
        if (error) {
          console.error("Supabase team registration failed:", error);
          setToast({ type: "error", message: error.message || "Failed to register team" });
          return;
        }

        setToast({ type: "success", message: "Team registered successfully!" });
        setTimeout(() => onClose(), 700);
      } catch (err) {
        console.error("Supabase team registration crashed:", err);
        setToast({ type: "error", message: "Failed to register team" });
      } finally {
        setSaving(false);
      }

      // keep local callback for any legacy UI
      onSubmit(tournament, formData);
      return;
    }

    try {
      setSaving(true);
      setToast(null);

      const member = clanMembers.find((m) => String(m.id) === String(formData.memberId));
      const payload = {
        tournament_id: tournament.id,
        tournament_name: tournament.name,
        registration_type: "individual",
        team_slug: "drs-esports",
        member_id: member?.id ?? null,
        member_name: member?.name ?? null,
        ign: formData.ign || member?.ign || member?.name || null,
        email: formData.email || null,
        phone: formData.phone || null,
      };

      const { error } = await createIndividualRegistration(payload);
      if (error) {
        console.error("Supabase individual registration failed:", error);
        setToast({ type: "error", message: error.message || "Failed to register" });
        return;
      }

      setToast({ type: "success", message: "Registered successfully!" });
      setTimeout(() => onClose(), 700);
    } catch (err) {
      console.error("Supabase individual registration crashed:", err);
      setToast({ type: "error", message: "Failed to register" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-content tournament-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Register for {tournament.name}</h2>
        <p className="modal-subtitle">{tournament.game} • {tournament.prizePool}</p>

        <div className="form-group">
          <label>Registration Type</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="team">Register a Team</option>
            <option value="individual">Register Individual (Clan Member)</option>
          </select>
        </div>

        {toast ? (
          <div
            className={toast.type === "error" ? "error-message" : "success-message"}
            style={{ marginBottom: 16 }}
          >
            {toast.message}
          </div>
        ) : null}
        
        <form onSubmit={handleSubmit} className="registration-form">
          {mode === "team" ? (
            <div className="form-group">
              <label>Team Name *</label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                placeholder="Enter your team name"
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Select Clan Member *</label>
              <select
                value={formData.memberId}
                onChange={(e) => {
                  const memberId = e.target.value;
                  const member = clanMembers.find((m) => String(m.id) === String(memberId));
                  setFormData((p) => ({
                    ...p,
                    memberId,
                    ign: p.ign || member?.ign || member?.name || "",
                  }));
                }}
                required
                disabled={loadingMembers}
              >
                <option value="">{loadingMembers ? "Loading…" : "Select a member"}</option>
                {clanMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}{m.ign ? ` (${m.ign})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {mode === "team" ? (
            <div className="form-group">
              <label>Captain Name *</label>
              <input
                type="text"
                name="captainName"
                value={formData.captainName}
                onChange={handleChange}
                placeholder="Team captain name"
                required
              />
            </div>
          ) : null}
          
          <div className="form-group">
            <label>Email {mode === "team" ? "*" : "(optional)"}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
              required={mode === "team"}
            />
          </div>
          
          <div className="form-group">
            <label>Phone {mode === "team" ? "*" : "(optional)"}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required={mode === "team"}
            />
          </div>
          
          {mode === "team" ? (
            <div className="form-group">
              <label>Team Players (5 required)</label>
              {formData.players.map((player, index) => (
                <input
                  key={index}
                  type="text"
                  value={player}
                  onChange={(e) => handlePlayerChange(index, e.target.value)}
                  placeholder={`Player ${index + 1} name`}
                  required={index < 5}
                />
              ))}
            </div>
          ) : (
            <div className="form-group">
              <label>In-Game Name (optional)</label>
              <input
                type="text"
                name="ign"
                value={formData.ign}
                onChange={handleChange}
                placeholder="Your IGN"
              />
            </div>
          )}
          
          {mode === "team" ? (
            <div className="form-group">
              <label>Substitute Player (optional)</label>
              <input
                type="text"
                name="substitute"
                value={formData.substitute}
                onChange={handleChange}
                placeholder="Substitute player name"
              />
            </div>
          ) : null}
          
          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? "Submitting…" : "Submit Registration"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Bracket component
function TournamentBracket({ tournament }) {
  const matches = [
    { round: "Quarter Finals", games: [
      { team1: "Team Alpha", team2: "Team Bravo", score: "2-0", winner: 1 },
      { team1: "Team Charlie", team2: "Team Delta", score: "1-2", winner: 2 },
      { team1: "Team Echo", team2: "Team Foxtrot", score: "2-1", winner: 1 },
      { team1: "Team Golf", team2: "Team Hotel", score: "0-2", winner: 2 }
    ]},
    { round: "Semi Finals", games: [
      { team1: "Team Alpha", team2: "Team Delta", score: "2-1", winner: 1 },
      { team1: "Team Echo", team2: "Team Hotel", score: "1-2", winner: 2 }
    ]},
    { round: "Finals", games: [
      { team1: "Team Alpha", team2: "Team Hotel", score: "3-2", winner: 1 }
    ]}
  ];

  return (
    <div className="tournament-bracket">
      {matches.map((round, roundIndex) => (
        <div key={roundIndex} className="bracket-round">
          <h3>{round.round}</h3>
          <div className="bracket-games">
            {round.games.map((game, gameIndex) => (
              <div key={gameIndex} className="bracket-game">
                <div className={`game-team ${game.winner === 1 ? 'winner' : ''}`}>
                  <span>{game.team1}</span>
                  {game.winner === 1 && <span className="winner-badge">🏆</span>}
                </div>
                <div className="game-score">{game.score}</div>
                <div className={`game-team ${game.winner === 2 ? 'winner' : ''}`}>
                  <span>{game.team2}</span>
                  {game.winner === 2 && <span className="winner-badge">🏆</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Tournaments() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showBracket, setShowBracket] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingTournaments(true);
        const { data, error } = await fetchTournaments();
        if (!mounted) return;
        if (error) {
          console.error("Supabase tournaments fetch failed:", error);
          setTournaments([]);
          return;
        }
        setTournaments((data || []).map(mapTournamentRow).filter(Boolean));
      } finally {
        if (!mounted) return;
        setLoadingTournaments(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const pageSize = 6;

  // keep page in URL (?page=2) so pagination is shareable
  const pageFromUrl = Number(searchParams.get("page") || "1");
  const [page, setPage] = useState(Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1);

  useEffect(() => {
    const next = Number(searchParams.get("page") || "1");
    const normalized = Number.isFinite(next) && next > 0 ? next : 1;
    if (normalized !== page) setPage(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => (activeTab === "all" ? true : t.status === activeTab));
  }, [activeTab]);

  const pageCount = Math.max(1, Math.ceil(filteredTournaments.length / pageSize));

  // Clamp page if filters reduce total results
  useEffect(() => {
    if (page > pageCount) {
      setSearchParams({ page: String(pageCount) }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount]);

  const pagedTournaments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTournaments.slice(start, start + pageSize);
  }, [filteredTournaments, page]);

  const goToPage = (nextPage) => {
    const clamped = Math.min(Math.max(1, nextPage), pageCount);
    setSearchParams({ page: String(clamped) }, { replace: false });
  };

  const handleRegister = (tournament) => {
    setSelectedTournament(tournament);
    setShowRegistration(true);
  };

  const handleSubmitRegistration = (tournament, data) => {
    // Keep local history only (Supabase is handled inside RegistrationForm)
    setRegistrations([...registrations, { tournament: tournament.name, ...data, date: new Date().toISOString() }]);
    setShowRegistration(false);
    setSelectedTournament(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "live": return <span className="status-badge status-live">🔴 Live</span>;
      case "upcoming": return <span className="status-badge status-upcoming">📅 Upcoming</span>;
      case "completed": return <span className="status-badge status-completed">✅ Completed</span>;
      default: return null;
    }
  };

  return (
    <>
      <Meta />
      <Navbar />
      <div className="page-container" id="main-content">
        {/* Hero Section */}
        <section className="tournaments-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Tournaments</h1>
            <p>Compete in the ultimate esports competitions</p>
          </motion.div>
        </section>

        {/* Tournament Tabs */}
        <section className="tournaments-content">
          <div className="tournament-tabs">
            <button 
              className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("upcoming");
                goToPage(1);
              }}
            >
              Upcoming
            </button>
            <button 
              className={`tab-btn ${activeTab === "live" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("live");
                goToPage(1);
              }}
            >
              Live Now
            </button>
            <button 
              className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("completed");
                goToPage(1);
              }}
            >
              Completed
            </button>
            <button 
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("all");
                goToPage(1);
              }}
            >
              All
            </button>
          </div>

          {/* Tournament Cards */}
          <div className="tournaments-grid">
            {loadingTournaments ? (
              <div className="empty-state" style={{ gridColumn: "1 / -1", padding: "24px" }}>
                <h3 style={{ marginBottom: 8 }}>Loading tournaments…</h3>
                <p style={{ opacity: 0.8 }}>Please wait</p>
              </div>
            ) : pagedTournaments.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: "1 / -1", padding: "24px" }}>
                <h3 style={{ marginBottom: 8 }}>No tournaments found</h3>
                <p style={{ opacity: 0.8 }}>Try switching tabs to view other events.</p>
              </div>
            ) : (
              pagedTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                className="tournament-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="tournament-image">
                  <div className="tournament-placeholder">
                    <span>🎮</span>
                  </div>
                  {getStatusBadge(tournament.status)}
                </div>
                <div className="tournament-info">
                  <div className="tournament-game">{tournament.game}</div>
                  <h3>{tournament.name}</h3>
                  <p className="tournament-description">{tournament.description}</p>
                  <div className="tournament-details">
                    <div className="detail">
                      <span className="detail-label">Prize Pool</span>
                      <span className="detail-value">{tournament.prizePool}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{tournament.date}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Teams</span>
                      <span className="detail-value">{tournament.registered}/{tournament.teams}</span>
                    </div>
                  </div>
                  <div className="tournament-actions">
                    {tournament.status !== "completed" && (
                      <button 
                        className="register-btn"
                        onClick={() => handleRegister(tournament)}
                      >
                        Register Now
                      </button>
                    )}
                    {(tournament.status === "completed" || tournament.status === "live") && (
                      <button 
                        className="bracket-btn"
                        onClick={() => setShowBracket(tournament.id)}
                      >
                        View Bracket
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
            )}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="pagination" style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
              <button className="tab-btn" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
                Prev
              </button>
              {Array.from({ length: pageCount }).map((_, i) => {
                const p = i + 1;
                const active = p === page;
                return (
                  <button
                    key={p}
                    className={`tab-btn ${active ? "active" : ""}`}
                    onClick={() => goToPage(p)}
                    aria-current={active ? "page" : undefined}
                  >
                    {p}
                  </button>
                );
              })}
              <button className="tab-btn" onClick={() => goToPage(page + 1)} disabled={page >= pageCount}>
                Next
              </button>
            </div>
          )}

          {/* Bracket Modal */}
          {showBracket && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowBracket(null)}
            >
              <motion.div 
                className="modal-content bracket-modal"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={() => setShowBracket(null)}>×</button>
                <h2>Tournament Bracket</h2>
                <TournamentBracket tournament={tournaments.find(t => t.id === showBracket)} />
              </motion.div>
            </motion.div>
          )}
        </section>
      </div>
      <Footer />
      
      {/* Registration Modal */}
      {showRegistration && selectedTournament && (
        <RegistrationForm 
          tournament={selectedTournament}
          onClose={() => { setShowRegistration(false); setSelectedTournament(null); }}
          onSubmit={handleSubmitRegistration}
        />
      )}
    </>
  );
}

export default Tournaments;
