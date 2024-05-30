// D:\InstalledSoftwares\mongodb\mongodb\bin\mongod.exe --dbpath=D:\InstalledSoftwares\mongodb\mongodb-data
// C:\'Program Files'\MongoDB\Server\7.0\bin\mongod.exe --dbpath C:\khushi\mongodb-data

const express = require("express");
const path = require('path');
require("./db/mongoose");
require("../src/utils/cleanup-token")

// const adminRouter = require("./routers/admin");
const patientRouter = require("./routers/patient");
const doctorRouter = require("./routers/doctor");
const medicalHistoryRouter = require("./routers/medicalHistory");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// statically serve profile-pictures folder
const profileDir = path.join(__dirname, "../uploads/profile-pictures");
app.use(express.static(profileDir));

// app.use(adminRouter); // to register admin router
app.use(patientRouter); // to register patient router
app.use(doctorRouter); // to register doctor router
app.use(medicalHistoryRouter); // to register patient history router

app.listen(port, () => {
  console.log("Server is up on port " + port);
});