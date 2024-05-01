import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import styles from "./DoctorProfile.module.css";

function DoctorProfile() {
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
    <div className={styles.card}>
      <div className="container">
        <h4>
          <b>{doctorInfo.name}</b>
        </h4>
        <hr style={{ width: "38rem" }} />
        <p>Has {doctorInfo.yearsOfExperience} years of experience</p>
        <hr style={{ width: "38rem" }} />
        <span>
          Specialization in
          {doctorInfo?.specialization?.map((s) => (
            <span key={s}> {s}, </span>
          ))}
        </span>

        <hr style={{ width: "38rem" }} />
        <span>
          Qualifications include
          {doctorInfo?.qualifications?.map((q) => (
            <span key={q}> {q}, </span>
          ))}
        </span>
        <button className={styles.edit}>
          <Link style={{ color: "#fff" }} to="/doctor/edit">
            Edit Profile
          </Link>
        </button>
      </div>
    </div>
  );
}

export default DoctorProfile;
