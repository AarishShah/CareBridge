import { useState } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const HandleConnectionRequest = ({ requestId }) => {
  const [message, setMessage] = useState("");

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  let url = BASE_URL;

  if (location.pathname.includes("patient/view-incoming-requests")) {
    url = url + "/patient/responseRequest";
  } else {
    url = url + "/doctor/responseRequest";
  }

  const handleResponse = async (action) => {
    try {
      const response = await axios.patch(
        `${url}/${requestId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error: Could not handle request");
    }
  };

  return (
    <div className="mt-4">
      {location.pathname.includes("view-incoming-requests") && (
        <button
          className="mr-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          onClick={() => handleResponse("accept")}
        >
          Accept
        </button>
      )}
      <button
        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        onClick={() => handleResponse("reject")}
      >
        Cancel
      </button>
      {message && (
        <p
          className={`mt-4 p-2 rounded ${
            message.startsWith("Error")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default HandleConnectionRequest;
