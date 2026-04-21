import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const API = "http://localhost:8282/api/products";

  // 🔒 Protect route
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  // 📥 Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ Add / Update
  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      if (editId) {
        // UPDATE
        await axios.put(`${API}/${editId}`, { name });
        setEditId(null);
      } else {
        // CREATE
        await axios.post(API, { name });
      }

      setName("");
      fetchProducts();

    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ Edit
  const handleEdit = (product) => {
    setName(product.name);
    setEditId(product.id);
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
  <div className="dashboard">

    <div className="dashboard-header">
      <h2 className="dashboard-title">Products</h2>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>

    <div className="product-input">
      <input
        type="text"
        placeholder="Enter product"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {editId ? "Update" : "Add"}
      </button>
    </div>

    <ul className="product-list">
      {products.map((p) => (
        <li key={p.id} className="product-item">
          {p.name}

          <div className="product-actions">
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>

  </div>
);
}

export default ProductList;