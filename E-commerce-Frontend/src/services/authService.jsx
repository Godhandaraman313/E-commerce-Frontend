import API from "../api/api";

// REGISTER
export const registerUser = (data) => {
  return API.post("/auth/register", data);
};

// LOGIN
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

// RESET PASSWORD
export const resetPassword = (data) => {
  return API.put("/auth/forgot-password", data);
};