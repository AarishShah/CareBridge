import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { FaEdit } from 'react-icons/fa'; 

const PersonalInfoDoctor = () => {
  const [patientInfo, setPatientInfo] = useState({ address: {} });

  const getPatientProfile = useCallback(async () => {
    const response = await axios.get("http://localhost:5000/patient/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setPatientInfo(response.data);
  }, []);

  useEffect(() => {
    getPatientProfile();
  }, [getPatientProfile]);

  return (
    <div className="bg-transparent p-2 rounded-lg flex">
      <div className="flex-none w-56 mr-44">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-2">{patientInfo.name}</h2>
          <button className="flex items-center mt-2 px-2  bg-gray-200 rounded">
            <FaEdit className="mr-1" />
            <Link to="/patient/edit">
              Edit
            </Link>
          </button>
        </div>
        <p>{patientInfo.email}</p>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-semibold mb-6">Personal Information</h3>
        <p><span className="font-semibold">Date of Birth:</span> {new Date(patientInfo.DOB).toLocaleDateString()}</p>
        <p><span className="font-semibold">Gender:</span> {patientInfo.gender}</p>
        <p><span className="font-semibold">Marital Status:</span> {patientInfo.maritalStatus}</p>
        <p><span className="font-semibold">Address:</span> {`${patientInfo.address.street}, ${patientInfo.address.city}, ${patientInfo.address.state}, ${patientInfo.address.pinCode}`}</p>
      </div>
    </div>
  );
};

export default PersonalInfoDoctor;
