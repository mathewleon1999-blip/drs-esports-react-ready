export async function callAI(action, payload) {
  const res = await fetch(`/api/ai?action=${encodeURIComponent(action)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload || {}),
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { reply: text };
  }

  if (!res.ok) {
    const msg = data?.error || "AI request failed";
    throw new Error(msg);
  }

  return data;
}
