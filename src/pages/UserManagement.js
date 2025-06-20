import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Dialog } from "@headlessui/react";

const roles = ["admin", "customer"];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("fullName");
  const [sortDir, setSortDir] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const USERS_PER_PAGE = 5;
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        search,
        role: roleFilter,
        sortBy,
        sortOrder: sortDir,
        page: currentPage,
        limit: USERS_PER_PAGE,
      });

      const res = await axios.get(`http://localhost:4000/users/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, sortBy, sortDir, currentPage]);

  const handleRoleChange = (id, newRole) => {
    const updatedUsers = users.map((user) => (user._id === id ? { ...user, role: newRole } : user));
    setUsers(updatedUsers);
    toast.success("Role updated successfully");

    // Optional: send role update to backend
    // axios.put(`http://localhost:4000/users/${id}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u._id !== id));
    toast.success("User deleted");

    // Optional: send delete request to backend
    // axios.delete(`http://localhost:4000/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  };

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const isOnline = (lastActive) => {
    const last = new Date(lastActive);
    const diff = Date.now() - last.getTime();
    return diff < 5 * 60 * 1000;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold text-violet-700">User Management</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-4 py-2 rounded w-full sm:w-1/2"
          />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-4 py-2 rounded"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("fullName")}>
                  Name
                </th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("email")}>
                  Email
                </th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("role")}>
                  Role
                </th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("lastActive")}>
                  Last Active
                </th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">{u.lastActive ? new Date(u.lastActive).toLocaleString() : "N/A"}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        isOnline(u.lastActive) ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isOnline(u.lastActive) ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setDeleteModal({ show: true, user: u })}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Delete Modal */}
        <Dialog open={deleteModal.show} onClose={() => setDeleteModal({ show: false, user: null })}>
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <Dialog.Panel className="bg-white rounded-lg shadow p-6 max-w-sm w-full">
              <Dialog.Title className="text-lg font-medium mb-4">Confirm Deletion</Dialog.Title>
              <p>
                Are you sure you want to delete <strong>{deleteModal.user?.fullName}</strong>?
              </p>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setDeleteModal({ show: false, user: null })}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete(deleteModal.user._id);
                    setDeleteModal({ show: false, user: null });
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default UserManagement;
