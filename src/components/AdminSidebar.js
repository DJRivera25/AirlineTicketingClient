import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Plane,
  ClipboardList,
  BarChart2,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import logo from "../assets/logo4text.png";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Flights", to: "/admin/flights", icon: Plane },
  { label: "Bookings", to: "/admin/bookings", icon: ClipboardList },
  { label: "Calendar", to: "/admin/calendar", icon: CalendarDays },
  { label: "Reports", to: "/admin/reports", icon: BarChart2 },
];

const AdminSidebar = ({ isLockedOpen, toggleSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSidebarOpen = isLockedOpen || isHovered;

  return (
    <aside
      className={`group relative z-40 h-full transition-all duration-300 ease-in-out bg-violet-900 text-white shadow-xl
      ${isSidebarOpen ? "w-64" : "w-16"} fixed md:relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-4 -right-3 z-50 bg-violet-700 text-white p-1.5 rounded-full shadow-md hover:bg-violet-600 transition-transform ${
          isSidebarOpen ? "rotate-0" : "rotate-180"
        }`}
        title="Toggle Sidebar"
      >
        {isLockedOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center px-4 py-5 border-b border-violet-700">
        <img
          src={logo}
          alt="Tiket Lakwatsero Logo"
          className={`transition-all duration-300 ${isSidebarOpen ? "w-40" : "w-8"}`}
        />
      </div>

      {/* Nav Items */}
      <nav className="mt-4 flex flex-col gap-1 px-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive ? "bg-violet-700 border-l-4 border-white pl-2" : "hover:bg-violet-700"}
              text-white group`
            }
          >
            <Icon size={20} />
            {isSidebarOpen ? (
              <span className="truncate">{label}</span>
            ) : (
              <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-black text-white rounded shadow-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 z-50">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
