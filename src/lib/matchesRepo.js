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
