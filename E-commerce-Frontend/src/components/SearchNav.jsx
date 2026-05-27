import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CategoryAPI } from "../api/ApiServices";
import "../styles/search-nav.css";

export default function SearchNav() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    CategoryAPI.list()
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error("Failed to load categories for search nav", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q && (!category || category === "All")) return;
    
    const params = new URLSearchParams();
    if (q) params.append("keyword", q);
    if (category && category !== "All") params.append("category", category);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="search-nav w-100">
      <form className="search-nav__form d-flex w-100" onSubmit={handleSubmit}>
        <div className="search-nav__category-dropdown d-flex align-items-center">
          <select 
            className="form-select shadow-none" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <input
          type="search"
          name="keyword"
          className="form-control search-nav__input shadow-none"
          placeholder="Search Kaimart"
          value={keyword}
          onChange={(e) => {
            e.target.setCustomValidity("");
            setKeyword(e.target.value);
          }}
          onInvalid={(e) => e.target.setCustomValidity("The Text field should not be empty")}
          required={!category || category === "All"}
        />
        <button type="submit" className="btn btn-warning search-nav__btn">
          🔍
        </button>
      </form>
    </div>
  );
}
