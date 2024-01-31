const express = require("express");
const Patient = require("../models/patient");
const auth = require("../middleware/auth");
const router = new express.Router();

// completed:

// createAccount() - Completed
// readAccount() - Completed
// Logging in() - Completed
// logging out() - Completed
// deleteAccount() - Completed
// updateAccount() - Completed

// incomplete:

// logout-all() - @KhushbooHamid
// chooseDoctor() - @AarishShah
// viewDiagnosisAndMed() - @AarishShah

// ```````````````````````````````````````````
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

    const newPatient = await Patient.create({ name, address, email, password, DOB, gender, });
    const token = await newPatient.generateAuthToken();

    res.status(201).send({ newPatient, token });
  } catch (e)
  {
    // console.error("Signup error:", e);
    res.status(500).send({ error: "Failed to create a new user." });
  }
});
// `````````````````````````````````````````

// Login Route
router.get("/patient/login", async (req, res) =>
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

// updateAccount() - Update a patient by ID
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
    const patient = await Patient.findByIdAndDelete(req.patient._id);
    // make sure to delete all prescriptions and medical records associated with the patient
    res.send(patient);
  } catch (error)
  {
    // console.error("Delete error:", error);
    res.status(500).send({ error: "Delete failed" });
  }
});

// Login() - Login a patient from a single device

router.post("/patient/login", async (req, res) =>
{
  try
  {
    const { email, password } = req.body;

    if (!email || !password)
    {
      return res.status(400).send({ error: "Email and password are required" });
    }

    const patient = await Patient.findByCredentials(email, password);

    if (!patient)
    {
      return res
        .status(400)
        .send({ error: "Login failed. Invalid email or password" });
    }

    req.session.isLoggedIn = true;
    req.session.patient = patient;

    res.send({ patient });
  } catch (e)
  {
    console.error("Login error:", e);
    res.status(400).send({ error: "Login failed" });
  }
});

// Logout() - Logout a patient from a single device
router.post("/patient/logout", async (req, res) =>
{
  req.session.destroy((error) =>
  {
    console.log(error);
  });

  return res.send(204);
});

// logout-all() - Logout a patient from all devices
router.post("/patient/logoutall", async (req, res) => { });

// deleteAccount() - Delete a patient by ID
router.delete("/patient/:id", async (req, res) =>
{
  try
  {
    if (!req.session.isLoggedIn)
    {
      return res.status(401).send({
        statusCode: 401,
        status: "Unauthorized",
        message: "You must be logged-in",
      });
    }

    const patientId = req.params.id;

    const deletedpatient = await Patient.findByIdAndDelete(patientId);

    if (!deletedpatient)
    {
      return res
        .status(404)
        .send({ statusCode: 404, message: "patient not found" });
    }

    req.session.destroy();
    // when deleting a resource only a status code of 204 is sent
    res.status(204);
  } catch (e)
  {
    console.error("Delete error:", e);
    res.status(500).send({ message: "Delete failed" });
  }
});

// chooseDoctor()
// post?

// viewDiagnosisAndMed()
router.get("/patient/:id", async (req, res) => { });

module.exports = router;
