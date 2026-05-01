import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, total, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: "40px" }}>

      <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center mt-5">
          <p>No items in cart</p>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div className="card mb-3 p-3" key={item.id}>
              <h5>{item.name}</h5>
              <p>₹{item.price}</p>

              <div className="d-flex gap-2">
                <button onClick={() => updateQty(item.id, "dec")}>-</button>
                <span>Qty: {item.qty}</span>
                <button onClick={() => updateQty(item.id, "inc")}>+</button>
              </div>

              <button
                className="btn btn-danger mt-2"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <h3>Total: ₹{total.toLocaleString()}</h3>

          <button
            className="btn btn-success mt-3"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}