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
import ManageFlightDetails from "./pages/ManageFlightDetails";
import NotFound from "./pages/NotFound";

// Loader Component
import FullPageLoader from "./pages/FullPageLoader";
import AdminCalendar from "./pages/AdminCalendar";
import GcashPaymentSuccess from "./pages/GcashPaymentSuccess";

function AppContent({ isAdmin, isLoggedIn }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const adminRoutes = [
    { path: "/admin/dashboard", element: <AdminDashboard /> },
    { path: "/admin/flights", element: <ManageFlights /> },
    { path: "/admin/bookings", element: <ManageBookings /> },
    { path: "/admin/users", element: <UserManagement /> },
    { path: "/admin/flights/:id", element: <ManageFlightDetails /> },
    { path: "/admin/calendar", element: <AdminCalendar /> },
  ];

  return (
    <>
      {!isAdminRoute && <Navbar />}

      {/* Padding for fixed navbar */}
      <div className={!isAdminRoute && location.pathname !== "/" ? "pt-24 px-4 sm:px-6 md:px-8" : !isAdminRoute}>
        <Routes>
          {/* Public/User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/flight-results" element={<FlightResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google-login" element={<GoogleLogin />} />
          <Route path="/flight/:id/one-way" element={<FlightDetails />} />
          <Route path="/flight-summary/round-trip" element={<RoundTripSummary />} />
          <Route path="/booking/:outboundId/:returnId?" element={<BookingPage />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
          <Route path="gcash/payment-success" element={<GcashPaymentSuccess />} />
          <Route path="/account/bookings" element={<AccountPage />} />
          <Route path="/account" element={<UserProfilePage />} />
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
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log(`user:`, user);
    setIsAdmin(!!user?.isAdmin);
    if (user.id != null) {
      setIsLoggedIn(true);
    }
  }, [user]);

  // Simulate a loading delay for better UX (especially on hard reload)
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Router>
      {loading ? <FullPageLoader /> : <AppContent isAdmin={isAdmin} isLoggedIn={isLoggedIn} />}
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
