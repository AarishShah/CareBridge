import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import defaultImage from '../../../assets/8.png'; 

const PersonalInfoDoctor = () => {
  const [doctorInfo, setDoctorInfo] = useState({});
  const [profile, setProfile] = useState('');

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const getDoctorProfile = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/doctor/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDoctorInfo(response.data.doctor);
      setProfile(response.data.profileUrl);
    } catch (error) {
      console.error("Failed to fetch doctor profile:", error);
    }
  }, []);

  useEffect(() => {
    getDoctorProfile();
  }, [getDoctorProfile]);

  return (
    <div className="bg-transparent p-2 rounded-lg flex flex-row items-start">
      <div className="flex-none w-56 mr-44">
        <div className="flex items-center">
          <img
            src={profile || defaultImage}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-4 border-gray-400 border-2"
            style={{ width: '80px', height: '80px' }}
          />
          <div>
            <div className="flex flex-col">
              <h2 className="text-sm md:text-xl font-semibold  mr-2">{doctorInfo.name}</h2>
              <button className="flex h-8 w-20 items-center px-2 bg-gray-200 rounded">
                <FaEdit className="mr-1" />
                <Link to="/doctor/edit">Edit</Link>
              </button>
            </div>
            <p  className="text-base sm:text-sm md:text-sm">{doctorInfo.email}</p>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-sm md:text-xl  font-semibold mb-2">{doctorInfo.name}'s' Information</h3>
        <p><span className="font-semibold">Experience:</span> {doctorInfo.yearsOfExperience} year(s)</p>
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
