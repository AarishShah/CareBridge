const express = require("express");
const path = require("path");
const { randomUUID } = require("crypto");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const auth = require("../middleware/auth");
const router = express.Router();
const { assignDoctor, removeDoctor } = require("../utils/assignment");
const s3 = require("../utils/s3Client");

require('dotenv').config({path: path.join(__dirname, '../.env')});

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
// Delete Route
// Logout Route
// Logout All Route
// Read Route
// Create patient's medical history
// Read patient's medical history (this is common to both patient and doctor)

// Incomplete:
// add doctor to patient's assignedDoctors array
// remove doctor from patient's assignedDoctors array

// when a doctor is assigned himself/herself to a patient, the patient should get a notification which when accepted, the doctor is added to the patient's assignedDoctors array

// Sign Up Route
router.post("/doctor/signup", async (req, res) =>
{
  try
  {
    const { name, email, password, gender, specialization, yearsOfExperience, qualifications } = req.body;

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

    const newDoctor = await Doctor.create({ name, email, password, profileKey: key,bucket: process.env.BUCKET_NAME, region: process.env.REGION, gender, specialization,yearsOfExperience, qualifications });

    const token = await newDoctor.generateAuthToken();

    res.status(201).send({ newDoctor, token, uploadUrl });
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

    const { bucket, profileKey } = doctor;
    const profileUrl = await getProfileUrl(bucket, profileKey);

    const token = await doctor.generateAuthToken();

    res.status(200).send({ doctor, profileUrl, token });
  } catch (error)
  {
    console.error("Login error:", error);
    res.status(400).send({ error: "Login failed" });
  }
});

// Update Route
router.patch("/doctor/me", auth, async (req, res) =>
{
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'gender', 'specialization', 'yearsOfExperience', 'qualifications'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  const ext = req.query.fileType.split(".")[1];
  const key = `profile/${randomUUID()}.${ext}`;
  
  if (!isValidOperation)
  {
    return res.status(404).send({ error: 'Invalid updates!' });
  }

  const putObjectCommands =
    {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        ContentType: "image/jpeg",
    };

    const command = new PutObjectCommand(putObjectCommands);
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

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
  res.send(req.user);
});

// assignDoctor Route
router.post("/doctor/assignDoctor", auth, async (req, res) =>
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

    const result = await assignDoctor(patient._id, doctorId);
    if (result.error)
    {
      return res.status(400).send({ error: result.message });
    }

    res.status(201).send({ message: "Doctor assigned successfully" });
  }
  catch (error)
  {
    // console.error("Assign doctor error:", error);
    res.status(500).send({ error: "Doctor assignment failed" });
  }
});

// removeDoctor Route
router.delete("/doctor/removeDoctor", auth, async (req, res) =>
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

    const result = await removeDoctor(patient._id, doctorId);
    if (result.error)
    {
      return res.status(400).send({ error: result.message });
    }

    res.status(200).send({ message: "Doctor removed successfully" });
  }
  catch (error)
  {
    // console.error("Remove doctor error:", error);
    res.status(400).send({ error: "Doctor removal failed" });
  }
});

module.exports = router;
