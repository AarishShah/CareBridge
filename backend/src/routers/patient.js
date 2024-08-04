// Requiring necessary npm packages
const express = require("express");
const router = new express.Router();
const path = require("path");
const bcrypt = require('bcrypt');
const passport = require("passport");
const nodemailer = require('nodemailer');
const { randomUUID } = require("crypto");
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Models
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Notification = require('../models/notification');

// Middleware
const auth = require("../middleware/auth");
require("../middleware/passport");

// Utils
const { assignDoctorRequest, removeDoctor, handlePatientResponse, cancelOutgoingRequest } = require('../utils/assignment');
const s3 = require("../utils/s3Client");


// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const getProfileUrl = async (bucket, profileKey) =>
{
    if (!bucket || !profileKey) return "";
    const command = new GetObjectCommand({ Bucket: bucket, Key: profileKey });
    return await getSignedUrl(s3, command, { expiresIn: 4000 });
};

const getUploadProfileUrl = async (fileType) =>
{
    let key;
    if (fileType)
    {
        const ext = fileType.split(".")[1];
        key = `profile/${randomUUID()}.${ext}`;
    }

    let uploadUrl = "";
    if (key)
    {
        const putObjectCommands =
        {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            ContentType: "image/jpeg",
        };
        const command = new PutObjectCommand(putObjectCommands);

        uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    }

    return { key, uploadUrl };
}

// ---------------- 1. Google authentication routes ----------------

// 1. Redirect to Google for authentication
router.get('/patient/auth/google', passport.authenticate('google-patient', { scope: ['profile', 'email'] }));

// 2. Google callback URL
router.get(
  "/patient/auth/google/callback",
  passport.authenticate("google-patient", {
    failureRedirect: "/patient/auth/google",
  }),
  async (req, res) => {
    const user = req.user;
    // console.log(user);

    if (!user) {
      return res.redirect("/patient/auth/google");
    }
    try {
      const existingUser = await Patient.findOne({ email: user.email });

      if (existingUser) {
        if (!existingUser.isGoogleSignUp) {
          existingUser.isGoogleSignUp = true;
          existingUser.googleId = user.googleId;
          await existingUser.save();
        }

        const token = await existingUser.generateAuthToken();
        return res.redirect(
          `${process.env.FRONTEND_URL}/patient/dashboard?token=${token}&role=patient`
        );
      } else {
        req.session.tempUser = user;
        return res.redirect(
          `${process.env.FRONTEND_URL}/patient/complete-profile`
        );
      }
    } catch (error) {
    //   console.error("Google authentication error:", error);
      return res.redirect("/patient/auth/google");
    }
  }
);

// 3. Complete Profile Route
router.post("/patient/complete-profile", async (req, res) =>
{
    try
    {
        const tempUser = req.session.tempUser;
        const { DOB, gender, maritalStatus, occupation, address } = req.body;

        const missingFields = [];
        if (!DOB) missingFields.push("date of birth (DOB)");
        if (!gender) missingFields.push("gender");
        if (!maritalStatus) missingFields.push("maritalStatus");
        if (!occupation) missingFields.push("occupation");
        if (!address) missingFields.push("address");

        if (missingFields.length > 0)
        {
            return res.status(400).send({ error: `The following field(s) are required and missing: ${missingFields.join(", ")}. Please ensure all fields are filled out correctly.`, });
        }

        const newPatient = await Patient.create(
            {
                name: tempUser.name,
                email: tempUser.email,
                isGoogleSignUp: tempUser.isGoogleSignUp,
                googleId: tempUser.googleId,
                DOB, gender, maritalStatus, occupation, address
            });
        const token = await newPatient.generateAuthToken();
        delete req.session.tempUser;

        res.status(201).send({ newPatient, token });
    } catch (e)
    {
        // console.error("Signup error:", e);
        // console.log(req.body);
        res.status(500).send({ error: "Failed to create a new user." });
    }
});

// ---------------- 1. CRUD operations for doctors ----------------

