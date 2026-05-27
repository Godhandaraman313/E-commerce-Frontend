import API from "./api";

/* ================= AUTH ================= */
export const AuthAPI = {
  login: (data) => API.post("/api/auth/login", data),
  register: (data) => API.post("/api/auth/register", data),
  verify: (code) => API.get(`/api/auth/verify?code=${code}`),
  forgotPassword: (data) => API.post("/api/auth/forgot-password", data),
  resetPassword: (data) => API.post("/api/auth/reset-password", data),
};

/* ================= ACCOUNT ================= */
export const AccountAPI = {
  getAccount: () => API.get("/api/account"),
  updateAccount: (data) => API.put("/api/account", data),
};

/* ================= COUNTRIES ================= */
export const CountryAPI = {
  list: () => API.get("/countries/list"),
  getAll: () => API.get("/countries/list"),
};

/* ================= CATEGORIES ================= */
export const CategoryAPI = {
  list: () => API.get("/api/categories"),
};

/* ================= ADDRESS ================= */
export const AddressAPI = {
  getAll: () => API.get("/api/address_book"),
  getById: (id) => API.get(`/api/address_book/${id}`),
  create: (data) => API.post("/api/address_book", data),
  update: (id, data) => API.put(`/api/address_book/${id}`, data),
  setDefault: (id) => API.patch(`/api/address_book/${id}/default`),
  delete: (id) => API.delete(`/api/address_book/${id}`),
};

/* ================= PRODUCTS ================= */
export const ProductAPI = {
  getAll: (params) =>
    // normalize backend responses so frontend components can rely on { data.content, data.totalPages }
    API.get("/api/products", { params }).then((res) => {
      const raw = res.data;
      const content = raw?.content ?? raw ?? [];
      const totalPages = raw?.totalPages ?? (Array.isArray(raw) ? 1 : 0);
      return { ...res, data: { content, totalPages, raw } };
    }),
  getById: (id) => API.get(`/api/products/${id}`),
  create: (data) => API.post("/api/products", data),
  update: (id, data) => API.put(`/api/products/${id}`, data),
  delete: (id) => API.delete(`/api/products/${id}`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return API.post(`/api/products/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteThumbnail: (id) => API.delete(`/api/products/${id}/image`),
  deleteExtraImage: (id, imagePath) => API.delete(`/api/products/${id}/extra-images`, { params: { imagePath } }),
};

/* ================= REVIEWS ================= */
export const ReviewAPI = {
  listByProduct: (productId, params) =>
    API.get(`/api/products/${productId}/reviews`, { params }),
  create: (productId, data) =>
    API.post(`/api/products/${productId}/reviews`, data),
  myReviews: () => API.get("/api/reviews/me"),
  remove: (id) => API.delete(`/api/reviews/${id}`),
};

/* ================= CART ================= */
export const CartAPI = {
  get: () => API.get("/api/cart"),
  add: (productId) => API.post(`/api/cart/add/${productId}`),
  addWithBody: (data) => API.post("/api/cart/add", data),
  updateQuantity: (cartItemId, quantity) =>
    API.put(`/api/cart/items/${cartItemId}/quantity`, { quantity }),
  removeItem: (cartItemId) => API.delete(`/api/cart/items/${cartItemId}`),
  getTotal: () => API.get("/api/cart/total"),
  clear: () => API.delete("/api/cart/clear"),
};

/* ================= CHECKOUT ================= */
export const CheckoutAPI = {
  get: () => API.get("/api/checkout"),
  placeOrder: (data) => API.post("/api/orders", data),
};

/* ================= ORDERS (Shopme customer orders) ================= */
export const OrderAPI = {
  list: (params) => API.get("/api/orders", { params }),
  getById: (id) => API.get(`/api/orders/${id}`),
  place: (data) => API.post("/api/orders", data),
  requestReturn: (id, data) => API.post(`/api/orders/${id}/return`, data),
};

/* ================= ADMIN ORDERS (Shopme BackEnd shipper) ================= */
export const AdminOrderAPI = {
  list: (params) => API.get("/api/admin/orders", { params }),
  getById: (id) => API.get(`/api/admin/orders/${id}`),
  updateStatus: (id, data) => API.patch(`/api/admin/orders/${id}/status`, data),
};

/* ================= ADMIN SETTINGS ================= */
export const AdminSettingAPI = {
  getAll: () => API.get("/api/admin/settings"),
  getByCategory: (category) => API.get(`/api/admin/settings/category/${category}`),
  saveGeneral: (settings) => API.post("/api/admin/settings/save_general", settings),
  saveMailServer: (settings) => API.post("/api/admin/settings/save_mail_server", settings),
  saveMailTemplates: (settings) => API.post("/api/admin/settings/save_mail_templates", settings),
  savePayment: (settings) => API.post("/api/admin/settings/save_payment", settings),
};

/* ================= BRANDS ================= */
export const BrandAPI = {
  list: (params) => API.get("/api/brands", { params }),
  listAll: () => API.get("/api/brands/all"),
  getById: (id) => API.get(`/api/brands/${id}`),
  create: (data) => API.post("/api/brands", data),
  update: (id, data) => API.put(`/api/brands/${id}`, data),
  delete: (id) => API.delete(`/api/brands/${id}`),
  uploadLogo: (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return API.post(`/api/brands/${id}/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
