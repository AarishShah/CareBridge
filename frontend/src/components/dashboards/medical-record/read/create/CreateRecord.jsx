import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import useMultiStepForm from "../../../../../hooks/use-multistep";
import Title from "./Title";
import History from "./History";
import SystemicHistory from "./SystemicHistory";
import OtherHistory from "./OtherHistory";
import GeneralPhysical from "./examination/GeneralPhysical";
import OtherExam from "./examination/OtherExam";
import Investiagtion from "./investigation/Investigation";
import Treatment from "./treatment/Treatment";

const INIT_DATA = {
  medicalHistory: {
    title: "",
    biodata: {
      modeOfAdmission: "",
    },
    historyOfPresentingComplaints: "",
    historyOfPresentingIllness: "",
    systemicHistory: {
      centralNervousSystem: "",
      cardiovascularSystem: "",
      gastrointestinalSystem: "",
      genitourinarySystem: "",
      musculoskeletalSystem: "",
    },
    pastSurgicalHistory: "",
    pastMedicalHistory: "",
    familyHistory: "",
    drugHistory: "",
    allergies: "",
    gynecologicalHistory: "",
    occupationalHistory: "",
    travelHistory: "",
    socioeconomicHistory: "",
  },
  examination: {
    generalPhysicalExamination: {
      bloodPressure: "",
      pulse: 78,
      temperature: "9",
      respiratoryRate: 16,
      bloodSugarLevel: "",
      Notes: "",
    },
    respiratorySystem: "",
    centralNervousSystem: "",
    cardiovascularSystem: "",
    gastrointestinalSystem: "",
  },
  investigations: {
    completeBloodCount: "",
    liverFunctionTests: "",
    renalFunctionTests: "",
    vitalMarkers: "",
    serumElectrolytes: "",
    prothrombinTime: "",
    activatedPartialThromboplastinTime: "",
    electrocardiogram: "",
    chestXRay: "",
  },
  treatment: {
    prescribedDrug: "",
    dosage: "",
    administrationRoute: "",
    dosageFrequency: "",
  },
};

function CreateRecord() {
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState(INIT_DATA);
  const navigate = useNavigate();

  const { id } = useParams();

  function updateFields(fields) {
    setFormData((prevData) => {
      return {
        ...prevData,
        ...fields,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    next();

    if (currentStep >= steps.length - 1) {
      try {
        const response = await axios.post(
          `http://localhost:5000/medicalhistory/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 201) {
          navigate("doctor/dashboard");
        }
      } catch (error) {
        console.log(error);
        setError(true);
      }
    }
  }

  const { steps, step, currentStep, back, next } = useMultiStepForm([
    <Title formData={formData} updateFields={updateFields} />,
    <History formData={formData} updateFields={updateFields} />,
    <SystemicHistory formData={formData} updateFields={updateFields} />,
    <OtherHistory formData={formData} updateFields={updateFields} />,
    <GeneralPhysical formData={formData} updateFields={updateFields} />,
    <OtherExam formData={formData} updateFields={updateFields} />,
    <Investiagtion formData={formData} updateFields={updateFields} />,
    <Treatment formData={formData} updateFields={updateFields} />,
  ]);

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div>
          {error && (
            <div style={{ color: "crimson" }}>
              Could not create record. Try again?
            </div>
          )}
          {currentStep + 1} / {steps.length}
        </div>
        {step}
        <div className="">
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

export default CreateRecord;
