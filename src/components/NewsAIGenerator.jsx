import { useState } from "react";
import { callAI } from "../lib/aiClient";

export default function NewsAIGenerator({ onGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(null);

  async function generate() {
    const text = prompt.trim();
    if (!text || loading) return;

    setLoading(true);
    setError("");
    setDraft(null);

    try {
      const data = await callAI("news_draft", {
        message: text,
      });
      setDraft(data);
      if (typeof onGenerated === "function") {
        onGenerated(data);
      }
    } catch (e) {
      setError(e?.message || "Failed to generate news");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-ai">
      <div className="admin-ai-header">
        <h3>AI News Draft</h3>
        <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
          Example: “PUBG scrims update”
        </p>
      </div>

      <div className="admin-ai-row">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What should the news be about?"
        />
        <button onClick={generate} disabled={loading || !prompt.trim()}>
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {error && <div className="admin-ai-error">{error}</div>}

      {draft && (
        <div className="admin-ai-draft">
          <h4 style={{ marginBottom: 10 }}>{draft.title}</h4>
          <p style={{ whiteSpace: "pre-wrap", color: "var(--text-light)" }}>{draft.body}</p>
          {Array.isArray(draft.hashtags) && draft.hashtags.length > 0 && (
            <p style={{ marginTop: 12, color: "var(--text-muted)" }}>
              {draft.hashtags.map((h) => `#${String(h).replace(/^#/, "")}`).join(" ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
