import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep logging minimal; avoid leaking sensitive info.
    console.error("UI ERROR:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const details =
        (this.state.error && (this.state.error.stack || this.state.error.message)) || "";

      return (
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
          <h1>Something went wrong</h1>
          <p>Please refresh the page. If the issue persists, contact support.</p>

          {/* Show debug details to help fix production crashes (can be removed later) */}
          {details ? (
            <pre
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 8,
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.12)",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              {String(details)}
            </pre>
          ) : null}

          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.25)",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
