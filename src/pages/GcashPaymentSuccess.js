import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const GcashPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const txId = searchParams.get("tx_id");
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!txId) return navigate("/unauthorized");

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/payments/verify-gcash`, {
          params: { tx_id: txId },
        });

        const { valid, payment, bookingId } = res.data;

        if (valid && payment && bookingId) {
          // ✅ Mark valid
          setIsValid(true);

          // ✅ Record payment in DB
          await axios.post(
            `${process.env.REACT_APP_API_BASEURL}/payments/record`,
            {
              booking: bookingId,
              method: "gcash",
              amount: payment.charge_amount / 100,
              currency: payment.currency,
              status: "succeeded",
              transactionId: payment.id,
              xenditChargeId: payment.id,
              xenditReferenceId: payment.reference_id,
              xenditCheckoutUrl: payment.actions?.desktop_web_checkout_url || "",
              xenditChannelCode: payment.channel_code,
              xenditRedirectSuccessUrl: payment.channel_properties?.success_redirect_url,
              xenditRedirectFailureUrl: payment.channel_properties?.failure_redirect_url,
              paidAt: Date.now(),
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );

          // ✅ Mark booking as paid
          await axios.patch(
            `${process.env.REACT_APP_API_BASEURL}/bookings/${bookingId}/pay`,
            {},
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
        } else {
          navigate("/unauthorized");
        }
      } catch (err) {
        console.error("Verification failed:", err);
        navigate("/unauthorized");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [txId, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Verifying Payment...</div>;
  if (!isValid) return null;

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
