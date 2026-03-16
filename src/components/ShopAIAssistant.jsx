import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { callAI } from "../lib/aiClient";

function safeText(v) {
  return typeof v === "string" ? v : "";
}

export default function ShopAIAssistant({ products = [], wishlist = [], cart = [], filters = {} }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask me anything about DRS merch (sizes, hoodies under a budget, recommendations).",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const catalog = useMemo(() => {
    // Keep catalog light to reduce token usage.
    return (products || []).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      price: p.price,
      category: p.category,
      featured: !!p.featured,
      colors: p.colors || [],
      sizes: p.sizes || [],
    }));
  }, [products]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    setLoading(true);
    try {
      const data = await callAI("shop_assistant", {
        message: text,
        catalog,
        wishlist,
        cart,
        filters,
      });

      const reply = safeText(data?.reply) || "I couldn't generate a response.";

      let extra = "";
      const suggestions = Array.isArray(data?.suggestions) ? data.suggestions : [];
      if (suggestions.length) {
        extra += "\n\nRecommended:\n";
        for (const s of suggestions.slice(0, 5)) {
          extra += `• ${safeText(s?.name)} — ₹${Number(s?.price ?? 0).toLocaleString()} (${safeText(
            s?.reason
          )})\n`;
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply + extra }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `AI error: ${safeText(err?.message) || "Request failed"}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="ai-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        type="button"
      >
        {open ? "×" : "AI"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-panel"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
          >
            <div className="ai-panel-header">
              <div>
                <div className="ai-title">DRS AI Shop Assistant</div>
                <div className="ai-subtitle">Sizes • Filters • Recommendations</div>
              </div>
              <button className="ai-close" onClick={() => setOpen(false)} type="button">
                ×
              </button>
            </div>

            <div className="ai-messages" ref={listRef}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={m.role === "user" ? "ai-msg user" : "ai-msg bot"}
                >
                  {m.content}
                </div>
              ))}
              {loading && <div className="ai-msg bot">Thinking…</div>}
            </div>

            <div className="ai-input-row">
              <input
                className="ai-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='e.g. "Show me hoodies under ₹2000"'
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
              <button className="ai-send" onClick={send} disabled={loading || !input.trim()}>
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
