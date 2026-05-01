// Fragments.jsx

import { useState } from "react";

// Pagination Component
export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="pagination justify-content-center flex-wrap">

        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(1)}>First</button>
        </li>

        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>Previous</button>
        </li>

        {pages.map(page => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>Next</button>
        </li>

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(totalPages)}>Last</button>
        </li>

      </ul>
    </nav>
  );
}

// Modal Component
export function Modal({ title, body, onClose }) {
  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h4 className="modal-title">{title}</h4>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {body}
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" onClick={onClose}>Close</button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Confirm Modal
export function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h4>Delete Confirmation</h4>
            <button className="btn-close" onClick={onCancel}></button>
          </div>

          <div className="modal-body">
            <span>{message}</span>
          </div>

          <div className="modal-footer">
            <button className="btn btn-success" onClick={onConfirm}>Yes</button>
            <button className="btn btn-danger" onClick={onCancel}>No</button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Search Form
export function SearchForm({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline m-3">
      <input
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="form-control"
        required
      />
      <button type="submit" className="btn btn-primary ms-2">
        Search
      </button>
      <button
        type="button"
        className="btn btn-secondary ms-2"
        onClick={() => setKeyword("")}
      >
        Clear
      </button>
    </form>
  );
}

// Utility Function
export function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}