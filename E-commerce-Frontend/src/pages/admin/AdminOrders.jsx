import { useEffect, useState } from "react";
import { AdminOrderAPI } from "../../api/ApiServices";
import "../../styles/admin-orders.css";

const FULFILLMENT_STEPS = [
  { key: "PROCESSING", label: "Processing", icon: "⚙️" },
  { key: "PICKED", label: "Picked", icon: "📦" },
  { key: "SHIPPING", label: "Shipping", icon: "🚚" },
  { key: "DELIVERED", label: "Delivered", icon: "✅" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    AdminOrderAPI.list({ page, size: 10, keyword })
      .then((res) => {
        setOrders(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch((err) => alert(err.response?.data?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(loadOrders, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword]);

  const openDetail = async (id) => {
    try {
      const res = await AdminOrderAPI.getById(id);
      setSelectedOrder(res.data);
    } catch {
      alert("Could not load order details");
    }
  };

  const updateStatus = async (orderId, status) => {
    if (!window.confirm(`Mark order #${orderId} as ${status}?`)) return;

    setUpdating(true);
    try {
      await AdminOrderAPI.updateStatus(orderId, { status });
      loadOrders();
      if (selectedOrder?.id === orderId) {
        const res = await AdminOrderAPI.getById(orderId);
        setSelectedOrder(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    } finally {
      setUpdating(false);
    }
  };

  const isStepDone = (order, stepKey) => {
    const map = {
      PROCESSING: order.status === "PROCESSING" || order.picked || order.shipping || order.delivered,
      PICKED: order.picked,
      SHIPPING: order.shipping,
      DELIVERED: order.delivered,
    };
    return map[stepKey] || false;
  };

  return (
    <div className="admin-orders container-fluid py-3">
      <h2>Manage Orders</h2>
      <p className="text-muted">Fulfill customer orders (Shopme admin shipper view).</p>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by order ID or customer email..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders to fulfill.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card admin-orders__card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Order #{order.id}</span>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openDetail(order.id)}>
                Details
              </button>
            </div>
            <div className="card-body">
              <p className="mb-1"><b>{order.recipientName}</b> · {order.userEmail}</p>
              <p className="mb-1 text-muted">{order.shippingAddress}</p>
              {order.phoneNumber && <p className="mb-1">📞 {order.phoneNumber}</p>}
              <p className="mb-1">{order.productNames}</p>
              {order.cod && (
                <p className="mb-2">
                  <span className="badge bg-warning text-dark">COD: ₹{order.total}</span>
                </p>
              )}
              <p className="mb-3">
                Status: <span className="badge bg-info text-dark">{order.status}</span>
              </p>

              <div className="admin-orders__steps row text-center">
                {FULFILLMENT_STEPS.map((step) => (
                  <div key={step.key} className="col-3 col-md-3">
                    {isStepDone(order, step.key) ? (
                      <span className="admin-orders__step admin-orders__step--done" title={step.label}>
                        {step.icon}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="admin-orders__step admin-orders__step--action"
                        disabled={updating || ["DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED", "REFUND_REQUESTED", "REFUNDED", "REPLACEMENT_REQUESTED", "REPLACED"].includes(order.status)}
                        title={`Mark as ${step.label}`}
                        onClick={() => updateStatus(order.id, step.key)}
                      >
                        {step.icon}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-2 d-flex gap-2 flex-wrap align-items-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  disabled={updating || ["DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED", "REFUND_REQUESTED", "REFUNDED", "REPLACEMENT_REQUESTED", "REPLACED"].includes(order.status)}
                  onClick={() => updateStatus(order.id, "CANCELLED")}
                >
                  Cancel
                </button>
                {order.status === "RETURN_REQUESTED" && (
                  <>
                    <span className="badge bg-warning text-dark">Return requested</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      disabled={updating}
                      onClick={() => updateStatus(order.id, "RETURNED")}
                    >
                      Mark Returned
                    </button>
                  </>
                )}
                {order.status === "REFUND_REQUESTED" && (
                  <>
                    <span className="badge bg-warning text-dark">Refund requested</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      disabled={updating}
                      onClick={() => updateStatus(order.id, "REFUNDED")}
                    >
                      Mark Refunded
                    </button>
                  </>
                )}
                {order.status === "REPLACEMENT_REQUESTED" && (
                  <>
                    <span className="badge bg-warning text-dark">Replacement requested</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      disabled={updating}
                      onClick={() => updateStatus(order.id, "REPLACED")}
                    >
                      Mark Replaced
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2">
          <button type="button" className="btn btn-outline-secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span className="align-self-center">Page {page + 1} / {totalPages}</span>
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {selectedOrder && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Order #{selectedOrder.id} Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)} />
              </div>
              <div className="modal-body">
                <p><b>Customer:</b> {selectedOrder.recipientName} ({selectedOrder.userEmail})</p>
                <p><b>Address:</b> {selectedOrder.shippingAddress}</p>
                <p><b>Status:</b> {selectedOrder.status}</p>
                <h6 className="mt-3">Items</h6>
                <ul>
                  {selectedOrder.items?.map((item) => (
                    <li key={item.id}>
                      {item.quantity} × {item.productName} — ₹{item.subtotal}
                    </li>
                  ))}
                </ul>
                <h6 className="mt-3">Tracking</h6>
                <ul className="list-unstyled">
                  {selectedOrder.tracks?.map((t) => (
                    <li key={t.id} className="border-bottom py-1">
                      <b>{t.status}</b> — {t.notes}
                      <br />
                      <small className="text-muted">{new Date(t.createdAt).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
                {selectedOrder.returnRequested && (
                  <div className="mt-3">
                    <h6>Customer Issue Request</h6>
                    <div className="alert alert-warning">
                      <p className="mb-1"><b>Issue Type:</b> {selectedOrder.issueType || "RETURN"}</p>
                      <p className="mb-1"><b>Reason:</b> {selectedOrder.returnReason}</p>
                      {selectedOrder.returnNote && (
                        <p className="mb-1"><b>Customer Message:</b> {selectedOrder.returnNote}</p>
                      )}
                      {selectedOrder.issuePhotos?.length > 0 && (
                        <div className="mt-2">
                          <b>Photos from Customer:</b>
                          <div className="d-flex flex-wrap gap-2 mt-1">
                            {selectedOrder.issuePhotos.map((url, idx) => {
                              const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:8282';
                              const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
                              return (
                                <a key={idx} href={fullUrl} target="_blank" rel="noopener noreferrer">
                                  <img src={fullUrl} alt={`Issue photo ${idx + 1}`} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4, border: "1px solid #ccc" }} />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
