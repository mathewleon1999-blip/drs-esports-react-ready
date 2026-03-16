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
    payment_status: String(order?.paymentStatus || "unpaid").trim(),
    utr: order?.utr ? String(order.utr).trim() : null,
    item_count: Number(order?.itemCount || 0),
    items: order?.items || [],
    customer: order?.customer || {},
    placed_at: order?.date || new Date().toISOString(),
  };

  const { data, error } = await supabase.from("orders").insert(payload).select().single();
  return { data, error };
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("placed_at", { ascending: false });

  return { data: data || [], error };
}

export async function updateOrder(orderId, updates) {
  const payload = {
    ...updates,
    ...(Object.prototype.hasOwnProperty.call(updates || {}, "utr")
      ? { utr: updates.utr ? String(updates.utr).trim() : null }
      : {}),
    ...(Object.prototype.hasOwnProperty.call(updates || {}, "payment_status")
      ? { payment_status: String(updates.payment_status || "").trim() }
      : {}),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("orders")
    .update(payload)
    .eq("order_code", orderId)
    .select()
    .single();

  return { data, error };
}
