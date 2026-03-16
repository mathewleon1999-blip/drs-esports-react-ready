import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";
import { fetchMatches } from "../lib/matchesRepo";
import { fetchPlayerLeaderboard, fetchTeamLeaderboard } from "../lib/leaderboardRepo";
import {
  fetchUsers as fetchUsersFromSupabase,
  updateUser as updateUserInSupabase,
  deleteUser as deleteUserInSupabase,
} from "../lib/usersRepo";
import { fetchLiveSettings } from "../lib/liveSettingsRepo";

// Transaction categories
const TRANSACTION_CATEGORIES = [
  "Player Salary",
  "Device Sponsor",
  "UC Sponsor",
  "Rename Card",
  "Tournament Expense",
  "Other"
];

// Default products data
const defaultProducts = [
  { id: 1, name: "DRS Official Jersey", price: 1299, stock: 50, category: "Jersey", featured: true, images: ["/JERSEY/WhatsApp Image 2026-03-03 at 5.36.51 PM.jpeg"], colors: ["Black", "Navy Blue"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 2, name: "DRS Official Hoodie", price: 2499, stock: 35, category: "Hoodie", featured: true, images: ["/HODIE/WhatsApp Image 2026-03-03 at 5.36.53 PM.jpeg"], colors: ["Black", "Grey"], sizes: ["S", "M", "L", "XL", "XXL"] },
];

// Default users
const defaultUsers = [
  { id: 1, username: "player1", email: "player1@drs.com", role: "player", joined: "2025-01-15" },
  { id: 2, username: "pro_gamer", email: "progamer@drs.com", role: "player", joined: "2025-02-20" },
];

// Default tournaments
const defaultTournaments = [
  { id: 1, name: "DRS Championship 2025", date: "2025-06-15", prizePool: 50000, status: "upcoming", registrations: 16 },
  { id: 2, name: "Weekly Scrims", date: "2025-03-20", prizePool: 5000, status: "ongoing", registrations: 8 },
];

// Default news
const defaultNews = [
  { id: 1, title: "DRS Wins PUBG Mobile Championship", category: "Tournament", date: "2025-02-10", featured: true },
  { id: 2, title: "New Merch Collection Launch", category: "Merchandise", date: "2025-02-05", featured: false },
];

// Default discount codes
const defaultDiscounts = [
  { id: 1, code: "WELCOME10", discount: 10, type: "percentage", validUntil: "2025-12-31", active: true, usage: 45 },
  { id: 2, code: "NEWYEAR20", discount: 20, type: "percentage", validUntil: "2025-01-31", active: false, usage: 120 },
];

// LocalStorage helpers
const getStoredData = (key, defaultData) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultData;
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [clanMembers, setClanMembers] = useState([]);
  const [loadingClanMembers, setLoadingClanMembers] = useState(false);
  const [news, setNews] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tournamentRegistrations, setTournamentRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [liveSettings, setLiveSettings] = useState(null);
  const [liveForm, setLiveForm] = useState({ is_live: false, title: "DRS Live", stream_url: "" });
  const [savingLive, setSavingLive] = useState(false);

  // Schedule + Leaderboard (Supabase)
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [playerLeaderboard, setPlayerLeaderboard] = useState([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [leaderboardFilters, setLeaderboardFilters] = useState({ game: "all", region: "all" });
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [financeFilters, setFinanceFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    player: "",
    sponsor: ""
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function fetchTransactionsFromSupabase() {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase transactions fetch failed:", error);
        // fall back to local data if any exists
        setTransactions(getStoredData("drs-transactions", []));
        showToast("Transactions sync failed (Supabase)", "error");
        return;
      }

      setTransactions(data || []);
    } catch (err) {
      console.error("Supabase transactions fetch crashed:", err);
      setTransactions(getStoredData("drs-transactions", []));
      showToast("Transactions sync error (Supabase)", "error");
    }
  }

  async function fetchTournamentsFromSupabase() {
    try {
      setLoadingTournaments(true);
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase tournaments fetch failed:", error);
        // fallback to local
        setTournaments(getStoredData("drs-tournaments-admin", defaultTournaments));
        showToast("Tournaments sync failed (Supabase)", "error");
        return;
      }

      const normalized = (data || []).map((t) => ({
        id: t.id,
        name: t.name,
        date: t.date || "",
        game: t.game || "",
        description: t.description || "",
        prizePool: t.prize_pool || "",
        status: t.status || "upcoming",
        teams: Number(t.teams ?? 0),
        registered: Number(t.registered ?? 0),
      }));

      setTournaments(normalized);
    } catch (err) {
      console.error("Supabase tournaments fetch crashed:", err);
      setTournaments(getStoredData("drs-tournaments-admin", defaultTournaments));
      showToast("Tournaments sync error (Supabase)", "error");
    } finally {
      setLoadingTournaments(false);
    }
  }

  async function fetchClanMembersFromSupabase() {
    try {
      setLoadingClanMembers(true);
      const { data, error } = await supabase
        .from("clan_members")
        .select("*")
        .eq("team_slug", "drs-esports")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase clan_members fetch failed:", error);
        setClanMembers([]);
        showToast("Clan members sync failed (Supabase)", "error");
        return;
      }

      setClanMembers(data || []);
    } catch (err) {
      console.error("Supabase clan_members fetch crashed:", err);
      setClanMembers([]);
      showToast("Clan members sync error (Supabase)", "error");
    } finally {
      setLoadingClanMembers(false);
    }
  }

  async function fetchTournamentRegistrationsFromSupabase() {
    try {
      setLoadingRegistrations(true);
      const { data, error } = await supabase
        .from("tournament_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase tournament_registrations fetch failed:", error);
        setTournamentRegistrations([]);
        showToast("Registrations sync failed (Supabase)", "error");
        return;
      }

      setTournamentRegistrations(data || []);
    } catch (err) {
      console.error("Supabase tournament_registrations fetch crashed:", err);
      setTournamentRegistrations([]);
      showToast("Registrations sync error (Supabase)", "error");
    } finally {
      setLoadingRegistrations(false);
    }
  }

  async function fetchMatchesFromSupabase() {
    try {
      setLoadingMatches(true);
      const rows = await fetchMatches();

      const normalized = (rows ?? []).map((m) => ({
        id: m.id,
        team1: m.team1,
        team2: m.team2,
        game: m.game ?? "PUBG Mobile",
        tournament: m.tournament ?? "",
        status: m.status ?? "upcoming",
        start_time: m.start_time ?? null,
        stream_url: m.stream_url ?? null,
        result: m.result ?? null,
      }));

      setMatches(normalized);
    } catch (err) {
      console.error("Supabase matches fetch failed:", err);
      setMatches([]);
      showToast("Schedule sync failed (Supabase)", "error");
    } finally {
      setLoadingMatches(false);
    }
  }

  async function fetchLeaderboardFromSupabase(nextFilters = leaderboardFilters) {
    try {
      setLoadingLeaderboard(true);
      const [players, teams] = await Promise.all([
        fetchPlayerLeaderboard(nextFilters),
        fetchTeamLeaderboard(nextFilters),
      ]);
      setPlayerLeaderboard(players || []);
      setTeamLeaderboard(teams || []);
    } catch (err) {
      console.error("Supabase leaderboard fetch failed:", err);
      setPlayerLeaderboard([]);
      setTeamLeaderboard([]);
      showToast("Leaderboard sync failed (Supabase)", "error");
    } finally {
      setLoadingLeaderboard(false);
    }
  }

  async function addMatch(match) {
    try {
      const payload = {
        team1: String(match?.team1 || "").trim(),
        team2: String(match?.team2 || "").trim(),
        game: String(match?.game || "PUBG Mobile").trim(),
        tournament: String(match?.tournament || "").trim() || null,
        status: String(match?.status || "upcoming").trim(),
        start_time: match?.start_time ? new Date(match.start_time).toISOString() : null,
        stream_url: match?.stream_url ? String(match.stream_url).trim() : null,
        result: match?.result ? String(match.result).trim() : null,
      };

      if (!payload.team1 || !payload.team2 || !payload.start_time) {
        showToast("Team 1, Team 2 and Start Time are required", "error");
        return;
      }

      const { data, error } = await supabase.from("matches").insert(payload).select().single();
      if (error) {
        console.error("Supabase matches insert failed:", error);
        showToast(`Failed to add match: ${error.message}`, "error");
        return;
      }

      setMatches((prev) => [data, ...prev]);
      showToast("Match added!");
      setShowModal(false);
    } catch (err) {
      console.error("Supabase matches insert crashed:", err);
      showToast("Failed to add match", "error");
    }
  }

  async function updateMatch(matchId, updates) {
    try {
      const payload = {
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "team1")
          ? { team1: String(updates.team1 || "").trim() }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "team2")
          ? { team2: String(updates.team2 || "").trim() }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "game")
          ? { game: String(updates.game || "").trim() }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "tournament")
          ? { tournament: String(updates.tournament || "").trim() || null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "status")
          ? { status: String(updates.status || "upcoming").trim() }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "start_time")
          ? { start_time: updates.start_time ? new Date(updates.start_time).toISOString() : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "stream_url")
          ? { stream_url: updates.stream_url ? String(updates.stream_url).trim() : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "result")
          ? { result: updates.result ? String(updates.result).trim() : null }
          : {}),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("matches")
        .update(payload)
        .eq("id", matchId)
        .select()
        .single();

      if (error) {
        console.error("Supabase matches update failed:", error);
        showToast(`Failed to update match: ${error.message}`, "error");
        return;
      }

      setMatches((prev) => prev.map((m) => (m.id === matchId ? data : m)));
      showToast("Match updated!");
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Supabase matches update crashed:", err);
      showToast("Failed to update match", "error");
    }
  }

  async function deleteMatch(matchId) {
    try {
      const { error } = await supabase.from("matches").delete().eq("id", matchId);
      if (error) {
        console.error("Supabase matches delete failed:", error);
        showToast(`Failed to delete match: ${error.message}`, "error");
        return;
      }
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      showToast("Match deleted!");
    } catch (err) {
      console.error("Supabase matches delete crashed:", err);
      showToast("Failed to delete match", "error");
    }
  }

  async function upsertLeaderboardPlayer(row) {
    try {
      const payload = {
        username: String(row?.username || "").trim(),
        team: row?.team ? String(row.team).trim() : null,
        points: Number(row?.points ?? 0),
        wins: Number(row?.wins ?? 0),
        kills: Number(row?.kills ?? 0),
        games: Number(row?.games ?? 0),
        game: String(row?.game || "pubg").trim(),
        region: String(row?.region || "global").trim(),
        updated_at: new Date().toISOString(),
      };

      if (!payload.username) {
        showToast("Username is required", "error");
        return;
      }

      const { data, error } = await supabase
        .from("leaderboard_players")
        .upsert(payload, { onConflict: "username,game,region" })
        .select()
        .single();

      if (error) {
        console.error("Supabase leaderboard_players upsert failed:", error);
        showToast(`Failed to save player row: ${error.message}`, "error");
        return;
      }

      showToast("Player leaderboard updated!");
      await fetchLeaderboardFromSupabase();
      setShowModal(false);
    } catch (err) {
      console.error("Supabase leaderboard_players upsert crashed:", err);
      showToast("Failed to save player row", "error");
    }
  }

  async function upsertLeaderboardTeam(row) {
    try {
      const payload = {
        name: String(row?.name || "").trim(),
        wins: Number(row?.wins ?? 0),
        losses: Number(row?.losses ?? 0),
        points: Number(row?.points ?? 0),
        kd: row?.kd != null && row.kd !== "" ? Number(row.kd) : null,
        game: String(row?.game || "pubg").trim(),
        region: String(row?.region || "global").trim(),
        updated_at: new Date().toISOString(),
      };

      if (!payload.name) {
        showToast("Team name is required", "error");
        return;
      }

      const { data, error } = await supabase
        .from("leaderboard_teams")
        .upsert(payload, { onConflict: "name,game,region" })
        .select()
        .single();

      if (error) {
        console.error("Supabase leaderboard_teams upsert failed:", error);
        showToast(`Failed to save team row: ${error.message}`, "error");
        return;
      }

      showToast("Team leaderboard updated!");
      await fetchLeaderboardFromSupabase();
      setShowModal(false);
    } catch (err) {
      console.error("Supabase leaderboard_teams upsert crashed:", err);
      showToast("Failed to save team row", "error");
    }
  }

  // Debounce search to avoid filtering on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Initialize data
  useEffect(() => {
    // Auth is enforced by route guard (RequireAdmin). We only read session for display.
    const session = JSON.parse(localStorage.getItem("drs-admin-session") || "{}");
    setAdmin(session?.loggedIn ? session : { username: "Admin" });

    // Load all other data
    setOrders(getStoredData("drs-orders", []));

    // Products: Supabase is source-of-truth.
    // Important: avoid falling back to localStorage when Supabase returns data,
    // because stale localStorage can cause price mismatch vs Supabase.
    (async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase products fetch failed:", error);
          setProducts(getStoredData("drs-products", defaultProducts));
          return;
        }

        // normalize product shape to match existing UI
        const normalized = (data || []).map((p) => ({
          id: p.id,
          name: p.name,
          // Supabase numeric can arrive as string; keep exact numeric value
          price: p.price == null || p.price === "" ? 0 : Number(p.price),
          stock: p.stock == null || p.stock === "" ? 0 : Number(p.stock),
          category: p.category || "Jersey",
          featured: Boolean(p.featured),
          images: p.images || [],
          colors: p.colors || [],
          sizes: p.sizes || [],
          created_at: p.created_at || null,
          updated_at: p.updated_at || null,
        }));

        setProducts(normalized);

        // Keep a local cache, but only after a successful Supabase read.
        setStoredData("drs-products", normalized);
      } catch (err) {
        console.error("Supabase products fetch crashed:", err);
        setProducts(getStoredData("drs-products", defaultProducts));
      }
    })();

    // Users: Supabase (sync across devices)
    (async () => {
      try {
        const { data, error } = await fetchUsersFromSupabase();
        if (error) {
          console.error("Supabase users fetch failed:", error);
          setUsers(getStoredData("drs-users", defaultUsers));
          return;
        }
        setUsers(data || []);
      } catch (err) {
        console.error("Supabase users fetch crashed:", err);
        setUsers(getStoredData("drs-users", defaultUsers));
      }
    })();

    // Tournaments: Supabase
    fetchTournamentsFromSupabase();

    // Clan members: Supabase
    fetchClanMembersFromSupabase();

    // Tournament registrations: Supabase
    fetchTournamentRegistrationsFromSupabase();

    // News/Discounts still local
    setNews(getStoredData("drs-news-admin", defaultNews));
    setDiscounts(getStoredData("drs-discounts", defaultDiscounts));

    // Transactions: Supabase (sync across devices)
    fetchTransactionsFromSupabase();

    // Schedule + Leaderboard: Supabase
    fetchMatchesFromSupabase();
    fetchLeaderboardFromSupabase({ game: "all", region: "all" });

    // Live settings: Supabase
    (async () => {
      try {
        const { data } = await fetchLiveSettings("main");
        setLiveSettings(data || null);
        setLiveForm({
          is_live: Boolean(data?.is_live),
          title: data?.title || "DRS Live",
          stream_url: data?.stream_url || "",
        });
      } catch {
        // ignore
      }
    })();
  }, []);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("drs-admin-session");
    navigate("/admin");
  };

  // Order functions
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setStoredData("drs-orders", updatedOrders);
    showToast("Order status updated!");
  };

  const deleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    setStoredData("drs-orders", updatedOrders);
    showToast("Order deleted!");
  };

  // Product functions
  const addProduct = async (product) => {
    try {
      const payload = {
        name: String(product.name || "").trim(),
        price: Number(product.price || 0),
        stock: Number(product.stock || 0),
        category: product.category || "Jersey",
        featured: !!product.featured,
        images: product.images || [],
        colors: product.colors || [],
        sizes: product.sizes || [],
        created_at: new Date().toISOString(),
      };

      if (!payload.name) {
        showToast("Product name is required", "error");
        return;
      }

      const { data, error } = await supabase.from("products").insert(payload).select().single();
      if (error) {
        console.error("Supabase product insert failed:", error);
        // fallback to local
        const newProduct = { ...payload, id: Date.now() };
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        setStoredData("drs-products", updatedProducts);
        showToast("Product added locally (Supabase failed)");
        setShowModal(false);
        return;
      }

      const normalized = {
        id: data.id,
        name: data.name,
        price: Number(data.price || 0),
        stock: Number(data.stock || 0),
        category: data.category || "Jersey",
        featured: Boolean(data.featured),
        images: data.images || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        created_at: data.created_at || null,
        updated_at: data.updated_at || null,
      };

      setProducts((prev) => [normalized, ...prev]);
      setStoredData("drs-products", [normalized, ...products]);
      showToast("Product added successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Add product crashed:", err);
      showToast("Failed to add product", "error");
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      const payload = {
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "name") ? { name: String(updates.name || "").trim() } : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "price") ? { price: Number(updates.price) } : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "stock") ? { stock: Number(updates.stock) } : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "category") ? { category: updates.category } : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "featured") ? { featured: !!updates.featured } : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "images") ? { images: updates.images } : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "colors") ? { colors: updates.colors } : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "sizes") ? { sizes: updates.sizes } : {}),
        updated_at: new Date().toISOString(),
      };

      if (!productId) {
        showToast("Missing product id", "error");
        return;
      }

      // Supabase is the source-of-truth for products.
      const { data, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", productId)
        // With PostgREST, UPDATE only returns rows if you explicitly select.
        // If zero/multiple rows are returned, `.single()` will throw.
        .select("*")
        .maybeSingle();

      if (!error && !data) {
        showToast("No product row returned from Supabase. Check the product id.", "error");
        return;
      }

      if (error) {
        console.error("Supabase product update failed:", error);
        showToast(`Failed to update product (Supabase): ${error.message}`, "error");
        return;
      }

      const normalized = {
        id: data.id,
        name: data.name,
        price: data.price == null || data.price === "" ? 0 : Number(data.price),
        stock: data.stock == null || data.stock === "" ? 0 : Number(data.stock),
        category: data.category || "Jersey",
        featured: Boolean(data.featured),
        images: data.images || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        created_at: data.created_at || null,
        updated_at: data.updated_at || null,
      };

      const nextProducts = products.map((p) => (p.id === productId ? normalized : p));
      setProducts(nextProducts);
      setStoredData("drs-products", nextProducts);

      // Notify other tabs (Shop) immediately.
      // This forces the `storage` listener in Shop.jsx to reload products without a refresh.
      try {
        localStorage.setItem("drs-products:last-updated", String(Date.now()));
      } catch {
        // ignore
      }

      showToast("Product updated successfully!");
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Update product crashed:", err);
      showToast("Failed to update product", "error");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) {
        console.error("Supabase product delete failed:", error);
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        setStoredData("drs-products", updatedProducts);
        showToast("Product deleted locally (Supabase failed)");
        return;
      }

      setProducts((prev) => prev.filter(p => p.id !== productId));
      setStoredData("drs-products", products.filter(p => p.id !== productId));
      showToast("Product deleted!");
    } catch (err) {
      console.error("Delete product crashed:", err);
      showToast("Failed to delete product", "error");
    }
  };

  // User functions
  const toggleUserStatus = async (userId) => {
    const current = users.find((u) => u.id === userId);
    const nextStatus = current?.status === "active" ? "suspended" : "active";

    try {
      const { data, error } = await updateUserInSupabase(userId, { status: nextStatus });
      if (error) {
        console.error("Supabase user update failed:", error);
        showToast(`Failed to update user: ${error.message}`, "error");
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)));
      showToast("User status updated!");
    } catch (err) {
      console.error("Supabase user update crashed:", err);
      showToast("Failed to update user", "error");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { error } = await deleteUserInSupabase(userId);
      if (error) {
        console.error("Supabase user delete failed:", error);
        showToast(`Failed to delete user: ${error.message}`, "error");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast("User deleted!");
    } catch (err) {
      console.error("Supabase user delete crashed:", err);
      showToast("Failed to delete user", "error");
    }
  };

  // Clan Members functions (Supabase-backed)
  const addClanMember = async (member) => {
    try {
      const payload = {
        team_slug: "drs-esports",
        name: String(member?.name || "").trim(),
        ign: member?.ign ? String(member.ign).trim() : null,
        role: member?.role ? String(member.role).trim() : null,
        image_url: member?.image_url ? String(member.image_url).trim() : null,
        instagram_url: member?.instagram_url ? String(member.instagram_url).trim() : null,
        discord: member?.discord ? String(member.discord).trim() : null,
        country: member?.country ? String(member.country).trim() : null,
        join_date: member?.join_date || null,
      };

      if (!payload.name) {
        showToast("Member name is required", "error");
        return;
      }

      const { data, error } = await supabase.from("clan_members").insert(payload).select().single();
      if (error) {
        console.error("Supabase clan_members insert failed:", error);
        showToast(`Failed to add member: ${error.message}`, "error");
        return;
      }

      setClanMembers((prev) => [data, ...prev]);
      showToast("Clan member added!");
      setShowModal(false);
    } catch (err) {
      console.error("Supabase clan_members insert crashed:", err);
      showToast("Failed to add member", "error");
    }
  };

  const updateClanMember = async (memberId, updates) => {
    try {
      const payload = {
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "name")
          ? { name: String(updates.name || "").trim() }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "ign")
          ? { ign: updates.ign ? String(updates.ign).trim() : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "role")
          ? { role: updates.role ? String(updates.role).trim() : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "image_url")
          ? { image_url: updates.image_url ? String(updates.image_url).trim() : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "instagram_url")
          ? { instagram_url: updates.instagram_url ? String(updates.instagram_url).trim() : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "discord")
          ? { discord: updates.discord ? String(updates.discord).trim() : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "country")
          ? { country: updates.country ? String(updates.country).trim() : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "join_date")
          ? { join_date: updates.join_date || null }
          : {}),
      };

      const { data, error } = await supabase
        .from("clan_members")
        .update(payload)
        .eq("id", memberId)
        .select()
        .single();

      if (error) {
        console.error("Supabase clan_members update failed:", error);
        showToast(`Failed to update member: ${error.message}`, "error");
        return;
      }

      setClanMembers((prev) => prev.map((m) => (m.id === memberId ? data : m)));
      showToast("Clan member updated!");
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Supabase clan_members update crashed:", err);
      showToast("Failed to update member", "error");
    }
  };

  const deleteClanMember = async (memberId) => {
    try {
      const { error } = await supabase.from("clan_members").delete().eq("id", memberId);
      if (error) {
        console.error("Supabase clan_members delete failed:", error);
        showToast(`Failed to delete member: ${error.message}`, "error");
        return;
      }

      setClanMembers((prev) => prev.filter((m) => m.id !== memberId));
      showToast("Clan member deleted!");
    } catch (err) {
      console.error("Supabase clan_members delete crashed:", err);
      showToast("Failed to delete member", "error");
    }
  };

  // Tournament functions (Supabase-backed)
  const addTournament = async (tournament) => {
    try {
      const payload = {
        name: String(tournament?.name || "").trim(),
        date: tournament?.date || null,
        game: String(tournament?.game || "PUBG Mobile").trim(),
        description: String(tournament?.description || "").trim() || null,
        prize_pool: tournament?.prizePool != null ? String(tournament.prizePool) : null,
        status: String(tournament?.status || "upcoming").trim(),
        teams: Number(tournament?.teams ?? 0),
        registered: Number(tournament?.registered ?? 0),
      };

      if (!payload.name) {
        showToast("Tournament name is required", "error");
        return;
      }

      const { data, error } = await supabase.from("tournaments").insert(payload).select().single();
      if (error) {
        console.error("Supabase tournament insert failed:", error);
        showToast(`Failed to add tournament: ${error.message}`, "error");
        return;
      }

      setTournaments((prev) => [
        {
          id: data.id,
          name: data.name,
          date: data.date || "",
          game: data.game || "",
          description: data.description || "",
          prizePool: data.prize_pool || "",
          status: data.status || "upcoming",
          teams: Number(data.teams ?? 0),
          registered: Number(data.registered ?? 0),
        },
        ...prev,
      ]);

      showToast("Tournament added!");
      setShowModal(false);
    } catch (err) {
      console.error("Supabase tournament insert crashed:", err);
      showToast("Failed to add tournament", "error");
    }
  };

  const updateTournament = async (tournamentId, updates) => {
    try {
      const payload = {
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "name")
          ? { name: String(updates.name || "").trim() }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "date") ? { date: updates.date || null } : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "game")
          ? { game: String(updates.game || "").trim() }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "description")
          ? { description: String(updates.description || "").trim() || null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "prizePool")
          ? { prize_pool: updates.prizePool != null ? String(updates.prizePool) : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "status")
          ? { status: String(updates.status || "upcoming").trim() }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "teams") ? { teams: Number(updates.teams ?? 0) } : {}),
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "registered")
          ? { registered: Number(updates.registered ?? 0) }
          : {}),
      };

      const { data, error } = await supabase
        .from("tournaments")
        .update(payload)
        .eq("id", tournamentId)
        .select()
        .single();

      if (error) {
        console.error("Supabase tournament update failed:", error);
        showToast(`Failed to update tournament: ${error.message}`, "error");
        return;
      }

      const normalized = {
        id: data.id,
        name: data.name,
        date: data.date || "",
        game: data.game || "",
        description: data.description || "",
        prizePool: data.prize_pool || "",
        status: data.status || "upcoming",
        teams: Number(data.teams ?? 0),
        registered: Number(data.registered ?? 0),
      };

      setTournaments((prev) => prev.map((t) => (t.id === tournamentId ? normalized : t)));
      showToast("Tournament updated!");
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Supabase tournament update crashed:", err);
      showToast("Failed to update tournament", "error");
    }
  };

  const deleteTournament = async (tournamentId) => {
    try {
      const { error } = await supabase.from("tournaments").delete().eq("id", tournamentId);
      if (error) {
        console.error("Supabase tournament delete failed:", error);
        showToast(`Failed to delete tournament: ${error.message}`, "error");
        return;
      }

      setTournaments((prev) => prev.filter((t) => t.id !== tournamentId));
      showToast("Tournament deleted!");
    } catch (err) {
      console.error("Supabase tournament delete crashed:", err);
      showToast("Failed to delete tournament", "error");
    }
  };

  // News functions
  const addNews = (item) => {
    const newNews = { ...item, id: Date.now(), date: new Date().toISOString().split("T")[0] };
    const updatedNews = [...news, newNews];
    setNews(updatedNews);
    setStoredData("drs-news-admin", updatedNews);
    showToast("News article added!");
    setShowModal(false);
  };

  const updateNews = (newsId, updates) => {
    const updatedNews = news.map(n => 
      n.id === newsId ? { ...n, ...updates } : n
    );
    setNews(updatedNews);
    setStoredData("drs-news-admin", updatedNews);
    showToast("News article updated!");
    setShowModal(false);
    setEditingItem(null);
  };

  const deleteNews = (newsId) => {
    const updatedNews = news.filter(n => n.id !== newsId);
    setNews(updatedNews);
    setStoredData("drs-news-admin", updatedNews);
    showToast("News article deleted!");
  };

  // Discount functions
  const addDiscount = (discount) => {
    const newDiscount = { ...discount, id: Date.now(), usage: 0 };
    const updatedDiscounts = [...discounts, newDiscount];
    setDiscounts(updatedDiscounts);
    setStoredData("drs-discounts", updatedDiscounts);
    showToast("Discount code created!");
    setShowModal(false);
  };

  const toggleDiscountStatus = (discountId) => {
    const updatedDiscounts = discounts.map(d => 
      d.id === discountId ? { ...d, active: !d.active } : d
    );
    setDiscounts(updatedDiscounts);
    setStoredData("drs-discounts", updatedDiscounts);
    showToast("Discount status updated!");
  };

