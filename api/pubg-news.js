export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Missing NEWS_API_KEY" });
      return;
    }

    const q =
      req.query?.q ||
      '"PUBG Mobile" OR "PUBG Mobile esports" OR "PUBG Mobile tournament"';

    const pageSizeRaw = Number(req.query?.pageSize || 20);
    const pageSize = Number.isFinite(pageSizeRaw)
      ? Math.min(Math.max(pageSizeRaw, 1), 50)
      : 20;

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", q);
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("language", "en");
    url.searchParams.set("pageSize", String(pageSize));

    const r = await fetch(url.toString(), {
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    const data = await r.json();

    if (!r.ok) {
      res.status(r.status).json({ error: data?.message || "NewsAPI error", raw: data });
      return;
    }

    // Minimal/clean payload to client
    const articles = (data.articles || []).map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      urlToImage: a.urlToImage,
      publishedAt: a.publishedAt,
      source: a.source?.name || "",
      author: a.author || "",
    }));

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json({ articles });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PUBG news" });
  }
}
