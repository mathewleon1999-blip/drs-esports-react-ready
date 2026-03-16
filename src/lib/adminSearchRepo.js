import { supabase } from "./supabaseClient";

// Server-side (Supabase) search helpers for Admin.
// NOTE: These use ilike and are intended for small/medium datasets.

export async function searchUsers(query, { limit = 50 } = {}) {
  const q = String(query || "").trim();
  if (!q) return { data: [], error: null };

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .or(`username.ilike.%${q}%,email.ilike.%${q}%,role.ilike.%${q}%,status.ilike.%${q}%`)
    .limit(limit);

  return { data: data || [], error };
}

export async function searchTransactions(query, { limit = 50 } = {}) {
  const q = String(query || "").trim();
  if (!q) return { data: [], error: null };

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .or(`category.ilike.%${q}%,player_name.ilike.%${q}%,paid_by.ilike.%${q}%,payment_method.ilike.%${q}%,description.ilike.%${q}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data: data || [], error };
}

export async function searchClanMembers(query, { teamSlug = "drs-esports", limit = 100 } = {}) {
  const q = String(query || "").trim();
  if (!q) return { data: [], error: null };

  const { data, error } = await supabase
    .from("clan_members")
    .select("*")
    .eq("team_slug", teamSlug)
    .or(`name.ilike.%${q}%,ign.ilike.%${q}%,role.ilike.%${q}%,country.ilike.%${q}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data: data || [], error };
}

export async function searchTournamentRegistrations(query, { limit = 100 } = {}) {
  const q = String(query || "").trim();
  if (!q) return { data: [], error: null };

  const { data, error } = await supabase
    .from("tournament_registrations")
    .select("*")
    .or(`tournament_name.ilike.%${q}%,registration_type.ilike.%${q}%,member_name.ilike.%${q}%,ign.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,team_name.ilike.%${q}%,captain_name.ilike.%${q}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data: data || [], error };
}
