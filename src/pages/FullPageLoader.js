// src/components/FullPageLoader.js
import React from "react";
import logo from "../assets/logo4.png";

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-white via-violet-50 to-violet-100">
      {/* Logo */}
      <div className="mb-6">
        <img src={logo} alt="Tiket Lakwatsero Logo" className="h-20 w-20 object-contain animate-bounce" />
      </div>

      {/* Brand Text */}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-violet-700 mb-2 animate-pulse">
        Tiket <span className="text-violet-500">Lakwatsero</span>
      </h1>
      <p className="text-sm sm:text-base text-gray-500 mb-8">Preparing your boarding experience...</p>

      {/* Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default FullPageLoader;
