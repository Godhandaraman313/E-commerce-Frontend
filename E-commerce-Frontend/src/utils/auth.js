export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAdmin() {
  const user = getStoredUser();
  return user?.role?.toUpperCase() === "ADMIN";
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
