import React, { useState } from "react";

const ContentManagement = () => {
  const [faqs, setFaqs] = useState([{ question: "How early should I check in?", answer: "2 hours before departure." }]);

  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  const [banners, setBanners] = useState([{ title: "Summer Promo!", status: "Active" }]);

  const [newBanner, setNewBanner] = useState({ title: "", status: "Active" });

  const [policy, setPolicy] = useState("Enter refund, baggage, or cancellation policies here...");

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
  });

  const handleFaqAdd = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([...faqs, newFaq]);
      setNewFaq({ question: "", answer: "" });
    }
  };

  const handleBannerAdd = () => {
    if (newBanner.title) {
      setBanners([...banners, newBanner]);
      setNewBanner({ title: "", status: "Active" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-violet-700">Content Management</h1>

      {/* FAQs */}
      <section>
        <h2 className="text-xl font-semibold mb-2">FAQs</h2>
        <div className="space-y-2 mb-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-50 p-3 border rounded">
              <strong>Q:</strong> {faq.question}
              <br />
              <strong>A:</strong> {faq.answer}
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Question"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
          />
          <input
            className="border p-2 rounded flex-1"
            placeholder="Answer"
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
          />
          <button onClick={handleFaqAdd} className="bg-violet-600 text-white px-4 py-2 rounded">
            Add FAQ
          </button>
        </div>
      </section>

      {/* Banners */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Homepage Banners</h2>
        <ul className="mb-4">
          {banners.map((banner, i) => (
            <li key={i} className="border p-2 rounded bg-gray-50 flex justify-between">
              <span>{banner.title}</span>
              <span className="text-sm italic text-gray-500">{banner.status}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Banner Title"
            value={newBanner.title}
            onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newBanner.status}
            onChange={(e) => setNewBanner({ ...newBanner, status: e.target.value })}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button onClick={handleBannerAdd} className="bg-violet-600 text-white px-4 py-2 rounded">
            Add Banner
          </button>
        </div>
      </section>

      {/* Policies */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Policy Editor</h2>
        <textarea
          className="w-full border p-3 rounded h-40"
          value={policy}
          onChange={(e) => setPolicy(e.target.value)}
        />
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Notification Settings</h2>
        <label className="block mb-2">
          <input
            type="checkbox"
            checked={notifications.emailAlerts}
            onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
            className="mr-2"
          />
          Enable Email Alerts
        </label>
        <label>
          <input
            type="checkbox"
            checked={notifications.smsAlerts}
            onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
            className="mr-2"
          />
          Enable SMS Notifications
        </label>
      </section>
    </div>
  );
};

export default ContentManagement;
