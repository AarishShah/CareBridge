const express = require('express');
const Doctor = require('../models/doctor');
const router = express.Router();

/*
completed:

createDoctor()
getDoctorById()
deleteDoctorById()
loginDoctor()
logoutDoctor()
*/


/*
incomplete:

updateDoctor()
viewPatientHistory()
provideDiagnosisAndMed()
*/

// Create a new doctor
router.post('/doctors', async (req, res) =>
{
    try
    {
        const { name, email, password, gender, specialization, yearsOfExperience, qualifications } = req.body;

        if (!name || !email || !password || !gender || !specialization || !yearsOfExperience || !qualifications)
        {
            return res.status(400).send({ error: 'Name, email, password, gender, specialization, yearsOfExperience, qualifications are required' });
        }

        const newDoctor = await Doctor.create({ name, email, password, gender, specialization, yearsOfExperience, qualifications });

        res.status(201).send({ newDoctor });
    } catch (e)
    {
        console.error('Create error:', e);
        res.status(500).send({ error: 'Create failed' });
    }
});


// Retrieve a doctor by ID
router.get('/doctors/:id', async (req, res) =>
{
    try
    {
        const doctorId = req.params.id;
        const doctor = await doctor.findById(doctorId);

        if (!doctor)
        {
            return res.status(404).send({ error: 'Doctor not found' });
        }

        res.send({ doctor });
    }
    catch (e)
    {
        console.error('Retrieve error:', e);
        res.status(500).send({ error: 'Retrieve failed' });
    }
});


// Update a doctor by ID
router.patch('/doctors/:id', async (req, res) =>
{
    const doctorId = await doctor.findById(req.params.id);

    if (!doctorId)
    {
        return res.send({ statusCode: 404, status: "Not Found", error: 'Doctor not found', });
    }

    // incomplete - fix it as per the items that user mentions and not all the items

})

// Delete a doctor by ID
router.delete('/doctors/:id', async (req, res) =>
{
    try
    {
        const doctorId = req.params.id;
        const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);

        if (!deletedDoctor)
        {
            return res.status(404).send({ error: 'Doctor not found' });
        }

        res.send({ message: `Doctor with ID ${doctorId} deleted successfully` });
    } catch (e)
    {
        console.error('Delete error:', e);
        res.status(500).send({ error: 'Delete failed' });
    }
});


// Doctor login
router.post('/doctors/login', async (req, res) =>
{
    try
    {
        const { email, password } = req.body;

        if (!email || !password)
        {
            return res.status(400).send({ error: 'Email and password are required' });
        }

        const user1 = await Doctor.findByCredentials(email, password);

        if (!user1)
        {
            return res.status(400).send({ error: 'Login failed. Invalid email or password' });
        }

        // Set the user in the session
        req.session.user = {
            _id: user1._id,
            email: user1.email,
            // Add any other relevant user data you want to store in the session
        };

        res.send({ user1 });
    } catch (e)
    {
        console.error('Login error:', e);
        res.status(400).send({ error: 'Login failed' });
    }
});

// Doctor logout
router.post('/doctors/logout', async (req, res) =>
{
    try
    {
        // Check if the session exists
        if (req.session)
        {
            const user = req.session.user;

            if (!user)
            {
                return res.status(401).send({ error: 'User not authenticated' });
            }

            // Clear the session data
            req.session.destroy((err) =>
            {
                if (err)
                {
                    console.error(err);
                    res.status(500).send({ error: 'Logout failed' });
                }
                else
                {
                    res.send('logout successfull');
                }
            });
        } 
        else
        {
            return res.status(401).send({ error: 'User not authenticated' });
        }
    } catch (e)
    {
        console.error(e);
        res.status(500).send({ error: 'Logout failed' });
    }
});

router.get('/doctors/viewPatientHistory', async (req, res) =>
{

});

router.post('/doctors/provideDiagnosisAndMed', async (req, res) =>
{

});

module.exports = router;