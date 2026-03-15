import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Meta from "../components/Meta";
import { supabase } from "../lib/supabaseClient";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("clan_members")
          .select("*")
          .eq("team_slug", "drs-esports")
          .order("created_at", { ascending: false });

        if (!mounted) return;

        if (error) {
          console.error("Supabase clan_members fetch failed:", error);
          setMembers([]);
          return;
        }

        setMembers(data || []);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Meta title="Members | DRS Esports" />
      <Navbar />
      <div className="page-container">
        <section className="teams-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>
              Clan <span className="highlight">Members</span>
            </h1>
            <p>Community members registered with DRS Esports</p>
          </motion.div>
        </section>

        <section className="teams-content">
          {loading ? (
            <div className="empty-state" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 8 }}>Loading members…</h3>
              <p style={{ opacity: 0.8 }}>Please wait</p>
            </div>
          ) : members.length === 0 ? (
            <div className="empty-state" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 8 }}>No members yet</h3>
              <p style={{ opacity: 0.8 }}>Add members from Admin → Clan Members.</p>
            </div>
          ) : (
            <div className="teams-grid">
              {members.map((m, index) => (
                <motion.div
                  key={m.id}
                  className="team-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="team-header">
                    <div className="team-logo-large">
                      {m.image_url ? (
                        <img
                          src={m.image_url}
                          alt={m.name}
                          style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover" }}
                        />
                      ) : (
                        "👤"
                      )}
                    </div>
                    <div className="team-title">
                      <h3 style={{ marginBottom: 4 }}>{m.name}</h3>
                      <span className="team-game">{m.ign || ""}</span>
                    </div>
                  </div>

                  <div className="team-stats" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                    <div className="stat">
                      <span className="stat-value">{m.role || "-"}</span>
                      <span className="stat-label">Role</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{m.country || "-"}</span>
                      <span className="stat-label">Country</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{m.join_date ? new Date(m.join_date).toLocaleDateString() : "-"}</span>
                      <span className="stat-label">Joined</span>
                    </div>
                  </div>

                  {(m.instagram_url || m.discord) && (
                    <div className="team-achievements">
                      <h4>Social</h4>
                      <div className="achievements-list">
                        {m.instagram_url ? (
                          <a
                            href={m.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="achievement-badge"
                            style={{ textDecoration: "none" }}
                          >
                            📷 Instagram
                          </a>
                        ) : null}
                        {m.discord ? (
                          <span className="achievement-badge">💬 {m.discord}</span>
                        ) : null}
                      </div>
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

export default Members;
