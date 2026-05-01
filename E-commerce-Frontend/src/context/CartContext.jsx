import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};

export function CartProvider({ children }) {

  // ✅ FIXED INITIAL STATE
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // SAVE
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ADD
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // REMOVE
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  // UPDATE QTY
  const updateQty = (id, type) => {
    setCart((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const qty = type === "inc" ? p.qty + 1 : p.qty - 1;
          return { ...p, qty: qty > 0 ? qty : 1 };
        }
        return p;
      })
    );
  };

  // TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, total }}
    >
      {children}
    </CartContext.Provider>
  );
}