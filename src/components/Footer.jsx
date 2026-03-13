import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { memo } from "react";

// Memoized Footer component for performance optimization
const Footer = memo(function Footer() {
  const socialLinks = [
    { name: "Instagram", icon: "📷", url: "https://www.instagram.com/ig.dikkaris_esports?utm_source=qr&igsh=MWFncHlsZXI1c21mMw==" },
    { name: "YouTube", icon: "📺", url: "https://www.youtube.com/@dikkarisesports" },
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
              {social.icon}
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

