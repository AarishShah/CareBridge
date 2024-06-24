import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useMultiStepForm from "../../../hooks/use-multistep";
import PersonalInfo from "../../auth/signup/patient/PersonalInfo";
import AccountDetails from "../../auth/signup/patient/AccountDetails";
import Address from "../../auth/signup/patient/Address"; 
import image from '../../../assets/8.png';
const INIT_DATA = {
  name: "",
  email: "",
  password: "",
  gender: "Prefer not to say",
  maritalStatus: "Unmarried",
  occupation: "Unemployed",
  address: { state: "", city: "", street: "", pinCode: "" },
};

function PatientEdit() {
  const [data, setData] = useState(INIT_DATA);
  const [error, setError] = useState(false);

  const updateFields = (fields) => {
    setData((prevData) => ({ ...prevData, ...fields }));
  };

  const { steps, step, currentStep, back, next } = useMultiStepForm([
    <PersonalInfo {...data} updateField={updateFields} />,
    <Address address={data.address} updateField={updateFields} />,
    <AccountDetails {...data} updateField={updateFields} />,
  ]);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    next();
    console.log("Data being submitted:", data);
    if (currentStep >= steps.length - 1) {
      try {
        const response = await axios.patch(
          `http://localhost:5000/patient/me`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        navigate("/patient/dashboard");
      } catch (error) {
        console.error("Error details:", error);
        if (error.response) {
          console.error("Server responded with:", error.response.data);
        }
        setError(true);
      }
    }
  }

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen" style={{ backgroundImage: `url(${image})`}}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: "crimson" }}>Could not update. Try again?</div>
        )}
        <div className="flex justify-center">
          {currentStep + 1} / {steps.length}
        </div>

        <div className="mt-44">
        {step}
        </div>

        <div className="flex justify-center">
          {currentStep !== 0 && (
            <button type="button" onClick={back}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-24 rounded"
            >
              Back
            </button>
          )}
                   <button type="submit" className="bg-blue-400 hover:bg-blue-500 text-white font-bold h-10 w-24 rounded ml-4">
            {currentStep !== steps.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientEdit;
