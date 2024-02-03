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

// New Entry Data Example:

{
    "patient": "5f8d0d55b54764421b7156da",
    "doctors": [
        "5f8d0d55b54764421b7156db",
        "5f8d0d55b54764421b7156dc",
        "5f8d0d55b54764421b7156dd"
    ],
    "medicalHistory": [
        {
            "date": "2020-10-20T00:00:00.000Z",
            "diagnosis": "Initial consultation and medical history review. Patient reports occasional chest pain.",
            "doctor": "Dr. Jane Smith",
            "treatment": "Prescribed medication for chest pain and advised to follow-up in 2 weeks.",
            "notes": "Blood pressure and cholesterol levels to be checked in follow-up visit.",
            "createdBy": "5f8d0d55b54764421b7156db",
            "onModel": "Doctor"
        },
        {
            "date": "2020-11-03T00:00:00.000Z",
            "diagnosis": "Patient reports improved symptoms after medication adjustment.",
            "doctor": "Dr. Jane Smith",
            "treatment": "Prescribed medication adjustment and follow-up in 4 weeks.",
            "notes": "Blood pressure and cholesterol levels to be checked in follow-up visit.",
            "createdBy": "5f8d0d55b54764421b7156db",
            "onModel": "Doctor"
        },
        {
            "date": "2020-11-17T00:00:00.000Z",
            "diagnosis": "Patient reports feeling better, but still slight dizziness occasionally.",
            "doctor": "Dr. Romana",
            "treatment": "Prescribed medication adjustment and follow-up in 4 weeks.",
            "notes": "Blood pressure and cholesterol levels to be checked in follow-up visit.",
            "createdBy": "5f8d0d55b54764421b7156da",
            "onModel": "Patient"
        }
    ],
    "allergies": [
        "Peanuts",
        "Penicillin"
    ],
    currentMedications: [
        {
            "name": "Lisinopril",
            "dosage": "10mg",
            "frequency": "Once daily",
            "startDate": "2020-10-20T00:00:00.000Z",
            preescriedUntil: "2021-10-20T00:00:00.000Z",
            "notes": "Take with food"
        }, 
        {
            "name": "Atorvastatin",
            "dosage": "20mg",
            "frequency": "Once daily",
            "startDate": "2020-10-20T00:00:00.000Z",
            preescriedUntil: "2021-10-20T00:00:00.000Z",
            "notes": "Take before bed"
        }
    ],
    previousMedications: [
        {
            "name": "Aspirin",
            "dosage": "81mg",
            "frequency": "Once daily",
            "startDate": "2020-10-20T00:00:00.000Z",
            "endDate": "2020-11-03T00:00:00.000Z",
            "notes": "Take with food"
        },
        {
            "name": "Atorvastatin",
            "dosage": "20mg",
            "frequency": "Once daily",
            "startDate": "2020-10-20T00:00:00.000Z",
            "endDate": "2020-11-03T00:00:00.000Z",
            "notes": "Take before bed"
        }
    ],
    "prescriptions": [
        "5f8d0d55b54764421b7156dc",
        "5f8d0d55b54764421b7156dd",
        "5f8d0d55b54764421b7156de"
    ]
}

*/
