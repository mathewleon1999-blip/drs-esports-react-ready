import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PasswordReset() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "request"; // request | reset | success
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess("Password reset link has been sent to your email!");
    }, 1500);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess("Password has been reset successfully!");
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <section className="password-reset-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>
              {mode === "request" && "Reset Your Password"}
              {mode === "reset" && "Create New Password"}
              {mode === "success" && "Password Reset Complete"}
            </h1>
            <p>
              {mode === "request" && "Enter your email to receive a password reset link"}
              {mode === "reset" && "Enter your new password below"}
              {mode === "success" && "Your password has been reset successfully"}
            </p>
          </motion.div>
        </section>

        <section className="password-reset-section">
          {mode === "success" ? (
            <motion.div
              className="reset-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="success-icon">✓</div>
              <h2>Success!</h2>
              <p>{success}</p>
              <Link to="/login" className="primary-btn">
                Go to Login
              </Link>
            </motion.div>
          ) : mode === "reset" ? (
            <motion.div
              className="reset-form-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <form onSubmit={handleResetPassword}>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              className="reset-form-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <form onSubmit={handleRequestReset}>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </motion.div>
          )}

          <div className="reset-footer">
            <p>
              Remember your password? <Link to="/login">Sign in</Link>
            </p>
          </div>

          <div className="security-tips">
            <h3>🔒 Security Tips</h3>
            <ul>
              <li>Use at least 8 characters</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Add numbers and special characters</li>
              <li>Don't use personal information</li>
            </ul>
          </div>
        </section>
      </div>
      <Footer />

      <style>{`
        .password-reset-hero {
          padding: 100px 20px;
          text-align: center;
          background: radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), var(--gradient-dark);
        }

        .password-reset-hero h1 {
          font-size: clamp(32px, 6vw, 48px);
          margin-bottom: 15px;
        }

        .password-reset-hero p {
          color: var(--text-muted);
          font-size: 18px;
        }

        .password-reset-section {
          padding: 60px 20px;
          background: var(--dark-bg);
          max-width: 500px;
          margin: 0 auto;
        }

        .reset-form-container {
          background: var(--card-bg);
          padding: 40px;
          border-radius: 16px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .reset-form-container .form-group {
          margin-bottom: 20px;
        }

        .reset-form-container label {
          display: block;
          color: var(--text-muted);
          margin-bottom: 8px;
          font-size: 14px;
        }

        .reset-form-container input {
          width: 100%;
          padding: 14px 16px;
          background: var(--dark-bg);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 8px;
          color: var(--text-light);
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .reset-form-container input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
        }

        .reset-form-container .submit-btn {
          width: 100%;
          padding: 16px;
          background: var(--gradient-primary);
          border: none;
          border-radius: 8px;
          color: #000;
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .reset-form-container .submit-btn:hover:not(:disabled) {
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
        }

        .reset-form-container .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .reset-footer {
          text-align: center;
          margin-top: 25px;
        }

        .reset-footer a {
          color: var(--primary);
          font-weight: 600;
        }

        .reset-footer a:hover {
          text-shadow: 0 0 10px var(--primary);
        }

        .reset-success {
          background: var(--card-bg);
          padding: 60px 40px;
          border-radius: 16px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          text-align: center;
        }

        .reset-success .success-icon {
          width: 80px;
          height: 80px;
          background: rgba(74, 222, 128, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: #4ade80;
          margin: 0 auto 25px;
        }

        .reset-success h2 {
          font-size: 28px;
          margin-bottom: 15px;
        }

        .reset-success p {
          color: var(--text-muted);
          margin-bottom: 30px;
        }

        .security-tips {
          margin-top: 40px;
          padding: 25px;
          background: rgba(0, 212, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .security-tips h3 {
          font-size: 16px;
          margin-bottom: 15px;
          color: var(--primary);
        }

        .security-tips ul {
          list-style: none;
          display: grid;
          gap: 10px;
        }

        .security-tips li {
          color: var(--text-muted);
          font-size: 14px;
          padding-left: 20px;
          position: relative;
        }

        .security-tips li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--primary);
        }
      `}</style>
    </>
  );
}

export default PasswordReset;

