import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:8282/api/auth/login", {
      email,
      password,
    });

    // ✅ STORE LOGIN STATE
    localStorage.setItem("user", JSON.stringify(res.data));

    alert("Login success");
    navigate("/products");

  } catch (err) {
    alert("Login failed");
  }
};

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AuthPage;