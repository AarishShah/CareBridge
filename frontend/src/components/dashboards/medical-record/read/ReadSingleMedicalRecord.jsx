import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ReadSingleMedicalRecord() {
  const [medicalRecord, setMedicalRecord] = useState(null);
  const { id } = useParams();

  const fetchMedicalRecord = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/medicalHistory/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMedicalRecord(response.data);
    } catch (error) {
      console.error("Error fetching medical record:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMedicalRecord();
    }
  }, [id]);

  if (!medicalRecord) return <div className="text-center text-gray-700">No data found</div>;

  const {
    biodata,
    examination,
    investigations,
    treatment,
    systemicHistory,
    doctorInfo,
    title,
    summary,
  } = medicalRecord || {};

  return (
    <div className="container mx-auto p-6">
      {biodata && <h1 className="text-3xl font-bold text-gray-800 ">Medical Record for {biodata.name}</h1>}
      {title && <h2 className="text-2xl font-semibold text-gray-700 mt-4">Title: {title}</h2>}

      {biodata && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Biodata</h2>
          <p className="mt-2"><span className="font-medium">Name:</span> {biodata.name}</p>
          <p><span className="font-medium">Email:</span> {biodata.email}</p>
          <p><span className="font-medium">Gender:</span> {biodata.gender}</p>
          <p>
            <span className="font-medium">Age:</span> {biodata.age.years} years, {biodata.age.months} months, {biodata.age.days} days
          </p>
          <p><span className="font-medium">Occupation:</span> {biodata.occupation}</p>
          <p><span className="font-medium">Mode of Admission:</span> {biodata.modeOfAdmission}</p>
          <p>
            <span className="font-medium">Date of Admission:</span> {new Date(biodata.dateOfAdmission).toLocaleDateString()}
          </p>
          <p><span className="font-medium">Marital Status:</span> {biodata.maritalStatus}</p>
          <p>
            <span className="font-medium">Address:</span> {`${biodata.address.street}, ${biodata.address.city}, ${biodata.address.state}, ${biodata.address.pinCode}`}
          </p>
        </div>
      )}

      {doctorInfo && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Doctor Information</h2>
          <p className="mt-2"><span className="font-medium">Name:</span> {doctorInfo.doctorName}</p>
          <p><span className="font-medium">Email:</span> {doctorInfo.doctorEmail}</p>
        </div>
      )}

      {systemicHistory && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Systemic History</h2>
          {Object.keys(systemicHistory).map((key) => (
            <div key={key} className="mt-2">
              <strong className="font-medium">{key.replace(/([A-Z])/g, " $1").trim()}:</strong> {systemicHistory[key]}
            </div>
          ))}
        </div>
      )}

      {examination && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Examination</h2>
          {Object.keys(examination).map((key) => {
            const value = examination[key];
            return (
              <div key={key} className="mt-2">
                <strong className="font-medium">{key.replace(/([A-Z])/g, " $1").trim()}:</strong>
                {typeof value === "object" && value !== null
                  ? Object.entries(value).map(([subKey, subValue]) => (
                      <div key={subKey} className="ml-4">{`${subKey}: ${subValue}`}</div>
                    ))
                  : value}
              </div>
            );
          })}
        </div>
      )}

      {investigations && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Investigations</h2>
          {Object.keys(investigations).map((key) => (
            <div key={key} className="mt-2">
              <strong className="font-medium">{key.replace(/([A-Z])/g, " $1").trim()}:</strong> {investigations[key]}
            </div>
          ))}
        </div>
      )}

      {treatment && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Treatment</h2>
          <p className="mt-2"><span className="font-medium">Prescribed Drug:</span> {treatment.prescribedDrug}</p>
          <p><span className="font-medium">Dosage:</span> {treatment.dosage}</p>
          <p><span className="font-medium">Administration Route:</span> {treatment.administrationRoute}</p>
          <p><span className="font-medium">Dosage Frequency:</span> {treatment.dosageFrequency}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-700">Summary</h2>
        <p className="mt-2">{summary || "No summary provided."}</p>
      </div>
    </div>
  );
}

export default ReadSingleMedicalRecord;
