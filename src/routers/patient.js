const express = require('express');
const Patient = require('../models/patient');
const auth = require('../middleware/auth');
const router = new express.Router();

// createAccount() @humma-irshad

// Create a new patient
patientRouter.post("/patient", async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    if (!name || !email || !password || !age || !gender) {
      return res
        .status(400)
        .send({ error: "Name, email, password, age and gender are required" });
    }

    // Implement logic to create a new patient in the database
    const newPatient = await Patient.create({
      name,
      email,
      password,
      age,
      gender,
    });

    res.status(201).send({ newPatient });
  } catch (e) {
    console.error("Create error:", e);
    res.status(500).send({ statusCode: 500, messgae: "Create failed" });
  }
});

// readAccount() @humma-irshad - @KhushbooHamid
patientRouter.get("/patient", async (_, res) => {
  const patients = await Patient.find();

  if (!patients)
    res.send({
      statusCode: 404,
      status: "Not Found",
      messgae: "No records found",
    });

  res.status(200).send({ statusCode: 200, status: "OK", data: patients });
});

// updateAccount()

// logging out()
// logout-all()

// deleteAccount() @KhushbooHamid

// Delete a patient by ID
patientRouter.delete("/patient/:id", async (req, res) => {
  try {
    const patientId = req.params.id;

    const deletedpatient = await Patient.findByIdAndDelete(patientId);

    if (!deletedpatient) {
      return res.status(404).send({ error: "patient not found" });
    }

    // when deleting a resource only a status code of 204 is sent
    res.status(204);
  } catch (e) {
    console.error("Delete error:", e);
    res.status(500).send({ error: "Delete failed" });
  }
});

// chooseDoctor()
// viewDiagnosisAndMed()
module.exports = patientRouter;
