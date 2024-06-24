import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { FaEdit } from 'react-icons/fa'; 

const PersonalInfoDoctor = () => {
  const [doctorInfo, setDoctorInfo] = useState({});

  const getDoctorProfile = useCallback(async () => {
    const response = await axios.get("http://localhost:5000/doctor/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setDoctorInfo(response.data);
  }, []);

  useEffect(() => {
    getDoctorProfile();
  }, [getDoctorProfile]);

  return (
    <div className="bg-transparent p-2 rounded-lg flex">
      <div className="flex-none w-56 mr-44">
        <div className="flex items-center">
          <h2 className="text-xl font-bold mr-2">{doctorInfo.name}</h2>
          <button className="flex items-center mt-2 px-2  bg-gray-200 rounded">
            <FaEdit className="mr-1" />
            <Link to="/doctor/edit">
              Edit
            </Link>
          </button>
        </div>
        <p>{doctorInfo.email}</p>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-semibold mb-6">Personal Information</h3>
        <p><span className="font-semibold">Experience:</span> {doctorInfo.yearsOfExperience}</p>
        <p><span className="font-semibold">Specialization:</span> {doctorInfo?.specialization?.map((s) => (
          <span key={s}> {s}, </span>
        ))}</p>
        <p><span className="font-semibold">Qualifications:</span> {doctorInfo?.qualifications?.map((q) => (
          <span key={q}> {q}, </span>
        ))}</p>
      </div>
    </div>
  );
};

export default PersonalInfoDoctor;
