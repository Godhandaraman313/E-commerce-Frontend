import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductAPI } from "../api/ApiServices";
import { getProductImageUrl } from "../utils/productImage";

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await ProductAPI.getAll({ page: 0, size: 5, sort: "id,desc" });
        if (!mounted) return;
        setSlides(res.data?.content || []);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setSlides([]);
        setError(e.response?.data?.message || "Failed to load hero slides");
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  // Auto-play slideshow
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <section className="hero-carousel hero-carousel--empty">
        <div className="hero-carousel__fallback">
          <h1>Welcome to Shopme</h1>
          <p>Your premium e-commerce destination</p>
          {error && (
            <div style={{ marginTop: 20 }}>
              <p style={{ color: "#dc3545" }}>{error}</p>
              <button className="btn btn-sm btn-outline-dark" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="hero-carousel-container">
      <div className="custom-slider">
        {slides.map((product, idx) => {
          let position = "nextSlide";
          if (idx === currentIndex) {
            position = "activeSlide";
          } else if (
            idx === currentIndex - 1 ||
            (currentIndex === 0 && idx === slides.length - 1)
          ) {
            position = "lastSlide";
          }

          return (
            <article
              key={product.id}
              className={`custom-slide ${position}`}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <img
                src={getProductImageUrl(product, 1200, 480)}
                alt={product.name}
                className="custom-slide__img"
              />
              <div className="custom-slide__overlay" />
              <div className="custom-slide__caption">
                <span className="custom-slide__tag">{product.category}</span>
                <h2 className="custom-slide__title">{product.name}</h2>
                <p className="custom-slide__price">₹{product.price}</p>
                <button
                  type="button"
                  className="custom-slide__btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/${product.id}`);
                  }}
                >
                  Shop Now
                </button>
              </div>
            </article>
          );
        })}

        {/* Navigation Arrows */}
        <button type="button" className="custom-arrow custom-arrow--prev" onClick={prevSlide} aria-label="Previous Slide">
          &#10094;
        </button>
        <button type="button" className="custom-arrow custom-arrow--next" onClick={nextSlide} aria-label="Next Slide">
          &#10095;
        </button>

        {/* Indicators Dots */}
        <div className="custom-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`custom-dot ${idx === currentIndex ? "custom-dot--active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
