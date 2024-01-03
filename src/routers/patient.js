const express = require("express");
const Patient = require("../models/patient");
// const auth = require('../middleware/auth');
const router = new express.Router();

// createAccount()        -   completed
// readAccount()          -   completed - change it to read by id
// updateAccount()        -   completed - add auth middleware
// logging out()          -   INCOMPLETE - @KhushbooHamid
// logout-all()           -   INCOMPLETE - @KhushbooHamid
// deleteAccount()        -   completed
// chooseDoctor()         -   INCOMPLETE - Aarish
// viewDiagnosisAndMed() -    INCOMPLETE - Aarish

// createAccount() - Create a new patient
router.post("/patient", async (req, res) =>
{
  try
  {
    const { name, email, password, DOB, gender } = req.body;

    if (!name || !email || !password || !DOB || !gender)
    {
      return res.status(400).send({ error: "Name, email, password, DOB and gender are required" });
    }

    // Implement logic to create a new patient in the database
    const newPatient = await Patient.create({ name, email, password, DOB, gender, });
    res.status(201).send({ newPatient });
  }
  catch (e)
  {
    console.error("Create error:", e);
    res.status(500).send({ statusCode: 500, messgae: "Create failed" });
  }
});

// readAccount() - Read all patients
router.get("/patient", async (_, res) =>
{
  const patient = await Patient.find();

  if (!patient)
    res.send({ statusCode: 404, status: "Not Found", messgae: "No records found", });

  res.status(200).send({ statusCode: 200, status: "OK", data: patient });
});

// updateAccount() - Update a patient by ID
router.patch("/patient/:id", async (req, res) =>
{
  const patient = await Patient.findById(req.params.id);

  // we wont need this because we would have already checked for the patient's existence in the auth middleware
  if (!patient)
  {
    return res.send({ statusCode: 404, status: "Not Found", error: "Patient with that id doesn't exist", });
  }

  if (req.body.age || req.body.DOB)
  {
    return res.send({ statusCode: 400, status: "Bad Request", error: "Can't update age or DOB", });
  }

  await patient.updateOne(
    {
      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      password: req.body.password,
    });

  return res.status(200).send({ statusCode: 200, status: "Success", message: "Resouce update successful", data: patient, });
});

// Logout() - Logout a patient from a single device
router.post("/patient/logout", async (req, res) => { });

// logout-all() - Logout a patient from all devices
router.post("/patient/logoutall", async (req, res) => { });

// deleteAccount() - Delete a patient by ID
router.delete("/patient/:id", async (req, res) =>
{
  try
  {
    const patientId = req.params.id;

    const deletedpatient = await Patient.findByIdAndDelete(patientId);

    if (!deletedpatient)
    {
      return res.status(404).send({ error: "patient not found" });
    }

    // when deleting a resource only a status code of 204 is sent
    res.status(204);
  }
  catch (e)
  {
    console.error("Delete error:", e);
    res.status(500).send({ error: "Delete failed" });
  }
});

// chooseDoctor()
// post?

// viewDiagnosisAndMed()
router.get("/patient/:id", async (req, res) => 
{

});

module.exports = router;
