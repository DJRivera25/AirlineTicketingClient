import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { LogOut, User2 } from "lucide-react";

const AdminNavbar = () => {
  const { user, unsetUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    unsetUser();
    setToken(null);
    navigate("/login");
  };

  return (
    <header className="bg-violet-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-wide"> Admin</h1>

        <div className="relative">
          {/* Profile button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-violet-600 focus:outline-none"
          >
            <User2 size={20} />
            <span className="hidden sm:inline font-medium">{user.fullName}</span>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg overflow-hidden z-50">
              <div className="px-4 py-2 text-sm border-b border-gray-200">
                Signed in as <br />
                <span className="font-semibold">{user.fullName}</span>
              </div>
              <button
                onClick={() => navigate("/", {})}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100"
              >
                <User2 size={18} /> User Panel
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
