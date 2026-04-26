import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    try {
      await axios.put(
        "http://localhost:8282/api/auth/forgot-password",
        { email, password }
      );

      alert("Password updated");
    } catch {
      alert("Reset failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Reset Password</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleReset}>Reset Password</button>

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}