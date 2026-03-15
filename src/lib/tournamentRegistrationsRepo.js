import { supabase } from "./supabaseClient";

export async function createIndividualRegistration(payload) {
  const { data, error } = await supabase
    .from("tournament_registrations")
    .insert(payload)
    .select()
    .single();

  return { data, error };
}

export async function createTeamRegistration(payload) {
  const { data, error } = await supabase
    .from("tournament_registrations")
    .insert(payload)
    .select()
    .single();

  return { data, error };
}

export async function fetchClanMembersByTeamSlug(teamSlug) {
  const { data, error } = await supabase
    .from("clan_members")
    .select("id, team_slug, name, ign, role, image_url")
    .eq("team_slug", teamSlug)
    .order("created_at", { ascending: true });

  return { data, error };
}
