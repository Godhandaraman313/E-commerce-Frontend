import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReviewAPI } from "../api/ApiServices";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    ReviewAPI.myReviews()
      .then((res) => setReviews(res.data || []))
      .catch(() => alert("Failed to load your reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await ReviewAPI.remove(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-4" style={{ maxWidth: 1000 }}>
      <h3 className="mb-4 fw-bold" style={{ letterSpacing: "1px" }}>MY REVIEWS</h3>

      {reviews.length === 0 ? (
        <div className="text-center py-5 border bg-white">
          <p className="text-muted mb-4">You haven't written any reviews yet.</p>
          <Link to="/" className="btn btn-primary px-5">START SHOPPING</Link>
        </div>
      ) : (
        <div className="row g-4">
          {reviews.map((r) => (
            <div key={r.id} className="col-12">
              <div className="card border-0 shadow-sm rounded-0">
                <div className="card-body p-4 position-relative">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">
                        <Link to={`/products/${r.productId}`} className="text-dark text-decoration-none">
                          {r.productName}
                        </Link>
                      </h6>
                      <div className="text-warning fs-5">
                        {"★".repeat(r.rating)}<span className="text-muted">{"★".repeat(5 - r.rating)}</span>
                      </div>
                    </div>
                    <button type="button" className="btn btn-link text-danger p-0 fw-semibold text-decoration-none small" onClick={() => handleDelete(r.id)}>
                      DELETE
                    </button>
                  </div>
                  <h6 className="fw-semibold mb-2">{r.headline}</h6>
                  <p className="text-muted mb-3" style={{ fontSize: "0.95rem" }}>{r.comment}</p>
                  <div className="text-muted small">
                    Reviewed on {new Date(r.reviewTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
