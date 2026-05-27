import { useEffect, useState } from "react";
import { BrandAPI, CategoryAPI } from "../../api/ApiServices";
import "../../styles/dashboard.css";

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [sortKey, setSortKey] = useState("id");
  const [direction, setDirection] = useState("asc");

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    CategoryAPI.list()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await BrandAPI.list({
        page,
        size,
        search,
        sort: `${sortKey},${direction}`,
      });
      setBrands(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBrands();
    }, 400);
    return () => clearTimeout(delay);
  }, [page, sortKey, direction, search]);

  const handleCategoryCheckboxChange = (catId) => {
    if (selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Brand name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      categoryIds: selectedCategoryIds,
    };

    try {
      if (editId) {
        await BrandAPI.update(editId, payload);
      } else {
        await BrandAPI.create(payload);
      }

      setName("");
      setSelectedCategoryIds([]);
      setEditId(null);
      setShowForm(false);
      fetchBrands();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      await BrandAPI.delete(id);
      fetchBrands();
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

  const handleLogoUpload = async (brandId, file) => {
    if (!file) return;
    try {
      await BrandAPI.uploadLogo(brandId, file);
      fetchBrands();
      alert("Logo uploaded successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Logo upload failed");
    }
  };

  const getLogoUrl = (brand) => {
    if (!brand.logo || brand.logo === "default-logo.png") {
      return "/images/image-thumbnail.png"; // fallback thumbnail
    }
    return brand.logo.startsWith("http") ? brand.logo : `http://localhost:8282${brand.logo}`;
  };

  return (
    <div className="dashboard">
      <div className="headerRow">
        <h1 className="title">Brand Dashboard</h1>
        <button
          className="addTopBtn"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setName("");
            setSelectedCategoryIds([]);
          }}
        >
          {showForm ? "Close Form" : "Add Brand"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="formBox" style={{ display: "block" }}>
          <h3>{editId ? "Edit Brand" : "Add Brand"}</h3>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Brand Name</label>
            <input
              placeholder="Enter brand name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Select Categories</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", maxHeight: "150px", overflowY: "auto", border: "1px solid #ccc", padding: "8px", borderRadius: "4px" }}>
              {categories.map((cat) => (
                <label key={cat.id} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() => handleCategoryCheckboxChange(cat.id)}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" style={{ padding: "8px 16px" }}>{editId ? "Update Brand" : "Save Brand"}</button>
        </form>
      )}

      <div className="topControls">
        <input
          placeholder="Search brand by name..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />
      </div>

      {loading ? (
        <p>Loading brands...</p>
      ) : brands.length === 0 ? (
        <p>No brands found.</p>
      ) : (
        <div className="tableWrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}>ID</th>
                <th>Logo</th>
                <th onClick={() => handleSort("name")}>Brand Name</th>
                <th>Categories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>{brand.id}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
                      <img
                        src={getLogoUrl(brand)}
                        alt={brand.name}
                        width={48}
                        height={48}
                        style={{ objectFit: "contain", borderRadius: 4, background: "#f8f9fa", padding: "2px", border: "1px solid #ddd" }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ fontSize: "11px", maxWidth: "150px" }}
                        onChange={(e) => handleLogoUpload(brand.id, e.target.files?.[0])}
                      />
                    </div>
                  </td>
                  <td style={{ fontWeight: "600" }}>{brand.name}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {brand.categories && brand.categories.length > 0 ? (
                        brand.categories.map((cat) => (
                          <span key={cat.id} style={{ background: "#e2e8f0", color: "#1e293b", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>
                            {cat.name}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "12px" }}>No categories linked</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="editBtn"
                      onClick={() => {
                        setName(brand.name);
                        setSelectedCategoryIds(brand.categories ? brand.categories.map((c) => c.id) : []);
                        setEditId(brand.id);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button className="deleteBtn" onClick={() => handleDelete(brand.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
        <span className="pageInfo">Page {page + 1} / {totalPages || 1}</span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
