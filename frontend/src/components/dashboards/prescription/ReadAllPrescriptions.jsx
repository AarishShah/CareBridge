import { useEffect, useState } from "react";
import axios from "axios";
import image from '../../../assets/8.png';

function ReadAllPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchPrescriptions = async () => {
    const response = await axios.get(
      `${BASE_URL}/prescription?page=1&limit=10`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setPrescriptions(response.data.items);
  };

  const fetchPrescription = async (id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/prescription/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSelectedPrescriptions(response.data);
      console.log("Response: ", response)
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen" style={{ backgroundImage: `url(${image})`}}>

      <div className="fixed w-1/3 container mx-auto p-6">
        {prescriptions.length === 0 && (
          <h2 className="text-xl font-semibold text-center text-gray-700">
            No prescriptions found
          </h2>
        )}
        <div className="flex justify-center items-center">
          <h1 className="text-2xl font-semibold mb-6">View Patient's Prescriptions</h1>
        </div>
        {prescriptions &&
          prescriptions.map((record) => (
            <div
              key={record.patientId}
              className="bg-transparent shadow-md rounded-lg mb-3 p-2"
            >
              <ul>
                <li className="flex justify-center items-center">
                  <button
                    className="mt-4 text-lg font-semibold text-black hover:text-blue-600"
                    onClick={() => fetchPrescription(record._id)}
                  >
                    {record.prescribedDrug}
                  </button>
                </li>
              </ul>
            </div>
          ))}
      </div>
      
      <div className="w-2/3 container mx-auto p-6" style={{ marginLeft: '26rem' }}>
        {selectedPrescriptions && (
          <div className="p-6 bg-gray-200 shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800">
              Prescribed Drug: {selectedPrescriptions.prescribedDrug}
            </h1>
            <div className="mt-6 p-4 border rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700 mt-4">
              Dosage: {selectedPrescriptions.dosage}
            </h3>
            </div>
            <div className="mt-6 p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Administration Route: {selectedPrescriptions.administrationRoute}</h2>
            </div>
            <div className="mt-6 p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Dosage Frequency: {selectedPrescriptions.dosageFrequency}</h2>
            </div>
            <div className="mt-6 p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Allergies</h2>
              {selectedPrescriptions.allergies.map((key) => {
                return (
                  <ul key={key} className="mt-2">
                    <li className="ml-4">{key}</li>
                  </ul>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadAllPrescriptions;
