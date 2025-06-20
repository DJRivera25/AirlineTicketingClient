import React, { useState } from "react";

const PromoManagement = () => {
  const [promos, setPromos] = useState([
    {
      code: "FLYHIGH20",
      discount: "20%",
      routes: "MNL - CEB",
      seatClass: "Economy",
      dateRange: "2025-07-01 to 2025-08-31",
      usageCount: 12,
    },
  ]);

  const [form, setForm] = useState({
    code: "",
    discount: "",
    routes: "",
    seatClass: "",
    dateRange: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddPromo = () => {
    if (!form.code || !form.discount) return;
    setPromos([...promos, { ...form, usageCount: 0 }]);
    setForm({
      code: "",
      discount: "",
      routes: "",
      seatClass: "",
      dateRange: "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-violet-700 mb-6">Promo Code Management</h2>

      {/* Promo Form */}
      <div className="bg-white rounded shadow p-6 mb-8 space-y-4">
        <h3 className="font-semibold text-lg mb-2">Create New Promo</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Promo Code (e.g., FLYHIGH20)"
            className="border p-2 rounded"
          />
          <input
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount (e.g., 20%)"
            className="border p-2 rounded"
          />
          <input
            name="routes"
            value={form.routes}
            onChange={handleChange}
            placeholder="Applicable Routes (e.g., MNL - CEB)"
            className="border p-2 rounded"
          />
          <input
            name="seatClass"
            value={form.seatClass}
            onChange={handleChange}
            placeholder="Seat Class (e.g., Economy)"
            className="border p-2 rounded"
          />
          <input
            name="dateRange"
            value={form.dateRange}
            onChange={handleChange}
            placeholder="Valid Date Range (e.g., 2025-07-01 to 2025-08-31)"
            className="border p-2 rounded"
          />
        </div>
        <button onClick={handleAddPromo} className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700">
          Add Promo
        </button>
      </div>

      {/* Promo List Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">Code</th>
              <th className="p-3 border">Discount</th>
              <th className="p-3 border">Routes</th>
              <th className="p-3 border">Seat Class</th>
              <th className="p-3 border">Date Range</th>
              <th className="p-3 border">Used</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((promo, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border">{promo.code}</td>
                <td className="p-2 border">{promo.discount}</td>
                <td className="p-2 border">{promo.routes}</td>
                <td className="p-2 border">{promo.seatClass}</td>
                <td className="p-2 border">{promo.dateRange}</td>
                <td className="p-2 border">{promo.usageCount}</td>
              </tr>
            ))}
            {promos.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500 text-center">
                  No promo codes created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoManagement;
