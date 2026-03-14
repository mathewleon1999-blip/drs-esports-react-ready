import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { memo } from "react";

// Memoized Footer component for performance optimization
const Footer = memo(function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/ig.dikkaris_esports?utm_source=qr&igsh=MWFncHlsZXI1c21mMw==",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4.5A5.5 5.5 0 1 1 6.5 14 5.51 5.51 0 0 1 12 8.5Zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5ZM18 6.8a1.2 1.2 0 1 1-1.2 1.2A1.2 1.2 0 0 1 18 6.8Z"
          />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@dikkarisesports",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.8 4.6 12 4.6 12 4.6s-5.8 0-7.5.5A3 3 0 0 0 2.4 7.2 31.3 31.3 0 0 0 2 12a31.3 31.3 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.7.5 7.5.5 7.5.5s5.8 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 22 12a31.3 31.3 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer>
      <div className="footer-content">
        <motion.img
          src="/DRSLOGO.jpg"
          className="footer-logo"
          alt="DRS ESPORTS"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />
        <motion.div
          className="social-links"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              className="social-link"
              title={social.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                }}
              >
                {social.icon}
              </span>
              <span style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                {social.name}
              </span>
            </motion.a>
          ))}
        </motion.div>
        <p className="footer-text">
          © <span>2026</span> DRS ESPORTS | PUBG Mobile Competitive Clan
        </p>
        <p className="footer-text" style={{ marginTop: "10px", fontSize: "12px" }}>
          Built with passion for esports excellence
        </p>
        <motion.div
          className="footer-donate"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/donate" className="footer-donate-btn">
            Support Us ❤️
          </Link>
        </motion.div>
      </div>
    </footer>
  );
});

export default Footer;

