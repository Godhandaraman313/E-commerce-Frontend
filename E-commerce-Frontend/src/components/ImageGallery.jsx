import { useState } from "react";
import { getProductImageUrl } from "../utils/productImage";
import "../styles/image-gallery.css";

export default function ImageGallery({ product }) {
  const [activeImage, setActiveImage] = useState(getProductImageUrl(product));
  
  // Combine main image with extra images
  const allImages = [getProductImageUrl(product)];
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      // img.name contains the url or path
      if (img.name) {
         allImages.push(img.name.startsWith("http") ? img.name : `http://localhost:8282${img.name}`);
      }
    });
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.target.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div className="product-gallery">
      <div className="gallery-thumbnails">
        {allImages.map((src, idx) => (
          <div 
            key={idx} 
            className={`thumbnail-wrap ${activeImage === src ? "active" : ""}`}
            onMouseEnter={() => setActiveImage(src)}
          >
            <img src={src} alt={`Thumbnail ${idx}`} />
          </div>
        ))}
      </div>
      <div className="gallery-main">
        <div 
          className="main-image-zoom-container"
          onMouseMove={handleMouseMove}
        >
          <img 
            src={activeImage} 
            alt="Product Main" 
            className="main-image" 
          />
        </div>
      </div>
    </div>
  );
}
