import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import image from "../../../assets/7.png";
import image1 from "../../../assets/2.png";

async function uploadToS3(event, patientId) {
  const formData = new FormData(event.target);

  const file = formData.get("file");

  if (!file) {
    return null;
  }

  const fileType = encodeURIComponent(file.type);

  const { data } = await axios.get(
    `http://localhost:5000/medical-record/${patientId}?fileType=${fileType}`,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );

  const { uploadUrl, key } = data;
  await axios.put(uploadUrl, file);

  return key;
}

function UploadFile() {
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [patientId, setPatientId] = useState("");

  const getPatient = useCallback(async () => {
    const response = await axios.get("http://localhost:5000/patient/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setPatientId(response.data.patient._id);
  }, []);

  useEffect(() => {
    getPatient();
  }, [getPatient]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (patientId) {
        await uploadToS3(e, patientId);
      }

      setUploadStatus("File upload successful");
    } catch (err) {
      setError("Could not upload your file");
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <img
        src={image}
        alt=""
        className="hidden md:block md:w-1/2 object-cover"
      />
      <div className="flex flex-col items-center w-full md:w-1/2 p-4 md:p-8">
        <img
          src={image1}
          alt=""
          className="h-16 w-16 rounded-full mt-16 mb-8"
        />
        <h2 className="text-2xl font-bold mb-8">Upload File</h2>
        {error && <h3 className="text-red-500 mb-3">{error}</h3>}
        {uploadStatus && (
          <h3 className="text-green-400 mb-3">{uploadStatus}</h3>
        )}
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="flex flex-col text-lg">
            <input
              className="border rounded h-10 text-sm placeholder-gray-400 placeholder:ml-5 border-gray-600 mb-6 p-2"
              type="file"
              accept="application/pdf"
              name="file"
            />
            <button
              className="h-10 w-1/3 bg-blue-600 text-white rounded ml-32 mb-8 hover:bg-blue-800 font-semibold"
              type="submit"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadFile;

