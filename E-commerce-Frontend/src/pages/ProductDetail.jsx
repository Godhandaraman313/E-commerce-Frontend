import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductReviews from "../components/ProductReviews";
import { ProductAPI } from "../api/ApiServices";
import { useCart } from "../context/CartContext";
import ImageGallery from "../components/ImageGallery";
import "../styles/product-detail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const brandLogoUrl = (logoPath) => {
    if (!logoPath || logoPath === "default-logo.png") return null;
    return logoPath.startsWith("http") ? logoPath : `http://localhost:8282${logoPath}`;
  };

  const loadProduct = () => {
    Promise.resolve().then(() => {
      setLoading(true);
      setError(null);
    });
    ProductAPI.getById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Product not found");
        setProduct(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProduct();
    const onReviewed = (e) => {
      if (String(e.detail?.productId) === String(id)) loadProduct();
    };
    window.addEventListener("product-reviewed", onReviewed);
    return () => window.removeEventListener("product-reviewed", onReviewed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!product.inStock) {
      alert("This product is out of stock");
      return;
    }
    const ok = await addToCart(product);
    if (ok) alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return <p className="product-detail__status">Loading product...</p>;
  }

  if (error || !product) {
    return (
      <div className="product-detail product-detail--error">
        <p>{error || "Product not found"}</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const rating = product.averageRating ?? 0;
  const reviewCount = product.reviewCount ?? 0;

  return (
    <div className="product-detail">
      <nav className="product-detail__breadcrumb">
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to={`/search?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span> / </span>
        <span>{product.name}</span>
      </nav>

      <div className="product-detail__layout">
        
        {/* Column 1: Gallery */}
        <div className="product-detail__gallery">
          <ImageGallery product={product} />
        </div>

        {/* Column 2: Core Info & Specs */}
        <div className="product-detail__info">
          <h1>{product.name}</h1>
          <a href="#reviews" className="product-detail__rating-link">
            <span className="product-detail__stars">
              {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
            </span>
            <span className="ms-2">({reviewCount} reviews)</span>
          </a>
          
          <hr className="my-3" />
          
          <div className="product-detail__price-block">
            <span className="fs-3 fw-bold">₹{product.price?.toLocaleString("en-IN")}</span>
            <p className="text-muted small mb-0">Inclusive of all taxes</p>
          </div>

          <hr className="my-3" />

          {/* Specifications Table */}
          <div className="product-detail__specs">
            <h5 className="fw-bold mb-3">Product Details</h5>
            <table className="table table-sm table-borderless spec-table">
              <tbody>
                <tr>
                  <td className="spec-label">Brand</td>
                  <td className="spec-value fw-bold">
                    {product.brand ? product.brand.name : "Generic"}
                    {product.brand && product.brand.logo && brandLogoUrl(product.brand.logo) && (
                      <img src={brandLogoUrl(product.brand.logo)} alt={product.brand.name} height="16" className="ms-2" style={{ objectFit:"contain" }} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="spec-label">Category</td>
                  <td className="spec-value">{product.category}</td>
                </tr>
                {product.details && product.details.map((detail, idx) => (
                  <tr key={idx}>
                    <td className="spec-label">{detail.name}</td>
                    <td className="spec-value">{detail.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr className="my-3" />
          
          <div className="product-detail__desc-block">
            <h5 className="fw-bold mb-2">About this item</h5>
            <ul className="product-detail__desc-list">
              {product.description?.split('\n').map((line, idx) => (
                line.trim() ? <li key={idx}>{line.trim()}</li> : null
              )) || <li>No description available.</li>}
            </ul>
          </div>
        </div>

        {/* Column 3: Sticky Buy Box */}
        <div className="product-detail__buybox">
          <div className="buybox-card">
            <h4 className="buybox-price">₹{product.price?.toLocaleString("en-IN")}</h4>
            <p className="text-success small fw-semibold mb-2">FREE Delivery</p>
            <p className={`product-detail__stock fw-bold mb-4 ${product.inStock ? "text-success" : "text-danger"}`}>
              {product.inStock ? "In Stock" : "Currently Unavailable"}
            </p>

            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-warning rounded-pill py-2 fw-semibold"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                Add to Cart
              </button>
              <button 
                type="button" 
                className="btn btn-warning rounded-pill py-2 fw-semibold" 
                style={{ background: "#ffa41c", borderColor: "#ffa41c" }}
                onClick={() => {
                  handleAddToCart().then(() => {
                    navigate("/checkout");
                  });
                }}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>
            
            <div className="mt-4 small text-muted">
              <div className="d-flex justify-content-between mb-1">
                <span>Ships from</span>
                <span>Kaimart.com</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Sold by</span>
                <span>Kaimart Retail</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <hr className="my-5" />
      
      {/* Reviews Section Overhaul */}
      <div id="reviews" className="product-detail__reviews-section">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
