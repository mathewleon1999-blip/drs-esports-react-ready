import { supabase } from "./supabaseClient";

export async function fetchTournaments() {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

export function mapTournamentRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    game: row.game || "",
    description: row.description || "",
    prizePool: row.prize_pool ?? row.prizePool ?? "",
    date: row.date || row.start_date || "",
    status: row.status || "upcoming",
    registered: Number(row.registered ?? row.registrations ?? 0),
    teams: Number(row.teams ?? row.max_teams ?? 0),
  };
}
