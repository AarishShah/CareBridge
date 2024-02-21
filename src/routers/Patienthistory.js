// Patient's medical history
// Only doctor that is present in Patient's assignedDoctors array can create patient's medical history
// Any doctor can read patient's medical history. Patient can read his/her own medical history.
// No one can update or delete patient's medical history

const express = require('express');
const Patienthistory = require('../models/Patienthistory');
const Patient = require('../models/patient');
const DoctorAuth = require('../middleware/doctor'); 
const router = express.Router();

// Create patient's medical history
router.post('/patienthistory/:id', DoctorAuth, async (req, res) => 
{
    // Check if doctor who is creating patient's medical history is present in patient's assignedDoctors array
    const patientId = req.params.id;
    const doctorID = req.doctor._id;

    try
    {
        const patient = await Patient.findById(patientId);

        if (!patient)
        {
            return res.status(404).send({ error: 'Patient not found' });
        }

        const isAssignedDoctor = patient.assignedDoctors.some(doc => doc.doctor.toString() === doctorID.toString());

        if (!isAssignedDoctor)
        {
            return res.status(403).send({ error: 'Doctor not authorized to add history for this patient' });
        }

        const patienthistory = new Patienthistory({
            biodata: {
                id: patientId,
                name: patient.name,
                email: patient.email,
                gender: patient.gender,
                age: patient.age,
                address: patient.address,
                occupation: patient.occupation,
                maritalStatus: patient.maritalStatus,
            },
            ...req.body,
            doctor: doctorID
        });

        await patienthistory.save();
        res.status(201).send(patienthistory);
    }
    catch (e)
    {
        console.error("Delete error:", e);
        res.status(400).send({ error: 'Create failed' });
    }
});

module.exports = router;