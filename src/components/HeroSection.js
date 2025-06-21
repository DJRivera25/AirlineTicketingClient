import { useEffect, useState } from "react";
import heroBackgrounds from "../data/HeroBackground";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = heroBackgrounds[currentIndex];

  useEffect(() => {
    // Preload all images
    heroBackgrounds.forEach((bg) => {
      const img = new Image();
      img.src = bg.image;
    });

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative z-0 h-[18rem] sm:h-[22rem] md:h-[26rem] lg:h-[28rem] xl:h-[30rem] w-full overflow-hidden shadow-2xl">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 z-0"
        style={{ backgroundImage: `url(${current.image})` }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-sm z-10" />

      {/* Country name */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight drop-shadow-xl text-center px-4">
          {current.country}
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
