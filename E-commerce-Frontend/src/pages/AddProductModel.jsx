export default function AddProductModal({ show, onClose, iframeSrc }) {
  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">

          <div className="modal-header">
            <h4 className="modal-title">Add Product</h4>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="ratio ratio-16x9">
            <iframe src={iframeSrc} title="Add Product"></iframe>
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" onClick={onClose}>
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}