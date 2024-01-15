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
