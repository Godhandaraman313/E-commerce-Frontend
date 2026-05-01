import API from "./api";

/* ================= AUTH ================= */
export const AuthAPI = {
  login: (data) => API.post("/api/auth/login", data),
  register: (data) => API.post("/api/auth/register", data),
  resetPassword: (data) => API.post("/api/auth/reset-password", data),
};

/* ================= ACCOUNT ================= */
export const AccountAPI = {
  getAccount: () => API.get("/api/account"),
  updateAccount: (data) => API.put("/api/account", data),
};

/* ================= COUNTRIES ================= */
export const CountryAPI = {
  getAll: () => API.get("/api/countries"),
};

/* ================= ADDRESS ================= */
export const AddressAPI = {
  getAll: () => API.get("/api/address_book"),
  delete: (id) => API.delete(`/api/address_book/${id}`),
};

/* ================= PRODUCTS ================= */
export const ProductAPI = {
  getAll: (params) => API.get("/api/products", { params }),
  create: (data) => API.post("/api/products", data),
  update: (id, data) => API.put(`/api/products/${id}`, data),
  delete: (id) => API.delete(`/api/products/${id}`),
};

/* ================= CHECKOUT ================= */
export const CheckoutAPI = {
  get: () => API.get("/api/checkout"),
  placeOrder: (data) => API.post("/api/orders", data),
};

/* ================= CART ================= */
export const CartAPI = {
  get: () => API.get("/api/cart"),
};