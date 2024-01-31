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

// Delete a doctor by ID
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

// Retrieve a doctor by ID
router.get("/doctors/:id", async (req, res) =>
{
  try
  {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor)
    {
      return res.status(404).send({ error: "Doctor not found" });
    }

    res.send({ doctor });
  } catch (e)
  {
    console.error("Retrieve error:", e);
    res.status(500).send({ error: "Retrieve failed" });
  }
});

// Doctor logout
router.post("/doctors/logout", async (req, res) =>
{
  try
  {
    // Check if the session exists
    if (req.session)
    {
      const user = req.session.user;

      if (!user)
      {
        return res.status(401).send({ error: "User not authenticated" });
      }

      // Clear the session data
      req.session.destroy((err) =>
      {
        if (err)
        {
          console.error(err);
          res.status(500).send({ error: "Logout failed" });
        } else
        {
          res.send("logout successfull");
        }
      });
    } else
    {
      return res.status(401).send({ error: "User not authenticated" });
    }
  } catch (e)
  {
    console.error(e);
    res.status(500).send({ error: "Logout failed" });
  }
});

router.get("/doctors/viewPatientHistory", async (req, res) => { });

router.post("/doctors/provideDiagnosisAndMed", async (req, res) => { });

module.exports = router;
