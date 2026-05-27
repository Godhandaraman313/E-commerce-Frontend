import Header from "./Header";

import Footer from "./Footer";
import { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.firstName || parsed.username || parsed.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Hide Header on /login and /register routes
  const hideHeader = ["/login", "/register"].includes(window.location.pathname);

  return (
    <div className="appLayout">

      {!hideHeader && <Header user={user} handleLogout={handleLogout} />}

      <main className="mainContent">
        {children}
      </main>

      <Footer />

    </div>
  );
}