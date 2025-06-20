import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-white px-6">
      <div className="text-center max-w-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-violet-100 text-violet-600 rounded-full p-4 shadow-lg">
            <AlertTriangle className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Oops! Page not found.</h2>
        <p className="text-gray-500 text-md mb-6">
          The page you’re looking for doesn’t exist or has been moved. Please check the URL or return to the homepage.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="inline-block bg-violet-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-violet-700 transition duration-300"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
