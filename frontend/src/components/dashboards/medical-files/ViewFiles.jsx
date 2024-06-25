import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import image from "../../../assets/8.png";

function ViewFiles() {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [title, setTitle] = useState('')

  const fetchMedicalRecords = useCallback(async () => {
    const response = await axios.get("http://localhost:5000/medical-record", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setMedicalRecords(response.data.presignedUrl);
    setTitle(response.data.key)
  }, []);

  useEffect(() => {
    fetchMedicalRecords();
  }, [fetchMedicalRecords]);

  return (
    <div
      className="flex justify-center  h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="fixed w-1/3 container mx-auto p-6">
        {!medicalRecords && (
          <h2 className="text-xl font-semibold text-center text-gray-700">
            No medical files found
          </h2>
        )}
          <h1 className="text-2xl font-semibold text-center  mt-2 mb-6">View Medical Files</h1>
        {medicalRecords &&
          medicalRecords.map((record) => (
            <div
              key={record}
              className="bg-transparent shadow-md rounded-lg mb-3 p-2"
            >
              <ul>
                <li className="flex justify-center items-center">
                  <Link
                    className="mt-4 text-lg font-semibold text-black hover:text-blue-600"
                    to={record}
                    target="_blank"
                  >
                    {title}
                  </Link>
                </li>
              </ul>
            </div>
          ))}
      </div>

      <div
        className="w-2/3 container mx-auto p-6"
        style={{ marginLeft: "30rem" }}
      ></div>
    </div>
  );
}

export default ViewFiles;
