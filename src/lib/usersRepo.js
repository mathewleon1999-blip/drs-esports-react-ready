import { supabase } from "./supabaseClient";

export async function upsertUser({ username, email, phone, role = "player" }) {
  const payload = {
    username: String(username || "").trim(),
    email: String(email || "").trim().toLowerCase(),
    phone: phone ? String(phone).trim() : null,
    role: String(role || "player").trim(),
    status: "active",
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "email" })
    .select()
    .single();

  return { data, error };
}

export async function fetchUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function updateUser(userId, updates) {
  const payload = { ...updates };
  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
}

export async function deleteUser(userId) {
  const { error } = await supabase.from("users").delete().eq("id", userId);
  return { error };
}
