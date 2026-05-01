import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
export default function Header({ user, handleLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container-fluid">

        <Link className="navbar-brand" to="/">
          <img src={logo} alt="logo" height="40" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#topNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="topNavbar">

          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart</Link>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/account">Account</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/address-book">Address</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/checkout">Checkout</Link>
                </li>
              </>
            )}

          </ul>

          <div className="d-flex align-items-center text-white">

            {user ? (
              <>
                <span className="me-3">Hi, {user}</span>
                <button
                  className="btn btn-outline-light"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-light"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}