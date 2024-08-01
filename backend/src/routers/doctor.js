// Requiring necessary npm packages
const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require('bcrypt');
const passport = require("passport");
const nodemailer = require("nodemailer");
const { randomUUID } = require("crypto");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const schedule = require("node-schedule");

// Models
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Notification = require('../models/notification');1

// Middleware
const auth = require("../middleware/auth");
require("../middleware/passport");

// Utils
const { doctorRequestPatient, handleDoctorResponse, removeDoctor, cancelOutgoingRequest } = require('../utils/assignment');
const s3 = require("../utils/s3Client");

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const getProfileUrl = async (bucket, profileKey) =>
{
    if (!bucket || !profileKey) return "";
    const command = new GetObjectCommand(
        {
            Bucket: bucket,
            Key: profileKey,
            ResponseContentType: "image/jpeg",
        });
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
router.get('/doctor/auth/google', passport.authenticate('google-doctor', { scope: ['profile', 'email'] }));

// 2. Google callback URL
router.get('/doctor/auth/google/callback',
    passport.authenticate('google-doctor', { failureRedirect: '/doctor/auth/google' }),
    async (req, res) =>
    {
        const user = req.user;

        if (!user)
        {
            return res.redirect('/doctor/auth/google');
        }

        try
        {
            const existingUser = await Doctor.findOne({ email: user.email });

            // check if user is in db
            if (existingUser)
            {
                // if user is in db but not linked to google account then update the parameters and hence link the account
                if (!existingUser.isGoogleSignUp)
                {
                    existingUser.isGoogleSignUp = true;
                    existingUser.googleId = user.googleId;
                    await existingUser.save();
                }

                // generate token, save it to the session and redirect to dashboard
                const token = await existingUser.generateAuthToken();
                req.session.token = token; //  remove if the below line is working fine
                // res.send({ token }); // test this
                return res.redirect('http://localhost:5173/doctor/dashboard');
            }

            else
            {
                // Temporarily store the user data
                req.session.tempUser = user;
                return res.redirect('http://localhost:5173/doctor/complete-profile');
            }

        } catch (error)
        {
            console.error("Google authentication error:", error);
            return res.redirect('/doctor/auth/google');
        }
    }
);

// 3. Complete Profile Route
router.post("/doctor/complete-profile", async (req, res) =>
{
    try
    {
        const tempUser = req.session.tempUser;
        const { gender, specialization, yearsOfExperience, qualifications } = req.body;

        const missingFields = [];
        if (!gender) missingFields.push("gender");
        if (!specialization) missingFields.push("specialization");
        if (!yearsOfExperience) missingFields.push("years of experience");
        if (!qualifications) missingFields.push("qualifications");

        if (missingFields.length > 0)
        {
            return res.status(400).send({ error: `The following field(s) are required and missing: ${missingFields.join(", ")}. Please ensure all fields are filled out correctly.`, });
        }

        const newDoctor = await Doctor.create(
            {
                name: tempUser.name,
                email: tempUser.email,
                isGoogleSignUp: tempUser.isGoogleSignUp,
                googleId: tempUser.google,
                gender, specialization, yearsOfExperience, qualifications
            });
        const token = await newDoctor.generateAuthToken();
        delete req.session.tempUser;

        res.status(201).send({ newDoctor, token });
    } catch (e)
    {
        // console.error("Signup error:", e);
        // console.log(req.body);
        res.status(500).send({ error: "Failed to create a new user." });
    }
});

// ---------------- 2. CRUD operations for doctors ----------------

// 1. Sign Up Route
router.post("/doctor/signup", async (req, res) =>
{
    try
    {
        const { key, uploadUrl } = await getUploadProfileUrl(req.query.fileType);

        const { name, email, password, gender, specialization, yearsOfExperience, qualifications } = req.body;

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

        const newDoctor = await Doctor.create({ name, email, password, profileKey: key, bucket: process.env.BUCKET_NAME, region: process.env.REGION, gender, specialization, yearsOfExperience, qualifications });

        const token = await newDoctor.generateAuthToken();

        res.status(201).send({ newDoctor, token, uploadUrl });
    } catch (e)
    {
        // console.error("Create error:", e);
        res.status(500).send({ error: "Create failed" });
    }
});

// 2. Login Route
router.post("/doctor/login", async (req, res) =>
{
  try
  {
    const doctor = await Doctor.findByCredentials(req.body.email, req.body.password);

    if (doctor.twoFactorSecret) {
      // Return a flag indicating that 2FA is required
      return res.status(200).send({ twoFactorRequired: true, doctorId: doctor._id });
  }
  
    const token = await doctor.generateAuthToken();

        res.status(202).send({ doctor, token });
    } catch (error)
    {
        // console.error("Login error:", error);
        res.status(400).send({ error: "Login failed" });
    }
});

// 3. Update Route
router.patch("/doctor/me", auth, async (req, res) =>
{
    const { key, uploadUrl } = await getUploadProfileUrl(req.query.fileType);

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'gender', 'specialization', 'yearsOfExperience', 'qualifications'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation)
    {
        return res.status(404).send({ error: 'Invalid updates!' });
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
        res.send({ updatedDoctor: req.user, uploadUrl });
    }
    catch (error)
    {
        // console.error("Update error:", error);
        res.status(400).send({ error: "Update failed" });
    }
});

