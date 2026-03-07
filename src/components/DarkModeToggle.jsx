import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("drs-theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    localStorage.setItem("drs-theme", isDark ? "dark" : "light");
    document.body.classList.toggle("dark-mode", isDark);
  }, [isDark]);

  return (
    <motion.button
      className="dark-mode-toggle"
      onClick={() => setIsDark(!isDark)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </motion.button>
  );
}

export default DarkModeToggle;
