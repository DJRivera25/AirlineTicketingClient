import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isLockedOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminNavbar />
        <main className="py-3">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
