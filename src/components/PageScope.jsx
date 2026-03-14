import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeToPage = (pathname) => {
  // Normalize trailing slashes
  const path = (pathname || '/').replace(/\/+$/, '') || '/';

  // Keep these stable because CSS is scoped against them
  if (path === '/') return 'Home';

  const map = {
    '/about': 'About',
    '/shop': 'Shop',
    '/shop-enhanced': 'ShopEnhanced',
    '/cart': 'Cart',
    '/achievements': 'Achievements',
    '/login': 'Login',
    '/admin': 'Admin',
    '/contact': 'Contact',
    '/player-dashboard': 'PlayerDashboard',
    '/admin-dashboard': 'AdminDashboard',
    '/order-tracking': 'OrderTracking',
    '/tournaments': 'Tournaments',
    '/live': 'LiveStream',
    '/leaderboard': 'Leaderboard',
    '/teams': 'Teams',
    '/news': 'News',
    '/schedule': 'Schedule',
    '/newsletter': 'Newsletter',
    '/faq': 'FAQ',
    '/privacy-policy': 'PrivacyPolicy',
    '/terms-of-service': 'TermsOfService',
    '/wishlist': 'Wishlist',
    '/password-reset': 'PasswordReset',
    '/donate': 'Donation',
    '/loyalty': 'LoyaltyDashboard',
    '/predictions': 'Predictions',
    '/prize-pool': 'PrizePool',
    '/pubg-stats': 'PUBGTracker',
  };

  if (map[path]) return map[path];

  // Dynamic routes
  if (/^\/player\//.test(path)) return 'PlayerProfile';

  // Admin dashboard path typo (some deployments use /admin-dashboard)
  if (/^\/admin-dashboard/.test(path)) return 'AdminDashboard';

  // Fallback (keeps CSS from leaking)
  return 'Unknown';
};

export default function PageScope() {
  const location = useLocation();

  useEffect(() => {
    const page = routeToPage(location.pathname);

    // Set both attribute + class for flexibility
    document.body.dataset.page = page;

    // Keep a single class for easy debugging in devtools
    const prefix = 'page-';
    document.body.classList.forEach((cls) => {
      if (cls.startsWith(prefix)) document.body.classList.remove(cls);
    });
    document.body.classList.add(`${prefix}${page}`);

    return () => {
      // On unmount, clear to reduce possibility of stale scoping
      delete document.body.dataset.page;
      document.body.classList.remove(`${prefix}${page}`);
    };
  }, [location.pathname]);

  return null;
}
