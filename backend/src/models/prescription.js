const mongoose = require("mongoose");

const prescription = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    prescribedDrug: { type: String, required: true },
    dosage: { type: String, required: true },
    administrationRoute: { type: String, required: true},
    dosageFrequency: { type: String,required: true },
    allergies: { type: [String], default: null, }
  }
);

const Prescription = new mongoose.model("Prescription", prescription);
module.exports = Prescription;

/*
{
    "prescribedDrug": "Oxycodone",
    "dosage": "500mg",
    "administrationRoute": "Oral",
    "dosageFrequency": "Once every two days",
    "allergies": ["Nut allergy"]
}

*/