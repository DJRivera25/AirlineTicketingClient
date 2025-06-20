import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Switch } from "@headlessui/react";

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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";
    if (!/^\d{10,11}$/.test(mobileNo)) newErrors.mobileNo = "Mobile number must be 10–11 digits.";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.post("http://localhost:4000/users/register", {
        fullName: name,
        email,
        mobileNo,
        password,
      });
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (field) =>
    `w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
      errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-violet-500"
    }`;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-violet-50 text-black"
      } min-h-screen flex items-center justify-center px-4 transition-colors`}
    >
      <ToastContainer />

      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-violet-700 dark:text-violet-300">Create Your Account</h1>
          {/* <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${
              darkMode ? "bg-violet-600" : "bg-gray-300"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
            aria-label="Toggle Dark Mode"
          >
            <span className="sr-only">Toggle Dark Mode</span>
            <span
              className={`${
                darkMode ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch> */}
        </div>

        <p className="text-gray-600 dark:text-gray-300">
          Book faster and manage your trips easily with Tiket Lakwatsero.
        </p>

        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          <input
            type="text"
            aria-label="Full Name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses("name")}
            required
          />
          <div>
            <input
              type="email"
              aria-label="Email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses("email")}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              aria-label="Mobile Number"
              placeholder="Mobile Number"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              className={inputClasses("mobileNo")}
              required
            />
            {errors.mobileNo && <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>}
          </div>
          <div>
            <input
              type="password"
              aria-label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses("password")}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <input
              type="password"
              aria-label="Confirm Password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClasses("confirmPassword")}
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded font-semibold flex justify-center items-center transition disabled:opacity-50"
          >
            {loading ? (
              <span className="loader ease-linear rounded-full border-2 border-t-2 border-white h-5 w-5"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
        </div>

        <button
          onClick={() => (window.location.href = "http://localhost:4000/users/google")}
          className="w-full flex items-center justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 rounded transition"
          aria-label="Sign Up with Google"
        >
          <GoogleIcon />
          Sign Up with Google
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-violet-600 hover:underline font-medium">
            Log In
          </a>
        </p>
      </div>

      <style>{`
        .loader {
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;
