import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/home.css";
// import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.username);
    }
  }, []);

  // const handleLogout = () => {
  //   localStorage.clear();
  //   setUser(null);
  //   navigate("/login");
  // };

  return (
    <div className="home">

      {/* NAVBAR
      <nav className="navbar">
        <h2 className="logo">Shopme</h2>

        {user ? (
          <div className="userSection">
            <span>Hi, {user}</span>

            <button
              className="btn"
              onClick={() => navigate("/products")}
            >
              Products
            </button>

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
      */}

      {/* HERO */}
      <section className="hero">
        <h1>Welcome to Kaimart</h1>
        <p>Your one-stop shop for everything</p>

        {/* {!user && (
          <button
            className="cta"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        )} */}

        {/* {user && (
          <button
            className="cta"
            onClick={() => navigate("/products")}
          >
            Explore Products
          </button>
        )} */}
      </section>

      {/* CATEGORY SECTION REMOVED */}

      {/* <Footer /> */}

    </div>
  );
}