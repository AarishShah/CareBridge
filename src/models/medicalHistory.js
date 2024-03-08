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
      // required: true,
      ref: 'Doctor'
    },

    doctorName:
    {
      type: String,
      // required: true
    },

    doctorEmail:
    {
      type: String,
      // required: true
    }
  });
const medicalHistorySchema = new mongoose.Schema(
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
        required: true
      },

      email:
      {
        type: String,
        required: true
      },

      gender:
      {
        type: String,
        required: true
      },

      age:
      {
        years:
        {
          type: Number,
          required: true
        },
        months:
        {
          type: Number,
          required: true
        },
        days:
        {
          type: Number,
          required: true
        },
      },

      address: {
        type: addressSchema, // Use addressSchema here
        required: true,
      },

      occupation:
      {
        type: String,
        required: true
      },

      modeOfAdmission:
      {
        type: String,
        required: true,
        enum: ['Emergency', 'Outpatient']
      },

      dateOfAdmission: {
        type: Date,
        default: Date.now
      },

      maritalStatus:
      {
        type: String,
        required: true
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
    },
    doctorInfo: doctorInfoSchema,
  });

const medicalHistoryModel = mongoose.model('medicalHistory', medicalHistorySchema);

module.exports = medicalHistoryModel;

