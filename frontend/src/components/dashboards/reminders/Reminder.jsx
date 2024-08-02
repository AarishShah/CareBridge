import { useState } from "react";
import axios from "axios";
import image from "../../../assets/2.png";

const Reminder = () => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    text: "",
    startDate: "",
    intervalDays: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value,
    });
  };

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/doctor/reminder`, emailData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccess("Email scheduled successfully!");
      setError("");
    } catch (err) {
      setError("Failed to schedule email. Please check your input.");
      setSuccess("");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundImage: `${BASE_URL}(${image})` }}
    >
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Schedule Email
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              To:
            </label>
            <input
              type="email"
              name="to"
              value={emailData.to}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Subject:
            </label>
            <input
              type="text"
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Body:
            </label>
            <textarea
              name="text"
              value={emailData.text}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Start Date:
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={emailData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Interval (Days):
            </label>
            <input
              type="number"
              min={0}
              name="intervalDays"
              value={emailData.intervalDays}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Schedule Reminder
          </button>
        </form>
        {success && <p className="mt-4 text-green-600">{success}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default Reminder;

