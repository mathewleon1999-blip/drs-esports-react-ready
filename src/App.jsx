import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PageScope from "./components/PageScope";
import LoadingSpinner from "./components/LoadingSpinner";
import Meta from "./components/Meta";
import PWAInstall from "./components/PWAInstall";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import { WishlistProvider } from "./components/WishlistContext";
import { LoyaltyProvider } from "./context/LoyaltyContext";
import { PredictionsProvider } from "./context/PredictionsContext";

// Lazy load all pages for better performance (code splitting)
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const Contact = lazy(() => import("./pages/Contact"));
const PlayerDashboard = lazy(() => import("./pages/PlayerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Tournaments = lazy(() => import("./pages/Tournaments"));
const LiveStream = lazy(() => import("./pages/LiveStream"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Teams = lazy(() => import("./pages/Teams"));
const News = lazy(() => import("./pages/News"));
const Schedule = lazy(() => import("./pages/Schedule"));
const ShopEnhanced = lazy(() => import("./pages/ShopEnhanced"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PlayerProfile = lazy(() => import("./pages/PlayerProfile"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const Donation = lazy(() => import("./components/Donation"));
const LoyaltyDashboard = lazy(() => import("./pages/LoyaltyDashboard"));
const Predictions = lazy(() => import("./pages/Predictions"));
const PrizePool = lazy(() => import("./pages/PrizePool"));
const PUBGTracker = lazy(() => import("./pages/PUBGTracker"));

function App() {
  return (
    <>
      <Meta />
      <PageScope />

      <ErrorBoundary>
        <WishlistProvider>
          <LoyaltyProvider>
            <PredictionsProvider>
              <main id="main-content" role="main">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop-enhanced" element={<ShopEnhanced />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/player-dashboard" element={<PlayerDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/order-tracking" element={<OrderTracking />} />
                    <Route path="/tournaments" element={<Tournaments />} />
                    <Route path="/live" element={<LiveStream />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/player/:playerId" element={<PlayerProfile />} />
                    <Route path="/password-reset" element={<PasswordReset />} />
                    <Route path="/donate" element={<Donation />} />

                    {/* New Feature Routes */}
                    <Route path="/loyalty" element={<LoyaltyDashboard />} />
                    <Route path="/predictions" element={<Predictions />} />
                    <Route path="/prize-pool" element={<PrizePool />} />
                    <Route path="/pubg-stats" element={<PUBGTracker />} />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>

              <PWAInstall />
            </PredictionsProvider>
          </LoyaltyProvider>
        </WishlistProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;

