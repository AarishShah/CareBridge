import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../../context/AuthContext";
import useMultiStepForm from "../../../../hooks/use-multistep";
import AccountDetails from "./AccountDetails";
import Address from "./Address";
import PersonalInfo from "./PersonalInfo";
import image from "../../../../assets/7.png";
import image1 from "../../../../assets/2.png";

const INIT_DATA = {
  name: "",
  email: "",
  password: "",
  gender: "Prefer not to say",
  DOB: "",
  maritalStatus: "Unmarried",
  occupation: "",
  address: {
    street: "",
    city: "",
    state: "",
    pinCode: "",
  },
};
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function PatientSignup() {
  const { login } = useAuth();
  const [data, setData] = useState(INIT_DATA);
  const [error, setError] = useState(false);
  function updateFields(fields) {
    setData((prevData) => {
      return { ...prevData, ...fields };
    });
  }
  const { steps, step, currentStep, back, next } = useMultiStepForm([
    <PersonalInfo key="personal" {...data} updateField={updateFields} />,
    <Address key="info" {...data} updateField={updateFields} />,
    <AccountDetails key="account" {...data} updateField={updateFields} />,
  ]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    next();

    if (currentStep >= steps.length - 1) {
      try {
        const response = await axios.post(`${BASE_URL}${pathname}`, data);

        if (response.data.token) {
          login(response.data.token);
          localStorage.setItem("patient", response.data.role);
        }

        if (pathname.includes("doctor")) {
          navigate("/doctor/login");
        } else {
          navigate("/patient/dashboard");
        }
      } catch (error) {
        setError(true);
      }
    }
  }

  const handleSignin = () => {
    window.location.href = `${BASE_URL}/patient/auth/google`;
  };

  const handleSignInNormally = () => {
    navigate("/login/patient");
  };

  return (
    <div className="flex min-h-screen h-full">
      <img src={image} alt="" className="md:block w-1/2 object-cover" />
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 flex flex-col items-center p-8"
      >
        {error && (
          <div style={{ color: "crimson" }}>Could not register. Try again?</div>
        )}
        <img src={image1} alt="" className="h-16 w-16 rounded-full " />
        <h1 className="text-2xl font-bold mt-4">Signup to CareBridge</h1>
        <div className="w-full flex flex-col items-center">{step}</div>
        <div className="">
          {currentStep !== 0 && (
            <button
              type="button"
              onClick={back}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-24 rounded mr-60"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 w-24 rounded"
          >
            {currentStep !== steps.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
        <div>
          <button
            type="button"
            className="h-10 w-48 border border-gray-400 text-gray-600 rounded mt-8 flex items-center justify-evenly font-medium text-sm hover:underline"
            onClick={handleSignin}
          >
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google logo"
              className="mr-1"
            />
            Sign up with Google
          </button>
        </div>
        <div className="text-center font-normal text-sm mt-6">
          <span>Already have an Account? </span>
          <button
          onClick={handleSignInNormally}
            className="text-blue-500 font-semibold hover:underline">
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientSignup;
