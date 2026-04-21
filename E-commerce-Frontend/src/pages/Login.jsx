import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({ email, password });

      // Store user session
      localStorage.setItem("user", JSON.stringify(res.data));

      // Redirect to dashboard
      navigate("/products");

    } catch (err) {
      alert(err.response?.data || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Welcome Back 👋</h2>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Login to your account
        </p>

        <input
          className="auth-input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Extra Links */}
        <div style={{ marginTop: "15px" }}>
          <p>
            Don’t have an account?{" "}
            <Link to="/register">Register</Link>
          </p>

          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>

      </div>
    </div>
  );
}