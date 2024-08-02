import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import defaultImage from "../../../assets/8.png";

const PersonalInfoDoctor = () => {
  const [patientInfo, setPatientInfo] = useState({ address: {} });
  const [profile, setProfile] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const getPatientProfile = useCallback(async () => {
    const response = await axios.get(`${BASE_URL}/patient/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setPatientInfo(response.data.patient);
    setProfile(response.data.profileUrl);
  }, []);

  useEffect(() => {
    getPatientProfile();
  }, [getPatientProfile]);

  return (
    <div className="bg-transparent p-2 rounded-lg flex flex-row items-start">
      <div className="flex-none w-56 mr-44">
        <div className="flex items-start">
          <img
            src={profile || defaultImage}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-4 border-gray-400 border-2"
          />
          <div className="flex flex-col">
            <h2 className="text-sm md:text-xl font-semibold mr-2">
              {patientInfo.name}
            </h2>
            <button className="flex h-8 w-20 items-center mt-2 px-2 bg-gray-200 rounded">
              <FaEdit className="mr-1" />
              <Link to="/patient/edit" className="text-base sm:text-sm md:text-xs">
                Edit
              </Link>
            </button>
            <p className="text-base sm:text-sm md:text-sm">{patientInfo.email}</p>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-sm md:text-xl  font-semibold mb-2">
          {patientInfo.name}'s Information:
        </h3>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Date of Birth: </span> 
            {new Date(patientInfo.DOB).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Gender: </span> {patientInfo.gender}
          </p>
          <p>
            <span className="font-semibold">Marital Status: </span>
            {patientInfo.maritalStatus}
          </p>
          <p>
            <span className="font-semibold">Address: </span> 
            {`${patientInfo.address.street}, ${patientInfo.address.city}, ${patientInfo.address.state}, ${patientInfo.address.pinCode}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoDoctor;
