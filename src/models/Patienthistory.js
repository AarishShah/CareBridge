const mongoose = require('mongoose');

const patientHistorySchema = new mongoose.Schema(
    {
        biodata:
        {
            id:
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Patient'
            },

            name:
            {
                type: String,
                required: true,
                ref: 'Patient'
            },

            email:
            {
                type: String,
                required: true,
                ref: 'Patient'
            },

            gender: 
            {
                type: String,
                required: true,
                ref: 'Patient'
            },

            age: 
            {
                type: String, // check if this is the right type
                required: true,
                ref: 'Patient'
            },

            address:
            {
                type: String,
                required: true,
                ref: 'Patient'
            },

            occupation:
            {
                type: String,
                required: true,
                ref: 'Patient'
            },

            modeOfAdmission: String,
            dateOfAdmission: Date,

            maritalStatus:
            {
                type: String,
                required: true,
                ref: 'Patient'
            },
        },
        historyOfPresentingComplaints: String,
        historyOfPresentingIllness: String,

        systemicHistory:
        {
            centralNervousSystem: String,
            cardiovascularSystem: String,
            gastrointestinalSystem: String,
            genitourinarySystem: String,
            musculoskeletalSystem: String,
        },
        pastSurgicalHistory: String,
        pastMedicalHistory: String,
        familyHistory: String,
        drugHistory: String,
        allergies: String,
        gynecologicalHistory: String,
        occupationalHistory: String,
        travelHistory: String,
        socioeconomicHistory: String,

        examination:
        {
            generalPhysicalExamination:
            {
                bloodPressure: String,
                pulse: Number,
                temperature: String,
                respiratoryRate: Number,
                bloodSugarLevel: String,
                notes: String,
            },
            respiratorySystem: String,
            centralNervousSystem: String,
            cardiovascularSystem: String,
            gastrointestinalSystem: String,
        },

        investigations:
        {
            completeBloodCount: String,
            liverFunctionTests: String,
            renalFunctionTests: String,
            vitalMarkers: String,
            serumElectrolytes: String,
            prothrombinTime: String,
            activatedPartialThromboplastinTime: String,
            electrocardiogram: String,
            chestXRay: String,
        },

        treatment:
        {
            prescribedDrug: String,
            dosage: String,
            administrationRoute: String,
            dosageFrequency: String,
            doctorSignature: String,
        },
    });

const PatientHistoryModel = mongoose.model('PatientHistory', patientHistorySchema);

module.exports = PatientHistoryModel;

/*
User
{
  "patientHistory": {
    "biodata": {
      "name": "John Doe",
      "gender": "Male",
      "age": 35,
      "address": "123 Main Street, Cityville, State, Zip Code",
      "occupation": "Software Engineer",
      "modeOfAdmission": "Emergency",
      "dateOfAdmission": "2024-02-03",
      "maritalStatus": "Single"
    },
    "historyOfPresentingComplaints": "The patient presents with severe abdominal pain and vomiting for the past 24 hours.",
    "historyOfPresentingIllness": "Mr. Doe reports that the abdominal pain started suddenly yesterday evening...",
    "systemicHistory": {
      "centralNervousSystem": "Clear and alert. No signs of neurological deficits.",
      "cardiovascularSystem": "Regular rhythm, no murmurs.",
      "gastrointestinalSystem": "Abdomen tender on palpation in the right lower quadrant. No rebound tenderness or guarding.",
      "genitourinarySystem": "No complaints of urinary frequency or urgency. No hematuria.",
      "musculoskeletalSystem": "No joint swelling or deformities."
    },
    "pastSurgicalHistory": "No previous surgical interventions reported.",
    "pastMedicalHistory": "The patient has a history of hypertension controlled with medication.",
    "familyHistory": "No significant family history reported.",
    "drugHistory": "The patient is currently taking Amlodipine 5mg daily for hypertension.",
    "allergies": "No known drug allergies reported.",
    "gynecologicalHistory": "N/A for male patient.",
    "occupationalHistory": "The patient works as a software engineer with prolonged sitting hours.",
    "travelHistory": "No recent travel history reported.",
    "socioeconomicHistory": "Middle-class socioeconomic status reported."
  },
  "examination": {
    "generalPhysicalExamination": {
      "bloodPressure": "120/80 mmHg",
      "pulse": 78,
      "temperature": "98.6°F",
      "respiratoryRate": 16,
      "bloodSugarLevel": "Normal",
      "Notes": "Overall the patient has mild headache"
    },
    "respiratorySystem": "Clear breath sounds bilaterally.",
    "centralNervousSystem": "Alert and oriented to person, place, and time.",
    "cardiovascularSystem": "Regular rhythm, no murmurs.",
    "gastrointestinalSystem": "Abdomen tender on palpation in the right lower quadrant. No rebound tenderness or guarding."
  },
  "investigations": {
    "completeBloodCount": "Complete Blood Count",
    "liverFunctionTests": "Liver Function Tests",
    "renalFunctionTests": "Renal Function Tests",
    "vitalMarkers": "Vital Markers",
    "serumElectrolytes": "Serum Electrolytes",
    "prothrombinTime": "Prothrombin Time",
    "activatedPartialThromboplastinTime": "Activated Partial Thromboplastin Time",
    "electrocardiogram": "Electrocardiogram",
    "chestXRay": "Chest X-ray"
  },
  "treatment": {
    "prescribedDrug": "Ibuprofen",
    "dosage": "400mg",
    "administrationRoute": "Oral",
    "dosageFrequency": "Every 6 hours",
    "doctorSignature": "Dr. Smith"
  }
}

*/