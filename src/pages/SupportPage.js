import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "What is the baggage allowance?",
    answer: "Most flights allow 7kg carry-on and 20kg checked baggage. Check specific airline policy during booking.",
  },
  {
    question: "How do I cancel or change my flight?",
    answer: "You can manage your bookings from the 'My Account' page. Cancellation fees may apply.",
  },
  {
    question: "Are there any COVID-19 travel rules?",
    answer:
      "Please check the latest health protocols of your destination. Requirements may include vaccination or negative test.",
  },
];

const SupportPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-violet-700">Support & Help</h1>

      {/* FAQs */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-4 py-3 font-medium flex justify-between items-center hover:bg-gray-50"
              >
                {faq.question}
                <span>{activeIndex === index ? "−" : "+"}</span>
              </button>
              {activeIndex === index && <div className="px-4 pb-4 text-gray-700">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-gray-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p>
          📞 Hotline: <strong>+63 912 345 6789</strong>
        </p>
        <p>
          📧 Email:{" "}
          <a href="mailto:support@lakwatseroair.com" className="text-blue-600 underline">
            support@lakwatseroair.com
          </a>
        </p>
      </section>

      {/* Support Options */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Need More Help?</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Live Chat (coming soon)
          </button>
          <button className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700">
            Submit Support Ticket
          </button>
        </div>
      </section>

      {/* Travel Alerts */}
      <section className="bg-yellow-100 p-4 rounded border-l-4 border-yellow-500">
        <h2 className="text-lg font-semibold mb-2">🚨 Travel Alerts</h2>
        <ul className="list-disc list-inside text-sm text-yellow-900">
          <li>Expect delays on July 1–5 due to maintenance at NAIA Terminal 3.</li>
          <li>COVID-19 protocols still apply to some international destinations.</li>
          <li>Weather disturbances may affect domestic flights in Visayas.</li>
        </ul>
      </section>

      {/* Back Button */}
      <div className="text-center pt-4">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-800 underline">
          ← Back to previous page
        </button>
      </div>
    </div>
  );
};

export default SupportPage;
