import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styles from "./ReadAllRecords.module.css";

function ReadAllRecords() {
  const [medicalRecord, setMedicalRecord] = useState([]);
  const navigate = useNavigate();

  const fetchMedicalRecord = async () => {
    const response = await axios.get(
      "http://localhost:5000/medicalhistories?page=1&limit=10",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setMedicalRecord(response.data.items);
  };

  useEffect(() => {
    fetchMedicalRecord();
  }, []);

  return (
    <>
      {medicalRecord.length === 0 && <h2>No medical record found</h2>}
      {medicalRecord &&
        medicalRecord.map((record) => (
          <div className={styles["cards"]}>
            <div key={record.patient} className={styles["container"]}>
              <ul>
                <li>{record.title}</li>
                <button onClick={() => navigate(record._id)}>
                  Read Medical Record
                </button>
              </ul>
            </div>
          </div>
        ))}
    </>
  );
}

export default ReadAllRecords;
