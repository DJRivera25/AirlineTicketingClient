import { useEffect, useRef, useState } from "react";
import heroBackgrounds from "../data/HeroBackground";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const intervalRef = useRef(null);

  // Preload all images once
  useEffect(() => {
    const initialLoadStatus = heroBackgrounds.map(() => false);
    setLoadedImages(initialLoadStatus);

    heroBackgrounds.forEach((bg, idx) => {
      const img = new Image();
      img.src = bg.image;
      img.onload = () => {
        setLoadedImages((prev) => {
          const updated = [...prev];
          updated[idx] = true;
          return updated;
        });
      };
    });
  }, []);

  // Carousel Interval
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section className="relative z-0 h-[18rem] sm:h-[22rem] md:h-[26rem] lg:h-[28rem] xl:h-[30rem] w-full overflow-hidden shadow-2xl">
      {/* All stacked images */}
      {heroBackgrounds.map((bg, idx) => (
        <img
          key={idx}
          src={bg.image}
          alt={bg.country}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            currentIndex === idx && loadedImages[idx] ? "opacity-100" : "opacity-0"
          }`}
          style={{
            willChange: "opacity",
            zIndex: 0,
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-sm z-10" />

      {/* Country Name */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight drop-shadow-xl text-center px-4">
          {heroBackgrounds[currentIndex].country}
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
