import { useState } from "react";
import API from "../api/api";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from query params
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid reset token. Please request another reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await API.post("/api/auth/reset-password", {
        token,
        password,
      });

      setMessage(res.data.message || "Password successfully reset!");
      alert("Password successfully reset! Redirecting to login page...");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to reset password. Token may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p style={{ color: "#aaa", fontSize: "14px", margin: "10px 0 20px 0" }}>
          Enter and confirm your new password below.
        </p>

        {!token && (
          <div style={{ backgroundColor: "rgba(220, 53, 69, 0.2)", color: "#dc3545", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
            No valid reset token found in the URL. Please request a new password reset.
          </div>
        )}

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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            disabled={loading || !token}
            required
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            disabled={loading || !token}
            required
          />

          <button type="submit" disabled={loading || !token}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p style={{ marginTop: "20px" }}>
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
