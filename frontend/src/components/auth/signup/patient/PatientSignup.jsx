import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import useMultiStepForm from "../../../../hooks/use-multistep";
import AccountDetails from "./AccountDetails";
import Address from "./Address";
import PersonalInfo from "./PersonalInfo";
import styles from "../Signup.module.css";

const INIT_DATA = {
  name: "",
  email: "",
  password: "",
  gender: "Prefer not to say",
  DOB: "",
  maritalStatus: "Unmarried",
  occupation: "",
  religion: "Undecided",
  address: {
    street: "",
    city: "",
    state: "",
    pinCode: "",
  },
};

let url = "http://localhost:5000";

function PatientSignup() {
  const [data, setData] = useState(INIT_DATA);
  const [error, setError] = useState(false);
  function updateFields(fields) {
    setData((prevData) => {
      return { ...prevData, ...fields };
    });
  }
  const { steps, step, currentStep, back, next } = useMultiStepForm([
    <PersonalInfo {...data} updateField={updateFields} />,
    <Address {...data} updateField={updateFields} />,
    <AccountDetails {...data} updateField={updateFields} />,
  ]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    next();

    if (currentStep >= steps.length - 1) {
      try {
        const response = await axios.post(`${url}${pathname}`, data);

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
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

export default PatientSignup;