// 4. Delete Route
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

// 5. Logout Route
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

// 6. Logout All Route - Logout a doctor from all devices
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

// 7. Read Doctor Route
router.get("/doctor/me", auth, async (req, res) =>
{
    try
    {
        // Populate assigned patients in the response
        const doctor = await Doctor.findById(req.user._id);

        const { bucket, profileKey } = doctor;

        // if (!bucket) throw new Error();

        const profileUrl = await getProfileUrl(bucket, profileKey);

        res.send({ doctor, profileUrl });
    } catch (error)
    {
        res.status(500).send({ error: "Failed to fetch doctor details" });
    }
});

// ---------------- 3. Patient-Doctor Connection Routes ----------------

// 1. Connect to Patient - Doctor requests to connect to a patient by email
router.post("/doctor/requestPatient", auth, async (req, res) => 
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

        const result = await doctorRequestPatient(doctorId, patient._id);
        if (result.error)
        {
            return res.status(400).send(result.message);
        }

        res.status(201).send({ message: result.message });
    }
    catch (error)
    {
        res.status(400).send({ error: "Patient connection request failed" });
    }
});
    
// 2. Connection Request - Doctor handles the response to a connection request
router.patch("/doctor/responseRequest/:id", auth, async (req, res) => 
{
    try
    {
        const action = req.body.action; // 'accept' or 'reject'
        const result = await handleDoctorResponse(req.params.id, action);
        if (result.error)
        {
            return res.status(400).send(result.message);
        }

        res.status(200).send({ message: result.message });
    }
    catch (error)
    {
        res.status(400).send({ error: "Handling request failed" });
    }
});
    
// 3. Outgoing requests - Get all pending requests sent by the doctor
router.get('/doctor/sentRequests', auth, async (req, res) =>
{
    try
    {
        const doctorId = req.user._id;
        const notifications = await Notification.find({ doctor: doctorId, status: 'pending', createdBy: 'doctor' }).populate('patient', 'name email');
        res.send(notifications);
    }
    catch (error)
    {
        res.status(500).send({ error: 'Fetching sent requests failed' });
    }
});
        
// 4. Incoming requests - Get all pending requests received by the doctor
router.get('/doctor/receivedRequests', auth, async (req, res) =>
{
    try
    {
        const doctorId = req.user._id;
        const notifications = await Notification.find({ doctor: doctorId, status: 'pending', createdBy: 'patient' }).populate('patient', 'name email');
        res.send(notifications);
    }
    catch (error)
    {
        res.status(500).send({ error: 'Fetching received requests failed' });
    }
});
    
// 5. Remove Patient - Doctor removes a connection with a patient by email
router.delete('/doctor/removePatient', auth, async (req, res) =>
{
    try
    {
        const doctorId = req.user._id;
        const patientEmail = req.body.email;

        const patient = await Patient.findOne({ email: patientEmail });
        if (!patient)
        {
            return res.status(404).send({ error: 'Patient not found' });
        }

        const result = await removeDoctor(patient._id, doctorId);
        if (result.error)
        {
            return res.status(400).send(result.message);
        }

        res.status(200).send({ message: 'Patient removed successfully' });
    }
    catch (error)
    {
        res.status(400).send({ error: 'Removing patient failed' });
    }
});
    
