const express = require("express");

const path = require("path");
const { randomUUID } = require("crypto");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const passport = require("passport");

const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const auth = require("../middleware/auth");
require("../middleware/passport");
const router = express.Router();
const { doctorRequestPatient, handleDoctorResponse, removeDoctor } = require('../utils/assignment');
const s3 = require("../utils/s3Client");

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const getProfileUrl = async (bucket, profileKey) =>
{
    if (!bucket || !profileKey) return "";
    const command = new GetObjectCommand(
        {
            Bucket: bucket,
            Key: profileKey,
            ResponseContentType: "image/jpeg",
        });
    return await getSignedUrl(s3, command, { expiresIn: 4000 });
};

const getUploadProfileUrl = async (fileType) =>
{
    let key;
    if (fileType)
    {
        const ext = fileType.split(".")[1];
        key = `profile/${randomUUID()}.${ext}`;
    }

    let uploadUrl = "";
    if (key)
    {
        const putObjectCommands =
        {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            ContentType: "image/jpeg",
        };
        const command = new PutObjectCommand(putObjectCommands);

        uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    }

    return { key, uploadUrl };
}

// Sign Up Route
router.post("/doctor/signup", async (req, res) =>
{
    try
    {
        const { key, uploadUrl } = await getUploadProfileUrl(req.query.fileType);

        const { name, email, password, gender, specialization, yearsOfExperience, qualifications } = req.body;

        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!email) missingFields.push("email");
        if (!password) missingFields.push("password");
        if (!gender) missingFields.push("gender");
        if (!specialization) missingFields.push("specialization");
        if (!yearsOfExperience) missingFields.push("years of experience");
        if (!qualifications) missingFields.push("qualifications");

        if (missingFields.length > 0)
        {
            return res.status(400).send({
                error: `The following field(s) are required and missing: ${missingFields.join(
                    ", "
                )}. Please ensure all fields are filled out correctly.`,
            });
        }

        const newDoctor = await Doctor.create({ name, email, password, profileKey: key, bucket: process.env.BUCKET_NAME, region: process.env.REGION, gender, specialization, yearsOfExperience, qualifications });

        const token = await newDoctor.generateAuthToken();

        res.status(201).send({ newDoctor, token, uploadUrl });
    } catch (e)
    {
        // console.error("Create error:", e);
        res.status(500).send({ error: "Create failed" });
    }
});

// Redirect to Google for authentication
router.get('/doctor/auth/google', passport.authenticate('google-doctor', { scope: ['profile', 'email'] }));

// Google callback URL
router.get('/doctor/auth/google/callback',
    passport.authenticate('google-doctor', { failureRedirect: '/doctor/auth/google' }),
    async (req, res) =>
    {
        const user = req.user;
        console.log(user);

        if (!user)
        {
            return res.redirect('/doctor/auth/google');
        }

        try
        {
            const existingUser = await Doctor.findOne({ email: user.email });

            // check if user is in db
            if (existingUser)
            {
                // if user is in db but not linked to google account then update the parameters and hence link the account
                if (!existingUser.isGoogleSignUp)
                {
                    existingUser.isGoogleSignUp = true;
                    existingUser.googleId = user.googleId;
                    await existingUser.save();
                }

                // generate token, save it to the session and redirect to dashboard
                const token = await existingUser.generateAuthToken();
                req.session.token = token; //  remove if the below line is working fine
                // res.send({ token }); // test this
                return res.redirect('http://localhost:5173/doctor/dashboard');
            }

            else
            {
                // Temporarily store the user data
                req.session.tempUser = user;
                return res.redirect('http://localhost:5173/doctor/complete-profile');
            }

        } catch (error)
        {
            console.error("Google authentication error:", error);
            return res.redirect('/doctor/auth/google');
        }
    }
);

// Complete Profile Route
router.post("/doctor/complete-profile", async (req, res) =>
{
    try
    {
        const tempUser = req.session.tempUser;
        const { gender, specialization, yearsOfExperience, qualifications } = req.body;

        const missingFields = [];
        if (!gender) missingFields.push("gender");
        if (!specialization) missingFields.push("specialization");
        if (!yearsOfExperience) missingFields.push("years of experience");
        if (!qualifications) missingFields.push("qualifications");

        if (missingFields.length > 0)
        {
            return res.status(400).send({ error: `The following field(s) are required and missing: ${missingFields.join(", ")}. Please ensure all fields are filled out correctly.`, });
        }

        const newDoctor = await Doctor.create(
            {
                name: tempUser.name,
                email: tempUser.email,
                isGoogleSignUp: tempUser.isGoogleSignUp,
                googleId: tempUser.google,
                gender, specialization, yearsOfExperience, qualifications
            });
        const token = await newDoctor.generateAuthToken();
        delete req.session.tempUser;

        res.status(201).send({ newDoctor, token });
    } catch (e)
    {
        // console.error("Signup error:", e);
        // console.log(req.body);
        res.status(500).send({ error: "Failed to create a new user." });
    }
});

