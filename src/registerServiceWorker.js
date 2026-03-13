export function registerServiceWorker() {
  // Keep SW disabled in development to avoid caching headaches.
  if (import.meta.env.DEV) return;

  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
    } catch (err) {
      // Avoid noisy logs in production.
      console.warn("Service worker registration failed");
    }
  });
}
