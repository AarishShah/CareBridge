const express = require('express');
const Patient = require('../models/patient');
// const auth = require('../middleware/auth');
const router = new express.Router();

// createAccount() @humma-irshad

// Create a new patient
router.post('/patients', async (req, res) => 
{
    try
    {
        const { name, email, password, age, gender } = req.body;

        if (!name || !email || !password || !age || !gender)
        {
            return res.status(400).send({ error: 'Name, email, password, age and gender are required' });
        }

        // Implement logic to create a new patient in the database
        const newpatient = await Patient.create({ name, email, password, age, gender });

        res.status(201).send({ newpatient });
    } catch (e)
    {
        console.error('Create error:', e);
        res.status(500).send({ error: 'Create failed' });
    }
});

// readAccount() @humma-irshad - @KhushbooHamid

// updateAccount()

// logging out()
// logout-all()

// deleteAccount() @KhushbooHamid

// Delete a patient by ID
router.delete('/patients/:id', async (req, res) =>
{
    try
    {
        const patientId = req.params.id;

        const deletedpatient = await Patient.findByIdAndDelete(patientId);

        if (!deletedpatient)
        {
            return res.status(404).send({ error: 'patient not found' });
        }

        res.send({ message: `patient with ID ${patientId} deleted successfully` });
    } catch (e)
    {
        console.error('Delete error:', e);
        res.status(500).send({ error: 'Delete failed' });
    }
});


// chooseDoctor()
// viewDiagnosisAndMed()