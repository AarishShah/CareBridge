const express = require("express");
const path = require("path");
const { randomUUID } = require("crypto");
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const auth = require("../middleware/auth");
const router = new express.Router();
const { assignDoctor, removeDoctor } = require('../utils/assignment');
const s3 = require("../utils/s3Client");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const getProfileUrl = async (bucket, profileKey) =>
{
    if (!bucket || !profileKey) return "";
    const command = new GetObjectCommand({ Bucket: bucket, Key: profileKey });
    return await getSignedUrl(s3, command, { expiresIn: 4000 });
};

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

        const ext = req.query.fileType.split(".")[1];
        const key = `profile/${randomUUID()}.${ext}`;

        const putObjectCommands =
        {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            ContentType: "image/jpeg",
        };

        const command = new PutObjectCommand(putObjectCommands);
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600, });

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

        const newPatient = await Patient.create({ name, email, password, profileKey: key, bucket: process.env.BUCKET_NAME, region: process.env.REGION, DOB, gender, maritalStatus, occupation, address, religion });
        const token = await newPatient.generateAuthToken();

        res.status(201).send({ newPatient, token, uploadUrl });
    } catch (e)
    {
        // console.error("Signup error:", e);
        res.status(500).send({ error: "Failed to create a new user." });
    }
});

// Login Route
router.post("/patient/login", async (req, res) =>
{
    try
    {
        const patient = await Patient.findByCredentials(req.body.email, req.body.password);

        const { bucket, profileKey } = patient;
        const profileUrl = await getProfileUrl(bucket, profileKey);

        const token = await patient.generateAuthToken();

        res.status(202).send({ patient, profileUrl, token });
    }
    catch (error)
    {
        console.error("Login error:", error);
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

    const ext = req.query.fileType.split(".")[1];
    const key = `profile/${randomUUID()}.${ext}`;

    const putObjectCommands =
    {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        ContentType: "image/jpeg",
    };

    const command = new PutObjectCommand(putObjectCommands);
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 4000 });

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
        res.status(200).send({ updatedPatient: req.user, uploadUrl });
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
