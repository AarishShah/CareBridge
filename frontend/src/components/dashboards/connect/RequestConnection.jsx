import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import image from "../../../assets/1.png";
import { useAuth } from "../../context/AuthContext";

const RequestConnection = () => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();

  let url = "http://localhost:5000/";

  if (location.pathname.includes("assign-patients")) {
    url = url + "doctor/requestPatient";
  } else {
    url = url + "patient/requestDoctor";
  }

  const handleRequest = async () => {
    try {
      const response = await axios.post(
        url,
        {
          email,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      if (error.response.status !== 404) {
        return setMessage("Error: " + error.response.data);
      }
      setMessage("Error: " + error.response.data.error);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <div
          className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Request to Connect
            </h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRequest}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Request Connection
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
        </div>
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
};

export default RequestConnection;

