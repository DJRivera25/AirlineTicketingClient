import React, { useState } from "react";

const samplePayments = [
  {
    id: "TXN001",
    user: "Juan Dela Cruz",
    date: "2025-06-09",
    amount: 5200,
    method: "Credit Card",
    status: "Paid",
    refundStatus: "No Refund",
  },
  {
    id: "TXN002",
    user: "Maria Santos",
    date: "2025-06-08",
    amount: 4100,
    method: "E-Wallet",
    status: "Refunded",
    refundStatus: "Processed",
  },
];

const PaymentsReports = () => {
  const [payments] = useState(samplePayments);

  const totalRevenue = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = payments.filter((p) => p.status === "Refunded").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-violet-700 mb-4">Payments & Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="font-semibold text-green-700">Total Revenue</h2>
          <p className="text-xl font-bold">₱{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="font-semibold text-red-700">Total Refunded</h2>
          <p className="text-xl font-bold">₱{totalRefunded.toLocaleString()}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="font-semibold text-blue-700">Transactions</h2>
          <p className="text-xl font-bold">{payments.length}</p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end space-x-4 mb-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Export to Excel</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Export to PDF</button>
      </div>

      {/* Payment Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">Transaction ID</th>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Method</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Refund</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((txn) => (
              <tr key={txn.id} className="text-center">
                <td className="p-3 border">{txn.id}</td>
                <td className="p-3 border">{txn.user}</td>
                <td className="p-3 border">{txn.date}</td>
                <td className="p-3 border">₱{txn.amount.toLocaleString()}</td>
                <td className="p-3 border">{txn.method}</td>
                <td className={`p-3 border font-semibold ${txn.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                  {txn.status}
                </td>
                <td className="p-3 border">{txn.refundStatus}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsReports;
