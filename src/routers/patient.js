const express = require("express");
const Patient = require("../models/patient");
// const auth = require('../middleware/auth');
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



// createAccount() - Create a new patient
// router.post("/patient/signup", async (req, res) =>
// {
//   try
//   {
//     const { name, email, password, DOB, gender } = req.body;

//     if (!name || !email || !password || !DOB || !gender)
//     {
//       return res
//         .status(400)
//         .send({ error: "Name, email, password, DOB and gender are required" });
//     }

//     // Implement logic to create a new patient in the database
//     const newPatient = await Patient.create({
//       name,
//       email,
//       password,
//       DOB,
//       gender,
//     });

//     req.session.isLoggedIn = true;
//     req.session.patient = newPatient;
//     res.status(201).send({ newPatient });
//   } catch (e)
//   {
//     console.error("Create error:", e);
//     res.status(500).send({ statusCode: 500, message: "Create failed" });
//   }
// });

// ```````````````````````````````````````````
// Create a new doctor
router.post('/patient/signup', async (req, res) =>
{
    try
    {
        console.log('Received POST request to /doctors');
        const { name, email, password, DOB, gender } = req.body;

        if (!name || !email || !password || !DOB || !gender)
        {
            return res.status(400).send({ error: 'Name, email, password, dob, gender are required' });
        }

        const newPatient = await Patient.create({ name, email, password, DOB, gender});

        res.status(201).send({ newPatient });
    } catch (e)
    {
        console.error('Create error:', e);
        res.status(500).send({ error: 'Create failed' });
    }
});
// `````````````````````````````````````````

// readAccount() - Read all patients
router.get("/patient/:id", async (req, res) =>
{
  if (!req.session.isLoggedIn)
  {
    return res.status(401).send({
      statusCode: 401,
      status: "Unauthorized",
      message: "You must be logged-in",
    });
  }

  const patient = await Patient.findById(req.params.id);

  if (!patient)
    res.send({
      statusCode: 404,
      status: "Not Found",
      messgae: "No records found",
    });

  res.status(201).send({ statusCode: 201, status: "Created", data: patient });
});

// updateAccount() - Update a patient by ID
router.patch("/patient/:id", async (req, res) =>
{
  if (!req.session.isLoggedIn)
  {
    return res.status(401).send({
      statusCode: 401,
      status: "Unauthorized",
      message: "You must be logged-in",
    });
  }

  const patient = await Patient.findById(req.params.id);

  // we wont need this because we would have already checked for the patient's existence in the auth middleware
  if (!patient)
  {
    return res.status(404).send({
      statusCode: 404,
      status: "Not Found",
      message: "Patient with that id doesn't exist",
    });
  }

  if (req.body.age || req.body.DOB)
  {
    return res.status(400).send({
      statusCode: 400,
      status: "Bad Request",
      message: "Can't update age or DOB",
    });
  }

  // incomplete - fix it as per the items that user mentions and not all the items
  await patient.updateOne({
    name: req.body.name,
    gender: req.body.gender,
    email: req.body.email,
    password: req.body.password,
  });

  return res.status(200).send({
    statusCode: 200,
    status: "Success",
    message: "Resouce update successful",
    data: patient,
  });
});

// Login() - Login a patient from a single device

router.post('/patient/login', async (req, res) =>
{
    try
    {
        const { email, password } = req.body;

        if (!email || !password)
        {
            return res.status(400).send({ error: 'Email and password are required' });
        }

        const user1 = await Patient.findByCredentials(email, password);

        if (!user1)
        {
            return res.status(400).send({ error: 'Login failed. Invalid email or password' });
        }

        // Set the user in the session
        req.session.user = {
            _id: user1._id,
            email: user1.email,
            // Add any other relevant user data you want to store in the session
        };

        res.send({ user1 });
    } catch (e)
    {
        console.error('Login error:', e);
        res.status(400).send({ error: 'Login failed' });
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
