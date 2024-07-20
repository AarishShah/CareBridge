import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import image from '../../../assets/8.png';

const INIT_DATA = {
    "prescribedDrug": "",
    "dosage": "",
    "administrationRoute": "",
    "dosageFrequency": "",
    "allergies": []
};
function CreatePrescription() {
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState(INIT_DATA);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch any necessary data using the `id` if needed
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const submitUrl = `http://localhost:5000/prescription/${id}`;

      const response = await axios.post(
        submitUrl,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      setError(true);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${image})` }}>
      <form onSubmit={handleSubmit} className="w-full md:w-1/2 flex flex-col items-center p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <div className="mb-4">
          {error && (
            <div className="text-red-600">
              Could not create record. Try again?
            </div>
          )}
        </div>

        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Prescribed Drug
          </label>
          <input
            type="text"
            name="prescribedDrug"
            value={formData.prescribedDrug}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Dosage
          </label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Administration Route
          </label>
          <input
            type="text"
            name="administrationRoute"
            value={formData.administrationRoute}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Dosage Frequency
          </label>
          <input
            type="text"
            name="dosageFrequency"
            value={formData.dosageFrequency}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Allergies
          </label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies.join(", ")}
            placeholder="Separated by comma"
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(",") })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mt-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 w-24 rounded ml-4">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePrescription;