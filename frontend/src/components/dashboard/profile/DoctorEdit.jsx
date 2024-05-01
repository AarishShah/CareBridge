import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import useMultiStepForm from "../../../hooks/use-multistep.js";
import PersonalInfo from "../../auth/signup/doctor/PersonalInfo";
import ProfessionalInfo from "../../auth/signup/doctor/ProfessionalInfo";
import AccountDetails from "../../auth/signup/doctor/AccountDetails";
import styles from "../../auth/signup/Signup.module.css";

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
      let formattedData = {};

      try {
        Object.keys(INIT_DATA).forEach((key) => {
          if (data[key] !== "") {
            formattedData[key] = data[key];
          }
        });

        const response = await axios.patch(
          `http://localhost:5000/doctor/me`,
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
    <div className={styles.main}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: "crimson" }}>Could not update. Try again?</div>
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
