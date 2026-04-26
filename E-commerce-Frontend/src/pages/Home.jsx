import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.username); // ✅ show username
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login"); // ✅ redirect after logout
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">Kaimart</h2>

        {user ? (
          <div className="userSection">
            <span>Hi, {user}</span>

            {/* ✅ NEW: CART BUTTON */}
            <button
              className="btn"
              onClick={() => navigate("/cart")}
            >
              Cart
            </button>

            <button
              className="btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1>Welcome to Kaimart</h1>
        <p>Your one-stop shop for everything</p>

        {!user && (
          <button
            className="cta"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <h2>Categories</h2>

        <div className="grid">
          <div
            className="card"
            onClick={() => navigate("/category/electronics")}
          >
            Electronics
          </div>

          <div
            className="card"
            onClick={() => navigate("/category/fashion")}
          >
            Fashion
          </div>

          <div
            className="card"
            onClick={() => navigate("/category/groceries")}
          >
            Groceries
          </div>

          <div
            className="card"
            onClick={() => navigate("/category/accessories")}
          >
            Accessories
          </div>
        </div>
      </section>

    </div>
  );
}