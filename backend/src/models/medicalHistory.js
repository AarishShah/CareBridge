const mongoose = require('mongoose');

// Defining a new schema for address information, same as in Patient.js for better reusability
const addressSchema = new mongoose.Schema(
  {

    state:
    {
      type: String,
      required: true,
      trim: true,
    },
    city:
    {
      type: String,
      required: true,
      trim: true,
    },
    street:
    {
      type: String,
      required: true,
      trim: true,
    },
    pinCode:
    {
      type: String,
      required: true,
      trim: true,
    },
  });

// Defining a new schema for doctor information
const doctorInfoSchema = new mongoose.Schema(
  {
    doctorSignature:
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Doctor'
    },

    doctorName:
    {
      type: String,
      required: true
    },

    doctorEmail:
    {
      type: String,
      required: true
    }
  });
const medicalHistorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100, required: true },

    biodata:
    {
      id:
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patient'
      },

      name: { type: String, required: true },

      email: { type: String, required: true },

      gender: { type: String, required: true },

      age:
      {
        years: { type: Number, required: true },
        months: { type: Number, required: true },
        days: { type: Number, required: true },
      },

      address: { type: addressSchema, required: true },
      occupation: { type: String, required: true },
      modeOfAdmission: { type: String, required: true, enum: ['Emergency', 'Outpatient'] },
      dateOfAdmission: { type: Date, default: Date.now },
      maritalStatus: { type: String, required: true },
    },

    historyOfPresentingComplaints: { type: String, default: null },
    historyOfPresentingIllness: { type: String, default: null },

    systemicHistory:
    {
      centralNervousSystem: { type: String, default: null },
      cardiovascularSystem: { type: String, default: null },
      gastrointestinalSystem: { type: String, default: null },
      genitourinarySystem: { type: String, default: null },
      musculoskeletalSystem: { type: String, default: null },
    },
    pastSurgicalHistory: { type: String, default: null },
    pastMedicalHistory: { type: String, default: null },
    familyHistory: { type: String, default: null },
    drugHistory: { type: String, default: null },
    allergies: { type: String, default: null },
    gynecologicalHistory: { type: String, default: null },
    occupationalHistory: { type: String, default: null },
    travelHistory: { type: String, default: null },
    socioeconomicHistory: { type: String, default: null },

    examination:
    {
      generalPhysicalExamination:
      {
        bloodPressure: { type: String, default: null },
        pulse: { type: Number, default: null },
        temperature: { type: String, default: null },
        respiratoryRate: { type: Number, default: null },
        bloodSugarLevel: { type: String, default: null },
        notes: { type: String, default: null },
      },
      respiratorySystem: { type: String, default: null },
      centralNervousSystem: { type: String, default: null },
      cardiovascularSystem: { type: String, default: null },
      gastrointestinalSystem: { type: String, default: null },
    },

    investigations:
    {
      completeBloodCount: { type: String, default: null },
      liverFunctionTests: { type: String, default: null },
      renalFunctionTests: { type: String, default: null },
      vitalMarkers: { type: String, default: null },
      serumElectrolytes: { type: String, default: null },
      prothrombinTime: { type: String, default: null },
      activatedPartialThromboplastinTime: { type: String, default: null },
      electrocardiogram: { type: String, default: null },
      chestXRay: { type: String, default: null },
    },

    treatment:
    {
      prescribedDrug: { type: String, default: null },
      dosage: { type: String, default: null },
      administrationRoute: { type: String, default: null },
      dosageFrequency: { type: String, default: null },
    },

    doctorInfo: doctorInfoSchema,

    summary:
    {
      type: String,
      required: false,
      default: null,
    },
  },

  {
    timestamps: true,
  }

);

const MedicalHistoryModel = mongoose.model('medicalHistory', medicalHistorySchema);

module.exports = MedicalHistoryModel;

