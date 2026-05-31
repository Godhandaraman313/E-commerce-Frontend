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
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [issueReason, setIssueReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [issueNote, setIssueNote] = useState("");
  const [issuePhotos, setIssuePhotos] = useState([]);
  const [submittingIssue, setSubmittingIssue] = useState(false);

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

  const getReasonOptions = () => {
    if (issueType === "REFUND") return [{ value: "Damaged product", label: "Damaged product" }, { value: "Other", label: "Other" }];
    if (issueType === "RETURN") return [{ value: "Not same as ordered", label: "Not same as ordered" }, { value: "Other", label: "Other" }];
    if (issueType === "REPLACEMENT") return [{ value: "Damaged product", label: "Damaged product" }, { value: "Expired product", label: "Expired product" }, { value: "Other", label: "Other" }];
    return [];
  };

  const submitIssue = async (e) => {
    e.preventDefault();
    if (!issueType) {
      alert("Please select an issue type");
      return;
    }
    if (!issueReason.trim()) {
      alert("Please select a reason");
      return;
    }
    const finalReason = issueReason === "Other" ? customReason.trim() : issueReason;
    if (!finalReason) {
      alert("Please provide a custom reason for 'Other'");
      return;
    }
    setSubmittingIssue(true);
    try {
      const formData = new FormData();
      formData.append("type", issueType);
      formData.append("reason", finalReason);
      if (issueNote) formData.append("note", issueNote);
      issuePhotos.forEach((file) => formData.append("photos", file));
      await OrderAPI.requestReturn(id, formData);
      setShowIssueForm(false);
      setIssuePhotos([]);
      setCustomReason("");
      loadOrder();
      alert("Issue request submitted");
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    } finally {
      setSubmittingIssue(false);
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
                <b>Issue requested ({order.issueType || "RETURN"})</b>
                <br />
                Reason: {order.returnReason}
                {order.returnNote && (
                  <>
                    <br />
                    Note: {order.returnNote}
                  </>
                )}
                {order.issuePhotos?.length > 0 && (
                  <div className="mt-2">
                    <b>Photos:</b>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      {order.issuePhotos.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={`Issue photo ${idx + 1}`} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {order.canRequestReturn && !showIssueForm && (
              <button
                type="button"
                className="btn btn-outline-danger mt-3"
                onClick={() => setShowIssueForm(true)}
              >
                Report Issue
              </button>
            )}

            {showIssueForm && (
              <form className="mt-3 border rounded p-3" onSubmit={submitIssue}>
                <h5>Report an Issue</h5>
                <select
                  className="form-select mb-2"
                  value={issueType}
                  onChange={(e) => {
                    setIssueType(e.target.value);
                    setIssueReason("");
                  }}
                  required
                >
                  <option value="">Select Issue Type</option>
                  <option value="REFUND">Refund</option>
                  <option value="RETURN">Return</option>
                  <option value="REPLACEMENT">Replacement</option>
                </select>
                
                {issueType && (
                  <select
                    className="form-select mb-2"
                    value={issueReason}
                    onChange={(e) => setIssueReason(e.target.value)}
                    required
                  >
                    <option value="">Select reason</option>
                    {getReasonOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}
                {issueReason === "Other" && (
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Specify custom reason"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    required
                  />
                )}

                <textarea
                  className="form-control mb-2"
                  placeholder="Additional notes (optional)"
                  rows={3}
                  value={issueNote}
                  onChange={(e) => setIssueNote(e.target.value)}
                />
                <div className="mb-2">
                  <label className="form-label"><b>Attach Photos</b> (optional)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={(e) => setIssuePhotos(Array.from(e.target.files))}
                  />
                  {issuePhotos.length > 0 && (
                    <small className="text-muted">{issuePhotos.length} file(s) selected</small>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-danger" disabled={submittingIssue}>
                    {submittingIssue ? "Submitting..." : "Submit Request"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowIssueForm(false)}
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
