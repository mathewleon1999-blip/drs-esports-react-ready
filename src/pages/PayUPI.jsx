import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createOrder } from "../lib/ordersRepo";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const getLocalStorage = (key, defaultValue) => {
  try {
    if (typeof window === "undefined") return defaultValue;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

export default function PayUPI() {
  const navigate = useNavigate();
  const query = useQuery();

  const orderDraftId = query.get("order") || "";

  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const UPI_VPA = "drsesports@upi";
  const UPI_PAYEE_NAME = "DRS Esports";

  const draft = useMemo(() => {
    if (!orderDraftId) return null;
    const drafts = getLocalStorage("drs-order-drafts", []);
    return drafts.find((d) => d.draftId === orderDraftId) || null;
  }, [orderDraftId]);

  const upiUri = useMemo(() => {
    if (!draft) return "";
    const params = new URLSearchParams({
      pa: UPI_VPA,
      pn: UPI_PAYEE_NAME,
      am: String(Number(draft.total || 0)),
      cu: "INR",
      tn: `Order ${draft.id}`.slice(0, 80),
      tr: draft.id,
    });
    return `upi://pay?${params.toString()}`;
  }, [draft]);

  useEffect(() => {
    if (!orderDraftId) setError("Missing payment reference.");
  }, [orderDraftId]);

  const confirmPayment = async () => {
    if (!draft) {
      setError("Order draft not found. Please go back to cart and try again.");
      return;
    }

    const trimmed = String(utr || "").trim();
    if (trimmed.length < 8) {
      setError("Please enter a valid UTR / transaction id.");
      return;
    }

    setLoading(true);
    setError("");

    const order = {
      ...draft,
      status: "pending",
      paymentMethod: "upi",
      paymentStatus: "pending_verification",
      utr: trimmed,
      date: new Date().toISOString(),
      createdAt: new Date().toLocaleString(),
    };

    // Save locally
    const existingOrders = getLocalStorage("drs-orders", []);
    setLocalStorage("drs-orders", [order, ...existingOrders]);

    // Save to Supabase
    try {
      const { error: supaError } = await createOrder(order);
      if (supaError) {
        setError(supaError.message || "Supabase order insert failed");
        setLoading(false);
        return;
      }
    } catch {
      setError("Supabase order insert crashed");
      setLoading(false);
      return;
    }

    // Remove draft
    const drafts = getLocalStorage("drs-order-drafts", []);
    setLocalStorage(
      "drs-order-drafts",
      drafts.filter((d) => d.draftId !== orderDraftId)
    );

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      navigate("/order-tracking");
    }, 900);
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="order-success" style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="success-icon">✅</div>
            <h1>Payment Submitted</h1>
            <p style={{ color: "var(--text-muted)" }}>
              Your UPI payment reference has been submitted. Your order will be verified by admin.
            </p>
            <div className="success-actions">
              <Link to="/order-tracking" className="primary-btn">Track Order</Link>
              <Link to="/shop" className="secondary-btn">Continue Shopping</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <section className="checkout-content" style={{ paddingTop: 120 }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1>Pay with UPI</h1>
              <p style={{ color: "var(--text-muted)" }}>
                Scan the QR and complete payment. Then enter your UTR/Transaction ID to place the order.
              </p>

              {error ? (
                <div className="error-message" style={{ marginTop: 16 }}>
                  {error}
                </div>
              ) : null}

              {!draft ? (
                <div className="empty-state" style={{ marginTop: 24 }}>
                  <p>Order draft not found.</p>
                  <Link to="/cart" className="primary-btn">Back to Cart</Link>
                </div>
              ) : (
                <div className="profile-card" style={{ marginTop: 24 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Order</div>
                        <div style={{ fontFamily: "Orbitron, sans-serif", color: "var(--primary)" }}>{draft.id}</div>
                      </div>
                      <div>
                        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Amount</div>
                        <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: 22 }}>₹{Number(draft.total || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>UPI ID</div>
                        <div style={{ fontFamily: "Orbitron, sans-serif" }}>{UPI_VPA}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                      <a className="primary-btn" href={upiUri}>
                        Open UPI App
                      </a>
                      <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                        If you are on mobile, this will open your UPI app.
                      </span>
                    </div>

                    <div className="form-group" style={{ marginTop: 8 }}>
                      <label>UTR / Transaction ID *</label>
                      <input
                        type="text"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                        placeholder="Enter UTR after payment"
                      />
                    </div>

                    <button
                      className="place-order-btn"
                      onClick={confirmPayment}
                      disabled={loading}
                    >
                      {loading ? "Submitting…" : "I Have Paid (Submit UTR)"}
                    </button>

                    <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 10 }}>
                      Note: Orders are verified by admin. Please enter the correct UTR.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
