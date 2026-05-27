export default function QuantityControl({ quantity, onChange, disabled }) {
  const decrease = () => onChange(Math.max(0, quantity - 1));
  const increase = () => onChange(quantity + 1);

  return (
    <div className="quantity-control d-inline-flex align-items-center border rounded">
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={decrease}
        disabled={disabled}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="quantity-control__value px-3">{quantity}</span>
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={increase}
        disabled={disabled}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
