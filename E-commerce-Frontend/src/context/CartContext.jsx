import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartAPI } from "../api/ApiServices";
import API from "../api/api";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!(token && token !== "undefined" && token !== "null");
  };

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn()) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const res = await API.get("/api/cart");
      setCartItems(res.data);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product) => {
    if (!isLoggedIn()) {
      alert("Please login to add items to cart");
      return false;
    }

    try {
      await API.post(`/api/cart/add/${product.id}`);
      await fetchCart();
      return true;
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
      return false;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity < 1) {
        await CartAPI.removeItem(cartItemId);
      } else {
        await CartAPI.updateQuantity(cartItemId, quantity);
      }
      await fetchCart();
      return true;
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
      return false;
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await CartAPI.removeItem(cartItemId);
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn()) return;

    try {
      await API.delete("/api/cart/clear");
      setCartItems([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to clear cart");
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const cart = cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.productName,
    price: item.price,
    qty: item.quantity,
    subtotal: item.subtotal,
  }));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cart,
        cartCount,
        total,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
