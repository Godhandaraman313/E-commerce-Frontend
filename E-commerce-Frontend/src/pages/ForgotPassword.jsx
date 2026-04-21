import { useState } from "react";
import { resetPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    try {
      const res = await resetPassword({ email, password });
      alert(res.data);
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleReset}>Reset</button>
    </div>
  );
}