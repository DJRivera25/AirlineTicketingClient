import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { PlaneTakeoff } from "lucide-react";
import { Link } from "react-router-dom";
import bgFlight from "../assets/bg-flight.png";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-violet-800 via-violet-700 to-violet-600 text-white overflow-hidden rounded-xl shadow-2xl px-6 py-20 sm:py-28 text-center">
      {/* Decorative background blur */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm scale-105" />
      {/* Content wrapper */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* Title */}
        <div className="flex justify-center items-center gap-4">
          <PlaneTakeoff className="w-12 h-12 text-white drop-shadow-xl" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Welcome to <span className="text-yellow-300 drop-shadow-md">Tiket Lakwatsero</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-violet-100 max-w-2xl mx-auto leading-relaxed">
          Discover world-class destinations, book flights in seconds, and take off with confidence.
        </p>

        {/* Call to action */}
        <a
          href="#searchFlight"
          className="inline-flex items-center gap-3 bg-yellow-300 text-violet-900 hover:bg-yellow-400 hover:scale-105 px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300"
        >
          Book Your Flight Now
          <ArrowRightIcon className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
