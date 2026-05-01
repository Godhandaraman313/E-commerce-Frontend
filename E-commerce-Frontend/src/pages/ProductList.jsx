import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/dashboard.css";

export default function ProductList() {

  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [sortKey, setSortKey] = useState("id");
  const [direction, setDirection] = useState("asc");

  const [loading, setLoading] = useState(false);

  // ✅ NEW STATE (important)
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delay);
  }, [page, sortKey, direction, search, filterCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await API.get("/api/products", {
        params: {
          page,
          size,
          search,
          category: filterCategory,
          sort: `${sortKey},${direction}`,
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

  const handleSubmit = async () => {
    if (!name || !category || !price) {
      alert("All fields required");
      return;
    }

    const payload = {
      name,
      category: category.toLowerCase(),
      price: Number(price),
    };

    try {
      if (editId) {
        await API.put(`/api/products/${editId}`, payload);
      } else {
        await API.post("/api/products", payload);
      }

      setName("");
      setCategory("");
      setPrice("");
      setEditId(null);

      // ✅ CLOSE FORM AFTER SAVE
      setShowForm(false);

      fetchProducts();

    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await API.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  return (
    <div className="dashboard">

      <h1 className="title">Product Dashboard</h1>

      {/* ✅ FLOATING ADD BUTTON */}
      <div className="headerRow">
  <h1 className="title">Product Dashboard</h1>

  <button
    className="addTopBtn"
    onClick={() => {
      setShowForm(!showForm);
      setEditId(null);
      setName("");
      setCategory("");
      setPrice("");
    }}
  >
    {showForm ? "Close" : "Add Product"}
  </button>
</div>

      {/* SEARCH + FILTER */}
      <div className="topControls">
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />

        <input
          placeholder="Filter category..."
          value={filterCategory}
          onChange={(e) => {
            setPage(0);
            setFilterCategory(e.target.value);
          }}
        />
      </div>

      {/* ✅ CONDITIONAL FORM */}
      {showForm && (
        <div className="formBox">
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

          <button onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </button>
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="tableWrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}>ID</th>
                <th onClick={() => handleSort("name")}>Name</th>
                <th onClick={() => handleSort("category")}>Category</th>
                <th onClick={() => handleSort("price")}>Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td className="categoryCell">{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>
                    <button
                      className="editBtn"
                      onClick={() => {
                        setName(p.name);
                        setCategory(p.category);
                        setPrice(p.price);
                        setEditId(p.id);
                        setShowForm(true); // ✅ open form on edit
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
        <span className="pageInfo"> Page {page + 1} / {totalPages} </span>
        <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
      </div>

    </div>
  );
}