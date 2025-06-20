import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";

const GoogleLoginLandingPage = () => {
  const { setToken, user, fetchUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    let token = query.get("token");
    if (!token || token === "undefined" || token === "null" || token.trim() === "") {
      token = localStorage.getItem("token");
    }

    if (!token || token === "undefined" || token === "null" || token.trim() === "") {
      localStorage.removeItem("token");
      setToken(null);
      navigate("/login", { replace: true });
    } else {
      localStorage.setItem("token", token);
      setToken(token);
      fetchUser(token).then(() => setLoading(false)); // wait for user to be fetched
    }
  }, [location.search, setToken, navigate]);

  // Redirect when user is available
  useEffect(() => {
    if (!loading && user) {
      const timeout = setTimeout(() => {
        navigate(user.isAdmin ? "/admin/dashboard" : "/", { replace: true });
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-violet-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-violet-700 mb-2">Welcome to Tiket Lakwatsero!</h1>
        <p className="text-lg text-violet-600 mb-4">
          Hello, <span className="font-semibold">{user?.fullName || "..."}</span>!
        </p>
        <p className="text-sm text-gray-600 mb-6">
          You're now logged in with Google. Redirecting you to your dashboard...
        </p>

        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default GoogleLoginLandingPage;
