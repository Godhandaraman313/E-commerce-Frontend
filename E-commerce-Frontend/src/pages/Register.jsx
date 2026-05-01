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

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.post("/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        alert(err.response.data.message);
      } else {
        alert("Register failed");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Kaimart Register</h2>

        <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input type="password" placeholder="Confirm Password" onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />

        <button onClick={handleRegister}>Register</button>

        <p>Already have account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}