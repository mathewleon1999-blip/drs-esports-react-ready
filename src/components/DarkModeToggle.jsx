import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Safe localStorage helpers
const getLocalStorage = (key, defaultValue) => {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(key);
    return saved ? saved : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  } catch {
    // Silently fail
  }
};

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = getLocalStorage("drs-theme", "false");
    return saved === "dark";
  });

  useEffect(() => {
    setLocalStorage("drs-theme", isDark ? "dark" : "light");
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
