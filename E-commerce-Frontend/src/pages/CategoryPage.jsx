import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "../styles/home.css";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart, cart } = useCart();

  const API = "http://localhost:8282/api/products";

  useEffect(() => {
    fetchProducts();
  }, [name]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API);

      const filtered = res.data
        .filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === name.toLowerCase()
        )
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (p) =>
                p.name === value.name &&
                p.price === value.price
            )
        );

      setProducts(filtered);
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // SORT
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="home">

      {/* 🔙 BACK */}
      <div className="topBar">
        <button className="btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>

      {/* 🔥 TITLE */}
      <h2 className="categoryTitle centerTitle">
        {name.toUpperCase()}
      </h2>

      {/* 🔥 RIGHT CONTROL PANEL */}
      <div className="rightPanel">

        <button
          className="btn cartBtn"
          onClick={() => navigate("/cart")}
        >
          🛒 Cart ({cart.length})
        </button>

        <select
          className="sortDropdown"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="centerText">Loading products...</p>
      )}

      {/* PRODUCTS */}
      <div className="listGrid">
        {!loading && sortedProducts.length === 0 ? (
          <p className="centerText">No products found</p>
        ) : (
          sortedProducts.map((p) => (
            <div className="productCard" key={p.id}>
              <h3>{p.name}</h3>

              <p>₹{p.price?.toLocaleString()}</p>

              <button
                className="btn"
                onClick={() => addToCart(p)}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}