import { useEffect, useState } from "react";
import { ReviewAPI } from "../api/ApiServices";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ headline: "", comment: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const isLoggedIn = () => !!localStorage.getItem("token");

  const loadReviews = () => {
    setLoading(true);
    ReviewAPI.listByProduct(productId, { page: 0, size: 20 })
      .then((res) => setReviews(res.data.content || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      alert("Please login to write a review");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      await ReviewAPI.create(productId, {
        headline: form.headline,
        comment: form.comment,
        rating: Number(form.rating),
      });
      setForm({ headline: "", comment: "", rating: 5 });
      setMessage("Thank you! Your review was posted.");
      loadReviews();
      window.dispatchEvent(new CustomEvent("product-reviewed", { detail: { productId } }));
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="product-reviews" id="reviews">
      <h2>Customer Reviews</h2>

      {isLoggedIn() ? (
        <form className="product-reviews__form border rounded p-3 mb-4" onSubmit={handleSubmit}>
          <h5>Write a Review</h5>
          {message && <div className="alert alert-success py-2">{message}</div>}
          <input
            className="form-control mb-2"
            placeholder="Headline"
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            required
          />
          <textarea
            className="form-control mb-2"
            placeholder="Your review"
            rows={3}
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            required
          />
          <label className="form-label">
            Rating
            <select
              className="form-select"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-primary mt-2" disabled={submitting}>
            {submitting ? "Submitting..." : "Post Review"}
          </button>
        </form>
      ) : (
        <p className="text-muted">Login to write a review.</p>
      )}

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted">No reviews yet. Be the first!</p>
      ) : (
        <ul className="list-unstyled">
          {reviews.map((r) => (
            <li key={r.id} className="product-reviews__item border-bottom py-3">
              <div className="d-flex justify-content-between">
                <strong>{r.headline}</strong>
                <span className="text-warning">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              </div>
              <p className="mb-1">{r.comment}</p>
              <small className="text-muted">
                {r.customerName || r.customerEmail} · {new Date(r.reviewTime).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
