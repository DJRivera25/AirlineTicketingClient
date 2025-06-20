import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CreditCard, Wallet, Banknote, ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const EXPIRATION_MINUTES = 15; // time before booking expires

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [status, setStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    console.log("Stripe:", stripe);
    console.log("Elements:", elements);
  }, [stripe, elements]);
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/bookings/${bookingId}`, {
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
    const createPaymentIntent = async () => {
      try {
        const res = await axios.post(
          "http://localhost:4000/payments/create-payment-intent",
          {
            amount: booking.totalPrice * 100, // in cents
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(`token`)}`,
            },
          }
        );
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Payment intent creation failed:", err);
      }
    };
    if (booking?.status === "paid") {
      console.log(`booking`, booking);
      setStatus("success");
      setTimeout(() => navigate(`/booking-confirmation/${bookingId}`), 3000);
    }

    if (booking) {
      createPaymentIntent();
    }
  }, [booking]);

  // Countdown timer effect
  useEffect(() => {
    if (!booking) return;

    const bookedAtTime = new Date(booking.bookedAt).getTime();
    const expirationTime = bookedAtTime + EXPIRATION_MINUTES * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((expirationTime - now) / 1000);
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateTimer(); // Initial call to set the time immediately
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId); // Clean up when unmounting
  }, [booking]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Payment system not ready. Please wait.");
      return;
    }
    if (timeLeft === 0 || !clientSecret || !booking?.fullName || !booking?.email || !booking?.phone) return;

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
        const paymentIntent = result.paymentIntent;
        const charge = paymentIntent?.charges?.data?.[0]; // safely access the charge object
        await axios.post(
          "http://localhost:4000/payments/record",
          {
            booking: bookingId,
            method: "card",
            amount: paymentIntent.amount / 100,
            status: "succeeded",
            currency: paymentIntent.currency,
            stripePaymentIntentId: paymentIntent.id,
            transactionId: charge?.id,
            receiptUrl: charge?.receipt_url,
            paidAt: Date.now(), // correct usage
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // 2. Update booking status to "paid"
        await axios.patch(
          `http://localhost:4000/bookings/${bookingId}/pay`,
          {}, // optional payload depending on your backend
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (err) {
        console.error("Failed to record payment:", err);
        toast.error("Payment processed but failed to update booking. Contact support.");
      }
      setStatus("success");
      setTimeout(() => navigate(`/booking-confirmation/${bookingId}`), 3000);
    }
  };

  if (!booking)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl font-medium">
        Loading booking details...
      </div>
    );

  const { tripType, departureFlight, returnFlight, passengers, fullName, email, phone, totalPrice } = booking;

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12 bg-white rounded-3xl shadow-lg drop-shadow-lg">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-violet-700 tracking-wide mb-3 drop-shadow-sm">
          Complete Your Payment
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Secure and fast payment options for your flight booking.
        </p>
      </header>

      {/* Countdown Timer */}
      <section
        className={`p-5 rounded-xl text-center font-semibold text-lg shadow-inner ${
          timeLeft > 0
            ? "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-yellow-900"
            : "bg-red-100 text-red-700"
        }`}
        role="alert"
        aria-live="polite"
      >
        {timeLeft > 0 ? (
          <>
            ⏳ Time remaining to complete payment:{" "}
            <span className="font-mono text-2xl font-bold tracking-widest">{formatTime(timeLeft)}</span>
          </>
        ) : (
          <>⏰ Booking expired. Please make a new booking.</>
        )}
      </section>

      {/* Booking Summary */}
      <section className="bg-violet-50 rounded-2xl p-8 shadow-lg border border-violet-200">
        <h2 className="text-3xl font-semibold text-violet-800 mb-6 tracking-tight">Booking Summary</h2>

        <div className="grid md:grid-cols-2 gap-8 text-violet-900 font-medium text-lg">
          <div>
            <p className="mb-2 text-violet-700">Trip Type</p>
            <p>{tripType === "roundtrip" ? "Round Trip" : "One Way"}</p>
          </div>
          <div>
            <p className="mb-2 text-violet-700">Contact Info</p>
            <p>
              {fullName} <span className="text-gray-600">|</span> {email} <span className="text-gray-600">|</span>{" "}
              {phone}
            </p>
          </div>
          <div>
            <p className="mb-2 text-violet-700">Departure</p>
            <p className="text-gray-700">
              {departureFlight?.from} → {departureFlight?.to}
              <br />
              <time dateTime={departureFlight?.departureTime}>
                {new Date(departureFlight?.departureTime).toLocaleString()}
              </time>{" "}
              -{" "}
              <time dateTime={departureFlight?.arrivalTime}>
                {new Date(departureFlight?.arrivalTime).toLocaleString()}
              </time>
            </p>
          </div>
          {tripType === "roundtrip" && returnFlight && (
            <div>
              <p className="mb-2 text-violet-700">Return</p>
              <p className="text-gray-700">
                {returnFlight.from} → {returnFlight.to}
                <br />
                <time dateTime={returnFlight.departureTime}>
                  {new Date(returnFlight.departureTime).toLocaleString()}
                </time>{" "}
                - <time dateTime={returnFlight.arrivalTime}>{new Date(returnFlight.arrivalTime).toLocaleString()}</time>
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="mb-2 text-violet-700 font-semibold text-lg">Passengers</p>
          <ul className="list-disc ml-6 space-y-1 text-violet-800 text-base max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-violet-100">
            {passengers.map((p, idx) => (
              <li key={idx} title={`${p.fullName || "Unnamed"} - Age: ${p.age || "?"}`}>
                <span className="font-semibold">{p.fullName || "Unnamed"}</span>{" "}
                <span className="text-gray-600">({p.age || "?"} y/o)</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fare Summary */}
      <section className="bg-violet-100 rounded-2xl p-6 shadow-md border border-violet-300 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-violet-900">Fare Summary</h2>
        <p className="text-3xl font-extrabold text-green-600 tracking-wide">₱{totalPrice.toLocaleString()}</p>
      </section>

      {/* Payment Method */}
      <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Select Payment Method</h2>
        <fieldset className="space-y-6">
          <legend className="sr-only">Payment Methods</legend>
          <div className="flex gap-6 justify-center flex-wrap">
            {[
              { key: "card", label: "Credit/Debit Card", icon: <CreditCard className="inline w-5 h-5 mr-2" /> },
              { key: "ewallet", label: "E-Wallet", icon: <Wallet className="inline w-5 h-5 mr-2" /> },
              { key: "bank", label: "Bank Transfer", icon: <Banknote className="inline w-5 h-5 mr-2" /> },
            ].map(({ key, label, icon }) => (
              <label
                key={key}
                htmlFor={`payment-${key}`}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg cursor-pointer border transition-shadow duration-300
                  ${
                    paymentMethod === key
                      ? "bg-violet-100 border-violet-600 text-violet-800 shadow-lg shadow-violet-300"
                      : "border-gray-300 hover:border-violet-400 hover:shadow-sm"
                  }
                `}
              >
                <input
                  id={`payment-${key}`}
                  type="radio"
                  name="payment"
                  value={key}
                  checked={paymentMethod === key}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />
                {icon}
                <span className="font-medium text-lg">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Payment Inputs */}
        <div className="mt-8 max-w-lg mx-auto space-y-4">
          {paymentMethod === "card" && (
            <div className="p-4 border rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-violet-500 bg-white">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1f2937", // Tailwind gray-800
                      "::placeholder": {
                        color: "#9ca3af", // Tailwind gray-400
                      },
                    },
                    invalid: {
                      color: "#dc2626", // Tailwind red-600
                    },
                  },
                }}
              />
            </div>
          )}
          {paymentMethod === "ewallet" && (
            <input
              type="text"
              placeholder="E-Wallet Number"
              className="input input-bordered w-full focus:ring-violet-500 focus:border-violet-500 rounded-lg shadow-sm"
              aria-label="E-Wallet Number"
            />
          )}
          {paymentMethod === "bank" && (
            <input
              type="text"
              placeholder="Bank Account No. or Reference #"
              className="input input-bordered w-full focus:ring-violet-500 focus:border-violet-500 rounded-lg shadow-sm"
              aria-label="Bank Account Number or Reference Number"
            />
          )}
        </div>
      </section>

      {/* Policy */}
      <section className="text-center text-gray-600 text-sm mt-6">
        <a
          href="/refund-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-600 hover:underline font-semibold"
        >
          View Cancellation & Refund Policy
        </a>
      </section>

      {/* Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 mt-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
          aria-label="Back to Booking"
        >
          <ArrowLeft size={20} /> Back to Booking
        </button>
        <button
          onClick={handlePayment}
          disabled={status === "processing" || status === "success" || timeLeft === 0}
          className={`flex items-center gap-3 px-8 py-3 rounded-lg text-white font-semibold transition duration-300
            ${
              status === "success"
                ? "bg-green-500 cursor-default"
                : status === "processing"
                ? "bg-green-600 cursor-wait"
                : timeLeft === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }
          `}
          aria-label="Pay Now"
        >
          {status === "processing" ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>

      {/* Status Messages */}
      <div
        className={`max-w-3xl mx-auto mt-6 rounded-lg p-4 flex items-center gap-3 shadow-md
          ${
            status === "success"
              ? "bg-green-100 text-green-800 animate-fade-in"
              : status === "failure"
              ? "bg-red-100 text-red-800 animate-fade-in"
              : ""
          }
        `}
        role="alert"
        aria-live="assertive"
      >
        {status === "success" && (
          <>
            <CheckCircle2 size={24} /> Payment Successful! Redirecting...
          </>
        )}
        {status === "failure" && (
          <>
            <XCircle size={24} /> Payment Failed. Please try again.
          </>
        )}
      </div>

      {timeLeft === 0 && (
        <div
          className="max-w-3xl mx-auto mt-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md text-center font-semibold"
          role="alert"
          aria-live="assertive"
        >
          Booking expired. Please create a new booking to continue.
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
