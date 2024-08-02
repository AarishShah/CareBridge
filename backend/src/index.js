const express = require("express");
const cors = require("cors");
const session = require("express-session");

require("./db/mongoose");
require("../src/utils/cleanup-token");

// const adminRouter = require("./routers/admin");
const patientRouter = require("./routers/patient");
const doctorRouter = require("./routers/doctor");
const medicalHistoryRouter = require("./routers/medicalHistory");
const medicalFileRouter = require("./routers/medicalFile");
const prescriptionRouter = require("./routers/prescription");

const app = express();

const port = process.env.PORT || 5000;

// Apply CORS with specific options only once
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL], // Frontend origin
  credentials: true, // To handle cookies and authentication
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed custom headers
}));

// Setup session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Parse JSON bodies
app.use(express.json());

// app.use(adminRouter); // to register admin router
app.use(patientRouter);
app.use(doctorRouter);
app.use(medicalHistoryRouter);
app.use(medicalFileRouter);
app.use(prescriptionRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
