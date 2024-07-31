const express = require('express');
const MedicalHistory = require('../models/medicalHistory');
const Patient = require('../models/patient');
const auth = require('../middleware/auth');
const openai = require('../utils/openai');
const router = express.Router();

// Create patient's medical history
router.post('/medicalhistory/:id', auth, async (req, res) =>
{
    if (req.role !== 'doctor')
    {
        return res.status(403).send({ error: 'Only doctors are authorized to add patient history' });
    }

    const patientId = req.params.id;
    const doctorId = req.user._id; // req.user is set by the auth middleware

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

        const {
            medicalHistory: {
                title,
                biodata: { modeOfAdmission },
                historyOfPresentingComplaints,
                historyOfPresentingIllness,
                systemicHistory,
                pastSurgicalHistory,
                pastMedicalHistory,
                familyHistory,
                drugHistory,
                allergies,
                gynecologicalHistory,
                occupationalHistory,
                travelHistory,
                socioeconomicHistory
            },
            examination,
            investigations,
            treatment
        } = req.body;

        const medicalHistory = new MedicalHistory({
            title,
            biodata: {
                id: patientId,
                name: patient.name,
                email: patient.email,
                gender: patient.gender,
                age: patient.age,
                address: patient.address,
                occupation: patient.occupation,
                maritalStatus: patient.maritalStatus,
                modeOfAdmission
            },
            historyOfPresentingComplaints,
            historyOfPresentingIllness,
            systemicHistory,
            pastSurgicalHistory,
            pastMedicalHistory,
            familyHistory,
            drugHistory,
            allergies,
            gynecologicalHistory,
            occupationalHistory,
            travelHistory,
            socioeconomicHistory,
            examination,
            investigations,
            treatment,
            doctorInfo: {
                doctorSignature: doctorId,
                doctorName: req.user.name,
                doctorEmail: req.user.email
            }
        });

        await medicalHistory.save();
        res.status(201).send(medicalHistory);
    } catch (e)
    {
        // console.error("Error creating patient history:", e);
        res.status(400).send({ error: 'Failed to create patient history' });
    }
});

// AI Processed Medical History
router.post('/medicalhistory/summary/:id', auth, async (req, res) =>
    {
        if (req.role !== 'doctor')
        {
            return res.status(403).send({ error: 'Only doctors are authorized to generate patient history summary' });
        }
    
        const medicalHistoryId = req.params.id;
        const doctorId = req.user._id; // req.user is set by the auth middleware
    
        try
        {
            const medicalHistory = await MedicalHistory.findById(medicalHistoryId);
    
            if (!medicalHistory)
            {
                return res.status(404).send({ error: 'Medical history not found' });
            }
    
            if (medicalHistory.doctorInfo.doctorSignature.toString() !== doctorId.toString())
            {
                return res.status(403).send({ error: 'Only the doctor who created this report is authorized to generate the summary.' });
            }
    
            const AISummary = await openai.summarize(medicalHistory);
            medicalHistory.summary = AISummary;
    
            await medicalHistory.save();
            res.status(200).send(medicalHistory);
        } catch (e)
        {
            // console.error("Error generating AI summary:", e);
            res.status(400).send({ error: 'Failed to generate AI summary' });
        }
    });

// Route to fetch paginated medical histories (only title and ID) with authorization
router.get('/medicalhistories', auth, async (req, res) =>
{
    const page = parseInt(req.query.page) || 1; // Default to first page
    const limit = parseInt(req.query.limit) || 6; // Default to 6 items per page
    const skip = (page - 1) * limit;

    try
    {

        let filter = {};

        // For patients, only fetch their own medical histories
        if (req.user.role === 'patient')
        {
            filter['biodata.id'] = req.user._id;
        }

        // For doctors, fetch medical histories of patients assigned to them
        else if (req.user.role === 'doctor')
        {
            const assignedPatientIds = await Patient.find({ 'assignedDoctors.doctor': req.user._id }, '_id');
            filter['biodata.id'] = { $in: assignedPatientIds.map(doc => doc._id) };
        }

        const medicalHistories = await MedicalHistory.find(filter, 'title _id summary biodata.name doctorInfo.doctorName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await MedicalHistory.countDocuments(filter);

        res.status(200).send(
            {
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                totalItems: totalCount,
                items: medicalHistories
            });
    }
    catch (error)
    {
        // console.error('Error fetching medical histories:', error);
        res.status(500).send({ error: 'Error fetching medical histories' });
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
        if (req.user.role === 'patient' && req.user._id.toString() === patientId.toString())
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