// Vercel Serverless Function (Node.js runtime)
// Provides AI endpoints without exposing API keys to the browser.
//
// Endpoints:
//  - POST /api/ai?action=shop_assistant
//  - POST /api/ai?action=admin_command
//  - POST /api/ai?action=news_draft
//
// Env vars required in Vercel (NOT VITE_*)
//  - OPENAI_API_KEY (optional if using OpenRouter)
//  - OPENROUTER_API_KEY (optional)
// Optional:
//  - OPENAI_MODEL (default: gpt-4o-mini)
//  - OPENROUTER_MODEL

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    const action = (req.query?.action || "").toString();

    let body = req.body;
    // Vercel may pass a string body depending on config
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    // Prefer OpenRouter if configured.
    const provider = openrouterKey ? "openrouter" : openaiKey ? "openai" : null;

    if (!provider) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error:
            "No AI provider key configured. Set OPENROUTER_API_KEY (recommended) or OPENAI_API_KEY in Vercel Environment Variables.",
        })
      );
      return;
    }

    const model =
      provider === "openrouter"
        ? process.env.OPENROUTER_MODEL || "openrouter/hunter-alpha"
        : process.env.OPENAI_MODEL || "gpt-4o-mini";

    const systemByAction = {
      shop_assistant:
        "You are DRS Esports Shop Assistant. Help users choose products, sizes, and answer questions. Use the provided catalog data. If the user asks for filtering, return a short recommendation list. If asked about size, give practical guidance and ask 1 clarifying question only if necessary.",
      admin_command:
        "You are DRS Admin AI Command Parser. Convert the admin's natural language into a JSON command for product management. Only output valid JSON matching the schema described in the developer message.",
      news_draft:
        "You are DRS Esports News Assistant. Write concise, hype but professional news drafts for an esports organization. Keep it factual based on given inputs. Output both a title and body.",
    };

    if (!systemByAction[action]) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Unknown action" }));
      return;
    }

    const developerByAction = {
      shop_assistant:
        "You will be given: message, catalog (products), optional wishlist/cart, and optional active filters. Respond in JSON with keys: reply (string, markdown allowed), suggestions (array of {id,name,price,reason} up to 5). If you can't find matching products, suggestions should be empty and reply should suggest how to adjust.",
      admin_command:
        "Return ONLY JSON. Schema: {\n  \"intent\": \"update_product\"|\"add_product\"|\"delete_product\"|\"filter\"|\"unknown\",\n  \"entities\": {\n    \"id\"?: number,\n    \"name\"?: string,\n    \"price\"?: number,\n    \"stock\"?: number,\n    \"category\"?: string,\n    \"featured\"?: boolean,\n    \"query\"?: string\n  },\n  \"confidence\": number\n}. If unsure, intent=unknown and set confidence low.",
      news_draft:
        "Respond in JSON with keys: title (string), category (string), body (string), hashtags (array of strings). Keep body under 180 words unless asked otherwise.",
    };

    const userMessage = (body?.message || "").toString();
    if (!userMessage) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing message" }));
      return;
    }

    const context = {
      ...(body?.catalog ? { catalog: body.catalog } : {}),
      ...(body?.wishlist ? { wishlist: body.wishlist } : {}),
      ...(body?.cart ? { cart: body.cart } : {}),
      ...(body?.filters ? { filters: body.filters } : {}),
      ...(body?.currentItem ? { currentItem: body.currentItem } : {}),
    };

    const messages = [
      { role: "system", content: systemByAction[action] },
      { role: "developer", content: developerByAction[action] },
      {
        role: "user",
        content:
          `Message: ${userMessage}\n\n` +
          `Context (JSON): ${JSON.stringify(context).slice(0, 12000)}`,
      },
    ];

    const url =
      provider === "openrouter"
        ? "https://openrouter.ai/api/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";

    const headers = {
      Authorization: `Bearer ${provider === "openrouter" ? openrouterKey : openaiKey}`,
      "Content-Type": "application/json",
      ...(provider === "openrouter"
        ? {
            "HTTP-Referer":
              req.headers?.origin || "https://drs-esports-react-ready.vercel.app",
            "X-Title": "DRS Esports",
          }
        : {}),
    };

    const openAIResp = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        temperature: action === "admin_command" ? 0.1 : 0.6,
        messages,
      }),
    });

    if (!openAIResp.ok) {
      const txt = await openAIResp.text();
      // Preserve upstream status when possible to avoid masking 4xx as 500.
      res.statusCode = openAIResp.status || 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "AI request failed",
          details: txt.slice(0, 2000),
        })
      );
      return;
    }

    const data = await openAIResp.json();
    const content = data?.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { reply: content };
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(parsed));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Server error",
        details: String(err?.message || err).slice(0, 2000),
      })
    );
  }
}