// 1. Sign Up Route
router.post("/patient/signup", async (req, res) =>
{
    try
    {
        const { key, uploadUrl } = await getUploadProfileUrl(req.query.fileType);

        const { name, email, password, DOB, gender, maritalStatus, occupation, address } = req.body;

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

        const newPatient = await Patient.create({ name, email, password, profileKey: key, bucket: process.env.BUCKET_NAME, region: process.env.REGION, DOB, gender, maritalStatus, occupation, address });

        const token = await newPatient.generateAuthToken();

        res.status(201).send({ newPatient, token, uploadUrl });
    } catch (e)
    {
        // Check for duplicate key error
        if (e.code === 11000 && e.keyPattern.email)
        {
            return res.status(400).send({ error: `The email '${e.keyValue.email}' is already in use. Please use a different email.` });
        }
        // console.error("Signup error:", e);
        res.status(500).send({ error: "Failed to create a new user." });
    }
});

// 2. Login Route
router.post("/patient/login", async (req, res) =>
{
    try
    {
        const patient = await Patient.findByCredentials(req.body.email, req.body.password);

         // Check if 2FA is enabled
         if (patient.twoFactorSecret) {
            // Return a flag indicating that 2FA is required
            return res.status(200).send({ twoFactorRequired: true, patientId: patient._id });
        }

        const token = await patient.generateAuthToken();

        res.status(202).send({ patient, token });

    }
    catch (error)
    {
        console.error("Patient Login error:", error);
        res.status(400).send({ error: "Login failed" });
    }
});

// 3. Update Route
router.patch("/patient/me", auth, async (req, res) =>
{
    const { key, uploadUrl } = await getUploadProfileUrl(req.query.fileType);

    const updates = Object.keys(req.body); // returns the keys of the json object as an array
    const allowedUpdates = ["name", "email", "password", "gender", "maritalStatus", "occupation", "address",];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation)
    {
        return res.status(404).send({ error: "Invalid updates!" });
    }

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

// 4. Delete Route
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

// 5. Logout Route
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

// 6. Logout All Route - Logout a patient from all devices
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

// 7. Read Patient Route
router.get("/patient/me", auth, async (req, res) =>
{
    try
    {
        const patient = await Patient.findById(req.user._id)

        const { bucket, profileKey } = patient;

    // if (!bucket) throw new Error();

        const profileUrl = await getProfileUrl(bucket, profileKey);

        res.send({ patient, profileUrl });
    } catch (error)
    {
        res.status(500).send({ error: "Failed to fetch doctor details" });
    }
});

// ---------------- 2. Patient-Doctor Connection Routes ----------------

// 1. Connect to Doctor - Patient requests to connect to a doctor by email
router.post("/patient/requestDoctor", auth, async (req, res) =>
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

        const result = await assignDoctorRequest(patientId, doctor._id);
        if (result.error)
        {
            return res.status(400).send(result.message);
        }

        res.status(201).send({ message: result.message });
    }
    catch (error)
    {
        res.status(400).send({ error: "Doctor assignment request failed" });
    }
});

// 2. Connection Request - Patient handles the response to a connection request
router.patch('/patient/responseRequest/:id', auth, async (req, res) =>
{
    try
    {
        const action = req.body.action; // 'accept' or 'reject'
        const result = await handlePatientResponse(req.params.id, action);
        if (result.error)
        {
            return res.status(400).send(result.message);
        }

        res.status(200).send({ message: result.message });
    }
    catch (error)
    {
        console.error("Handling request error:", error);
        res.status(400).send({ error: 'Handling request failed' });
    }
});

// 3. Outgoing requests - Get all pending requests sent by the patient
router.get('/patient/sentRequests', auth, async (req, res) =>
{
    try
    {
        const patientId = req.user._id;
        const notifications = await Notification.find({ patient: patientId, status: 'pending', createdBy: 'patient' }).populate('doctor', 'name email');
        res.send(notifications);
    }
    catch (error)
    {
        res.status(500).send({ error: 'Fetching sent requests failed' });
    }
});

// 4. Incoming requests - Get all pending requests received by the patient
router.get('/patient/receivedRequests', auth, async (req, res) =>
{
    try
    {
        const patientId = req.user._id;
        const notifications = await Notification.find({ patient: patientId, status: 'pending', createdBy: 'doctor' }).populate('doctor', 'name email');
        res.send(notifications);
    }
    catch (error)
    {
        res.status(500).send({ error: 'Fetching received requests failed' });
    }
});

// 5. Remove Doctor - Patient removes a connection with a doctor by email
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
        res.status(400).send({ error: "Removing doctor failed" });
    }
});

