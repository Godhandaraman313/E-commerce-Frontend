import { useEffect, useState } from "react";
import API from "../api/api";
import { CategoryAPI, ProductAPI, BrandAPI } from "../api/ApiServices";
import { getProductImageUrl } from "../utils/productImage";
import { useCart } from "../context/CartContext";
import "../styles/dashboard.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brandId, setBrandId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState(true);
  const [editId, setEditId] = useState(null);
  const [details, setDetails] = useState([]);
  const [extraFiles, setExtraFiles] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentImages, setCurrentImages] = useState([]);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [sortKey, setSortKey] = useState("id");
  const [direction, setDirection] = useState("asc");

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    CategoryAPI.list()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));

    BrandAPI.listAll()
      .then((res) => setBrands(res.data || []))
      .catch(() => setBrands([]));
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [
    page,
    search,
    filterCategory,
    sortKey,
    direction
  ]);
  const fetchProducts = async () => {
    try {
      setLoading(true);

      // use admin API when on admin routes
      // Use unified endpoint for both admin and regular users
      const endpoint = "/api/products";

      const res = await API.get(endpoint, {
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
      description,
      inStock,
      brandId: brandId ? Number(brandId) : null,
      details,
    };

    try {
      if (editId) {
        await API.put(`/api/products/${editId}`, payload);
        if (extraFiles && extraFiles.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < extraFiles.length; i++) {
            formData.append("files", extraFiles[i]);
          }
          await API.post(`/api/products/${editId}/extra-images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        const res = await API.post("/api/products", payload);
        if (extraFiles && extraFiles.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < extraFiles.length; i++) {
            formData.append("files", extraFiles[i]);
          }
          await API.post(`/api/products/${res.data.id}/extra-images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      setName("");
      setCategory("");
      setBrandId("");
      setPrice("");
      setDescription("");
      setInStock(true);
      setDetails([]);
      setExtraFiles(null);
      setEditId(null);
      setCurrentImageUrl("");
      setCurrentImages([]);
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

  const handleImageUpload = async (productId, file) => {
    if (!file) return;
    try {
      await ProductAPI.uploadImage(productId, file);
      fetchProducts();
      alert("Image uploaded successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Image upload failed");
    }
  };

  return (
    <div className="dashboard">
      <div className="headerRow">
        <h1 className="title">Product Dashboard</h1>

        <button
          className="addTopBtn"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setName("");
            setCategory("");
            setBrandId("");
            setPrice("");
            setDescription("");
            setInStock(true);
            setDetails([]);
            setExtraFiles(null);
            setCurrentImageUrl("");
            setCurrentImages([]);
          }}
        >
          {showForm ? "Close" : "Add Product"}
        </button>
      </div>

      {categories.length > 0 && (
        <div className="topControls" style={{ flexWrap: "wrap", gap: "8px" }}>
          <button
            type="button"
            className={filterCategory === "" ? "editBtn" : ""}
            onClick={() => selectCategory("")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.code}
              type="button"
              className={filterCategory === cat.name ? "editBtn" : ""}
              onClick={() => selectCategory(cat.name)}
            >
              {cat.name} ({cat.productCount})
            </button>
          ))}
        </div>
      )}

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

      {showForm && (
        <div className="formBox">
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.code} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <label>
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
            In stock
          </label>

          <div style={{ marginTop: 10, marginBottom: 10, padding: 10, border: "1px solid #e2e8f0", borderRadius: 4 }}>
            <h5>Product Specifications</h5>
            {details.map((d, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
                <input placeholder="Name (e.g. Memory)" value={d.name} onChange={e => {
                  const newD = [...details];
                  newD[index].name = e.target.value;
                  setDetails(newD);
                }} />
                <input placeholder="Value (e.g. 16GB)" value={d.value} onChange={e => {
                  const newD = [...details];
                  newD[index].value = e.target.value;
                  setDetails(newD);
                }} />
                <button type="button" onClick={() => setDetails(details.filter((_, i) => i !== index))} style={{ padding: "0 10px", background: "#ef4444" }}>X</button>
              </div>
            ))}
            <button type="button" onClick={() => setDetails([...details, { name: "", value: "" }])} style={{ background: "#3b82f6", marginTop: 5 }}>+ Add Detail</button>
          </div>

          {editId && currentImageUrl && (
            <div style={{ marginTop: 10, marginBottom: 10, padding: 10, border: "1px solid #e2e8f0", borderRadius: 4 }}>
              <h5>Current Thumbnail</h5>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={currentImageUrl} alt="Thumbnail" width={64} height={64} style={{ objectFit: "cover", borderRadius: 4 }} />
                <button
                  type="button"
                  className="deleteBtn"
                  onClick={async () => {
                    if (!window.confirm("Delete thumbnail?")) return;
                    try {
                      await ProductAPI.deleteThumbnail(editId);
                      setCurrentImageUrl("");
                      fetchProducts();
                    } catch (e) {
                      alert(e.response?.data?.message || "Delete failed");
                    }
                  }}
                >
                  Delete Thumbnail
                </button>
              </div>
            </div>
          )}

          {editId && currentImages.length > 0 && (
            <div style={{ marginTop: 10, marginBottom: 10, padding: 10, border: "1px solid #e2e8f0", borderRadius: 4 }}>
              <h5>Current Extra Images</h5>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {currentImages.map((img) => (
                  <div key={img.id} style={{ position: "relative" }}>
                    <img src={img.imagePath || img.name} alt="Extra" width={64} height={64} style={{ objectFit: "cover", borderRadius: 4 }} />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm("Delete this image?")) return;
                        try {
                          await ProductAPI.deleteExtraImage(editId, img.name);
                          setCurrentImages(currentImages.filter(i => i.id !== img.id));
                          fetchProducts();
                        } catch (e) {
                          alert(e.response?.data?.message || "Delete failed");
                        }
                      }}
                      style={{
                        position: "absolute", top: -5, right: -5, background: "red", color: "white",
                        border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <label>Extra Gallery Images:</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setExtraFiles(e.target.files)} />
          </div>

          <button onClick={handleSubmit}>{editId ? "Update" : "Add"}</button>
        </div>
      )}

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
                <th>Brand</th>
                <th onClick={() => handleSort("price")}>Price</th>
                <th>Stock</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td className="categoryCell">{p.category}</td>
                  <td>{p.brand?.name || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No Brand</span>}</td>
                  <td>₹{p.price}</td>
                  <td>{p.inStock ? "Yes" : "No"}</td>
                  <td>
                    <img src={getProductImageUrl(p, 48, 48)} alt="" width={48} height={48} style={{ objectFit: "cover", borderRadius: 4 }} />
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control form-control-sm mt-1"
                      onChange={(e) => handleImageUpload(p.id, e.target.files?.[0])}
                    />
                  </td>
                  <td>
                    <button
                      className="editBtn"
                      onClick={() => {
                        setName(p.name);
                        setCategory(p.category || "");
                        setBrandId(p.brand?.id || "");
                        setPrice(p.price);
                        setDescription(p.description || "");
                        setInStock(p.inStock !== false);
                        setDetails(p.details || []);
                        setExtraFiles(null);
                        setEditId(p.id);
                        setCurrentImageUrl(p.imageUrl || "");
                        setCurrentImages(p.images || []);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>

                    <button className="deleteBtn" onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>

                    <button
                      className="editBtn"
                      onClick={() => handleAddToCart(p)}
                      style={{ marginLeft: "8px", background: "#10b981" }}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span className="pageInfo">
          Page {page + 1} / {totalPages || 1}
        </span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
