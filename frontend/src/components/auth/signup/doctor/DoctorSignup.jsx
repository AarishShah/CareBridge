import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import useMultiStepForm from "../../../../hooks/use-multistep";
import PersonalInfo from "./PersonalInfo";
import ProfessionalInfo from "./ProfessionalInfo";
import AccountDetails from "./AccountDetails";
import styles from "../Signup.module.css";

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
    <PersonalInfo {...data} updateField={updateFields} />,
    <ProfessionalInfo {...data} updateField={updateFields} />,
    <AccountDetails {...data} updateField={updateFields} />,
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

  return (
    <div className={styles.main}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: "crimson" }}>Could not register. Try again?</div>
        )}
        <div>
          {currentStep + 1} / {steps.length}
        </div>
        {step}

        <div className={styles.action}>
          {currentStep !== 0 && (
            <button type="button" onClick={back}>
              Back
            </button>
          )}
          <button>
            {currentStep !== steps.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DoctorSignup;
