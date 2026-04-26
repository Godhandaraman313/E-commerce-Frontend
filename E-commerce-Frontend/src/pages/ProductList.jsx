import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);

  // ✅ NEW STATES
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const navigate = useNavigate();
  const API = "http://localhost:8282/api/products";

  // 🔒 Protect route
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`${API}/${editId}`, { name, category });
    } else {
      await axios.post(API, { name, category });
    }

    setName("");
    setCategory("");
    setEditId(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchProducts();
  };

  // ✅ SEARCH FILTER
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ PAGINATION LOGIC
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="dashboard">
      <h2>Product Dashboard</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px", padding: "10px" }}
      />

      {/* FORM */}
      <div className="form">
        <input
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          value={category}
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid">
        {currentProducts.map((p) => (
          <div className="product-card" key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.category}</p>

            <button onClick={() => {
              setName(p.name);
              setCategory(p.category);
              setEditId(p.id);
            }}>
              Edit
            </button>

            <button onClick={() => handleDelete(p.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* 📄 PAGINATION */}
      <div style={{ marginTop: "20px" }}>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: "5px",
              padding: "8px",
              background: currentPage === i + 1 ? "#ff6600" : "#ccc"
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}