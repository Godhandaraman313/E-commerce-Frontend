import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, total, updateQty, removeFromCart } = useCart();
  console.log("CART DATA:", cart);
  const navigate = useNavigate();

  return (
    <div className="home" style={{ padding: "40px" }}>

      <button className="btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <h1 style={{ marginTop: "20px" }}>Your Cart</h1>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.map((item) => (
          <div className="productCard" key={item.id}>
            <h3>{item.name}</h3>

            <p>Price: ₹{item.price}</p>

            {/* ✅ QUANTITY */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => updateQty(item.id, "dec")}>-</button>
              <span>Qty: {item.qty}</span>
              <button onClick={() => updateQty(item.id, "inc")}>+</button>
            </div>

            {/* ✅ REMOVE */}
            <button
              className="btn"
              onClick={() => removeFromCart(item.id)}
              style={{ marginTop: "10px", background: "red" }}
            >
              Remove
            </button>
          </div>
        ))
      )}

      {/* ✅ TOTAL */}
      <h2 style={{ marginTop: "20px" }}>
        Total: ₹{total.toLocaleString()}
      </h2>
    </div>
  );
}