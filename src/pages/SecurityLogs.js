import React, { useState } from "react";

const SecurityLogs = () => {
  const [logs] = useState([
    { admin: "superadmin", action: "Deleted user: john.doe", time: "2025-06-10 08:45" },
    { admin: "agent001", action: "Modified flight LH230", time: "2025-06-09 16:30" },
  ]);

  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  const [roles, setRoles] = useState([
    { username: "admin01", role: "Admin" },
    { username: "agent001", role: "Agent" },
    { username: "viewer002", role: "Viewer" },
  ]);

  const updateRole = (username, newRole) => {
    setRoles(roles.map((r) => (r.username === username ? { ...r, role: newRole } : r)));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-violet-700">Security & Logs</h1>

      {/* Activity Logs */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Admin Activity Logs</h2>
        <div className="bg-white rounded shadow p-4">
          {logs.map((log, i) => (
            <div key={i} className="border-b py-2 text-sm">
              <strong>{log.admin}</strong>: {log.action}
              <div className="text-gray-500 text-xs">{log.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2FA Settings */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Two-Factor Authentication</h2>
        <div className="flex items-center space-x-3">
          <span>2FA is currently:</span>
          <span className={`font-bold ${twoFAEnabled ? "text-green-600" : "text-red-600"}`}>
            {twoFAEnabled ? "Enabled" : "Disabled"}
          </span>
          <button onClick={() => setTwoFAEnabled(!twoFAEnabled)} className="bg-violet-600 text-white px-4 py-2 rounded">
            {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>
      </section>

      {/* Role-Based Access Control */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Role-Based Access Control</h2>
        <div className="space-y-2">
          {roles.map((user, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-100 p-3 rounded">
              <span>{user.username}</span>
              <select
                value={user.role}
                onChange={(e) => updateRole(user.username, e.target.value)}
                className="p-2 border rounded"
              >
                <option>Admin</option>
                <option>Agent</option>
                <option>Viewer</option>
              </select>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SecurityLogs;
