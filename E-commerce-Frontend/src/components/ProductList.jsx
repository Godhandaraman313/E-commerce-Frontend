import React, { useEffect, useState } from "react";
import {
  getProducts,
  addProducts,
  deleteProduct,
  updateProduct,
} from "../api/productApi";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const handleAddOrUpdate = async () => {
    if (!name.trim()) return;

    if (editId) {
      await updateProduct(editId, { name });
      setEditId(null);
    } else {
      await addProducts([{ name }]);
    }

    setName("");
    loadProducts();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
  };

  const handleEdit = (product) => {
    setName(product.name);
    setEditId(product.id);
  };

  return (
    <div>
      <h2>Product List</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter product"
      />

      <button onClick={handleAddOrUpdate}>
        {editId ? "Update" : "Add"}
      </button>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name}

            <button onClick={() => handleEdit(p)}>✏️</button>

            <button onClick={() => handleDelete(p.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;