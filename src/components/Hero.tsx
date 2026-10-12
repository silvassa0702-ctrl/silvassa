import { useEffect, useState } from 'react';
import { assetUrl } from '../utils/assets';
import Icon from './Icon';

const HERO_SLIDES = [
  { img: 'img/hero.png', alt: 'Goodness in Every Bite' },
  { img: 'img/hero2.png', alt: 'Fresh Oven-Baked Treats' },
  { img: 'img/hero3.png', alt: 'Artisan Cakes & Pastries' },
  { img: 'img/hero4.png', alt: 'Pure Ingredients, Better Living' },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto sliding every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section className="hero-image-section hero-slider-wrap" id="hero">
      <div className="hero-slider-track">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.img}
            className={`hero-slide-item ${index === currentSlide ? 'active' : ''}`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={assetUrl(slide.img)}
              alt={slide.alt}
              className="hero-banner-img"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Slide Navigation Arrows */}
      <button
        type="button"
        className="hero-nav-arrow hero-arrow-left"
        onClick={handlePrev}
        aria-label="Previous slide"
      >
        <Icon name="arrow-left" />
      </button>
      <button
        type="button"
        className="hero-nav-arrow hero-arrow-right"
        onClick={handleNext}
        aria-label="Next slide"
      >
        <Icon name="arrow-right" />
      </button>

      {/* Dot Indicators */}
      <div className="hero-dots" role="tablist" aria-label="Hero slider pagination">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.img}
            type="button"
            className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
            role="tab"
            aria-selected={idx === currentSlide}
          />
        ))}
      </div>
    </section>
  );
}
