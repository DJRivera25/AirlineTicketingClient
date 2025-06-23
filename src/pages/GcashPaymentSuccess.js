import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const GcashPaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-violet-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-3xl p-10 text-center border border-violet-200">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
        <h1 className="text-4xl font-extrabold text-violet-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 text-lg mb-6">
          Thank you for your payment via <span className="font-semibold text-violet-700">GCash</span>. Your booking is
          being processed and a confirmation email will be sent shortly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
          >
            Return to Home
          </Link>
          <Link
            to="/account/bookings"
            className="border border-violet-600 text-violet-700 hover:bg-violet-100 font-medium px-6 py-3 rounded-lg transition duration-300"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GcashPaymentSuccess;
