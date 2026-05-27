import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OrderAPI } from "../api/ApiServices";
import "../styles/orders.css";

const STATUS_CLASS = {
  NEW: "badge bg-primary",
  PROCESSING: "badge bg-info text-dark",
  SHIPPED: "badge bg-warning text-dark",
  DELIVERED: "badge bg-success",
  CANCELLED: "badge bg-danger",
  RETURN_REQUESTED: "badge bg-secondary",
  RETURNED: "badge bg-dark",
  SHIPPING: "badge bg-info text-dark",
  PICKED: "badge bg-primary",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(true);
      OrderAPI.list({ page, size: 10, keyword })
        .then((res) => {
          setOrders(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
        })
        .catch(() => alert("Failed to load orders"))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(delay);
  }, [page, keyword]);

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  return (
    <div className="container py-4" style={{ maxWidth: 1000 }}>
      <h3 className="mb-4 fw-bold" style={{ letterSpacing: "1px" }}>MY ORDERS</h3>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <p className="text-muted mb-0">Track and manage your orders below.</p>
        <form
          className="d-flex"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(0);
          }}
          style={{ width: "100%", maxWidth: "350px" }}
        >
          <input
            type="search"
            className="form-control rounded-0 rounded-start border-dark"
            placeholder="Search by order ID..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0);
            }}
          />
          <button type="submit" className="btn btn-dark rounded-0 rounded-end px-3">
            <i className="bi bi-search">Search</i>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 border bg-white">
          <p className="text-muted mb-4">No orders found.</p>
          <Link to="/" className="btn btn-primary px-5">START SHOPPING</Link>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {orders.map((order) => (
              <div key={order.id} className="col-12">
                <div className="card border-0 shadow-sm rounded-0">
                  <div className="card-header bg-light border-bottom-0 p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted small d-block">ORDER PLACED</span>
                      <span className="fw-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="text-end">
                      <span className="text-muted small d-block">TOTAL</span>
                      <span className="fw-bold">₹{order.total}</span>
                    </div>
                    <div className="text-end d-none d-md-block">
                      <span className="text-muted small d-block">ORDER ID</span>
                      <span className="fw-medium">#{order.id}</span>
                    </div>
                  </div>
                  <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                      <h6 className="fw-bold mb-2 text-truncate" style={{ maxWidth: "400px" }}>{order.productNames}</h6>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <span className={`badge ${STATUS_CLASS[order.status] || "bg-secondary"}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-outline-dark rounded-0 px-4"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-5">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-0 px-3"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                PREV
              </button>
              <span className="align-self-center px-2 fw-medium">Page {page + 1} of {totalPages}</span>
              <button
                type="button"
                className="btn btn-outline-secondary rounded-0 px-3"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                NEXT
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
