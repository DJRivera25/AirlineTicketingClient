import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserContext from "../context/UserContext";

// Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3">
    <path
      d="M533.5 278.4c0-17.5-1.6-35.1-4.9-52H272v98.5h146.9c-6.4 34.3-25.5 63.5-54.6 83.1v68h88.1c51.4-47.3 80.1-117 80.1-197.6z"
      fill="#4285f4"
    />
    <path
      d="M272 544.3c72.6 0 133.5-24 178-65.3l-88.1-68c-24.5 16.4-55.8 25.9-89.9 25.9-68.8 0-127.1-46.5-148-109.2h-89.9v68.7c44.4 87.4 134.3 147.9 237.9 147.9z"
      fill="#34a853"
    />
    <path
      d="M124 327.7c-10.3-30.1-10.3-62.5 0-92.6v-68.7H34.1c-39.5 77.7-39.5 168.6 0 246.3L124 327.7z"
      fill="#fbbc04"
    />
    <path
      d="M272 107.7c38.6-.6 75.8 13.8 104 40.3l77.9-77.9C407.1 24 345.3-.1 272 0 168.4 0 78.5 60.5 34.1 148l89.9 68.7C144.9 154.2 203.2 107.7 272 107.7z"
      fill="#ea4335"
    />
  </svg>
);

const Login = () => {
  const { unsetUser, setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const baseUrl = `http://localhost:4000`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    unsetUser();
    setToken(null);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email.includes("@")) newErrors.email = "Invalid email format.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix validation errors.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/users/login`, { email, password });
      const token = res.data.access;
      localStorage.setItem("token", token);
      setToken(token);

      const userRes = await axios.get(`${baseUrl}/users/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userRes.data;
      setUser(user);

      toast.success("Login successful!");

      // ⏱ Add delay before redirecting
      setTimeout(() => {
        setLoading(false);
        navigate(user.isAdmin ? "/admin/dashboard" : "/");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-violet-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-violet-700">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Log in to book, manage, and view your trips on Tiket Lakwatsero.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-violet-500"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-400" : "focus:ring-violet-500"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-violet-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <button
          onClick={() => (window.location.href = `${baseUrl}/users/google`)}
          className="w-full flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 py-2 rounded"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-violet-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
