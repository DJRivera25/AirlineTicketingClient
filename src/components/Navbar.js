import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, User2 } from "lucide-react";
import UserContext from "../context/UserContext";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.png";

const UserNavbar = () => {
  const { user, unsetUser, setToken } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLoggedIn = !!user?.id;

  const handleLogout = () => {
    unsetUser();
    setToken(null);
    navigate("/login");
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 180);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `${isHome && !scrolled ? "text-white" : "text-gray-700"} ${
      isActive ? "font-semibold" : "hover:text-violet-700"
    } transition`;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isHome && !scrolled ? "bg-transparent text-white" : "bg-white/70 backdrop-blur-md text-gray-800 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between w-full">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 min-w-[250px]">
          <div className="h-10 w-10">
            <img
              src={isHome && !scrolled ? logo4 : logo3}
              alt="Logo"
              className="h-full w-full object-contain object-center"
            />
          </div>
          <span
            className={`text-xl font-extrabold tracking-wide ${isHome && !scrolled ? "text-white" : "text-violet-700"}`}
          >
            Tiket <span className={isHome && !scrolled ? "text-indigo-300" : "text-violet-500"}>Lakwatsero</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center justify-center gap-6 flex-1">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/support" className={navLinkClass}>
            Support
          </NavLink>
          {isLoggedIn && (
            <NavLink to="/account/bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
          )}
        </div>

        {/* Right - Auth/Profile */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className={`border ${
                  isHome && !scrolled
                    ? "border-white text-white hover:bg-white/10"
                    : "border-violet-600 text-violet-700  bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                } font-medium px-4 py-1.5 rounded-md transition`}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={`border ${
                  isHome && !scrolled
                    ? "border-white text-white hover:bg-white/10"
                    : "border-violet-600 text-violet-700  bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                } font-medium px-4 py-1.5 rounded-md transition`}
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              ref={dropdownRef}
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded hover:bg-violet-100 transition cursor-pointer">
                <User2 size={20} className={isHome && !scrolled ? "text-white" : "text-violet-700"} />
                <span
                  className={`hidden sm:inline font-medium ${isHome && !scrolled ? "text-white" : "text-gray-800"}`}
                >
                  {user.fullName}
                </span>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 top-full w-48 bg-white text-gray-700 rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 text-sm border-b border-gray-200">
                    Signed in as <br />
                    <span className="font-semibold">{user.fullName}</span>
                  </div>

                  {user.isAdmin && (
                    <NavLink
                      to="/admin/dashboard"
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 border-b border-gray-200"
                    >
                      <User2 size={18} /> Admin Panel
                    </NavLink>
                  )}

                  <NavLink to="/profile" className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100">
                    <User size={18} /> Profile
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`${isHome && !scrolled ? "text-white" : "text-violet-700"} md:hidden`}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 text-gray-800 px-6 pt-4 pb-6 space-y-3 shadow-md transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <NavLink to="/" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600 font-medium">
          Home
        </NavLink>
        <NavLink to="/flights" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600 font-medium">
          Search Flights
        </NavLink>
        <NavLink to="/check-in" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600 font-medium">
          Check-In
        </NavLink>
        <NavLink to="/support" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600 font-medium">
          Support
        </NavLink>

        {!isLoggedIn ? (
          <>
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600">
              Login
            </NavLink>
            <NavLink to="/register" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600">
              Sign Up
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/account/bookings" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600">
              My Bookings
            </NavLink>
            <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600">
              Profile
            </NavLink>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block w-full text-left hover:text-violet-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default UserNavbar;
