// src/App.js
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "./components/AdminLayout";
import UserContext from "./context/UserContext";

// Public/User Pages
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FlightResults from "./pages/FlightResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleLogin from "./pages/GoogleLogin";
import FlightDetails from "./pages/FlightDetails";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import AccountPage from "./pages/AccountPage";
import SupportPage from "./pages/SupportPage";
import UserProfilePage from "./pages/UserProfilePage";
import RoundTripSummary from "./pages/RoundTripSummary";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageFlights from "./pages/ManageFlights";
import ManageBookings from "./pages/ManageBookings";
import UserManagement from "./pages/UserManagement";
import PaymentsReports from "./pages/PaymentsReports";
import PromoManagement from "./pages/PromoManagement";
import ContentManagement from "./pages/ContentManagement";
import SecurityLogs from "./pages/SecurityLogs";
import ManageFlightDetails from "./pages/ManageFlightDetails";
import NotFound from "./pages/NotFound";

function AppContent({ isAdmin }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const adminRoutes = [
    { path: "/admin/dashboard", element: <AdminDashboard /> },
    { path: "/admin/flights", element: <ManageFlights /> },
    { path: "/admin/bookings", element: <ManageBookings /> },
    { path: "/admin/users", element: <UserManagement /> },
    { path: "/admin/payments", element: <PaymentsReports /> },
    { path: "/admin/promos", element: <PromoManagement /> },
    { path: "/admin/content", element: <ContentManagement /> },
    { path: "/admin/security", element: <SecurityLogs /> },
    { path: "/admin/flights/:id", element: <ManageFlightDetails /> },
  ];

  return (
    <>
      {!isAdminRoute && <Navbar />}

      {/* Apply top padding ONLY on user pages to avoid content being hidden under fixed navbar */}
      <div className={!isAdminRoute ? "pt-24 px-4 sm:px-6 md:px-8" : ""}>
        <Routes>
          {/* Public/User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<FlightResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google-login" element={<GoogleLogin />} />
          <Route path="/flight/:id/one-way" element={<FlightDetails />} />
          <Route path="/flight-summary/round-trip" element={<RoundTripSummary />} />
          <Route path="/booking/:outboundId/:returnId?" element={<BookingPage />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
          <Route path="/account/bookings" element={<AccountPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="*" element={<NotFound />} />

          {/* Admin Routes */}
          {isAdmin &&
            adminRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={<AdminLayout>{element}</AdminLayout>} />
            ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(!!user?.isAdmin);
  }, [user]);

  return (
    <Router>
      <AppContent isAdmin={isAdmin} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
