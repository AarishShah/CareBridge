import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import useMultiStepForm from "../../../../hooks/use-multistep";
import PersonalInfo from "./PersonalInfo";
import ProfessionalInfo from "./ProfessionalInfo";
import AccountDetails from "./AccountDetails";
import image from "../../../../assets/7.png";
import image1 from "../../../../assets/2.png";

const INIT_DATA = {
  name: "",
  email: "",
  password: "",
  gender: "Prefer not to say",
  specialization: "",
  yearsOfExperience: 1,
  qualifications: "",
};

let url = "http://localhost:5000";

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
    <ProfessionalInfo
      key="professional"
      {...data}
      updateField={updateFields}
    />,
    <AccountDetails key="account" {...data} updateField={updateFields} />,
  ]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    next();

    if (currentStep >= steps.length - 1) {
      try {
        const formattedData = {
          ...data,
          specialization: data.specialization.split(","),
          qualifications: data.qualifications.split(","),
        };

        const response = await axios.post(`${url}${pathname}`, formattedData);

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

  const handleSignin = () => {
    const userType = location.pathname.includes("doctor")
      ? "doctor"
      : "patient";
    const signInUrl = `${url}/${userType}/auth/google`;
    window.location.href = signInUrl;
  };

  return (
    <div className="flex min-h-screen h-full">
      <img src={image} alt="" className="hidden md:block w-1/2 object-cover" />
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 flex flex-col items-center  p-8"
      >
        {error && (
          <div style={{ color: "crimson" }}>Could not register. Try again?</div>
        )}
        <img src={image1} alt="" className="h-16 w-16 rounded-full mt-12" />
        <h1 className="text-2xl font-bold mt-8">Signup to CareBridge</h1>

        {/* <div className="p-8">
          {currentStep + 1} / {steps.length}
        </div> */}
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
        <div className="text-center mt-8 font-normal text-sm">
          <span>Already have an Account? </span>
          <a href="#" className="text-blue-500 font-semibold hover:underline">
            Sign in
          </a>
        </div>
      </form>
    </div>
  );
}

export default DoctorSignup;
