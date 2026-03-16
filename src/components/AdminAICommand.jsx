import { useMemo, useState } from "react";
import { callAI } from "../lib/aiClient";

export default function AdminAICommand({ products = [], onApply }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const compactProducts = useMemo(() => {
    return (products || []).slice(0, 50).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
      featured: !!p.featured,
    }));
  }, [products]);

  async function run() {
    const q = text.trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await callAI("admin_command", {
        message: q,
        catalog: compactProducts,
      });
      setResult(data);

      if (typeof onApply === "function") {
        onApply(data);
      }
    } catch (e) {
      setError(e?.message || "AI command failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-ai">
      <div className="admin-ai-header">
        <h3>AI Admin Commands</h3>
        <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
          Try: “hoodie price 1500 stock 40” or “filter hoodies”
        </p>
      </div>

      <div className="admin-ai-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type an admin command…"
        />
        <button onClick={run} disabled={loading || !text.trim()}>
          {loading ? "Running…" : "Run"}
        </button>
      </div>

      {error && <div className="admin-ai-error">{error}</div>}
      {result && (
        <pre className="admin-ai-result">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
