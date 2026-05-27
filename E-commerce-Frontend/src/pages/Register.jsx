import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Standard email regex
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  };

  const handleRegister = async () => {
    if (!validateEmail(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/api/auth/register", form);
      setMessage(response.data);
      setForm({ username: "", email: "", password: "", confirmPassword: "" });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        alert(err.response.data.message || err.response.data);
      } else {
        alert("Register failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Kaimart Register</h2>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
            {message}
          </div>
        )}

        <input 
          placeholder="Username" 
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} 
          disabled={loading}
        />
        <input 
          placeholder="Email" 
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
          disabled={loading}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
          disabled={loading}
        />
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
          disabled={loading}
        />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>Already have account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}