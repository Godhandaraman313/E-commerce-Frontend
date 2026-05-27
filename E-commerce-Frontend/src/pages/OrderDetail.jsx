import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { OrderAPI } from "../api/ApiServices";
import "../styles/orders.css";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const loadOrder = () => {
    Promise.resolve().then(() => setLoading(true));
    OrderAPI.getById(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.response?.data?.message || "Order not found"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitReturn = async (e) => {
    e.preventDefault();
    if (!returnReason.trim()) {
      alert("Please select a return reason");
      return;
    }
    setSubmittingReturn(true);
    try {
      await OrderAPI.requestReturn(id, { reason: returnReason, note: returnNote });
      setShowReturnForm(false);
      loadOrder();
      alert("Return request submitted");
    } catch (err) {
      alert(err.response?.data?.message || "Return request failed");
    } finally {
      setSubmittingReturn(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading order...</p>;

  if (error || !order) {
    return (
      <div className="container text-center mt-5">
        <p className="text-danger">{error || "Order not found"}</p>
        <Link to="/orders" className="btn btn-primary">Back to My Orders</Link>
      </div>
    );
  }

  const productSubtotal = order.items?.reduce((s, i) => s + i.subtotal, 0) ?? 0;
  const shippingCost = Math.max(0, order.total - productSubtotal);

  return (
    <div className="orders-page container py-3">
      <nav className="mb-3">
        <Link to="/orders">← My Orders</Link>
      </nav>

      <h2>Order #{order.id}</h2>
      <p className="text-muted">{new Date(order.createdAt).toLocaleString()}</p>

      <ul className="nav nav-tabs mb-3">
        {["overview", "products", "shipping", "track"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              type="button"
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {activeTab === "overview" && (
        <div className="card">
          <div className="card-body">
            <p><b>Status:</b> {order.status}</p>
            <p><b>Payment:</b> {order.paymentMethod}</p>
            <p><b>Product cost:</b> ₹{productSubtotal.toFixed(2)}</p>
            <p><b>Shipping:</b> ₹{shippingCost.toFixed(2)}</p>
            <p><b>Total:</b> ₹{order.total}</p>

            {order.returnRequested && (
              <div className="alert alert-warning mt-3">
                <b>Return requested</b>
                <br />
                Reason: {order.returnReason}
                {order.returnNote && (
                  <>
                    <br />
                    Note: {order.returnNote}
                  </>
                )}
              </div>
            )}

            {order.canRequestReturn && !showReturnForm && (
              <button
                type="button"
                className="btn btn-outline-danger mt-3"
                onClick={() => setShowReturnForm(true)}
              >
                Request Return
              </button>
            )}

            {showReturnForm && (
              <form className="mt-3 border rounded p-3" onSubmit={submitReturn}>
                <h5>Return This Order</h5>
                <select
                  className="form-select mb-2"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  required
                >
                  <option value="">Select reason</option>
                  <option value="Defective product">Defective product</option>
                  <option value="Wrong item received">Wrong item received</option>
                  <option value="Item not as described">Item not as described</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Other">Other</option>
                </select>
                <textarea
                  className="form-control mb-2"
                  placeholder="Additional notes (optional)"
                  rows={3}
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                />
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-danger" disabled={submittingReturn}>
                    {submittingReturn ? "Submitting..." : "Submit Return Request"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowReturnForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.subtotal}</td>
                  <td>
                    {order.status === "DELIVERED" && (
                      <Link to={`/products/${item.productId}#reviews`} className="btn btn-sm btn-link">
                        Review
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "shipping" && (
        <div className="card">
          <div className="card-body">
            <h5>Shipping Address</h5>
            <p>{order.shippingAddress || "Not available"}</p>
          </div>
        </div>
      )}

      {activeTab === "track" && (
        <div className="card">
          <div className="card-body">
            <h5>Order Tracking</h5>
            {order.tracks?.length ? (
              <ul className="list-unstyled">
                {order.tracks.map((t) => (
                  <li key={t.id} className="border-bottom py-2">
                    <b>{t.status}</b> — {t.notes}
                    <br />
                    <small className="text-muted">{new Date(t.createdAt).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No tracking updates yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
