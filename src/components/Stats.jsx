import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function StatCard({ number, label, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = parseInt(number.replace(/[^0-9]/g, ""));
    const duration = 2000;
    const steps = 60;
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
  }, [number]);

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="stat-number">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

function Stats() {
  const stats = [
    { number: "50+", label: "Tournaments Played" },
    { number: "PMNC", label: "UAE 2025", suffix: "" },
    { number: "#4", label: "National Rank" },
    { number: "India", label: "Proudly Representing", suffix: "" },
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
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </section>
  );
}

export default Stats;

