const express = require("express");
const Doctor = require("../models/doctor");
const auth = require("../middleware/doctor");
const router = express.Router();

/*
completed:

createDoctor()
getDoctorById()
deleteDoctorById()
loginDoctor()
logoutDoctor()

tested with postman and working
*/

/*
incomplete:

updateDoctor() 
viewPatientHistory()
provideDiagnosisAndMed()
*/

// Sign Up Route
router.post("/doctor/signup", async (req, res) =>
{
  try
  {
    const { name, email, password, gender, specialization, yearsOfExperience, qualifications } = req.body;

    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!gender) missingFields.push('gender');
    if (!specialization) missingFields.push('specialization');
    if (!yearsOfExperience) missingFields.push('years of experience');
    if (!qualifications) missingFields.push('qualifications');

    if (missingFields.length > 0)
    {
      return res.status(400).send({ error: `The following field(s) are required and missing: ${missingFields.join(', ')}. Please ensure all fields are filled out correctly.` });
    }

    const newDoctor = await Doctor.create({ name, email, password, gender, specialization, yearsOfExperience, qualifications });
    const token = await newDoctor.generateAuthToken();

    res.status(201).send({ newDoctor, token });
  } catch (e)
  {
    // console.error("Create error:", e);
    res.status(500).send({ error: "Create failed" });
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
    // console.error("Login error:", error);
    res.status(400).send({ error: "Login failed" });
  }
});

// Update Route
router.patch("/doctor/:id", auth, async (req, res) =>
{
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'gender', 'specialization', 'yearsOfExperience', 'qualifications'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation)
  {
    return res.status(404).send({ error: 'Invalid updates!' });
  }

  try
  {
    updates.forEach((update) => req.doctor[update] = req.body[update]);
    await req.doctor.save();
    res.send(req.doctor);
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
    const doctorId = req.doctor._id;
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
    req.doctor.tokens = req.doctor.tokens.filter((token) => { return token.token !== req.token; });
    await req.doctor.save();
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
    req.doctor.tokens = [];
    await req.doctor.save();
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
  res.send(req.doctor);
});

router.get("/doctors/viewPatientHistory", async (req, res) => { });

router.post("/doctors/provideDiagnosisAndMed", async (req, res) => { });

module.exports = router;
