import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Basic local auth (client-only). This is not equivalent to server-side security.
// It prevents accidental access and enables a clean upgrade path to real backend auth.

const STORAGE_KEY = "drs-admin-session";

const AdminAuthContext = createContext(null);

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? safeJsonParse(raw, null) : null;
  });

  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  }, [session]);

  const value = useMemo(() => {
    return {
      admin: session,
      isAuthenticated: Boolean(session?.loggedIn),
      login: ({ username, email }) => {
        setSession({
          username,
          email,
          loggedIn: true,
          loginTime: new Date().toISOString(),
        });
      },
      logout: () => setSession(null),
    };
  }, [session]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
