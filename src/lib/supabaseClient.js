import { createClient } from "@supabase/supabase-js";

// Public project credentials (safe to use in frontend)
// Keep these in env vars for production deployments.
const SUPABASE_URL = "https://vmojavbwzrebtonsynnf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Z7w3HgUVTZLln-fVJmc5mQ_fwiZpTaO";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
