const express = require("express");
const Patient = require("../models/patient");
const auth = require("../middleware/patient");
const router = new express.Router();

// completed:

// Sign Up Route
// Login Route
// Update Route
// Delete Route // make sure to delete all prescriptions and medical records associated with the patient
// Logout Route
// Logout All Route
// Read Patient Route

// incomplete:

// chooseDoctor() - @AarishShah
// viewDiagnosisAndMed() - @AarishShah

// Sign Up Route
router.post("/patient/signup", async (req, res) =>
{
  try
  {
    const { name, address, email, password, DOB, gender } = req.body;

    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!address) missingFields.push('address');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!DOB) missingFields.push('date of birth (DOB)');
    if (!gender) missingFields.push('gender');

    if (missingFields.length > 0)
    {
      return res.status(400).send({ error: `The following field(s) are required and missing: ${missingFields.join(', ')}. Please ensure all fields are filled out correctly.` });
    }

    const newPatient = await Patient.create({ name, address, email, password, DOB, gender });
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
  } catch (error)
  {
    // console.error("Login error:", error);
    res.status(400).send({ error: "Login failed" });
  }
});

// Update Route
router.patch("/patient/:id", auth, async (req, res) =>
{
  const updates = Object.keys(req.body); // returns the keys of the json object as an array
  const allowedUpdates = ['name', 'address', 'email', 'password', 'gender'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation)
  {
    return res.status(404).send({ error: 'Invalid updates!' });
  }

  try
  {
    updates.forEach((update) => req.patient[update] = req.body[update]);
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
    res.send({message: 'Account deleted successfully.'});
  } catch (error)
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
    req.patient.tokens = req.patient.tokens.filter((token) => { return token.token !== req.token; });
    await req.patient.save();
    res.send({ message: "Logout successful" });
  }

  catch (e)
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

// chooseDoctor()
// post?

// viewDiagnosisAndMed()
router.get("/patient/:id", async (req, res) => { });

module.exports = router;
