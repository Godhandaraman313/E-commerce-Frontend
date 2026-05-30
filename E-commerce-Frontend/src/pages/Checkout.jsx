import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import { getProductImageUrl } from "../utils/productImage";

export default function Checkout() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    setError("Please login to checkout");
    return;
  }

  API.get("/api/checkout")
    .then((res) => {
      setData(res.data);
      setError("");
    })
    .catch((err) => {
      setData(null);
      setError(
        err.response?.data?.message ||
          "Checkout failed. Add items to cart and try again."
      );
    });
}, []);

  const placeCODOrder = async () => {
    try {
      setPlacing(true);
      const res = await API.post("/api/orders", { method: "COD" });
      sessionStorage.setItem("lastOrderId", String(res.data.orderId ?? ""));
      await fetchCart();
      alert("Order placed successfully!");
      navigate("/order-completed");
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  if (error) {
    return (
      <div className="container text-center mt-5">
        <h2>Checkout</h2>
        <p className="text-danger">{error}</p>
        {!isLoggedIn && (
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
        <button
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/")}
        >
          Back to products
        </button>
      </div>
    );
  }

  if (!data) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  const info = data.checkoutInfo;

  return (
    <div className="container py-4" style={{ maxWidth: 1000 }}>
      <button type="button" className="btn btn-link text-decoration-none text-dark ps-0 mb-3 fw-medium" onClick={() => navigate("/cart")}>
        ← BACK TO BAG
      </button>

      <h3 className="mb-4 fw-bold text-center" style={{ letterSpacing: "1px" }}>CHECKOUT</h3>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-0 mb-4">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="mb-0 fw-semibold text-uppercase" style={{ fontSize: "0.9rem" }}>Delivery Address</h5>
            </div>
            <div className="card-body p-4">
              <p className="mb-1 text-dark fw-medium" style={{ fontSize: "0.95rem" }}>
                {data.shippingAddress}
              </p>
              <p className="text-muted small mb-0">Expected Delivery: {info?.deliverDate}</p>
            </div>
          </div>

          <div className="card shadow-sm border-0 rounded-0">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="mb-0 fw-semibold text-uppercase" style={{ fontSize: "0.9rem" }}>Payment Options</h5>
            </div>
            <div className="card-body p-4">
              {info?.codSupported && (
                <div className="border p-3 mb-3 border-dark bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold d-block">Cash on Delivery (Cash/UPI)</span>
                    <span className="text-muted small">Pay at your doorstep</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={placeCODOrder}
                    disabled={placing}
                  >
                    {placing ? "PLACING ORDER..." : "PLACE ORDER"}
                  </button>
                </div>
              )}

              <div className="border p-3 text-muted d-flex justify-content-between align-items-center" style={{ backgroundColor: "#f9f9f9", opacity: 0.7 }}>
                <div>
                  <span className="fw-bold d-block">Pay with PayPal</span>
                  <span className="small">Coming soon</span>
                </div>
                <button className="btn btn-outline-secondary btn-sm" disabled>UNAVAILABLE</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-4 bg-light border-0">
            <h6 className="fw-bold mb-3 border-bottom pb-2">ORDER SUMMARY</h6>
            
            <div className="mb-4">
              {data.cartItems?.length === 0 && <p>No items in cart</p>}
              {data.cartItems?.map((item) => (
                <div key={item.product?.id} className="d-flex align-items-center mb-3">
                  <img 
                    src={getProductImageUrl(item.product, 40, 40)} 
                    alt={item.product?.shortName}
                    width={40}
                    height={40}
                    className="object-fit-cover me-3"
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold" style={{ fontSize: "0.85rem" }}>{item.product?.shortName}</div>
                    <div className="text-muted small">Qty: {item.quantity}</div>
                  </div>
                  <span className="fw-bold fs-6">₹{item.subtotal}</span>
                </div>
              ))}
            </div>

            <h6 className="fw-bold mb-3 border-bottom pb-2">PRICE DETAILS</h6>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Total MRP</span>
              <span>₹{info?.productTotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Platform Fee</span>
              <span className="text-success">FREE</span>
            </div>
            <div className="d-flex justify-content-between mb-3 small text-muted">
              <span>Shipping Fee</span>
              <span>₹{info?.shippingCostTotal}</span>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between mt-3 fw-bold fs-5">
              <span>Total Amount</span>
              <span>₹{info?.paymentTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}