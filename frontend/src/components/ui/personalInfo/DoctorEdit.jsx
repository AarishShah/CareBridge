import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import image from '../../../assets/8.png';


import useMultiStepForm from "../../../hooks/use-multistep.js";
import PersonalInfo from "../../auth/signup/doctor/PersonalInfo";
import ProfessionalInfo from "../../auth/signup/doctor/ProfessionalInfo";
import AccountDetails from "../../auth/signup/doctor/AccountDetails";

const INIT_DATA = {
  name: "",
  email: "",
  password: "",
  gender: "Prefer not to say",
  specialization: "",
  yearsOfExperience: 0,
  qualifications: "",
};

function DoctorSignup() {
  const [data, setData] = useState(INIT_DATA);
  const [error, setError] = useState(false);

  function updateFields(fields) {
    setData((prevData) => {
      return {
        ...prevData,
        ...fields,
      };
    });
  }
  const { steps, step, currentStep, back, next } = useMultiStepForm([
    <PersonalInfo key="personal" {...data} updateField={updateFields} />,
    <ProfessionalInfo key="professional" {...data} updateField={updateFields} />,
    <AccountDetails key="account" {...data} updateField={updateFields} />,
  ]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  async function handleSubmit(event) {
    event.preventDefault();
    next();

    if (currentStep >= steps.length - 1) {
      let formattedData = {};

      try {
        Object.keys(INIT_DATA).forEach((key) => {
          if (data[key] !== "") {
            formattedData[key] = data[key];
          }
        });

        const response = await axios.patch(
          `${BASE_URL}/doctor/me`,
          formattedData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        if (pathname.includes("doctor")) {
          navigate("/doctor/dashboard");
        } else {
          navigate("/patient/dashboard");
        }
      } catch (error) {
        console.log(error);
        setError(true);
      }
    }
  }

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen" style={{ backgroundImage: `${BASE_URL}(${image})`}}>
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

export default DoctorSignup;
