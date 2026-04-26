import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8282/api/auth/login",
        { email, password }
      );

      // ✅ FIX: store only user object
      localStorage.setItem("user", JSON.stringify(res.data.data));

      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Kaimart Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          New user? <Link className="link" to="/register">Register</Link>
        </p>

        <p>
          <Link className="link" to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}