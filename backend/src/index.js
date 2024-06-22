// D:\InstalledSoftwares\mongodb\mongodb\bin\mongod.exe --dbpath=D:\InstalledSoftwares\mongodb\mongodb-data
// C:\'Program Files'\MongoDB\Server\7.0\bin\mongod.exe --dbpath C:\khushi\mongodb-data

const express = require("express");
const cors = require("cors");
const session = require("express-session");

require("./db/mongoose");
require("../src/utils/cleanup-token")

// const adminRouter = require("./routers/admin");
const patientRouter = require("./routers/patient");
const doctorRouter = require("./routers/doctor");
const medicalHistoryRouter = require("./routers/medicalHistory");
const medicalFileRouter = require("./routers/medicalFile");

const app = express();

app.use(cors());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

const port = process.env.PORT || 5000;

app.use(express.json());

// app.use(adminRouter); // to register admin router
app.use(patientRouter); // to register patient router
app.use(doctorRouter); // to register doctor router
app.use(medicalHistoryRouter); // to register patient history router
app.use(medicalFileRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});