// 6. Cancel Request - Cancel an outgoing request sent by the doctor
router.delete('/doctor/cancelRequest/:id', auth, async (req, res) =>
{
    try
    {
        const result = await cancelOutgoingRequest(req.params.id, req.user._id, 'doctor');
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

// ---------------- 4. Two Factor Authentication Routes ----------------

// 1. Get QR Code - Route to generate a QR code for 2FA
router.get('/doctor/qrCode',auth, async (req, res) => {
  try {
      const doctorId = req.user._id; // Assuming you have middleware to get the authenticated user's ID
      const secret = speakeasy.generateSecret({ length: 20 });
      
      // Update the existing doctor document with the new secret
      const doctor = await Doctor.findByIdAndUpdate(doctorId, { twoFactorSecret: JSON.stringify(secret) }, { new: true });
      if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found' });
      }

      qrcode.toDataURL(secret.otpauth_url, (err, data) => {
          if (err) {
              console.error('Error generating QR code:', err);
              return res.status(500).json({ message: 'Error generating QR code' });
          }
          res.json({ qrCode: data });
      });
  } catch (error) {
      console.error('Error storing secret:', error);
      res.status(500).json({ message: 'Error storing secret' });
  }
});

// 2. Verify QR Code - To Enable 2FA for doctors
router.post('/doctor/verifyqrCode',auth, async (req, res) => {
  try {
      const { code } = req.body;
      const doctorId = req.user._id; // Assuming you have middleware to get the authenticated user's ID
      
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found' });
      }

      const token = JSON.parse(doctor.twoFactorSecret);
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
router.post('/doctor/verify2FA', async (req, res) => {
  console.log("doctor verify2fa route hit");
  try {
      const { doctorId, code } = req.body;
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
          return res.status(404).json({ error: 'Doctor not found' });
      }

      const token = JSON.parse(doctor.twoFactorSecret);
      const verify = speakeasy.totp.verify({
          secret: token.base32,
          encoding: 'base32',
          token: code
      });

      if (verify) {
          const authToken = await doctor.generateAuthToken();
          return res.status(200).json({ doctor, token: authToken });
      } else {
          return res.status(400).json({ error: 'Invalid 2FA code' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
  }
});

// 4. Disable 2FA - Route to remove 2FA secret for doctors
router.post('/doctor/remove2FA', auth, async (req, res) => {
  console.log("remove yourself doc");

  try {
      const doctorId = req.user._id; // Assuming you have middleware to get the authenticated user's ID
      
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found' });
      }

      await Doctor.updateOne({ _id: doctorId }, { $unset: { twoFactorSecret: "" } });

      res.status(200).json({ message: '2FA disabled successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to disable 2FA', error: error.message });
  }
});

// ---------------- 5. Forgot and Reset Password Routes ----------------

// 1. Forgot password - send email to patient with reset link
router.post('/doctor/forgot-password', (req, res) => {
  const { email } = req.body;

  Doctor.findOne({email: email})
  .then(user => {
      if(!user) {
          return res.send({Status: "User does not exist"})
      }

      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'carebridge56@gmail.com',
            pass: 'qwnrzwddfyztxzha'
          }
        });

        const mailOptions = {
          from: 'carebridge56@gmail.com',
          to: email,
          subject: 'Reset your password',
          text: `http://localhost:5173/doctor/reset-password/${user._id}/${token}`
        };
        
        console.log("mailOptions", mailOptions);
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            // console.log(error);
            return res.status(500).send({ Status: "Error sending email" });
          } else {
            return res.send({Status: "Success"})
          }
        });
  })
  .catch(err => res.status(500).send({ Status: "Server error", Error: err.message }));
})

// 2. Reset password - route to update password 
router.post('/doctor/reset-password/:id/:token', (req, res) => {
  // install bcrypt, nodemailer
  const {id, token} = req.params
  const {password} = req.body

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      console.log("res");
      if(err) {
        //   console.error('Error with token verification:', err);
          return res.status(400).json({ Status: "Error with token" });
          
      } else {
          bcrypt.hash(password, 10)
              .then(hash => {
                  return Doctor.findByIdAndUpdate(id, { password: hash });
              })
              .then(u => res.json({ Status: "Success" }))
              .catch(err => res.status(500).json({ Status: err.message }));
      }
  })
})

// ---------------- 6. Routes for sending medicine reminders ----------------

// 1. Send medicine reminder
router.post('/doctor/reminder', auth, (req, res) =>
{
  try
  {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "carebridge56@gmail.com",
        pass: "qwnrzwddfyztxzha",
      },
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    const { to, subject, text, startDate, intervalDays } = req.body;

    if (!to || !subject || !text || !startDate || !intervalDays)
    {
        return res.status(400).send('Missing required fields');
    }

    const startDateObj = new Date(startDate);
    if (isNaN(startDateObj))
    {
        return res.status(400).send('Invalid start date');
    }

    const sendEmail = () =>
      {
        const mailOptions =
        {
          from: 'carebridge56@gmail.com',
          to,
          subject,
          text
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error)
            {
              console.error('Error sending email:', error);
              return;
            } else
            {
              console.log('Email sent:', info.response);
            }
          });
        };

    const scheduleNextEmail = (date) => {
      schedule.scheduleJob(date, () => {
        sendEmail();

        const nextDate = new Date(
          date.getTime() + intervalDays * 24 * 60 * 60 * 1000
        );
        scheduleNextEmail(nextDate);
      });
    };

    scheduleNextEmail(startDateObj);
    res.status(200).send('Email scheduled!');
  } catch (e)
  {
    res.status(500).send("Could not send email")
    console.log(e);
  }
});

module.exports = router;