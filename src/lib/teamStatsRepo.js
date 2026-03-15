import { supabase } from "./supabaseClient";

// Single-row table approach: team_profile where slug='drs'
export async function fetchTeamProfile(slug = "drs") {
  const { data, error } = await supabase
    .from("team_profile")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return { data, error };
}

// Derived stat: total tournaments played from tournaments table
export async function fetchTournamentsPlayed() {
  // Prefer head:true count query
  const { count, error } = await supabase
    .from("tournaments")
    .select("id", { count: "exact", head: true });

  return { count: count ?? null, error };
}
