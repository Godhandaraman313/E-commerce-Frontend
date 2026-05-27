import { useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await API.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message || "Password reset link sent to your email.");
      setEmail("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p style={{ color: "#aaa", fontSize: "14px", margin: "10px 0 20px 0" }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && (
          <div style={{ backgroundColor: "rgba(40, 167, 69, 0.2)", color: "#28a745", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: "rgba(220, 53, 69, 0.2)", color: "#dc3545", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p style={{ marginTop: "20px" }}>
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
