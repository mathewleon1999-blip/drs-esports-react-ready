import { supabase } from "./supabaseClient";

// Orders repository (Supabase)
// Note: This is public/anon access in the current setup.

export async function createOrder(order) {
  const payload = {
    order_code: String(order?.id || "").trim(),
    status: String(order?.status || "pending").trim(),
    subtotal: Number(order?.subtotal || 0),
    shipping: Number(order?.shipping || 0),
    total: Number(order?.total || 0),
    payment_method: String(order?.paymentMethod || "").trim(),
    item_count: Number(order?.itemCount || 0),
    items: order?.items || [],
    customer: order?.customer || {},
    placed_at: order?.date || new Date().toISOString(),
  };

  const { data, error } = await supabase.from("orders").insert(payload).select().single();
  return { data, error };
}
