// QuantityControl.jsx  (from quantity_control.html :contentReference[oaicite:0]{index=0})

export default function QuantityControl({ value, onIncrease, onDecrease }) {
  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <button className="page-link" onClick={onDecrease}><b>-</b></button>
        </li>

        <li className="page-item">
          <input
            type="text"
            value={value}
            readOnly
            className="form-control text-center"
            style={{ width: "55px" }}
          />
        </li>

        <li className="page-item">
          <button className="page-link" onClick={onIncrease}><b>+</b></button>
        </li>
      </ul>
    </nav>
  );
}