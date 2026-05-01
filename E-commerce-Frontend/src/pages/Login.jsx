import { useState } from "react";
import API from "../api/api";
import { Link, useLocation } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and Password are required");
      return;
    }

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      const { token, username, email: userEmail } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ username, email: userEmail })
      );

      window.location.href = from; // ✅ SMART redirect

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Kaimart Login</h2>

        <form onSubmit={handleLogin}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button type="submit">Login</button>
        </form>

        <p>
          New user? <Link to="/register">Register</Link>
        </p>

        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}