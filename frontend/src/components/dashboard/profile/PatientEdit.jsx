import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import useMultiStepForm from "../../../hooks/use-multistep.js";
import PersonalInfo from "../../auth/signup/patient/PersonalInfo";
import AccountDetails from "../../auth/signup/patient/AccountDetails";
import Address from "../../auth/signup/patient/Address"; // Importing Address component
import styles from "../../auth/signup/Signup.module.css";

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
    console.log(data)
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
        console.error(error);
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

export default PatientEdit;
