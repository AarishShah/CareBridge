const express = require("express");
const passport = require("passport");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const auth = require("../middleware/auth");
require("../middleware/passport");
const router = new express.Router();
const { assignDoctor, removeDoctor } = require('../utils/assignment');

// completed:

// Sign Up Route
// Login Route
// Update Route
// Delete Route // make sure to delete all prescriptions and medical records associated with the patient
// Logout Route
// Logout All Route
// Read Route
// assignDoctor Route
// removeDoctor Route
// read patient's medical history (this is common to both patient and doctor)

// Incomplete:
// when a patient assigns a doctor, the doctor should get a notification which when accepted, the doctor is added to the patient's assignedDoctors array

// Sign Up Route
router.post("/patient/signup", async (req, res) =>
{
    try
    {
        const { name, email, password, DOB, gender, maritalStatus, occupation, address, religion } = req.body;

        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!email) missingFields.push("email");
        if (!password) missingFields.push("password");
        if (!DOB) missingFields.push("date of birth (DOB)");
        if (!gender) missingFields.push("gender");
        if (!maritalStatus) missingFields.push("maritalStatus");
        if (!occupation) missingFields.push("occupation");
        if (!address) missingFields.push("address");

        if (missingFields.length > 0)
        {
            return res.status(400).send({ error: `The following field(s) are required and missing: ${missingFields.join(", ")}. Please ensure all fields are filled out correctly.`, });
        }

        const newPatient = await Patient.create({ name, email, password, DOB, gender, maritalStatus, occupation, address });
        const token = await newPatient.generateAuthToken();

        res.status(201).send({ newPatient, token });
    } catch (e)
    {
        // console.error("Signup error:", e);
        res.status(500).send({ error: "Failed to create a new user." });
    }
});

// Redirect to Google for authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback URL
router.get('/auth/google/callback',
    passport.authenticate('google', { session: true, failureRedirect: '/' }), // remember to check if session is true by default, then remove it
    async (req, res) =>
    {
        req.session.tempUser = req.user;
        const isNewUser = !req.user.DOB || !req.user.gender || !req.user.maritalStatus || !req.user.occupation || !req.user.address;

        if (isNewUser)
        {
            res.redirect(`http://localhost:5173/patient/complete-profile`);
        } else
        {
            res.redirect(`/patient/dashboard`); // User is already registered, redirect to dashboard
        }
    }
);

router.get('/patient/complete-profile', (req, res) => {
    const { name, email, googleId, isGoogleSignUp } = req.query;

    // Render a form with hidden fields for temp user data
    res.send(`
        <form action="/patient/complete-profile" method="POST">
            <input type="hidden" name="name" value="${name}">
            <input type="hidden" name="email" value="${email}">
            <input type="hidden" name="googleId" value="${googleId}">
            <input type="hidden" name="isGoogleSignUp" value="${isGoogleSignUp}">

            <!-- Fields for additional profile data -->
            <label for="DOB">Date of Birth:</label>
            <input type="date" id="DOB" name="DOB" required><br>
            
            <label for="gender">Gender:</label>
            <input type="text" id="gender" name="gender" required><br>
            
            <label for="maritalStatus">Marital Status:</label>
            <input type="text" id="maritalStatus" name="maritalStatus" required><br>
            
            <label for="occupation">Occupation:</label>
            <input type="text" id="occupation" name="occupation" required><br>
            
            <label for="state">State:</label>
            <input type="text" id="state" name="state" required><br>
            
            <label for="city">City:</label>
            <input type="text" id="city" name="city" required><br>
            
            <label for="street">Street:</label>
            <input type="text" id="street" name="street" required><br>
            
            <label for="pinCode">Pin Code:</label>
            <input type="text" id="pinCode" name="pinCode" required><br>
            
            <button type="submit">Complete Profile</button>
        </form>
    `);
});

