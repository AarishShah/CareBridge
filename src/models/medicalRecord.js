const mongoose = require('mongoose');

// Medical entry is a subdocument of medical record. We can define it here and embed it in the medical record schema. For Example: Entry could be a doctor's note or a patient's self-note where as the medical record is the collection of all the entries for a patient.
const recordEntrySchema = new mongoose.Schema(
    {
        content:
        {
            type: String,
            required: true
        },
        createdBy:
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'onModel'
        },
        onModel:
        {
            type: String,
            required: true,
            enum: ['Patient', 'Doctor']
        }
    }, { timestamps: true });

const medicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patient'
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    entries: [recordEntrySchema],
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
    }]
}, {
    timestamps: true
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;

/*
Dummy data

{
    "patient": "5f8d0d55b54764421b7156da",
    "doctor": "5f8d0d55b54764421b7156db",
    "entries": [
        {
            "content": "Initial consultation and medical history review. Patient reports occasional chest pain.",
            "createdBy": "5f8d0d55b54764421b7156db",
            "onModel": "Doctor"
        },
        {
            "content": "Patient reports improved symptoms after medication adjustment.",
            "createdBy": "5f8d0d55b54764421b7156db",
            "onModel": "Doctor"
        },
        {
            "content": "Patient's self-note: Requesting follow-up on test results.",
            "createdBy": "5f8d0d55b54764421b7156da",
            "onModel": "Patient"
        }
    ]
}

// Complete Medical Record Data Example:
{
    patient: "5f8d0d55b54764421b7156da", // Example patient ObjectId
    doctor: "5f8d0d55b54764421b7156db", // Example doctor ObjectId
    entries: [
        {
            content: "Patient reports experiencing mild headaches for the past week.",
            createdBy: "5f8d0d55b54764421b7156db", // Doctor's ObjectId
            onModel: "Doctor"
        },
        {
            content: "Follow-up visit: Headaches have reduced after medication.",
            createdBy: "5f8d0d55b54764421b7156db", // Doctor's ObjectId
            onModel: "Doctor"
        },
        {
            content: "Self-note: Feeling better, but still slight dizziness occasionally.",
            createdBy: "5f8d0d55b54764421b7156da", // Patient's ObjectId
            onModel: "Patient"
        }
    ],
    prescriptions: [
        "5f8d0d55b54764421b7156dc" // Example prescription ObjectId
    ]
}


*/
