import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PatientList() {
  const [assignedPatients, setAssignedPatients] = useState([]);
  const navigate = useNavigate();

  const fetchAssignedDoctor = async () => {
    try {
      const response = await axios.get("http://localhost:5000/doctor/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });


      
      if (response.data) {
        setAssignedPatients([response.data]);
      } else {
        console.warn("No patient data in response");
        setAssignedPatients([]); 
      }
    } catch (error) {
      console.error("Error fetching assigned patients:", error);
      setAssignedPatients([]); 
    }
  };

  useEffect(() => {
    fetchAssignedDoctor();
  }, []);

  return (
    <div>
      {assignedPatients.length === 0 ? (
        <h2 className="text-xl font-semibold text-center text-gray-700">
          No assigned patients found
        </h2>
      ) : (
        assignedPatients.map((assignedPatient, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg mb-6 p-6">
            <ul>
              <li className="text-lg font-medium text-gray-800">{assignedPatient.name}</li>
              <button
                className="mt-4 h-10 w-48 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => navigate(`${assignedPatient.patient}`)}
              >
                Create Medical Record
              </button>
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default PatientList;
