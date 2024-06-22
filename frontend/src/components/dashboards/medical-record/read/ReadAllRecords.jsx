import { useEffect, useState } from "react";
import axios from "axios";
import image from '../../../../assets/8.png';

function ReadAllRecords() {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchMedicalRecords = async () => {
    const response = await axios.get(
      "http://localhost:5000/medicalhistories?page=1&limit=10",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setMedicalRecords(response.data.items);
  };

  const fetchMedicalRecord = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/medicalHistory/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSelectedRecord(response.data);
    } catch (error) {
      console.error("Error fetching medical record:", error);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen" style={{ backgroundImage: `url(${image})`}}>

      <div className="fixed w-1/3 container mx-auto p-6">
        {medicalRecords.length === 0 && (
          <h2 className="text-xl font-semibold text-center text-gray-700">
            No medical record found
          </h2>
        )}
        <div className="flex justify-center items-center">
          <h1 className="text-2xl font-semibold mb-6">View Medical Records</h1>
        </div>
        {medicalRecords &&
          medicalRecords.map((record) => (
            <div
              key={record.patient}
              className="bg-transparent shadow-md rounded-lg mb-3 p-2"
            >
              <ul>
                <li className="flex justify-center items-center">
                  <button
                    className="mt-4 text-lg font-semibold text-black hover:text-blue-600"
                    onClick={() => fetchMedicalRecord(record._id)}
                  >
                    {record.biodata.name}
                  </button>
                </li>
              </ul>
            </div>
          ))}
      </div>
      
      <div className=" w-2/3 container mx-auto p-6" style={{ marginLeft: '30rem' }}>
        {selectedRecord && (
          <div className="p-6 bg-transparent shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800">
              Medical Record for {selectedRecord.biodata.name}
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mt-4">
              Title: {selectedRecord.title}
            </h2>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700">Biodata</h2>
              <p className="mt-2">
                <span className="font-medium">Name:</span>{" "}
                {selectedRecord.biodata.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedRecord.biodata.email}
              </p>
              <p>
                <span className="font-medium">Gender:</span>{" "}
                {selectedRecord.biodata.gender}
              </p>
              <p>
                <span className="font-medium">Age:</span>{" "}
                {selectedRecord.biodata.age.years} years,{" "}
                {selectedRecord.biodata.age.months} months,{" "}
                {selectedRecord.biodata.age.days} days
              </p>
              <p>
                <span className="font-medium">Occupation:</span>{" "}
                {selectedRecord.biodata.occupation}
              </p>
              <p>
                <span className="font-medium">Mode of Admission:</span>{" "}
                {selectedRecord.biodata.modeOfAdmission}
              </p>
              <p>
                <span className="font-medium">Date of Admission:</span>{" "}
                {new Date(
                  selectedRecord.biodata.dateOfAdmission
                ).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Marital Status:</span>{" "}
                {selectedRecord.biodata.maritalStatus}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {`${selectedRecord.biodata.address.street}, ${selectedRecord.biodata.address.city}, ${selectedRecord.biodata.address.state}, ${selectedRecord.biodata.address.pinCode}`}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Doctor Information
              </h2>
              <p className="mt-2">
                <span className="font-medium">Name:</span>{" "}
                {selectedRecord.doctorInfo.doctorName}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedRecord.doctorInfo.doctorEmail}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Systemic History
              </h2>
              {Object.keys(selectedRecord.systemicHistory).map((key) => (
                <div key={key} className="mt-2">
                  <strong className="font-medium">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </strong>{" "}
                  {selectedRecord.systemicHistory[key]}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Examination
              </h2>
              {Object.keys(selectedRecord.examination).map((key) => {
                const value = selectedRecord.examination[key];
                return (
                  <div key={key} className="mt-2">
                    <strong className="font-medium">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </strong>
                    {typeof value === "object" && value !== null
                      ? Object.entries(value).map(([subKey, subValue]) => (
                          <div
                            key={subKey}
                            className="ml-4"
                          >{`${subKey}: ${subValue}`}</div>
                        ))
                      : value}
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Investigations
              </h2>
              {Object.keys(selectedRecord.investigations).map((key) => (
                <div key={key} className="mt-2">
                  <strong className="font-medium">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </strong>{" "}
                  {selectedRecord.investigations[key]}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700">Treatment</h2>
              <p className="mt-2">
                <span className="font-medium">Prescribed Drug:</span>{" "}
                {selectedRecord.treatment.prescribedDrug}
              </p>
              <p>
                <span className="font-medium">Dosage:</span>{" "}
                {selectedRecord.treatment.dosage}
              </p>
              <p>
                <span className="font-medium">Administration Route:</span>{" "}
                {selectedRecord.treatment.administrationRoute}
              </p>
              <p>
                <span className="font-medium">Dosage Frequency:</span>{" "}
                {selectedRecord.treatment.dosageFrequency}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700">Summary</h2>
              <p className="mt-2">
                {selectedRecord.summary || "No summary provided."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadAllRecords;
