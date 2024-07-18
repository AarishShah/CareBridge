import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import image from '../../../../assets/8.png';

function PatientList() {
  const [assignedPatients, setAssignedPatients] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname)

  const fetchAssignedDoctor = async () => {
    try {
      const response = await axios.get("http://localhost:5000/doctor/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // console.log(response.data.doctor.assignedPatients);
      if ( response.data.doctor.assignedPatients) {
        console.log("Assigned Patients:", response.data.doctor.assignedPatients); // Debugging statement
        setAssignedPatients(response.data.doctor.assignedPatients); // Ensure assignedPatients is populated correctly
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
    <div className="flex flex-col items-center bg-cover bg-center bg-no-repeat min-h-screen" style={{ backgroundImage: `url(${image})`}}>
      {assignedPatients.length > 0 && (
        <h1 className="text-2xl font-semibold text-center text-gray-700 mt-2 mb-6">
          All Assigned Patients
        </h1>
      )}

      {assignedPatients.length === 0 ? (
        <h2 className="text-xl font-semibold text-center text-gray-700">
          No assigned patients found
        </h2>
      ) : (
        assignedPatients.map((assignedPatient, index) => (
          <div key={index} className="bg-transparent shadow-md rounded-lg mb-6 p-4 w-1/3">
            <ul>
            <li className="flex justify-center items-center">
              <button
                className="text-black text-lg font-semibold hover:text-blue-600"
                onClick={() => {
                  console.log("Navigating to create record for patient ID:", assignedPatient.patient); 
                  location.pathname.includes("create-prescription") ? navigate(`${location.pathname}/${assignedPatient.patient}`) : navigate(`/medical-record/create/${assignedPatient.patient}`);
                }}
              >
                {assignedPatient.name}
              </button>
              </li>
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default PatientList;
