const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patient'
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    medication: {
        type: String,
        required: true,
        trim: true
    },
    dosage: {
        type: String,
        trim: true,
        default: 'Dosage not specified' // Updated default value
    },

    duration: {
        type: String,
        trim: true,
        default: 'N/A' // Default value if duration is not specified
    },
    modeOfAction: {
        type: String,
        trim: true
    },
    dateOfPrescription: {
        type: Date,
        default: Date.now
    },
    instructionsForUse: {
        type: String,
        trim: true,
        default: 'Follow doctor\'s instructions'
    },
    refillInformation: {
        type: String,
        trim: true,
        default: 'No refills'
    },
    investigations: [{
        type: String,
        trim: true
    }],
    treatment: {
        type: String,
        trim: true,
        default: 'N/A'
    },
    diagnosis: {
        type: String,
        trim: true,
        default: 'Pending'
    }
}, {
    timestamps: true
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;

/*
// Minimal data example:
{
    patientId: "5f8d0d55b54764421b7156da", // Replace with a valid patient ObjectId
    doctorId: "5f8d0d55b54764421b7156db", // Replace with a valid doctor ObjectId
    medication: "Ibuprofen"
}


// Complte data example:
{
    patientId: "5f8d0d55b54764421b7156da", // Example patient ObjectId
    doctorId: "5f8d0d55b54764421b7156db", // Example doctor ObjectId
    medication: "Amoxicillin",
    dosage: "500 mg every 8 hours",
    duration: "7 days",
    modeOfAction: "Antibiotic that fights bacteria",
    dateOfPrescription: new Date(), // Current date and time
    instructionsForUse: "Take with food to reduce stomach irritation",
    refillInformation: "One-time refill",
    investigations: ["Complete Blood Count", "X-Ray Chest"],
    treatment: "Infection treatment",
    diagnosis: "Bacterial Pneumonia"
}

*/