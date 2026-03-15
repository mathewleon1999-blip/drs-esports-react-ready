import { supabase } from "./supabaseClient";

export async function fetchLiveSettings(slug = "main") {
  const { data, error } = await supabase
    .from("live_settings")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return { data, error };
}
