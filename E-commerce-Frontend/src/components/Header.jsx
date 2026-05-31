import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { isAdmin } from "../utils/auth";
import logo from "../assets/logo.png";
import SearchNav from "./SearchNav";

export default function Header({ user, handleLogout }) {
  const navigate = useNavigate();
  const { cartCount } = useCart();

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
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {isAdmin() && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/orders">
                  Fulfill Orders
                </Link>
              </li>
            )}

            {isAdmin() && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/products">
                  Manage Products
                </Link>
              </li>
            )}

            {isAdmin() && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/brands">
                  Manage Brands
                </Link>
              </li>
            )}
          </ul>

          <div className="mx-auto" style={{ width: "50%", minWidth: "300px" }}>
            <SearchNav />
          </div>

          <ul className="navbar-nav ms-auto align-items-center">
            {!isAdmin() && (
              <li className="nav-item me-3">
                <Link className="nav-link d-flex align-items-center gap-1" to="/cart">
                  <span style={{ fontSize: "1.2rem" }}>🛒</span> Cart 
                  {cartCount > 0 && <span className="badge bg-warning text-dark ms-1 rounded-pill">{cartCount}</span>}
                </Link>
              </li>
            )}

            {user && !isAdmin() && (
              <li className="nav-item">
                <Link className="nav-link" to="/checkout">
                  Checkout
                </Link>
              </li>
            )}

            {user && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="settingsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Settings
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="settingsDropdown">
                  <li>
                    <Link className="dropdown-item" to="/account">
                      Account
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/address-book">
                      Address
                    </Link>
                  </li>
                  {!isAdmin() && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/orders">
                          My Orders
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/my-reviews">
                          My Reviews
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center text-white ms-3">
            {user ? (
              <div className="d-flex align-items-center gap-3 me-3">
                <span className="text-light" style={{ fontSize: "0.95rem" }}>Hi, {user}</span>
                <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div className="d-flex flex-column lh-1 me-3" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
                <small className="text-muted" style={{ fontSize: "0.75rem" }}>Hello, sign in</small>
                <span className="fw-bold">Account & Lists</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