router.post("/patient/complete-profile", async (req, res) =>
{
    try
    {
        const { DOB, gender, maritalStatus, occupation, address } = req.body;

        const missingFields = [];
        if (!DOB) missingFields.push("date of birth (DOB)");
        if (!gender) missingFields.push("gender");
        if (!maritalStatus) missingFields.push("maritalStatus");
        if (!occupation) missingFields.push("occupation");
        if (!address) missingFields.push("address");

        if (missingFields.length > 0)
        {
            return res.status(400).send({ error: `The following field(s) are required and missing: ${missingFields.join(", ")}. Please ensure all fields are filled out correctly.`, });
        }

        const tempUser = req.session.tempUser;


        const newPatient = await Patient.create(
            {
                name: tempUser.name,
                email: tempUser.email,
                isGoogleSignUp: tempUser.isGoogleSignUp,
                googleId: tempUser.googleId,
                DOB, gender, maritalStatus, occupation, address
            });
        const token = await newPatient.generateAuthToken();
        delete req.session.tempUser;

        res.status(201).send({ newPatient, token });
    } catch (e)
    {
        console.error("Signup error:", e);
        res.status(500).send({ error: "Failed to create a new user." });
    }
});


// Login Route
router.post("/patient/login", async (req, res) =>
{
    try
    {
        const patient = await Patient.findByCredentials(req.body.email, req.body.password);
        const token = await patient.generateAuthToken();
        res.status(202).send({ patient, token });
    }
    catch (error)
    {
        // console.error("Login error:", error);
        res.status(400).send({ error: "Login failed" });
    }
});

// Update Route
router.patch("/patient/me", auth, async (req, res) =>
{
    const updates = Object.keys(req.body); // returns the keys of the json object as an array
    const allowedUpdates = ["name", "email", "password", "gender", "maritalStatus", "occupation", "address",];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation)
    {
        return res.status(404).send({ error: "Invalid updates!" });
    }

    try
    {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.status(200).send(req.user);
    }
    catch (error)
    {
        // console.error("Update error:", error);
        res.status(400).send({ error: "Update failed" });
    }
});

// Delete Route
router.delete("/patient/me", auth, async (req, res) =>
{
    try
    {
        const patientId = req.user._id;
        const deletedPatient = await Patient.findByIdAndDelete(patientId);
        // make sure to delete all prescriptions and medical records associated with the patient
        res.send({ message: "Account deleted successfully." });
    }
    catch (error)
    {
        // console.error("Delete error:", error);
        res.status(500).send({ error: "Delete failed" });
    }
});

// Logout Route
router.post("/patient/logout", auth, async (req, res) =>
{
    try
    {
        req.user.tokens = req.user.tokens.filter((token) =>
        {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send({ message: "Logout successful" });
    } catch (e)
    {
        // console.error("Logout error:", e);
        res.status(500).send({ error: "Logout failed" });
    }
});

// Logout All Route - Logout a patient from all devices
router.post("/patient/logoutall", auth, async (req, res) =>
{
    try
    {
        req.user.tokens = [];
        await req.user.save();
        res.send({ message: "Logout successful from all instances." });
    }
    catch (error)
    {
        // console.error("Logout error:", error);
        res.status(500).send({ error: "Logout failed" });
    }
});

// Read Patient Route
router.get("/patient/me", auth, async (req, res) =>
{
    res.send(req.user);
});

// assignDoctor Route
router.post("/patient/assignDoctor", auth, async (req, res) =>
{
    try
    {
        const patientId = req.user._id;
        const doctorEmail = req.body.email;

        const doctor = await Doctor.findOne({ email: doctorEmail });
        if (!doctor)
        {
            return res.status(404).send({ error: "Doctor not found" });
        }

        const result = await assignDoctor(patientId, doctor._id);
        if (result.error)
        {
            return res.status(400).send(result.message);
        }

        res.status(201).send({ message: "Doctor assigned successfully" });
    }
    catch (error)
    {
        // console.error("Doctor assignment error:", error);
        res.status(400).send({ error: "Doctor assignment failed" });
    }
});

// removeDoctor Route
router.delete("/patient/removeDoctor", auth, async (req, res) =>
{
    try
    {
        const patientId = req.user._id;
        const doctorEmail = req.body.email;

        const doctor = await Doctor.findOne({ email: doctorEmail });
        if (!doctor)
        {
            return res.status(404).send({ error: "Doctor not found" });
        }

        const result = await removeDoctor(patientId, doctor._id);
        if (result.error)
        {
            return res.status(400).send(result.message);
        }

        res.status(200).send({ message: "Doctor removed successfully" });
    }
    catch (error)
    {
        // console.error("Doctor removal error:", error);
        res.status(400).send({ error: "Doctor removal failed" });
    }
});

module.exports = router;
