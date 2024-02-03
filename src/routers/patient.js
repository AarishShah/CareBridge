const express = require("express");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const auth = require("../middleware/patient");
const router = new express.Router();

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

// incomplete:

// viewDiagnosisAndMed() - @AarishShah

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
        if (!religion) missingFields.push("religion");

        if (missingFields.length > 0)
        {
            return res.status(400).send({ error: `The following field(s) are required and missing: ${missingFields.join(", ")}. Please ensure all fields are filled out correctly.`, });
        }

        const newPatient = await Patient.create({ name, email, password, DOB, gender, maritalStatus, occupation, address, religion });
        const token = await newPatient.generateAuthToken();

        res.status(201).send({ newPatient, token });
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
    const allowedUpdates = ["name", "email", "password", "gender", "maritalStatus", "occupation", "address", "religion",];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation)
    {
        return res.status(404).send({ error: "Invalid updates!" });
    }

    try
    {
        updates.forEach((update) => (req.patient[update] = req.body[update]));
        await req.patient.save();
        res.status(200).send(req.patient);
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
        const patientId = req.patient._id;
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
        req.patient.tokens = req.patient.tokens.filter((token) =>
        {
            return token.token !== req.token;
        });
        await req.patient.save();
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
        req.patient.tokens = [];
        await req.patient.save();
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
    res.send(req.patient);
});

// assignDoctor Route - assign a doctor to the patient's assigned doctors list using the doctor's email
router.post("/patient/assignDoctor", auth, async (req, res) =>
{
    try
    {
        const doctor = await Doctor.findOne({ email: req.body.email });
        if (!doctor)
        {
            return res.status(404).send({ error: "Doctor not found" });
        }

        const doctorId = doctor._id;
        const doctorName = doctor.name;
        const doctorEmail = doctor.email;

        // Check if the doctor is already assigned
        const isAlreadyAssigned = req.patient.assignedDoctors.some(
            (assignedDoc) => assignedDoc.doctor.toString() === doctorId.toString()
        );

        if (isAlreadyAssigned)
        {
            return res.status(400).send({ error: "Doctor already assigned" });
        }

        req.patient.assignedDoctors = req.patient.assignedDoctors.concat({ doctor: doctorId, name: doctorName, email: doctorEmail, });
        await req.patient.save();

        res.status(201).send({ message: "Doctor assigned successfully" });
    }
    catch (error)
    {
        // console.error("Doctor assignment error:", error);
        res.status(400).send({ error: "Doctor assignment failed" });
    }
});

// removeDoctor Route - remove a doctor from the patient's assigned doctors list using the doctor's email
router.delete("/patient/removeDoctor", auth, async (req, res) =>
{
    try
    {
        const doctor = await Doctor.findOne({ email: req.body.email });
        if (!doctor)
        {
            return res.status(404).send({ error: "Doctor not found" });
        }

        const doctorId = doctor._id;

        // Check if the doctor is already assigned
        const isAssigned = req.patient.assignedDoctors.some(
            (assignedDoc) => assignedDoc.doctor.toString() === doctorId.toString()
        );

        if (!isAssigned)
        {
            return res.status(400).send({ error: "Doctor not assigned" });
        }

        req.patient.assignedDoctors = req.patient.assignedDoctors.filter(
            (assignedDoc) => assignedDoc.doctor.toString() !== doctorId.toString()
        );
        await req.patient.save();

        res.status(200).send({ message: "Doctor removed successfully" });
    }
    catch (error)
    {
        // console.error("Doctor removal error:", error);
        res.status(400).send({ error: "Doctor removal failed" });
    }
});

// post?

// viewDiagnosisAndMed()
router.get("/patient/:id", async (req, res) => { });

module.exports = router;
