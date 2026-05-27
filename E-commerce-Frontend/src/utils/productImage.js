const API_BASE = "http://localhost:8282";
const DEFAULT_IMAGE = "https://via.placeholder.com/400x400?text=No+Image";

/** Resolve product or category image URL from API (relative or absolute). */
export function getProductImageUrl(product, width, height) {
  const url = product?.imageUrl;
  if (url) {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
  }
  if (width && height) {
    return DEFAULT_IMAGE;
  }
  return DEFAULT_IMAGE;
}

export function getCategoryImageUrl(category) {
  return getProductImageUrl({ imageUrl: category?.imageUrl });
}

export { DEFAULT_IMAGE, API_BASE };
