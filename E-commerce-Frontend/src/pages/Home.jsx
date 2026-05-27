import HeroCarousel from "../components/HeroCarousel";
import InfiniteProductGrid from "../components/InfiniteProductGrid";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-page">
      <HeroCarousel />
      <InfiniteProductGrid />
    </div>
  );
}
