import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryAPI } from "../api/ApiServices";
import { getCategoryImageUrl } from "../utils/productImage";

export default function CategoryTiles({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    CategoryAPI.list()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  if (categories.length === 0) return null;

  const handleClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat.name);
      return;
    }
    navigate(`/search?category=${encodeURIComponent(cat.name)}`);
  };

  return (
    <section className="category-tiles">
      <h2 className="category-tiles__title">Shopping by Categories</h2>
      <div className="category-tiles__row">
        {categories.map((cat) => (
          <button
            key={cat.code}
            type="button"
            className="category-tiles__item"
            onClick={() => handleClick(cat)}
          >
            <img src={getCategoryImageUrl(cat)} alt={cat.name} width={80} height={80} />
            <span className="category-tiles__name">{cat.name}</span>
            <span className="category-tiles__count">{cat.productCount} items</span>
          </button>
        ))}
      </div>
    </section>
  );
}
