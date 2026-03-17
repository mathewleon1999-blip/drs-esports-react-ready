import { supabase } from "./supabaseClient";

const TABLE = "matches";

export async function fetchMatches() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchUpcomingMatches({ limit = 10 } = {}) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .gte('start_time', now)
    .order('start_time', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function fetchLiveMatches() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .gte('start_time', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()) // 2hr window
    .lte('end_time', new Date().toISOString()) // ended after now
    .or(`status.eq.live,status.eq.in_progress`)
    .limit(3)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore no rows
  return data || [];
}
