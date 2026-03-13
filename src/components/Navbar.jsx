import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeToggle from "./DarkModeToggle";
import { useWishlist } from "./WishlistContext";

// Memoized Navbar component for performance optimization
const Navbar = memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [player, setPlayer] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [tournamentsOpen, setTournamentsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { wishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    const playerData = localStorage.getItem("drs-player");
    if (playerData) {
      setPlayer(JSON.parse(playerData));
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setTournamentsOpen(false);
      setMoreOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDropdownClick = (e, isOpen, setIsOpen) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <Link to="/">
        <motion.img 
          src="/DRSLOGO.jpg"
          className="logo" 
          alt="DRS Esports - Professional PUBG Mobile Esports Team India"
          title="DRS Esports - Professional PUBG Mobile Esports Team"
          width="80"
          height="80"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </Link>
      
      {/* Desktop Navigation */}
      <div className="navbar-links desktop-nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        
        <div className="dropdown" onClick={(e) => handleDropdownClick(e, tournamentsOpen, setTournamentsOpen)}>
          <button className="dropdown-toggle">
            Tournaments <span className="arrow">▾</span>
          </button>
          <AnimatePresence>
            {tournamentsOpen && (
              <motion.div 
                className="dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Link to="/tournaments" onClick={() => setTournamentsOpen(false)}>All Tournaments</Link>
                <Link to="/schedule" onClick={() => setTournamentsOpen(false)}>Schedule</Link>
                <Link to="/leaderboard" onClick={() => setTournamentsOpen(false)}>Leaderboard</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <Link to="/teams">Teams</Link>
        <Link to="/news">News</Link>
        <Link to="/live">Live</Link>
        <Link to="/shop">Shop</Link>
        
        <div className="dropdown" onClick={(e) => handleDropdownClick(e, moreOpen, setMoreOpen)}>
          <button className="dropdown-toggle">
            More <span className="arrow">▾</span>
          </button>
          <AnimatePresence>
            {moreOpen && (
              <motion.div 
                className="dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
<Link to="/achievements" onClick={() => setMoreOpen(false)}>Achievements</Link>
                <Link to="/contact" onClick={() => setMoreOpen(false)}>Contact</Link>
                <Link to="/order-tracking" onClick={() => setMoreOpen(false)}>Track Order</Link>
                <Link to="/pubg-stats" onClick={() => setMoreOpen(false)}>PUBG Stats</Link>
                <Link to="/newsletter" onClick={() => setMoreOpen(false)}>Newsletter</Link>
                <Link to="/wishlist" onClick={() => setMoreOpen(false)} className="wishlist-link">
                  Wishlist {wishlist.length > 0 && <span className="wishlist-count">{wishlist.length}</span>}
                </Link>
                <Link to="/donate" onClick={() => setMoreOpen(false)} className="donate-link">Donate ❤️</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <Link to="/cart" className="cart-icon">
          🛒
        </Link>
        
        <DarkModeToggle />
        
        {player && player.loggedIn ? (
          <Link to="/player-dashboard" className="login-link">
            👤 {player.username}
          </Link>
        ) : (
          <Link to="/login" className="login-link">
            Login
          </Link>
        )}
        <Link to="/admin" className="admin-link">
          Admin
        </Link>
        <Link to="/" className="join-btn">
          Join
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>
        {showMobileMenu ? "✕" : "☰"}
      </button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            className="mobile-nav"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
          >
            <Link to="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
            <Link to="/about" onClick={() => setShowMobileMenu(false)}>About</Link>
            <Link to="/tournaments" onClick={() => setShowMobileMenu(false)}>Tournaments</Link>
            <Link to="/schedule" onClick={() => setShowMobileMenu(false)}>Schedule</Link>
            <Link to="/leaderboard" onClick={() => setShowMobileMenu(false)}>Leaderboard</Link>
            <Link to="/teams" onClick={() => setShowMobileMenu(false)}>Teams</Link>
            <Link to="/news" onClick={() => setShowMobileMenu(false)}>News</Link>
            <Link to="/live" onClick={() => setShowMobileMenu(false)}>Live</Link>
            <Link to="/shop" onClick={() => setShowMobileMenu(false)}>Shop</Link>
            <Link to="/achievements" onClick={() => setShowMobileMenu(false)}>Achievements</Link>
            <Link to="/contact" onClick={() => setShowMobileMenu(false)}>Contact</Link>
            <Link to="/order-tracking" onClick={() => setShowMobileMenu(false)}>Track Order</Link>
            <Link to="/newsletter" onClick={() => setShowMobileMenu(false)}>Newsletter</Link>
            <Link to="/wishlist" onClick={() => setShowMobileMenu(false)} className="wishlist-link-mobile">
              Wishlist {wishlist.length > 0 && <span className="wishlist-count">{wishlist.length}</span>} ❤️
            </Link>
            <Link to="/cart" onClick={() => setShowMobileMenu(false)}>Cart 🛒</Link>
            <Link to="/donate" onClick={() => setShowMobileMenu(false)} className="donate-link-mobile">Donate ❤️</Link>
            {player && player.loggedIn ? (
              <Link to="/player-dashboard" onClick={() => setShowMobileMenu(false)}>Profile 👤</Link>
            ) : (
              <Link to="/login" onClick={() => setShowMobileMenu(false)}>Login</Link>
            )}
            <Link to="/admin" onClick={() => setShowMobileMenu(false)}>Admin</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

export default Navbar;
