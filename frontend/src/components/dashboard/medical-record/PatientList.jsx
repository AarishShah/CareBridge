import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styles from "./Create.module.css";

function PatientList() {
  const [assignedPatients, setAssignedPatients] = useState([]);
  const navigate = useNavigate();

  const fetchAssignedDoctor = async () => {
    const response = await axios.get("http://localhost:5000/doctor/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setAssignedPatients(response.data["assignedPatients"]);
  };

  useEffect(() => {
    fetchAssignedDoctor();
  }, []);

  return (
    <>
      {assignedPatients.map((assignedPatient) => (
        <div className={styles["cards"]}>
          <div key={assignedPatient.patient} className={styles["container"]}>
            <ul>
              <li>{assignedPatient.name}</li>
              <button onClick={() => navigate(`${assignedPatient.patient}`)}>
                Create Medical Record
              </button>
            </ul>
          </div>
        </div>
      ))}
    </>
  );
}

export default PatientList;
