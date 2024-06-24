import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import image from "../../../assets/8.png";

import useMultiStepForm from "../../../hooks/use-multistep.js";
import PersonalInfo from "../../auth/signup/patient/PersonalInfo";
import AccountDetails from "../../auth/signup/patient/AccountDetails";
import Address from "../../auth/signup/patient/Address"; // Importing Address component

const INIT_DATA = {
  name: "",
  email: "",
  password: "",
  gender: "Prefer not to say",
  maritalStatus: "Unmarried",
  occupation: "Unemployed",
  address: { state: "", city: "", street: "", pinCode: "" },
};

function getNonEmptyValues(data) {
  const nonEmptyData = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null) {
      const nonEmptySubData = getNonEmptyValues(value);
      if (Object.keys(nonEmptySubData).length > 0) {
        nonEmptyData[key] = nonEmptySubData;
      }
    } else if (value !== "") {
      nonEmptyData[key] = value;
    }
  }

  return nonEmptyData;
}

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
    <Address key="address" {...data} updateField={updateFields} />,
    <AccountDetails key="account" {...data} updateField={updateFields} />,
  ]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    next();

    if (currentStep >= steps.length - 1) {
      const nonEmptyData = getNonEmptyValues(data);

      try {
        const response = await axios.patch(
          `http://localhost:5000/patient/me`,
          nonEmptyData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        if (pathname.includes("patient")) {
          navigate("/patient/dashboard");
        } else {
          navigate("/doctor/dashboard");
        }
      } catch (error) {
        console.log(error);
        setError(true);
      }
    }
  }

  return (
    <div
      className="bg-cover bg-center bg-no-repeat min-h-screen"
      style={{ backgroundImage: `url(${image})` }}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: "crimson" }}>Could not update. Try again?</div>
        )}
        <div className="flex justify-center">
          {currentStep + 1} / {steps.length}
        </div>

        <div className="mt-44">{step}</div>

        <div className="flex justify-center">
          {currentStep !== 0 && (
            <button
              type="button"
              onClick={back}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-24 rounded"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold h-10 w-24 rounded ml-4"
          >
            {currentStep !== steps.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DoctorSignup;
