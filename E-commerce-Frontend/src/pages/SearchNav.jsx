// SearchNav.jsx  (from navigation.html search_nav :contentReference[oaicite:4]{index=4})

import { useState } from "react";

export default function SearchNav({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch(keyword);
  };

  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          type="search"
          className="form-control mr-sm-2"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="keyword"
          required
        />
        <button className="btn btn-outline-success">Search</button>
      </form>
    </nav>
  );
}