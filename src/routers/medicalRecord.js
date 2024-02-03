const express = require('express');
const MedicalRecord = require('../models/medicalRecord');
const auth = require('../middleware/patient');
const router = new express.Router();

// POST route to create a medical record
router.post('/medicalRecords', auth, async (req, res) =>
{
    try
    {
        const medicalRecord = new MedicalRecord({
            patient: req.patient._id,
            doctor: req.user._id, // Assuming the doctor is creating the record
            entries: [] // Start with an empty array of entries
        });
        await medicalRecord.save();
        res.status(201).send(medicalRecord);
    } catch (error)
    {
        res.status(400).send(error);
    }
});

// POST route for a patient or a doctor to add an entry to their medical record
router.post('/medicalRecords/:id/entries', auth, async (req, res) =>
{
    try
    {
        const medicalRecord = await MedicalRecord.findById(req.params.id);
        if (!medicalRecord)
        {
            return res.status(404).send();
        }
        // Check if the patient is adding the record or the doctor is the one associated with the medical record
        if (req.user.role === 'Patient' || medicalRecord.doctor.equals(req.user._id))
        {
            const entry = { content: req.body.content, createdBy: req.user._id, onModel: req.user.role };
            medicalRecord.entries.push(entry);
            await medicalRecord.save();
            res.status(201).send(entry);
        } else
        {
            res.status(403).send({ error: 'Not authorized to add entries to this medical record' });
        }
    } catch (error)
    {
        res.status(400).send(error);
    }
});

// DELETE route for a patient or a doctor to delete an entry they added
router.delete('/medicalRecords/:recordId/entries/:entryId', auth, async (req, res) =>
{
    try
    {
        const medicalRecord = await MedicalRecord.findById(req.params.recordId);
        const entry = medicalRecord.entries.id(req.params.entryId);

        if (!entry)
        {
            return res.status(404).send({ error: 'Medical record entry not found' });
        }
        // Check if the requesting user is the one who created the entry
        if (entry.createdBy.equals(req.user._id))
        {
            entry.remove();
            await medicalRecord.save();
            res.status(200).send({ message: 'Entry deleted' });
        } else
        {
            res.status(403).send({ error: 'Not authorized to delete this entry' });
        }
    } catch (error)
    {
        res.status(400).send(error);
    }
});

// PUT route for a patient or a doctor to edit an entry they added
router.put('/medicalRecords/:recordId/entries/:entryId', auth, async (req, res) =>
{
    try
    {
        const medicalRecord = await MedicalRecord.findById(req.params.recordId);
        const entry = medicalRecord.entries.id(req.params.entryId);

        if (!entry)
        {
            return res.status(404).send({ error: 'Medical record entry not found' });
        }
        // Check if the requesting user is the one who created the entry
        if (entry.createdBy.equals(req.user._id))
        {
            entry.content = req.body.content;
            await medicalRecord.save();
            res.status(200).send(entry);
        } else
        {
            res.status(403).send({ error: 'Not authorized to edit this entry' });
        }
    } catch (error)
    {
        res.status(400).send(error);
    }
});

// PATCH route for a patient or a doctor to partially edit an entry they added
router.patch('/medicalRecords/:recordId/entries/:entryId', auth, async (req, res) =>
{
    try
    {
        const medicalRecord = await MedicalRecord.findById(req.params.recordId);
        const entry = medicalRecord.entries.id(req.params.entryId);

        if (!entry)
        {
            return res.status(404).send({ error: 'Medical record entry not found' });
        }

        // Check if the requesting user is the one who created the entry
        if (entry.createdBy.equals(req.user._id))
        {
            // Assume req.body contains the fields to update
            for (let field in req.body)
            {
                entry[field] = req.body[field];
            }
            await medicalRecord.save();
            res.status(200).send(entry);
        } else
        {
            res.status(403).send({ error: 'Not authorized to edit this entry' });
        }
    } catch (error)
    {
        res.status(400).send(error);
    }
});

module.exports = router;
