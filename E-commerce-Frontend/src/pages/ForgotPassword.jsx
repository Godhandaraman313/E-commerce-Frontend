import { useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ added

  const handleReset = async () => {

    if (!email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/api/auth/reset-password", {
        email,
        password,
      });

      alert(res.data);

      // ✅ reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // ✅ REDIRECT (main fix)
      navigate("/login");

    } catch (err) {
      console.error("RESET ERROR:", err);

      if (err.response && err.response.data) {
        alert(err.response.data.message);
      } else {
        alert("Server not reachable");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Reset Password</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleReset} disabled={loading}>
          {loading ? "Updating..." : "Reset Password"}
        </button>

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}