const express = require('express');
const Patient = require('../models/patient');
// const auth = require('../middleware/auth');
const router = new express.Router();

// createAccount()        -   completed
// readAccount()          -   completed - change it ti read by id
// updateAccount()        -   INCOMPLETE
// logging out()          -   INCOMPLETE
// logout-all()           -   INCOMPLETE
// deleteAccount()        -   completed
// chooseDoctor()         -   INCOMPLETE
// viewDiagnosisAndMed() -    INCOMPLETE

// createAccount() - Create a new patient
router.post("/patient", async (req, res) =>
{
  try
  {
    const { name, email, password, DOB, gender } = req.body;

    if (!name || !email || !password || !DOB || !gender)
    {
      return res
        .status(400)
        .send({ error: "Name, email, password, DOB and gender are required" });
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

});


// Logout() - Logout a patient from a single device
router.post("/patient/logout", async (req, res) =>
{

});



// logout-all() - Logout a patient from all devices
router.post("/patient/logoutall", async (req, res) =>
{

});



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
  } catch (e)
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
