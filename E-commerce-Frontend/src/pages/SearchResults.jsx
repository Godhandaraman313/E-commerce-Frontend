import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductAPI, CategoryAPI, BrandAPI } from "../api/ApiServices";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import "../styles/shop.css";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const categoryParam = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [activeBrandId, setActiveBrandId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { addToCart } = useCart();

  // Load static filter data (categories and brands) on mount
  useEffect(() => {
    CategoryAPI.list()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));

    BrandAPI.listAll()
      .then((res) => setBrands(res.data || []))
      .catch(() => setBrands([]));
  }, []);

  // Sync state filters with URL query parameters
  useEffect(() => {
    Promise.resolve().then(() => {
      setActiveCategory(categoryParam);
      setActiveBrandId(null);
      setPage(0);
    });
  }, [keyword, categoryParam]);

  // Fetch products when filters/pages change
  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(true);
      ProductAPI.getAll({
        page,
        size: 12,
        search: keyword,
        category: activeCategory,
        brandId: activeBrandId || "",
        sort: "id,asc",
      })
        .then((res) => {
          setProducts(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
        })
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(delay);
  }, [keyword, activeCategory, activeBrandId, page]);

  const handleCategorySelect = (catName) => {
    setPage(0);
    setActiveCategory(catName);
    // Sync to URL if keyword search is empty
    if (!keyword) {
      if (catName) {
        setSearchParams({ category: catName });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleBrandSelect = (brandId) => {
    setPage(0);
    setActiveBrandId(brandId);
  };

  const handleAddToCart = async (product) => {
    const ok = await addToCart(product);
    if (ok) alert(`${product.name} added to cart!`);
  };

  const title = activeCategory
    ? `Category: ${activeCategory}`
    : keyword
      ? `Search: "${keyword}"`
      : "Products Catalog";

  return (
    <div className="shop-container">
      <h1 className="shop-title">{title}</h1>
      <p style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "600" }}>
          ← Back to Home
        </Link>
      </p>

      <div className="shop-layout">
        {/* Amazon-style Left Sidebar Filters */}
        <aside className="shop-sidebar">
          {/* Category Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Categories</h3>
            <ul className="filter-list">
              <li>
                <button
                  type="button"
                  className={`filter-item-btn ${activeCategory === "" ? "active" : ""}`}
                  onClick={() => handleCategorySelect("")}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.code}>
                  <button
                    type="button"
                    className={`filter-item-btn ${activeCategory === cat.name ? "active" : ""}`}
                    onClick={() => handleCategorySelect(cat.name)}
                  >
                    <span>{cat.name}</span>
                    <span className="filter-count">{cat.productCount}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Brands</h3>
            <ul className="filter-list">
              <li>
                <button
                  type="button"
                  className={`filter-item-btn ${activeBrandId === null ? "active" : ""}`}
                  onClick={() => handleBrandSelect(null)}
                >
                  All Brands
                </button>
              </li>
              {brands.map((brand) => (
                <li key={brand.id}>
                  <button
                    type="button"
                    className={`filter-item-btn ${activeBrandId === brand.id ? "active" : ""}`}
                    onClick={() => handleBrandSelect(brand.id)}
                  >
                    {brand.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right Side Products Grid */}
        <main className="shop-content">
          {loading ? (
            <p className="loading-text">Loading catalog...</p>
          ) : products.length === 0 ? (
            <p className="no-products">No products found matching filters.</p>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="shop-pagination">
              <button
                type="button"
                className="pagination-btn"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              <span className="page-info">
                Page {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                className="pagination-btn"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
