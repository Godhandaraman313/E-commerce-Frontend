import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductImageUrl } from "../utils/productImage";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onAddToCart }) {
  if (!product || product.id == null) {
    return null;
  }

  const navigate = useNavigate();
  const imageUrl = getProductImageUrl(product, 320, 240);
  const { cartItems, updateQuantity, removeItem } = useCart();
  const [busy, setBusy] = useState(false);

  // Find if this product is already in cart
  const cartItem = (cartItems || []).find((i) => i.productId === product.id);

  const handleQtyChange = async (newQty) => {
    setBusy(true);
    if (newQty < 1) {
      await removeItem(cartItem.id);
    } else {
      await updateQuantity(cartItem.id, newQty);
    }
    setBusy(false);
  };

  const goToDetail = () => navigate(`/products/${product.id}`);

  return (
    <article
      className="shop-product-card"
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && goToDetail()}
    >
      {/* Faded blurred background image */}
      <div
        className="shop-product-card__bg"
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-hidden="true"
      />

      {/* Actual product image */}
      <div className="shop-product-card__image-wrap">
        <img
          src={imageUrl}
          alt={product.name}
          className="shop-product-card__image"
          loading="lazy"
          onError={(e) => { e.target.style.opacity = "0.3"; }}
        />
      </div>

      <div className="shop-product-card__body">
        {product.brand?.name && (
          <p className="shop-product-card__brand">{product.brand.name}</p>
        )}
        <h3 className="shop-product-card__title">{product.name}</h3>
        <p className="shop-product-card__category">{product.category}</p>
        {!product.inStock && (
          <span className="shop-product-card__oos-badge">Out of Stock</span>
        )}
        <p className="shop-product-card__price">₹{product.price?.toLocaleString("en-IN")}</p>

        {cartItem ? (
          <div
            className="shop-product-card__qty d-inline-flex align-items-center border rounded overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-0 px-2 py-1"
              disabled={busy}
              onClick={() => handleQtyChange(cartItem.quantity - 1)}
              aria-label="Decrease"
            >−</button>
            <span className="px-3 fw-semibold small">{cartItem.quantity}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-0 px-2 py-1"
              disabled={busy}
              onClick={() => handleQtyChange(cartItem.quantity + 1)}
              aria-label="Increase"
            >+</button>
          </div>
        ) : (
          <button
            type="button"
            className="shop-product-card__btn"
            disabled={product.inStock === false}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
          >
            {product.inStock === false ? "Out of Stock" : "Add to Cart"}
          </button>
        )}
      </div>
    </article>
  );
}
