import { useState, useEffect } from "react";
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
import image from '../../../../../assets/8.png';


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

  useEffect(() => {
    console.log("Patient ID:", id); // Debug patient ID
  }, [id]);

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
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Debug token

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log("Decoded Token:", decodedToken); // Debug decoded token

        const submitUrl = `http://localhost:5000/medicalhistory/${id}`;
        console.log("Submit URL:", submitUrl); // Debug submit URL

        const response = await axios.post(
          submitUrl,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          navigate("/doctor/dashboard");
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
    <div className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${image})` }}>
    <form onSubmit={handleSubmit} className="w-full md:w-1/2 flex flex-col items-center p-8">
      <div className="mb-4">
        {error && (
          <div className="text-red-600">
            Could not create record. Try again?
          </div>
        )}
        {/* <div className="text-gray-700">
          {currentStep + 1} / {steps.length}
        </div> */}
      </div>
      <div className="w-full flex flex-col items-center">
          {step}
        </div>
      <div className="mt-4">
        {currentStep !== 0 && (
          <button type="button" onClick={back} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-24 rounded">
            Back
          </button>
        )}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 w-24 rounded ml-4">
          {currentStep !== steps.length - 1 ? "Next" : "Finish"}
        </button>
      </div>
    </form>
  </div>
  );
}

export default CreateRecord;