const deleteDiscount = (discountId) => {
    const updatedDiscounts = discounts.filter(d => d.id !== discountId);
    setDiscounts(updatedDiscounts);
    setStoredData("drs-discounts", updatedDiscounts);
    showToast("Discount code deleted!");
  };

  // Transaction functions (Supabase-backed)
  const addTransaction = async (transaction) => {
    try {
      const payload = {
        // enforce required fields and types
        date: transaction?.date || new Date().toISOString().slice(0, 10),
        category: String(transaction?.category || "").trim(),
        player_name: transaction?.player_name ? String(transaction.player_name).trim() : null,
        paid_by: String(transaction?.paid_by || "").trim(),
        amount: Number(transaction?.amount),
        currency: transaction?.currency ? String(transaction.currency).trim() : "AED",
        payment_method: transaction?.payment_method ? String(transaction.payment_method).trim() : null,
        description: transaction?.description ? String(transaction.description).trim() : null,
        created_by: admin?.username || "admin",
      };

      if (!payload.category || !payload.paid_by || !Number.isFinite(payload.amount)) {
        showToast("Please fill Category, Paid By and Amount", "error");
        return;
      }

      const { data, error } = await supabase.from("transactions").insert(payload).select().single();

      if (error) {
        console.error("Supabase insert failed:", error);
        showToast(`Failed to add transaction (Supabase): ${error.message}`, "error");
        return;
      }

      setTransactions((prev) => [data, ...prev]);
      showToast("Transaction added successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Supabase insert crashed:", err);
      showToast("Failed to add transaction (Supabase)", "error");
    }
  };

  const updateTransaction = async (transactionId, updates) => {
    try {
      const normalizedUpdates = {
        ...updates,
        // normalize amount if present
        ...(Object.prototype.hasOwnProperty.call(updates || {}, "amount")
          ? { amount: Number(updates.amount) }
          : {}),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("transactions")
        .update(normalizedUpdates)
        .eq("id", transactionId)
        .select()
        .single();

      if (error) {
        console.error("Supabase update failed:", error);
        showToast(`Failed to update transaction (Supabase): ${error.message}`, "error");
        return;
      }

      setTransactions((prev) => prev.map((t) => (t.id === transactionId ? data : t)));
      showToast("Transaction updated successfully!");
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Supabase update crashed:", err);
      showToast("Failed to update transaction (Supabase)", "error");
    }
  };

  const deleteTransaction = async (transactionId) => {
    try {
      const { error } = await supabase.from("transactions").delete().eq("id", transactionId);

      if (error) {
        console.error("Supabase delete failed:", error);
        showToast(`Failed to delete transaction (Supabase): ${error.message}`, "error");
        return;
      }

      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      showToast("Transaction deleted!");
    } catch (err) {
      console.error("Supabase delete crashed:", err);
      showToast("Failed to delete transaction (Supabase)", "error");
    }
  };

  // Excel export function
  const exportToExcel = () => {
    // Prepare data for Excel
    const data = filteredTransactions.map(t => ({
      Date: t.date,
      Category: t.category,
      Player: t.player_name || "",
      "Paid By": t.paid_by,
      Amount: t.amount,
      Currency: t.currency || "AED",
      Method: t.payment_method,
      Notes: t.description || ""
    }));

    // Create worksheet from JSON data
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // Date
      { wch: 20 }, // Category
      { wch: 20 }, // Player
      { wch: 20 }, // Paid By
      { wch: 12 }, // Amount
      { wch: 10 }, // Currency
      { wch: 15 }, // Method
      { wch: 30 }  // Notes
    ];

    // Create new workbook
    const workbook = XLSX.utils.book_new();
    
    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Generate and download file
    XLSX.writeFile(workbook, `transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast("Excel exported successfully!");
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesDate = !financeFilters.dateFrom || t.date >= financeFilters.dateFrom;
    const matchesDateTo = !financeFilters.dateTo || t.date <= financeFilters.dateTo;
    const matchesCategory = !financeFilters.category || t.category === financeFilters.category;
    const matchesPlayer = !financeFilters.player || t.player_name?.toLowerCase().includes(financeFilters.player.toLowerCase());
    const matchesSponsor = !financeFilters.sponsor || t.paid_by?.toLowerCase().includes(financeFilters.sponsor.toLowerCase());
    return matchesDate && matchesDateTo && matchesCategory && matchesPlayer && matchesSponsor;
  });

  // Finance calculations
  const totalSalary = transactions.filter(t => t.category === "Player Salary").reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const totalSponsor = transactions.filter(t => ["Device Sponsor", "UC Sponsor"].includes(t.category)).reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const totalExpenses = transactions.filter(t => ["Tournament Expense", "Other"].includes(t.category)).reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const netBalance = totalSponsor - totalSalary - totalExpenses;

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  // Filtered data
  const filteredOrders = useMemo(() => {
    const q = debouncedSearchTerm.toLowerCase();
    if (!q) return orders;

    return orders.filter((order) => {
      const orderId = String(order.id || "").toLowerCase();
      const name = String(order.customer?.name || "").toLowerCase();
      const email = String(order.customer?.email || "").toLowerCase();
      const phone = String(order.customer?.phone || "").toLowerCase();
      const status = String(order.status || "").toLowerCase();
      const payment = String(order.paymentMethod || "").toLowerCase();
      return (
        orderId.includes(q) ||
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        status.includes(q) ||
        payment.includes(q)
      );
    });
  }, [orders, debouncedSearchTerm]);

  const filteredProducts = useMemo(() => {
    const q = debouncedSearchTerm.toLowerCase();
    if (!q) return products;
    return products.filter((product) => String(product.name || "").toLowerCase().includes(q));
  }, [products, debouncedSearchTerm]);

  const filteredUsers = useMemo(() => {
    const q = debouncedSearchTerm.toLowerCase();
    if (!q) return users;
    return users.filter((user) => {
      const username = String(user.username || "").toLowerCase();
      const email = String(user.email || "").toLowerCase();
      const role = String(user.role || "").toLowerCase();
      const status = String(user.status || "").toLowerCase();
      return username.includes(q) || email.includes(q) || role.includes(q) || status.includes(q);
    });
  }, [users, debouncedSearchTerm]);

  if (!admin) return null;

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setModalType("");
  };

  return (
    <>
      <Navbar />
      
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <button 
          className="admin-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
        <h2>⚙️ Admin Panel</h2>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`admin-sidebar-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className="admin-dashboard">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button 
            className="sidebar-close-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕
          </button>
          <div className="sidebar-header">
            <h2>⚙️ Admin Panel</h2>
            <p className="welcome-text">Welcome, {admin.username}</p>
          </div>
          <nav className="sidebar-nav">
            <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
              📊 Overview
            </button>
            <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
              📦 Orders <span className="badge">{pendingOrders}</span>
            </button>
            <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
              👕 Products
            </button>
            <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
              👥 Users
            </button>
            <button className={activeTab === "tournaments" ? "active" : ""} onClick={() => setActiveTab("tournaments")}>
              🏆 Tournaments
            </button>
            <button className={activeTab === "schedule" ? "active" : ""} onClick={() => setActiveTab("schedule")}>
              📅 Schedule
            </button>
            <button className={activeTab === "leaderboard" ? "active" : ""} onClick={() => setActiveTab("leaderboard")}>
              🏅 Leaderboard
            </button>
            <button className={activeTab === "registrations" ? "active" : ""} onClick={() => setActiveTab("registrations")}>
              📝 Registrations
            </button>
            <button className={activeTab === "clan-members" ? "active" : ""} onClick={() => setActiveTab("clan-members")}>
              👥 Clan Members
            </button>
            <button className={activeTab === "news" ? "active" : ""} onClick={() => setActiveTab("news")}>
              📰 News
            </button>
<button className={activeTab === "discounts" ? "active" : ""} onClick={() => setActiveTab("discounts")}>
              🎟️ Discounts
            </button>
            <button className={activeTab === "finance" ? "active" : ""} onClick={() => setActiveTab("finance")}>
              💵 Finance
            </button>
            <button className={activeTab === "live" ? "active" : ""} onClick={() => setActiveTab("live")}>
              📺 Live
            </button>
            <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
              ⚙️ Settings
            </button>
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          {/* Toast Notification */}
          <AnimatePresence>
            {toast.show && (
              <motion.div 
                className={`admin-toast ${toast.type}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1>Dashboard Overview</h1>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>{totalOrders}</h3>
                    <p>Total Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>₹{totalRevenue.toLocaleString()}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>{pendingOrders}</h3>
                    <p>Pending Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👕</div>
                  <div className="stat-info">
                    <h3>{totalProducts}</h3>
                    <p>Products</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>{totalUsers}</h3>
                    <p>Registered Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-info">
                    <h3>{tournaments.length}</h3>
                    <p>Tournaments</p>
                  </div>
                </div>
              </div>

              <div className="recent-section">
                <h2>Recent Orders</h2>
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer?.name || "N/A"}</td>
                            <td>₹{order.total}</td>
                            <td>
                              <span className={`status-badge ${order.status}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Order Management</h1>
                <div className="search-box">
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {filteredOrders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="orders-list">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="order-card-admin">
                      <div className="order-header">
                        <span className="order-id">{order.id}</span>
                        <span className={`status-badge ${order.status}`}>{order.status}</span>
                      </div>
                      <div className="order-body">
                        <div className="order-info">
                          <p><strong>Customer:</strong> {order.customer?.name}</p>
                          <p><strong>Email:</strong> {order.customer?.email}</p>
                          <p><strong>Phone:</strong> {order.customer?.phone}</p>
                          <p><strong>Address:</strong> {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}</p>
                        </div>
                        <div className="order-items">
                          <p><strong>Items:</strong></p>
                          {order.items?.map((item, idx) => (
                            <p key={idx} className="item-row">
                              {item.name} - {item.size}/{item.color} × {item.quantity} = ₹{item.price * item.quantity}
                            </p>
                          ))}
                        </div>
                        <div className="order-total">
                          <p><strong>Subtotal:</strong> ₹{order.subtotal}</p>
                          <p><strong>Shipping:</strong> ₹{order.shipping}</p>
                          <p><strong>Total:</strong> ₹{order.total}</p>
                          <p><strong>Payment:</strong> {order.paymentMethod?.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="order-actions">
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button className="delete-btn" onClick={() => deleteOrder(order.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Product Management</h1>
                <button className="add-btn" onClick={() => openModal("addProduct")}>
                  + Add Product
                </button>
              </div>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="products-grid-admin">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card-admin">
                    <div className="product-image">
                      <img src={product.images?.[0] || "/JERSEY/WhatsApp Image 2026-03-03 at 5.36.51 PM.jpeg"} alt={product.name} />
                    </div>
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <p className="product-price">₹{Number(product.price ?? 0).toLocaleString()}</p>
                      <p className="product-stock">Stock: {product.stock}</p>
                      <p className="product-category">{product.category}</p>
                    </div>
                    <div className="product-actions">
                      <button className="edit-btn" onClick={() => openModal("editProduct", product)}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => deleteProduct(product.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>User Management</h1>
                <button className="add-btn" onClick={() => openModal("addUser")}>
                  + Add User
                </button>
              </div>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.joined}</td>
                        <td>
                          <button className="edit-btn" onClick={() => openModal("editUser", user)}>✏️</button>
                          <button className="delete-btn" onClick={() => deleteUser(user.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <motion.div
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Schedule (Matches)</h1>
                <div className="header-actions">
                  <button className="add-btn" onClick={fetchMatchesFromSupabase}>
                    ↻ Refresh
                  </button>
                  <button className="add-btn" onClick={() => openModal("addMatch")}>
                    + Add Match
                  </button>
                </div>
              </div>

              {loadingMatches ? (
                <div className="empty-state"><p>Loading matches…</p></div>
              ) : matches.length === 0 ? (
                <div className="empty-state"><p>No matches yet</p></div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Start</th>
                        <th>Tournament</th>
                        <th>Game</th>
                        <th>Team 1</th>
                        <th>Team 2</th>
                        <th>Status</th>
                        <th>Stream</th>
                        <th>Result</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.map((m) => (
                        <tr key={m.id}>
                          <td>{m.start_time ? new Date(m.start_time).toLocaleString() : "-"}</td>
                          <td>{m.tournament || "-"}</td>
                          <td>{m.game || "-"}</td>
                          <td>{m.team1}</td>
                          <td>{m.team2}</td>
                          <td>{m.status}</td>
                          <td>{m.stream_url ? "Yes" : "No"}</td>
                          <td>{m.result || "-"}</td>
                          <td>
                            <button className="edit-btn" onClick={() => openModal("editMatch", m)}>✏️</button>
                            <button className="delete-btn" onClick={() => deleteMatch(m.id)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <motion.div
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Leaderboard</h1>
                <div className="header-actions">
                  <button className="add-btn" onClick={() => fetchLeaderboardFromSupabase()}>
                    ↻ Refresh
                  </button>
                  <button className="add-btn" onClick={() => openModal("addLeaderboardPlayer")}>
                    + Add Player Row
                  </button>
                  <button className="add-btn" onClick={() => openModal("addLeaderboardTeam")}>
                    + Add Team Row
                  </button>
                </div>
              </div>

              <div className="finance-filters" style={{ marginBottom: 20 }}>
                <div className="filter-group">
                  <label>Game</label>
                  <select
                    value={leaderboardFilters.game}
                    onChange={async (e) => {
                      const next = { ...leaderboardFilters, game: e.target.value };
                      setLeaderboardFilters(next);
                      await fetchLeaderboardFromSupabase(next);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="valorant">Valorant</option>
                    <option value="cs2">CS2</option>
                    <option value="pubg">PUBG</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Region</label>
                  <select
                    value={leaderboardFilters.region}
                    onChange={async (e) => {
                      const next = { ...leaderboardFilters, region: e.target.value };
                      setLeaderboardFilters(next);
                      await fetchLeaderboardFromSupabase(next);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="india">India</option>
                    <option value="asia">Asia</option>
                    <option value="global">Global</option>
                  </select>
                </div>
              </div>

              {loadingLeaderboard ? (
                <div className="empty-state"><p>Loading leaderboard…</p></div>
              ) : (
                <>
                  <h2 style={{ marginTop: 10 }}>Players</h2>
                  {playerLeaderboard.length === 0 ? (
                    <div className="empty-state"><p>No player rows</p></div>
                  ) : (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Team</th>
                            <th>Points</th>
                            <th>Wins</th>
                            <th>Kills</th>
                            <th>Games</th>
                            <th>Game</th>
                            <th>Region</th>
                          </tr>
                        </thead>
                        <tbody>
                          {playerLeaderboard.map((p) => (
                            <tr key={`${p.username}-${p.game}-${p.region}`}>
                              <td>#{p.rank}</td>
                              <td>{p.username}</td>
                              <td>{p.team || "-"}</td>
                              <td>{Number(p.points ?? 0).toLocaleString()}</td>
                              <td>{p.wins}</td>
                              <td>{Number(p.kills ?? 0).toLocaleString()}</td>
                              <td>{p.games}</td>
                              <td>{p.game}</td>
                              <td>{p.region}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <h2 style={{ marginTop: 24 }}>Teams</h2>
                  {teamLeaderboard.length === 0 ? (
                    <div className="empty-state"><p>No team rows</p></div>
                  ) : (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Points</th>
                            <th>K/D</th>
                            <th>Game</th>
                            <th>Region</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamLeaderboard.map((t) => (
                            <tr key={`${t.name}-${t.game}-${t.region}`}>
                              <td>#{t.rank}</td>
                              <td>{t.name}</td>
                              <td>{t.wins}</td>
                              <td>{t.losses}</td>
                              <td>{t.points}</td>
                              <td>{t.kd}</td>
                              <td>{t.game}</td>
                              <td>{t.region}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Registrations Tab */}
          {activeTab === "registrations" && (
            <motion.div
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Tournament Registrations</h1>
                <button className="add-btn" onClick={fetchTournamentRegistrationsFromSupabase}>
                  ↻ Refresh
                </button>
              </div>

              {loadingRegistrations ? (
                <div className="empty-state">
                  <p>Loading registrations…</p>
                </div>
              ) : tournamentRegistrations.length === 0 ? (
                <div className="empty-state">
                  <p>No registrations yet</p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Tournament</th>
                        <th>Member</th>
                        <th>IGN</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournamentRegistrations.map((r) => (
                        <tr key={r.id}>
                          <td>{r.registration_type || "-"}</td>
                          <td>{r.tournament_name || r.tournament_id || "-"}</td>
                          <td>{r.member_name || "-"}</td>
                          <td>{r.ign || "-"}</td>
                          <td>{r.email || "-"}</td>
                          <td>{r.phone || "-"}</td>
                          <td>{r.created_at ? new Date(r.created_at).toLocaleString() : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Clan Members Tab */}
          {activeTab === "clan-members" && (
            <motion.div
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Clan Members</h1>
                <button className="add-btn" onClick={() => openModal("addClanMember")}>
                  + Add Member
                </button>
              </div>

              {loadingClanMembers ? (
                <div className="empty-state">
                  <p>Loading clan members…</p>
                </div>
              ) : clanMembers.length === 0 ? (
                <div className="empty-state">
                  <p>No clan members yet</p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>IGN</th>
                        <th>Role</th>
                        <th>Country</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clanMembers.map((m) => (
                        <tr key={m.id}>
                          <td>{m.name}</td>
                          <td>{m.ign || "-"}</td>
                          <td>{m.role || "-"}</td>
                          <td>{m.country || "-"}</td>
                          <td>
                            <button className="edit-btn" onClick={() => openModal("editClanMember", m)}>✏️</button>
                            <button className="delete-btn" onClick={() => deleteClanMember(m.id)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Tournaments Tab */}
          {activeTab === "tournaments" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Tournament Management</h1>
                <button className="add-btn" onClick={() => openModal("addTournament")}>
                  + Add Tournament
                </button>
              </div>
              <div className="tournaments-list">
                {loadingTournaments ? (
                  <div className="empty-state">
                    <p>Loading tournaments…</p>
                  </div>
                ) : tournaments.length === 0 ? (
                  <div className="empty-state">
                    <p>No tournaments yet</p>
                  </div>
                ) : tournaments.map(tournament => (
                  <div key={tournament.id} className="tournament-card-admin">
                    <div className="tournament-info">
                      <h3>{tournament.name}</h3>
                      <p><strong>Date:</strong> {tournament.date}</p>
                      <p><strong>Prize Pool:</strong> {tournament.prizePool}</p>
                      <p><strong>Teams:</strong> {tournament.registered}/{tournament.teams}</p>
                      <span className={`status-badge ${tournament.status}`}>{tournament.status}</span>
                    </div>
                    <div className="tournament-actions">
                      <button className="edit-btn" onClick={() => openModal("editTournament", tournament)}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => deleteTournament(tournament.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* News Tab */}
          {activeTab === "news" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>News Management</h1>
                <button className="add-btn" onClick={() => openModal("addNews")}>
                  + Add News
                </button>
              </div>
              <div className="news-list">
                {news.map(item => (
                  <div key={item.id} className="news-card-admin">
                    <div className="news-info">
                      <h3>{item.title}</h3>
                      <p><strong>Category:</strong> {item.category}</p>
                      <p><strong>Date:</strong> {item.date}</p>
                      <span className={`status-badge ${item.featured ? "featured" : "normal"}`}>
                        {item.featured ? "Featured" : "Normal"}
                      </span>
                    </div>
                    <div className="news-actions">
                      <button className="edit-btn" onClick={() => openModal("editNews", item)}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => deleteNews(item.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

{/* Discounts Tab */}
          {activeTab === "discounts" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Discount Codes</h1>
                <button className="add-btn" onClick={() => openModal("addDiscount")}>
                  + Add Discount
                </button>
              </div>
              <div className="discounts-list">
                {discounts.map(discount => (
                  <div key={discount.id} className="discount-card-admin">
                    <div className="discount-info">
                      <h3>{discount.code}</h3>
                      <p><strong>Discount:</strong> {discount.discount}{discount.type === "percentage" ? "%" : "₹"}</p>
                      <p><strong>Valid Until:</strong> {discount.validUntil}</p>
                      <p><strong>Usage:</strong> {discount.usage} times</p>
                      <span className={`status-badge ${discount.active ? "active" : "inactive"}`}>
                        {discount.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="discount-actions">
                      <button 
                        className={`toggle-btn ${discount.active ? "deactivate" : "activate"}`}
                        onClick={() => toggleDiscountStatus(discount.id)}
                      >
                        {discount.active ? "Deactivate" : "Activate"}
                      </button>
                      <button className="delete-btn" onClick={() => deleteDiscount(discount.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Finance Tab */}
          {activeTab === "finance" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="panel-header">
                <h1>Finance Manager</h1>
                <div className="header-actions">
                  <button className="add-btn export-btn" onClick={exportToExcel}>
                    📊 Export Excel
                  </button>
                  <button className="add-btn" onClick={() => openModal("addTransaction")}>
                    + Add Transaction
                  </button>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="finance-summary">
                <div className="summary-card salary">
                  <div className="summary-icon">💵</div>
                  <div className="summary-info">
                    <h3>₹{totalSalary.toLocaleString()}</h3>
                    <p>Total Salary Paid</p>
                  </div>
                </div>
                <div className="summary-card sponsor">
                  <div className="summary-icon">🎁</div>
                  <div className="summary-info">
                    <h3>₹{totalSponsor.toLocaleString()}</h3>
                    <p>Total Sponsor Money</p>
                  </div>
                </div>
                <div className="summary-card expenses">
                  <div className="summary-icon">📤</div>
                  <div className="summary-info">
                    <h3>₹{totalExpenses.toLocaleString()}</h3>
                    <p>Total Expenses</p>
                  </div>
                </div>
                <div className={`summary-card ${netBalance >= 0 ? "positive" : "negative"}`}>
                  <div className="summary-icon">{netBalance >= 0 ? "📈" : "📉"}</div>
                  <div className="summary-info">
                    <h3>₹{netBalance.toLocaleString()}</h3>
                    <p>Net Balance</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="finance-filters">
                <div className="filter-group">
                  <label>From Date</label>
                  <input 
                    type="date" 
                    value={financeFilters.dateFrom}
                    onChange={(e) => setFinanceFilters({...financeFilters, dateFrom: e.target.value})}
                  />
                </div>
                <div className="filter-group">
                  <label>To Date</label>
                  <input 
                    type="date" 
                    value={financeFilters.dateTo}
                    onChange={(e) => setFinanceFilters({...financeFilters, dateTo: e.target.value})}
                  />
                </div>
                <div className="filter-group">
                  <label>Category</label>
                  <select 
                    value={financeFilters.category}
                    onChange={(e) => setFinanceFilters({...financeFilters, category: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    {TRANSACTION_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Player</label>
                  <input 
                    type="text" 
                    placeholder="Search player..."
                    value={financeFilters.player}
                    onChange={(e) => setFinanceFilters({...financeFilters, player: e.target.value})}
                  />
                </div>
                <div className="filter-group">
                  <label>Sponsor</label>
                  <input 
                    type="text" 
                    placeholder="Search sponsor..."
                    value={financeFilters.sponsor}
                    onChange={(e) => setFinanceFilters({...financeFilters, sponsor: e.target.value})}
                  />
                </div>
                <button 
                  className="clear-filters-btn"
                  onClick={() => setFinanceFilters({ dateFrom: "", dateTo: "", category: "", player: "", sponsor: "" })}
                >
                  Clear Filters
                </button>
              </div>

              {/* Transactions Table */}
              {filteredTransactions.length === 0 ? (
                <div className="empty-state">
                  <p>No transactions found</p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Player</th>
                        <th>Paid By</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Notes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td>{transaction.date}</td>
                          <td>{transaction.category}</td>
                          <td>{transaction.player_name || "-"}</td>
                          <td>{transaction.paid_by}</td>
                          <td className="amount-cell">₹{parseFloat(transaction.amount).toLocaleString()}</td>
                          <td>{transaction.payment_method}</td>
                          <td>{transaction.description || "-"}</td>
                          <td>
                            <button className="edit-btn" onClick={() => openModal("editTransaction", transaction)}>✏️</button>
                            <button className="delete-btn" onClick={() => deleteTransaction(transaction.id)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Live Tab */}
          {activeTab === "live" && (
            <motion.div
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1>Live Stream Settings</h1>
              <p style={{ color: "var(--text-muted)", marginTop: -10, marginBottom: 20 }}>
                Paste your YouTube Live URL here. When you set Live = ON, it will play on the Live page.
              </p>

              <div className="settings-section" style={{ maxWidth: 720 }}>
                <div className="form-group">
                  <label>Live Status</label>
                  <select
                    value={liveForm.is_live ? "true" : "false"}
                    onChange={(e) => setLiveForm((p) => ({ ...p, is_live: e.target.value === "true" }))}
                  >
                    <option value="false">OFFLINE</option>
                    <option value="true">LIVE</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={liveForm.title}
                    onChange={(e) => setLiveForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="DRS Live"
                  />
                </div>

                <div className="form-group">
                  <label>YouTube URL</label>
                  <input
                    type="text"
                    value={liveForm.stream_url}
                    onChange={(e) => setLiveForm((p) => ({ ...p, stream_url: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <button
                  className="save-btn"
                  disabled={savingLive}
                  onClick={async () => {
                    try {
                      setSavingLive(true);
                      const payload = {
                        slug: "main",
                        platform: "youtube",
                        is_live: Boolean(liveForm.is_live),
                        title: String(liveForm.title || "DRS Live"),
                        stream_url: String(liveForm.stream_url || "").trim(),
                        updated_at: new Date().toISOString(),
                      };

                      const { data, error } = await supabase
                        .from("live_settings")
                        .upsert(payload, { onConflict: "slug" })
                        .select()
                        .single();

                      if (error) {
                        console.error("Supabase live_settings upsert failed:", error);
                        showToast(`Failed to save live settings: ${error.message}`, "error");
                        return;
                      }

                      setLiveSettings(data);
                      showToast("Live settings saved!");
                    } catch (err) {
                      console.error("Supabase live_settings upsert crashed:", err);
                      showToast("Failed to save live settings", "error");
                    } finally {
                      setSavingLive(false);
                    }
                  }}
                >
                  {savingLive ? "Saving…" : "Save Live Settings"}
                </button>

                {liveSettings?.updated_at ? (
                  <p style={{ marginTop: 12, color: "var(--text-muted)", fontSize: 13 }}>
                    Last updated: {new Date(liveSettings.updated_at).toLocaleString()}
                  </p>
                ) : null}
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1>Settings</h1>
              <div className="settings-section">
                <h2>Site Settings</h2>
                <div className="form-group">
                  <label>Site Name</label>
                  <input type="text" defaultValue="DRS Esports" />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input type="email" defaultValue="admin@drsesports.com" />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select defaultValue="INR">
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Free Shipping Threshold</label>
                  <input type="number" defaultValue="1000" />
                </div>
                <button className="save-btn" onClick={() => showToast("Settings saved!")}>
                  Save Settings
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="admin-modal"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal}>×</button>
              
              {/* Add/Edit Product Modal */}
              {(modalType === "addProduct" || modalType === "editProduct") && (
                <ProductForm 
                  product={editingItem} 
                  onSave={(data) => editingItem ? updateProduct(editingItem.id, data) : addProduct(data)}
                  onCancel={closeModal}
                />
              )}

              {/* Add/Edit User Modal */}
              {(modalType === "addUser" || modalType === "editUser") && (
                <UserForm 
                  user={editingItem}
                  onSave={(data) => {
                    if (editingItem) {
                      setUsers(users.map(u => u.id === editingItem.id ? { ...u, ...data } : u));
                    } else {
                      setUsers([...users, { ...data, id: Date.now() }]);
                    }
                    showToast(editingItem ? "User updated!" : "User added!");
                    closeModal();
                  }}
                  onCancel={closeModal}
                />
              )}

              {/* Add/Edit Tournament Modal */}
              {(modalType === "addTournament" || modalType === "editTournament") && (
                <TournamentForm 
                  tournament={editingItem}
                  onSave={(data) => editingItem ? updateTournament(editingItem.id, data) : addTournament(data)}
                  onCancel={closeModal}
                />
              )}

              {/* Add/Edit Clan Member Modal */}
              {(modalType === "addClanMember" || modalType === "editClanMember") && (
                <ClanMemberForm
                  member={editingItem}
                  onSave={(data) =>
                    editingItem ? updateClanMember(editingItem.id, data) : addClanMember(data)
                  }
                  onCancel={closeModal}
                />
              )}

              {/* Add/Edit News Modal */}
              {(modalType === "addNews" || modalType === "editNews") && (
                <NewsForm 
                  news={editingItem}
                  onSave={(data) => editingItem ? updateNews(editingItem.id, data) : addNews(data)}
                  onCancel={closeModal}
                />
              )}

              {/* Add Discount Modal */}
              {modalType === "addDiscount" && (
                <DiscountForm 
                  onSave={addDiscount}
                  onCancel={closeModal}
                />
              )}

              {/* Add/Edit Transaction Modal */}
              {(modalType === "addTransaction" || modalType === "editTransaction") && (
                <TransactionForm 
                  transaction={editingItem}
                  onSave={(data) => editingItem ? updateTransaction(editingItem.id, data) : addTransaction(data)}
                  onCancel={closeModal}
                />
              )}

              {/* Add/Edit Match Modal */}
              {(modalType === "addMatch" || modalType === "editMatch") && (
                <MatchForm
                  match={editingItem}
                  onSave={(data) => (editingItem ? updateMatch(editingItem.id, data) : addMatch(data))}
                  onCancel={closeModal}
                />
              )}

              {/* Add Leaderboard Player/Team Row */}
              {(modalType === "addLeaderboardPlayer" || modalType === "editLeaderboardPlayer") && (
                <LeaderboardPlayerForm
                  row={editingItem}
                  onSave={(data) => upsertLeaderboardPlayer(data)}
                  onCancel={closeModal}
                />
              )}

              {(modalType === "addLeaderboardTeam" || modalType === "editLeaderboardTeam") && (
                <LeaderboardTeamForm
                  row={editingItem}
                  onSave={(data) => upsertLeaderboardTeam(data)}
                  onCancel={closeModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

// Product Form Component
function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    category: product?.category || "Jersey",
    featured: product?.featured || false,
    description: product?.description || "",
    colors: product?.colors || ["Black"],
    sizes: product?.sizes || ["S", "M", "L", "XL"]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{product ? "Edit Product" : "Add New Product"}</h2>
      <div className="form-group">
        <label>Product Name</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Price (₹)</label>
          <input 
            type="number" 
            value={formData.price} 
            onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input 
            type="number" 
            value={formData.stock} 
            onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
            required 
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Jersey">Jersey</option>
            <option value="Hoodie">Hoodie</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div className="form-group">
          <label>Featured</label>
          <select 
            value={formData.featured ? "true" : "false"} 
            onChange={(e) => setFormData({...formData, featured: e.target.value === "true"})}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

// User Form Component
function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "player"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{user ? "Edit User" : "Add New User"}</h2>
      <div className="form-group">
        <label>Username</label>
        <input 
          type="text" 
          value={formData.username} 
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required 
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input 
          type="email" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
        />
      </div>
      <div className="form-group">
        <label>Role</label>
        <select 
          value={formData.role} 
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="player">Player</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

// Tournament Form Component
function ClanMemberForm({ member, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: member?.name || "",
    ign: member?.ign || "",
    role: member?.role || "",
    country: member?.country || "",
    image_url: member?.image_url || "",
    instagram_url: member?.instagram_url || "",
    discord: member?.discord || "",
    join_date: member?.join_date || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{member ? "Edit Clan Member" : "Add Clan Member"}</h2>

      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>IGN</label>
          <input
            type="text"
            value={formData.ign}
            onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
            placeholder="In-game name"
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="Member / Player / Coach"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Join Date</label>
          <input
            type="date"
            value={formData.join_date}
            onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Image URL</label>
        <input
          type="text"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="/DRS ESPORTS/member.jpg"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Instagram URL</label>
          <input
            type="text"
            value={formData.instagram_url}
            onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
            placeholder="https://instagram.com/..."
          />
        </div>
        <div className="form-group">
          <label>Discord</label>
          <input
            type="text"
            value={formData.discord}
            onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
            placeholder="username#0000"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

function MatchForm({ match, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    team1: match?.team1 || "",
    team2: match?.team2 || "",
    game: match?.game || "PUBG Mobile",
    tournament: match?.tournament || "",
    status: match?.status || "upcoming",
    start_time: match?.start_time ? new Date(match.start_time).toISOString().slice(0, 16) : "",
    stream_url: match?.stream_url || "",
    result: match?.result || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{match ? "Edit Match" : "Add Match"}</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Team 1 *</label>
          <input
            type="text"
            value={formData.team1}
            onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Team 2 *</label>
          <input
            type="text"
            value={formData.team2}
            onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Game</label>
          <input
            type="text"
            value={formData.game}
            onChange={(e) => setFormData({ ...formData, game: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Start Time *</label>
        <input
          type="datetime-local"
          value={formData.start_time}
          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Tournament</label>
        <input
          type="text"
          value={formData.tournament}
          onChange={(e) => setFormData({ ...formData, tournament: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Stream URL</label>
        <input
          type="text"
          value={formData.stream_url}
          onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
          placeholder="https://youtube.com/..."
        />
      </div>

      <div className="form-group">
        <label>Result (for completed matches)</label>
        <input
          type="text"
          value={formData.result}
          onChange={(e) => setFormData({ ...formData, result: e.target.value })}
          placeholder="Team DRS won 2-0"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

function LeaderboardPlayerForm({ row, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    username: row?.username || "",
    team: row?.team || "",
    points: row?.points ?? 0,
    wins: row?.wins ?? 0,
    kills: row?.kills ?? 0,
    games: row?.games ?? 0,
    game: row?.game || "pubg",
    region: row?.region || "global",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{row ? "Edit Player Row" : "Add Player Row"}</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Username *</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Team</label>
          <input
            type="text"
            value={formData.team}
            onChange={(e) => setFormData({ ...formData, team: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Points</label>
          <input
            type="number"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Wins</label>
          <input
            type="number"
            value={formData.wins}
            onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Kills</label>
          <input
            type="number"
            value={formData.kills}
            onChange={(e) => setFormData({ ...formData, kills: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Games</label>
          <input
            type="number"
            value={formData.games}
            onChange={(e) => setFormData({ ...formData, games: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Game</label>
          <select value={formData.game} onChange={(e) => setFormData({ ...formData, game: e.target.value })}>
            <option value="valorant">Valorant</option>
            <option value="cs2">CS2</option>
            <option value="pubg">PUBG</option>
          </select>
        </div>
        <div className="form-group">
          <label>Region</label>
          <select value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })}>
            <option value="india">India</option>
            <option value="asia">Asia</option>
            <option value="global">Global</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

function LeaderboardTeamForm({ row, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: row?.name || "",
    wins: row?.wins ?? 0,
    losses: row?.losses ?? 0,
    points: row?.points ?? 0,
    kd: row?.kd ?? 1,
    game: row?.game || "pubg",
    region: row?.region || "global",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{row ? "Edit Team Row" : "Add Team Row"}</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Points</label>
          <input
            type="number"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Wins</label>
          <input
            type="number"
            value={formData.wins}
            onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Losses</label>
          <input
            type="number"
            value={formData.losses}
            onChange={(e) => setFormData({ ...formData, losses: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>K/D</label>
          <input
            type="number"
            step="0.01"
            value={formData.kd}
            onChange={(e) => setFormData({ ...formData, kd: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Game</label>
          <select value={formData.game} onChange={(e) => setFormData({ ...formData, game: e.target.value })}>
            <option value="valorant">Valorant</option>
            <option value="cs2">CS2</option>
            <option value="pubg">PUBG</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Region</label>
        <select value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })}>
          <option value="india">India</option>
          <option value="asia">Asia</option>
          <option value="global">Global</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

function TournamentForm({ tournament, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: tournament?.name || "",
    date: tournament?.date || "",
    prizePool: tournament?.prizePool || 0,
    status: tournament?.status || "upcoming"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{tournament ? "Edit Tournament" : "Add New Tournament"}</h2>
      <div className="form-group">
        <label>Tournament Name</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Prize Pool (₹)</label>
          <input 
            type="number" 
            value={formData.prizePool} 
            onChange={(e) => setFormData({...formData, prizePool: parseInt(e.target.value)})}
            required 
          />
        </div>
      </div>
      <div className="form-group">
        <label>Status</label>
        <select 
          value={formData.status} 
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

// News Form Component
function NewsForm({ news, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: news?.title || "",
    category: news?.category || "Tournament",
    featured: news?.featured || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{news ? "Edit News" : "Add New News"}</h2>
      <div className="form-group">
        <label>Title</label>
        <input 
          type="text" 
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required 
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Tournament">Tournament</option>
            <option value="Merchandise">Merchandise</option>
            <option value="Team">Team</option>
            <option value="General">General</option>
          </select>
        </div>
        <div className="form-group">
          <label>Featured</label>
          <select 
            value={formData.featured ? "true" : "false"} 
            onChange={(e) => setFormData({...formData, featured: e.target.value === "true"})}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
}

// Discount Form Component
function DiscountForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    code: "",
    discount: 0,
    type: "percentage",
    validUntil: "",
    active: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>Create Discount Code</h2>
      <div className="form-group">
        <label>Code</label>
        <input 
          type="text" 
          placeholder="e.g., SUMMER20"
          value={formData.code} 
          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
          required 
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Discount Value</label>
          <input 
            type="number" 
            value={formData.discount} 
            onChange={(e) => setFormData({...formData, discount: parseInt(e.target.value)})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select 
            value={formData.type} 
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Valid Until</label>
        <input 
          type="date" 
          value={formData.validUntil} 
          onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
          required 
        />
      </div>
      <div className="form-group">
        <label>Active</label>
        <select 
          value={formData.active ? "true" : "false"} 
          onChange={(e) => setFormData({...formData, active: e.target.value === "true"})}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">Create</button>
      </div>
    </form>
  );
}

// Transaction Form Component
function TransactionForm({ transaction, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    category: transaction?.category || "Player Salary",
    player_name: transaction?.player_name || "",
    paid_by: transaction?.paid_by || "",
    amount: transaction?.amount || 0,
    currency: transaction?.currency || "AED",
    payment_method: transaction?.payment_method || "Bank Transfer",
    description: transaction?.description || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{transaction ? "Edit Transaction" : "Add New Transaction"}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {TRANSACTION_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Player Name</label>
          <input 
            type="text" 
            placeholder="Enter player name"
            value={formData.player_name} 
            onChange={(e) => setFormData({...formData, player_name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Paid By</label>
          <input 
            type="text" 
            placeholder="Owner / Sponsor Name"
            value={formData.paid_by} 
            onChange={(e) => setFormData({...formData, paid_by: e.target.value})}
            required 
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Amount</label>
          <input 
            type="number" 
            value={formData.amount} 
            onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select 
            value={formData.currency} 
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
          >
            <option value="AED">AED</option>
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Payment Method</label>
        <select 
          value={formData.payment_method} 
          onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
        >
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="UPI">UPI</option>
          <option value="PayPal">PayPal</option>
          <option value="Crypto">Crypto</option>
        </select>
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea 
          placeholder="Additional notes..."
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">{transaction ? "Update" : "Add Transaction"}</button>
      </div>
    </form>
  );
}

export default AdminDashboard;