// Login Route
router.post("/doctor/login", async (req, res) =>
{
    try
    {
        const doctor = await Doctor.findByCredentials(req.body.email, req.body.password);

        const token = await doctor.generateAuthToken();

        res.status(202).send({ doctor, token });
    } catch (error)
    {
        console.error("Login error:", error);
        res.status(400).send({ error: "Login failed" });
    }
});

// Update Route
router.patch("/doctor/me", auth, async (req, res) =>
{
    const { key, uploadUrl } = await getUploadProfileUrl(req.query.fileType);

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'gender', 'specialization', 'yearsOfExperience', 'qualifications'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation)
    {
        return res.status(404).send({ error: 'Invalid updates!' });
    }

    try
    {
        updates.forEach((update) => 
        {
            req.user[update] = req.body[update];
            req.user.profileKey = key;
            req.user.bucket = process.env.BUCKET_NAME;
            req.user.region = process.env.REGION;
        });

        await req.user.save();
        res.send({ updatedDoctor: req.user, uploadUrl });
    }
    catch (error)
    {
        // console.error("Update error:", error);
        res.status(400).send({ error: "Update failed" });
    }
});

// Delete Route
router.delete("/doctor/me", auth, async (req, res) =>
{
    try
    {
        const doctorId = req.user._id;
        const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);

        res.send({ message: 'Account deleted successfully.' });
    } catch (error)
    {
        // console.error("Delete error:", e);
        res.status(500).send({ error: "Delete failed" });
    }
});

// Logout Route
router.post("/doctor/logout", auth, async (req, res) =>
{
    try
    {
        req.user.tokens = req.user.tokens.filter((token) => { return token.token !== req.token; });
        await req.user.save();
        res.send({ message: "Logout successful" });
    }

    catch (e)
    {
        // console.error("Logout error:", e);
        res.status(500).send({ error: "Logout failed" });
    }
});

// Logout All Route - Logout a doctor from all devices
router.post("/doctor/logoutall", auth, async (req, res) =>
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

// Read Doctor Route
router.get("/doctor/me", auth, async (req, res) =>
{
    try
    {
        // Populate assigned patients in the response
        const doctor = await Doctor.findById(req.user._id).populate('assignedPatients');

        const { bucket, profileKey } = doctor;
        const profileUrl = await getProfileUrl(bucket, profileKey);

        res.send({ doctor, profileUrl });
    } catch (error)
    {
        res.status(500).send({ error: "Failed to fetch doctor details" });
    }
});
// assignDoctor Route - Doctor requests to connect to a patient by email
router.post("/doctor/requestPatient", auth, async (req, res) => 
{
    try
    {
        const doctorId = req.user._id;
        const patientEmail = req.body.email;

        const patient = await Patient.findOne({ email: patientEmail });

        if (!patient)
        {
            return res.status(404).send({ error: "Patient not found" });
        }

        const result = await doctorRequestPatient(doctorId, patient._id);
        if (result.error)
        {
            return res.status(400).send(result.message);
        }

        res.status(201).send({ message: result.message });
    }
    catch (error)
    {
        res.status(400).send({ error: "Patient connection request failed" });
    }
});

// removeDoctor Route - Doctor handles the response to a connection request
router.patch("/doctor/responseRequest/:id", auth, async (req, res) => 
{
    try
    {
        const action = req.body.action; // 'accept' or 'reject'
        const result = await handleDoctorResponse(req.params.id, action);
        if (result.error)
        {
            return res.status(400).send(result.message);
        }

        res.status(200).send({ message: result.message });
    }
    catch (error)
    {
        res.status(400).send({ error: "Handling request failed" });
    }
});

// Doctor removes a connection with a patient by email
router.delete('/doctor/removePatient', auth, async (req, res) =>
{
    try
    {
        const doctorId = req.user._id;
        const patientEmail = req.body.email;

        const patient = await Patient.findOne({ email: patientEmail });
        if (!patient)
        {
            return res.status(404).send({ error: 'Patient not found' });
        }

        const result = await removeDoctor(patient._id, doctorId);
        if (result.error)
        {
            return res.status(400).send(result.message);
        }

        res.status(200).send({ message: 'Patient removed successfully' });
    }
    catch (error)
    {
        res.status(400).send({ error: 'Removing patient failed' });
    }
});

module.exports = router;
