import axios from "axios";

// =====================================================
// AXIOS INSTANCE
// =====================================================

const API = axios.create({
  baseURL: "http://localhost:8282",
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

API.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    // Attach JWT token automatically
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

API.interceptors.response.use(

  // SUCCESS
  (response) => response,

  // ERROR
  (error) => {

    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";

    // =========================================
    // UNAUTHORIZED
    // =========================================

    if (status === 401) {

      console.error("Unauthorized - Token expired");

      localStorage.clear();

      window.location.href = "/login";
    }

    // =========================================
    // FORBIDDEN
    // =========================================

    if (status === 403) {
      const isCartOrCheckout =
        requestUrl.includes("/api/cart") ||
        requestUrl.includes("/api/checkout");

      if (!isCartOrCheckout) {
        console.error(
          "Forbidden - You do not have permission"
        );
      }
    }

    // =========================================
    // SERVER ERROR
    // =========================================

    if (status === 500) {

      console.error(
        "Internal Server Error"
      );
    }

    return Promise.reject(error);
  }
);

export default API;