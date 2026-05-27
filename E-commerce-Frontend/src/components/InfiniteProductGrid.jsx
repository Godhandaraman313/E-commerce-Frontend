import { useEffect, useRef, useState } from "react";
import { ProductAPI } from "../api/ApiServices";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 12;

export default function InfiniteProductGrid({ categoryFilter = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(0);
  const loadingRef = useRef(false);
  const sentinelRef = useRef(null);
  const { addToCart } = useCart();

  const fetchPage = async (append) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (append) setLoadingMore(true);
    else setLoading(true);

    setError(null);

    try {
      const res = await ProductAPI.getAll({
        page: pageRef.current,
        size: PAGE_SIZE,
        category: categoryFilter,
        sort: "id,asc",
      });

      const content = res.data.content || [];
      const totalPages = res.data.totalPages ?? 1;

      setProducts((prev) => (append ? [...prev, ...content] : content));
      pageRef.current += 1;
      setHasMore(pageRef.current < totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const retry = () => {
    setError(null);
    pageRef.current = 0;
    setProducts([]);
    setHasMore(true);
    fetchPage(false);
  };

  useEffect(() => {
    pageRef.current = 0;
    setProducts([]);
    setHasMore(true);
    fetchPage(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          fetchPage(true);
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, products.length]);

  const handleAddToCart = async (product) => {
    const ok = await addToCart(product);
    if (ok) alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return <p className="home-products__status">Loading products...</p>;
  }

  if (error && products.length === 0) {
    return (
      <div className="home-products__status home-products__status--error">
        <p>{error}</p>
        <button className="btn btn-sm btn-outline-dark" onClick={retry}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="home-products">
      <h2 className="home-products__heading">
        {categoryFilter ? `${categoryFilter} Products` : "Featured Products"}
      </h2>

      {products.length === 0 ? (
        <p className="home-products__status">No products yet. Add some from the admin dashboard.</p>
      ) : (
        <div className="home-products__grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="home-products__sentinel" aria-hidden="true" />

      {loadingMore && <p className="home-products__status">Loading more...</p>}

      {!hasMore && products.length > 0 && (
        <p className="home-products__status home-products__status--end">You&apos;ve seen all products</p>
      )}
    </section>
  );
}
