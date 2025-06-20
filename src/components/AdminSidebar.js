import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Plane, ClipboardList, BarChart2, ChevronRight, ChevronLeft } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Flights", to: "/admin/flights", icon: Plane },
  { label: "Bookings", to: "/admin/bookings", icon: ClipboardList },
  { label: "Reports", to: "/admin/reports", icon: BarChart2 },
];

const AdminSidebar = ({ isLockedOpen, toggleSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSidebarOpen = isLockedOpen || isHovered;

  return (
    <aside
      className={`group relative z-40 h-full transition-all duration-300 ease-in-out bg-violet-900 text-white shadow-lg
      ${isSidebarOpen ? "w-64" : "w-16"} fixed md:relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 z-50 bg-violet-700 text-white p-1 rounded-full hover:bg-violet-600 shadow-md transition"
      >
        {isLockedOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-violet-700">
        <span className="text-2xl">✈️</span>
        {isSidebarOpen && <span className="text-lg font-bold tracking-wide">Tiket Lakwatsero</span>}
      </div>

      {/* Nav Items */}
      <nav className="mt-4 px-2 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all group
              ${isActive ? "bg-violet-700" : "hover:bg-violet-700"}
              text-white`
            }
          >
            <Icon size={20} />
            {isSidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
