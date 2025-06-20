import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, User2 } from "lucide-react";
import UserContext from "../context/UserContext";
import logo4 from "../assets/logo4.png";

const UserNavbar = () => {
  const { user, unsetUser, setToken } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!user?.id);
  }, [user]);

  const handleLogout = () => {
    setIsLoggedIn(false);
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

  const navLinkClass = ({ isActive }) =>
    isActive ? "text-violet-300 font-semibold" : "text-white/90 hover:text-violet-300 transition duration-200";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between w-full">
        {/* LEFT: Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 min-w-[250px]">
          <div className="h-10 w-10">
            <img src={logo4} alt="Logo" className="h-full w-full object-contain object-center" />
          </div>
          <span className="text-xl font-extrabold tracking-wide text-violet-700">
            Tiket <span className="text-violet-500">Lakwatsero</span>
          </span>
        </Link>

        {/* CENTER: Nav Links - show only on md+ */}
        <div className="hidden md:flex items-center justify-center gap-6 flex-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-violet-700 font-semibold" : "text-gray-700 hover:text-violet-700 transition"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) =>
              isActive ? "text-violet-700 font-semibold" : "text-gray-700 hover:text-violet-700 transition"
            }
          >
            Support
          </NavLink>
          {isLoggedIn && (
            <NavLink
              to="/account/bookings"
              className={({ isActive }) =>
                isActive ? "text-violet-700 font-semibold" : "text-gray-700 hover:text-violet-700 transition"
              }
            >
              My Bookings
            </NavLink>
          )}
        </div>

        {/* RIGHT: Auth/Profile - show only on md+ */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className="border border-violet-600 text-violet-700 font-medium px-4 py-1.5 rounded-md hover:bg-violet-50 transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-violet-600 text-white font-semibold px-4 py-1.5 rounded-md hover:bg-violet-700 transition"
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
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-violet-100">
                <User2 size={20} className="text-violet-700" />
                <span className="hidden sm:inline font-medium text-gray-800">{user.fullName}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0  w-48 bg-white text-gray-700 rounded-md shadow-lg z-50">
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

        {/* Mobile Toggle Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-violet-700" aria-label="Toggle Menu">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white text-gray-800 px-4 pt-2 pb-4 space-y-2 transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <NavLink to="/" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600">
          Home
        </NavLink>
        <NavLink to="/flights" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600">
          Search Flights
        </NavLink>
        <NavLink to="/check-in" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600">
          Check-In
        </NavLink>
        <NavLink to="/support" onClick={() => setMenuOpen(false)} className="block hover:text-violet-600">
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
