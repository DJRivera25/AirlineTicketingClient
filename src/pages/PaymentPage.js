// ✅ IMPORTS
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CreditCard, Wallet, Banknote, ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import locations from "../data/Locations";

const countryToFlagCode = {
  Philippines: "ph",
  Japan: "jp",
  "South Korea": "kr",
  Singapore: "sg",
  Thailand: "th",
  "United Kingdom": "gb",
  Germany: "de",
  "United States": "us",
  Canada: "ca",
};

const flattenCities = () =>
  locations.flatMap((region) =>
    region.countries.flatMap((country) =>
      country.cities.map((city) => ({
        city: city.name,
        code: city.code,
        country: country.country,
        flag: `https://flagcdn.com/24x18/${countryToFlagCode[country.country]}.png`,
      }))
    )
  );

const EXPIRATION_MINUTES = 15;

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [status, setStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [gcashRedirecting, setGcashRedirecting] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBooking(res.data);
      } catch (err) {
        console.error("Failed to fetch booking:", err);
      }
    };
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (!booking) return;

    if (booking?.status === "paid") {
      setStatus("success");
      setTimeout(() => navigate(`/booking-confirmation/${bookingId}`), 3000);
    } else {
      const createPaymentIntent = async () => {
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_API_BASEURL}/payments/create-payment-intent`,
            { amount: booking.totalPrice * 100 },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setClientSecret(res.data.clientSecret);
        } catch (err) {
          console.error("Payment intent creation failed:", err);
        }
      };
      createPaymentIntent();
    }
  }, [booking]);

  useEffect(() => {
    if (!booking) return;
    const bookedAtTime = new Date(booking.bookedAt).getTime();
    const expirationTime = bookedAtTime + EXPIRATION_MINUTES * 60 * 1000;
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((expirationTime - now) / 1000);
      setTimeLeft(diff > 0 ? diff : 0);
    };
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [booking]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleStripePayment = async () => {
    if (!stripe || !elements || timeLeft === 0 || !clientSecret || !booking?.fullName) return;
    setStatus("processing");
    const cardElement = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: booking.fullName,
          email: booking.email,
          phone: booking.phone,
        },
      },
    });

    if (result.error) {
      console.error(result.error.message);
      setStatus("failure");
    } else if (result.paymentIntent.status === "succeeded") {
      try {
        const charge = result.paymentIntent?.charges?.data?.[0];
        await axios.post(
          `${process.env.REACT_APP_API_BASEURL}/payments/record`,
          {
            booking: bookingId,
            method: "card",
            amount: result.paymentIntent.amount / 100,
            status: "succeeded",
            currency: result.paymentIntent.currency,
            stripePaymentIntentId: result.paymentIntent.id,
            transactionId: charge?.id,
            receiptUrl: charge?.receipt_url,
            paidAt: Date.now(),
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        await axios.patch(
          `${process.env.REACT_APP_API_BASEURL}/bookings/${bookingId}/pay`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setStatus("success");
        setTimeout(() => navigate(`/booking-confirmation/${bookingId}`), 3000);
      } catch (err) {
        toast.error("Payment succeeded but failed to update booking.");
      }
    }
  };

  const handleGcashPayment = async () => {
    setGcashRedirecting(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASEURL}/payments/sandbox/gcash`,
        {
          amount: booking.totalPrice,
          email: booking.email,
          phone: booking.phone,
        },

        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log(data.actions.checkout_url);
      console.log(`data`, data);
      // window.location.href = data.actions.desktop_web_checkout_url;
    } catch (err) {
      console.error("GCash error:", err.response?.data || err.message);
      toast.error("Failed to create GCash charge.");
      setGcashRedirecting(false);
    }
  };

  if (!booking) return <div className="text-center mt-20 text-gray-600 text-xl">Loading booking details...</div>;

  const { departureFlight, returnFlight, passengers, fullName, email, phone, totalPrice, tripType } = booking;
  const cityList = flattenCities();
  const depFrom = cityList.find((c) => departureFlight.from.includes(c.code));
  const depTo = cityList.find((c) => departureFlight.to.includes(c.code));
  const retFrom = returnFlight && cityList.find((c) => returnFlight.from.includes(c.code));
  const retTo = returnFlight && cityList.find((c) => returnFlight.to.includes(c.code));

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-3xl shadow-lg space-y-10">
      <h1 className="text-4xl font-bold text-center text-violet-700">Complete Your Payment</h1>

      {/* Timer */}
      <div
        className={`text-center p-4 rounded-xl font-semibold text-lg ${
          timeLeft > 0 ? "bg-yellow-100 text-yellow-900" : "bg-red-100 text-red-700"
        }`}
      >
        {timeLeft > 0 ? (
          <>
            ⏳ Time left: <span className="font-mono text-xl">{formatTime(timeLeft)}</span>
          </>
        ) : (
          "⏰ Booking expired. Please book again."
        )}
      </div>

      {/* Booking Summary */}
      <div className="p-6 bg-violet-50 rounded-xl">
        <h2 className="text-2xl font-semibold text-violet-800 mb-4">Booking Summary</h2>
        <p className="text-gray-700 mb-2">Name: {fullName}</p>
        <p className="text-gray-700 mb-2">Email: {email}</p>
        <p className="text-gray-700 mb-2">Phone: {phone}</p>
        <p className="text-gray-700 mb-2">
          From: {departureFlight.from} → {departureFlight.to}
        </p>
        {tripType === "roundtrip" && returnFlight && (
          <p className="text-gray-700">
            Return: {returnFlight.from} → {returnFlight.to}
          </p>
        )}
        <p className="mt-3 text-lg font-bold">Total: ₱{totalPrice.toLocaleString()}</p>
      </div>

      {/* Payment Options */}
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Select Payment Method</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {[
            { key: "card", icon: <CreditCard />, label: "Credit/Debit Card" },
            { key: "ewallet", icon: <Wallet />, label: "E-Wallet (GCash)" },
          ].map(({ key, icon, label }) => (
            <label
              key={key}
              className={`cursor-pointer border px-6 py-3 rounded-lg flex items-center gap-2 ${
                paymentMethod === key
                  ? "bg-violet-100 border-violet-600 shadow-lg"
                  : "hover:border-violet-300 border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={key}
                checked={paymentMethod === key}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden"
              />
              {icon}
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Payment Inputs */}
      {paymentMethod === "card" && (
        <div className="max-w-md mx-auto mt-4 border p-4 rounded-lg bg-white shadow-sm">
          <CardElement
            options={{
              style: {
                base: { fontSize: "16px", color: "#1f2937", "::placeholder": { color: "#9ca3af" } },
                invalid: { color: "#dc2626" },
              },
            }}
          />
        </div>
      )}

      {/* E-Wallet Button */}
      {paymentMethod === "ewallet" && (
        <div className="text-center">
          <button
            onClick={handleGcashPayment}
            disabled={gcashRedirecting || timeLeft === 0}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition ${
              gcashRedirecting
                ? "bg-gray-400 cursor-wait"
                : timeLeft === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {gcashRedirecting ? "Redirecting to GCash..." : "Pay with GCash"}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-700 border border-gray-300 px-5 py-2 rounded hover:bg-gray-100"
        >
          <ArrowLeft className="inline w-4 h-4 mr-1" /> Back
        </button>
        {paymentMethod === "card" && (
          <button
            onClick={handleStripePayment}
            disabled={status === "processing" || status === "success" || timeLeft === 0}
            className={`px-8 py-3 rounded-lg text-white font-semibold transition ${
              status === "success"
                ? "bg-green-500"
                : status === "processing"
                ? "bg-green-600 cursor-wait"
                : timeLeft === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {status === "processing" ? (
              <>
                <Loader2 className="animate-spin inline mr-2" /> Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        )}
      </div>

      {/* Status Message */}
      {status === "success" && (
        <div className="text-green-700 bg-green-100 p-4 rounded-lg text-center mt-6 flex justify-center items-center gap-2">
          <CheckCircle2 /> Payment Successful! Redirecting...
        </div>
      )}
      {status === "failure" && (
        <div className="text-red-700 bg-red-100 p-4 rounded-lg text-center mt-6 flex justify-center items-center gap-2">
          <XCircle /> Payment Failed. Try again.
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
