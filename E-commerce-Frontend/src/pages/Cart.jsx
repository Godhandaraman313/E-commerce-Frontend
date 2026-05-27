import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import QuantityControl from "../components/QuantityControl";
import { getProductImageUrl } from "../utils/productImage";
import "../styles/global.css";

export default function Cart() {
  const { cartItems, total, loading, fetchCart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (item, newQty) => {
    setUpdatingId(item.id);
    if (newQty < 1) {
      await removeItem(item.id);
    } else {
      await updateQuantity(item.id, newQty);
    }
    setUpdatingId(null);
  };

  if (loading) {
    return <div className="container py-5 text-center"><p>Loading cart...</p></div>;
  }

  return (
    <div className="container py-4" style={{ maxWidth: 1000 }}>
      <button type="button" className="btn btn-link text-decoration-none text-dark ps-0 mb-3 fw-medium" onClick={() => navigate("/")}>
        ← CONTINUE SHOPPING
      </button>

      <h3 className="mb-4 fw-bold" style={{ letterSpacing: "1px" }}>SHOPPING BAG {cartItems.length > 0 && `(${cartItems.length} ITEMS)`}</h3>

      {cartItems.length === 0 ? (
        <div className="text-center py-5 border bg-white">
          <p className="text-muted mb-4">There is nothing in your bag. Let's add some items.</p>
          <button type="button" className="btn btn-primary px-5" onClick={() => navigate("/")}>
            WISHLIST NOW
          </button>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <div key={item.id} className="card mb-3 border-0 border-bottom pb-3 position-relative overflow-hidden" style={{ background: "transparent" }}>
                <div
                  style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `url(${getProductImageUrl({ id: item.productId, imageUrl: item.imageUrl || item.product?.imageUrl }, 100, 100)})`,
                    backgroundSize: "cover", backgroundPosition: "center", filter: "blur(40px) saturate(2)", opacity: 0.08, zIndex: 0, pointerEvents: "none"
                  }}
                />
                <div className="card-body p-0 row position-relative z-1">
                  <div className="col-auto">
                    <div className="bg-white p-2 border shadow-sm me-2">
                      <img
                        src={getProductImageUrl({ id: item.productId, imageUrl: item.imageUrl || item.product?.imageUrl }, 100, 100)}
                        alt=""
                        style={{ width: 90, height: 110, objectFit: "contain" }}
                      />
                    </div>
                  </div>
                  <div className="col d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="mb-1 fw-bold">{item.productName}</h6>
                      <p className="text-muted small mb-2">{item.category}</p>
                      <p className="fw-semibold mb-2">₹{item.price}</p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-auto">
                      <QuantityControl
                        quantity={item.quantity}
                        disabled={updatingId === item.id}
                        onChange={(qty) => handleQuantityChange(item, qty)}
                      />
                      <button
                        type="button"
                        className="btn btn-link text-danger text-decoration-none p-0 fw-semibold"
                        style={{ fontSize: "0.8rem" }}
                        onClick={() => removeItem(item.id)}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                  <div className="col-auto text-end">
                    <p className="fw-bold fs-5">₹{item.subtotal}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-start mt-3">
              <button type="button" className="btn btn-outline-dark btn-sm" onClick={clearCart}>
                EMPTY BAG
              </button>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card p-4 bg-light border-0">
              <h6 className="fw-bold mb-3 border-bottom pb-2">PRICE DETAILS</h6>
              <div className="d-flex justify-content-between mb-2 small text-muted">
                <span>Total MRP</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 small text-muted">
                <span>Platform Fee</span>
                <span className="text-success">FREE</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small text-muted">
                <span>Shipping Fee</span>
                <span className="text-success">FREE</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <button type="button" className="btn btn-primary w-100 py-3" onClick={() => navigate("/checkout")}>
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
