import { useEffect, useState } from "react";
import API from "../api/api";
import { CategoryAPI } from "../api/ApiServices";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/shop.css";

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    CategoryAPI.list()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delay);
  }, [page, search, filterCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await API.get("/api/products", {
        params: {
          page,
          size,
          search,
          category: filterCategory,
          sort: "id,asc",
        },
      });

      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const ok = await addToCart(product);
    if (ok) {
      alert(`${product.name} added to cart!`);
    }
  };

  const selectCategory = (catName) => {
    setPage(0);
    setFilterCategory(catName);
  };

  return (
    <div className="shop-container">
      <h1 className="shop-title">Shop Products</h1>

      {categories.length > 0 && (
        <div className="shop-controls" style={{ flexWrap: "wrap", gap: "8px" }}>
          <button type="button" className="pagination-btn" onClick={() => selectCategory("")}>
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.code}
              type="button"
              className="pagination-btn"
              onClick={() => selectCategory(cat.name)}
            >
              {cat.name} ({cat.productCount})
            </button>
          ))}
        </div>
      )}

      <div className="shop-controls">
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
          className="shop-search"
        />

        <input
          placeholder="Filter category..."
          value={filterCategory}
          onChange={(e) => {
            setPage(0);
            setFilterCategory(e.target.value);
          }}
          className="shop-search"
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="no-products">No products found</p>
      ) : (
        <div className="home-products__grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="shop-product-card"
              onClick={() => navigate(`/products/${product.id}`)}
              role="button"
              tabIndex={0}
            >
              <div
                className="shop-product-card__bg"
                style={{ backgroundImage: `url(${getProductImageUrl(product, 320, 240)})` }}
                aria-hidden="true"
              />
              <div className="shop-product-card__image-wrap">
                <img
                  src={getProductImageUrl(product, 320, 240)}
                  alt={product.name}
                  className="shop-product-card__image"
                  loading="lazy"
                  onError={(e) => { e.target.style.opacity = "0.3"; }}
                />
              </div>
              <div className="shop-product-card__body">
                <h3 className="shop-product-card__title">{product.name}</h3>
                <p className="shop-product-card__category">{product.category}</p>
                <p className="shop-product-card__price">₹{product.price?.toLocaleString("en-IN")}</p>
                <button
                  type="button"
                  className="shop-product-card__btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="shop-pagination">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="pagination-btn"
          >
            Prev
          </button>
          <span className="page-info">Page {page + 1} / {totalPages}</span>
          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      <div className="shop-footer">
        <button className="view-cart-btn" onClick={() => navigate("/cart")}>
          View Cart
        </button>
      </div>
    </div>
  );
}
