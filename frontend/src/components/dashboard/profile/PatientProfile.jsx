import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import styles from './PatientProfile.module.css';


function PatientProfile() {
    const [patientInfo, setPatientInfo] = useState({ address: {} });

    const getPatientProfile = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5000/patient/me", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setPatientInfo(response.data);
        } catch (error) {
            console.error('Failed to fetch patient data:', error);
        }
    }, []);

    useEffect(() => {
        getPatientProfile();
    }, [getPatientProfile]);

    return (
        <div className={styles.card}>
            <div className={styles.container}>
                <h4><b>{patientInfo.name}</b></h4>
                <hr style={{ width: "38rem" }} />
                <p>Email: {patientInfo.email}</p>
                <p>Date of Birth: {new Date(patientInfo.DOB).toLocaleDateString()}</p>
                <p>Gender: {patientInfo.gender}</p>
                <p>Marital Status: {patientInfo.maritalStatus}</p>
                <p>Occupation: {patientInfo.occupation}</p>
                <p>Religion: {patientInfo.religion}</p>
                <hr style={{ width: "38rem" }} />
                <p>Address: {`${patientInfo.address.street}, ${patientInfo.address.city}, ${patientInfo.address.state}, ${patientInfo.address.pinCode}`}</p>
                <hr style={{ width: "38rem" }} />
                <button className={styles.edit}>
                    <Link style={{ color: "#fff" }} to="/patient/edit">
                        Edit Profile
                    </Link>
                </button>
            </div>
        </div>
    );
}

export default PatientProfile;
