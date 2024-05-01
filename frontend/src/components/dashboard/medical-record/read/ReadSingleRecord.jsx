import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ReadSingleRecord.module.css";

function ReadSingleRecord() {
  const [medicalRecord, setMedicalRecord] = useState(null);
  const { id } = useParams();

  const fetchMedicalRecord = async () => {
    const response = await axios.get(
      `http://localhost:5000/medicalHistory/${id}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setMedicalRecord(response.data);
  };

  useEffect(() => {
    fetchMedicalRecord();
  }, [id]);

  if (!medicalRecord) return <div>Loading...</div>;

  const {
    biodata,
    examination,
    investigations,
    treatment,
    systemicHistory,
    doctorInfo,
    title,
    summary,
  } = medicalRecord;

  return (
    <div className={styles.container}>
      <h1>Medical Record for {biodata.name}</h1>
      <h2>Title: {title}</h2>
      <h2>Biodata</h2>
      <p>Name: {biodata.name}</p>
      <p>Email: {biodata.email}</p>
      <p>Gender: {biodata.gender}</p>
      <p>
        Age: {biodata.age.years} years, {biodata.age.months} months,{" "}
        {biodata.age.days} days
      </p>
      <p>Occupation: {biodata.occupation}</p>
      <p>Mode of Admission: {biodata.modeOfAdmission}</p>
      <p>
        Date of Admission:{" "}
        {new Date(biodata.dateOfAdmission).toLocaleDateString()}
      </p>
      <p>Marital Status: {biodata.maritalStatus}</p>
      <p>
        Address:{" "}
        {`${biodata.address.street}, ${biodata.address.city}, ${biodata.address.state}, ${biodata.address.pinCode}`}
      </p>

      <h2>Doctor Information</h2>
      <p>Name: {doctorInfo.doctorName}</p>
      <p>Email: {doctorInfo.doctorEmail}</p>

      <h2>Systemic History</h2>
      {Object.keys(systemicHistory).map((key) => (
        <div key={key}>
          <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
          {systemicHistory[key]}
        </div>
      ))}

      <h2>Examination</h2>
      {Object.keys(examination).map((key) => {
        const value = examination[key];
        return (
          <div key={key}>
            <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>
            {typeof value === "object" && value !== null
              ? Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey}>{`${subKey}: ${subValue}`}</div>
                ))
              : value}
          </div>
        );
      })}

      <h2>Investigations</h2>
      {Object.keys(investigations).map((key) => (
        <div key={key}>
          <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
          {investigations[key]}
        </div>
      ))}

      <h2>Treatment</h2>
      <p>Prescribed Drug: {treatment.prescribedDrug}</p>
      <p>Dosage: {treatment.dosage}</p>
      <p>Administration Route: {treatment.administrationRoute}</p>
      <p>Dosage Frequency: {treatment.dosageFrequency}</p>

      <h2>Summary</h2>
      <p>{summary || "No summary provided."}</p>
    </div>
  );
}

export default ReadSingleRecord;