// 6. Cancel Request - Cancel an outgoing request sent by the patient
router.delete('/patient/cancelRequest/:id', auth, async (req, res) =>
{
    try
    {
        const result = await cancelOutgoingRequest(req.params.id, req.user._id, 'patient');
        if (result.error)
        {
            return res.status(404).send(result.message);
        }

        res.status(200).send({ message: result.message });
    }
    catch (error)
    {
        res.status(500).send({ error: 'Canceling request failed' });
    }
});

// ---------------- 3. Two Factor Authentication Routes ----------------

// 1. Get QR Code - Route to generate a QR code for 2FA
router.get('/patient/qrCode',auth, async (req, res) => {
    try {
        const patientId = req.user._id; // Assuming you have middleware to get the authenticated user's ID
        const secret = speakeasy.generateSecret({ length: 20 });
        
        // Update the existing patient document with the new secret
        const patient = await Patient.findByIdAndUpdate(patientId, { twoFactorSecret: JSON.stringify(secret) }, { new: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        qrcode.toDataURL(secret.otpauth_url, (err, data) => {
            if (err) {
                // console.error('Error generating QR code:', err);
                return res.status(500).json({ message: 'Error generating QR code' });
            }
            res.json({ qrCode: data });
        });
    } catch (error) {
        // console.error('Error storing secret:', error);
        res.status(500).json({ message: 'Error storing secret' });
    }
});

// 2. Verify QR Code - To Enable 2FA for doctors
router.post('/patient/verifyqrCode',auth, async (req, res) => {
    try {
        const { code } = req.body;
        const patientId = req.user._id; // Assuming you have middleware to get the authenticated user's ID
        
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const token = JSON.parse(patient.twoFactorSecret);
        const verify = speakeasy.totp.verify({
            secret: token.base32,
            encoding: 'base32',
            token: code
        });

        res.json({ verify });
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ message: 'Error verifying code' });
    }
});

// 3. Verify 2FA Code - Route to verify the 2FA (OTP) code during login
router.post('/patient/verify2FA', async (req, res) => {

    try {
        const { patientId, code } = req.body;
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const token = JSON.parse(patient.twoFactorSecret);
        const verify = speakeasy.totp.verify({
            secret: token.base32,
            encoding: 'base32',
            token: code
        });

        if (verify) {
            const authToken = await patient.generateAuthToken();
            return res.status(200).json({ patient, token: authToken });
        } else {
            console.error('Invalid 2FA code');
            return res.status(400).json({ error: 'Invalid 2FA code' });
        }
    } catch (error) {
        console.error("Patient 2FA verification error:", error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// 4. Disable 2FA - Route to remove 2FA secret for patients
router.post('/patient/remove2FA', auth, async (req, res) => {
    try {
        const patientId = req.user._id; // Assuming you have middleware to get the authenticated user's ID
        
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        await Patient.updateOne({ _id: patientId }, { $unset: { twoFactorSecret: "" } });

        res.status(200).json({ message: '2FA disabled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to disable 2FA', error: error.message });
    }
});

// ---------------- 4. Forgot and Reset Password Routes ----------------

// 1. Forgot password - send email to patient with reset link
router.post('/patient/forgot-password', (req, res) => {
    const { email } = req.body;

    Patient.findOne({email: email})
    .then(user => {
        if(!user) {
            return res.send({Status: "User does not exist"})
        }


        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your password',
            text: `${process.env.FRONTEND_URL}/patient/reset-password/${user._id}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            //   console.log(error);
                return res.send({Status: "Error"})
            } else {
              return res.send({Status: "Success"})
            }
          });
    })
})

// 2. Reset password - route to update password 
router.post('/patient/reset-password/:id/:token', (req, res) => {
    // install bcrypt, nodemailer
    const {id, token} = req.params
    const {password} = req.body

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            // console.error('Error with token verification:', err);
            return res.status(400).json({ Status: "Error with token" });
            
        } else {
            bcrypt.hash(password, 10)
                .then(hash => {
                    return Patient.findByIdAndUpdate(id, { password: hash });
                })
                .then(u => res.json({ Status: "Success" }))
                .catch(err => res.status(500).json({ Status: err.message }));
        }
    })
})

module.exports = router;