import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchTeamProfile, fetchTournamentsPlayed } from "../lib/teamStatsRepo";

function StatCard({ value, label, suffix = "", tooltip = "Not available yet" }) {
  const [count, setCount] = useState(null);

  const isNumeric = Number.isFinite(typeof value === "string" ? Number(value) : value);

  useEffect(() => {
    if (!isNumeric) {
      setCount(null);
      return;
    }

    const target = Math.max(0, Number(value));
    const duration = 1200;
    const steps = 48;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isNumeric]);

  const displayValue = isNumeric
    ? `${Number(count ?? 0).toLocaleString()}${suffix}`
    : value
      ? String(value)
      : "—";

  const title = !isNumeric && !value ? tooltip : undefined;

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      title={title}
    >
      <div className="stat-number">{displayValue}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

function Stats() {
  const [stats, setStats] = useState({
    tournamentsPlayed: 50,
    uae2025: null,
    nationalRank: 4,
    representing: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const [{ data: profile }, { count }] = await Promise.all([
          fetchTeamProfile("drs"),
          fetchTournamentsPlayed(),
        ]);

        setStats((prev) => ({
          tournamentsPlayed: Number.isFinite(count) ? count : prev.tournamentsPlayed,
          uae2025: profile?.uae_2025 ?? prev.uae2025,
          nationalRank: profile?.national_rank ?? prev.nationalRank,
          representing: profile?.representing ?? prev.representing,
        }));
      } catch {
        // keep defaults
      }
    })();
  }, []);

  const statCards = [
    { value: stats.tournamentsPlayed, label: "Tournaments Played", suffix: "+" },
    { value: stats.uae2025, label: "UAE 2025", suffix: "" },
    { value: stats.nationalRank, label: "National Rank", suffix: "" },
    { value: stats.representing, label: "Proudly Representing", suffix: "" },
  ];

  return (
    <section className="stats" id="stats">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Team Statistics
      </motion.h2>
      <motion.p
        className="stats-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Dominating the battlefield since 2020
      </motion.p>
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </section>
  );
}

export default Stats;

