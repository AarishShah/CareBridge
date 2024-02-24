// Patient's medical history
// Only doctor that is present in Patient's assignedDoctors array can create patient's medical history
// Any doctor can read patient's medical history. Patient can read his/her own medical history.
// No one can update or delete patient's medical history

const express = require('express');
const MedicalHistory = require('../models/medicalHistory');
const Patient = require('../models/patient');
const auth = require('../middleware/auth');
const router = express.Router();

// Create patient's medical history
router.post('/medicalhistory/:id', auth, async (req, res) => 
{
    if (req.role !== 'doctor')
    {
        return res.status(403).send({ error: 'Only doctors are authorized to add patient history' });
    }

    const patientId = req.params.id;
    const doctorId = req.user._id; // Assuming req.user is set by the auth middleware

    try
    {
        const patient = await Patient.findById(patientId);

        if (!patient)
        {
            return res.status(404).send({ error: 'Patient not found' });
        }

        const isAssignedDoctor = patient.assignedDoctors.some(doc => doc.doctor.toString() === doctorId.toString());

        if (!isAssignedDoctor)
        {
            return res.status(403).send({ error: 'Doctor not authorized to add history for this patient' });
        }

        const modeOfAdmission = req.body.medicalHistory.biodata.modeOfAdmission;
        const medicalHistory = new MedicalHistory({
            biodata: {
                id: patientId,
                name: patient.name,
                email: patient.email,
                gender: patient.gender,
                age: patient.age,
                address: patient.address,
                occupation: patient.occupation,
                maritalStatus: patient.maritalStatus,
                modeOfAdmission: modeOfAdmission
            },
            ...req.body, // All other fields from the request body
            doctorInfo: { // Set the doctor information in its dedicated section
                doctorSignature: doctorId, // ID from authenticated doctor
                doctorName: req.user.name, // Name from authenticated doctor
                doctorEmail: req.user.email // Email from authenticated doctor
            }

        });

        await medicalHistory.save();
        res.status(201).send(medicalHistory);
    } catch (e)
    {
        console.error("Error creating patient history:", e);
        res.status(400).send({ error: 'Failed to create patient history' });
    }
});

// Read patient's medical history
router.get('/medicalHistory/:id', auth, async (req, res) =>
{
    try
    {
        const medicalRecordId = req.params.id;
        const medicalRecord = await MedicalHistory.findById(medicalRecordId);
        const patientId = medicalRecord.biodata.id;

        if (!medicalRecord)
        {
            return res.status(404).send();
        }

        // Only the patient can view his/her own medical history
        if (req.user.role === 'patient' && req.user._id.toString() === medicalRecord.biodata.id.toString())
        {
            return res.send(medicalRecord);
        } 
        // Only the assigned doctor can view the patient's medical history
        else if (req.user.role === 'doctor')
        {
            const patient = await Patient.findById(patientId);
            const isAssignedDoctor = patient.assignedDoctors.some(doctor => doctor.doctor.toString() === req.user._id.toString());

            if (isAssignedDoctor)
            {
                return res.send(medicalRecord);
            } else
            {
                return res.status(403).send({ error: 'Not authorized to view this medical record' });
            }
        } else
        {
            return res.status(403).send({ error: 'Not authorized to view this medical record' });
        }
    } catch (error)
    {
        res.status(500).send(error);
    }
});

module.exports = router;