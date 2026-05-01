// ResetPassword.jsx  (from reset_password_form.html :contentReference[oaicite:2]{index=2})

import { useState } from "react";
import { AuthAPI } from "../api/ApiServices.js";
//import Header from "../components/Header";
//import Footer from "../components/Footer";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirm) return alert("Passwords do not match");

  try {
    await AuthAPI.resetPassword({ token, password });
    alert("Password changed");
  } catch {
    alert("Failed");
  }
};
  return (
    <div className="container-fluid text-center">
      <Header />

      <h2>Reset Your Password</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 420, margin: "0 auto" }}>
        <div className="border p-3">

          <input
            type="password"
            className="form-control mb-2"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button className="btn btn-primary">Change Password</button>

        </div>
      </form>

      <Footer />
    </div>
  );
}