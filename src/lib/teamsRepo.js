import { supabase } from "./supabaseClient";

export async function fetchTeams() {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("created_at", { ascending: true });

  return { data, error };
}

export async function fetchTeamMembers(teamSlug) {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("team_slug", teamSlug)
    .order("created_at", { ascending: true });

  return { data, error };
}

export async function fetchTeamsWithMembers() {
  const { data: teams, error: teamsError } = await fetchTeams();
  if (teamsError) return { data: null, error: teamsError };

  const membersBySlug = {};
  for (const t of teams || []) {
    const { data: members, error } = await fetchTeamMembers(t.slug);
    if (error) return { data: null, error };
    membersBySlug[t.slug] = members || [];
  }

  const combined = (teams || []).map((t) => ({
    id: t.slug,
    slug: t.slug,
    name: t.name,
    shortName: t.short_name || t.name,
    game: t.game,
    logo: t.logo || "🎮",
    recruiting: Boolean(t.recruiting),
    stats: {
      wins: Number(t.wins || 0),
      losses: Number(t.losses || 0),
      tournaments: Number(t.tournaments || 0),
    },
    achievements: [],
    members: (membersBySlug[t.slug] || []).map((m) => ({
      id: m.id,
      name: m.name,
      ign: m.ign || m.name,
      realName: m.name,
      role: m.role || "Player",
      avatar: "👤",
      image: m.image_url || "",
      country: m.country || "",
      mainRole: m.role || "",
      age: m.age || "",
      joinDate: m.join_date || m.created_at,
      stats: {
        kda: m.kda ?? "-",
        hs: m.hs ?? "-",
        matches: m.matches ?? "-",
      },
      social: {
        instagramUrl: m.instagram_url || "",
        discord: m.discord || "",
      },
    })),
  }));

  return { data: combined, error: null };
}
