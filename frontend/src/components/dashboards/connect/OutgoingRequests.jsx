import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import image from "../../../assets/11.png";
import HandleConnectionRequest from "./HandleConnectionRequests";
import { useAuth } from "../../context/AuthContext";

const OutgoingRequests = () => {
  const { isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const location = useLocation();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  let url = BASE_URL;
  
  if (location.pathname.includes("/patient/view-outgoing-requests")) {
    url = url + "/patient/sentRequests";
  } else {
    url = url + "/doctor/sentRequests";
  }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        setTimeout(() => {
          setRequests(response.data);
        }, 400);
      } catch (error) {
        console.error("Error fetching received requests", error);
      }
    };

    fetchRequests();
  }, [ requests]);

  return (
    <>
      {isAuthenticated ? (
        <div
          className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Outgoing Requests
            </h2>
            <ul className="space-y-4">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <li
                    className="p-5 border border-gray-300 rounded-lg shadow-md bg-gray-50"
                    key={request._id}
                  >
                    <Link to="">
                      <div className="text-lg font-medium text-gray-800">
                        {location.pathname.includes(
                          "patient/view-outgoing-requests"
                        )
                          ? request.doctor.name
                          : request.patient.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {location.pathname.includes(
                          "patient/view-outgoing-requests"
                        )
                          ? request.doctor.email
                          : request.patient.email}
                      </div>
                      <HandleConnectionRequest requestId={request._id} />
                    </Link>
                  </li>
                ))
              ) : (
                <h3 className="text-lg font-semibold text-gray-500">
                  You&apos;re all caught-up :-)
                </h3>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
};

export default OutgoingRequests;

