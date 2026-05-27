import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdmin, isLoggedIn } from "../utils/auth";

export default function ProtectedAdminRoute() {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
