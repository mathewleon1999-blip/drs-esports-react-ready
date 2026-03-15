import { supabase } from "./supabaseClient";

const PLAYERS_TABLE = "leaderboard_players";
const TEAMS_TABLE = "leaderboard_teams";

export async function fetchPlayerLeaderboard({ game, region } = {}) {
  let query = supabase.from(PLAYERS_TABLE).select("*");

  if (game && game !== "all") query = query.eq("game", game);
  if (region && region !== "all") query = query.eq("region", region);

  const { data, error } = await query
    .order("points", { ascending: false })
    .order("wins", { ascending: false })
    .order("kills", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row, idx) => ({ ...row, rank: idx + 1 }));
}

export async function fetchTeamLeaderboard({ game, region } = {}) {
  let query = supabase.from(TEAMS_TABLE).select("*");

  if (game && game !== "all") query = query.eq("game", game);
  if (region && region !== "all") query = query.eq("region", region);

  const { data, error } = await query
    .order("points", { ascending: false })
    .order("wins", { ascending: false })
    .order("kd", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row, idx) => ({ ...row, rank: idx + 1 }));
}
