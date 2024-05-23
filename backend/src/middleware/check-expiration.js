const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");

const checkExpiration = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);

  if (!token) next();

  try {
    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
      res.status(400).json({ error: "Invalid token" });
    }

    // to change secs to millisecs we multiply by 1000
    // as Date.now is in ms
    const expired = decodedToken.exp * 1000 < Date.now();

    if (decodedToken.role === "doctor" && expired) {
      const doctor = await Doctor.findOne({ "tokens.token": token });

      if (doctor) {
        doctor.tokens = doctor.tokens.filter((t) => t.token !== token);
        await doctor.save();
      }
      return res.status(401).json({ error: "Token expired" });
    } else if (decodedToken.role === "patient" && expired) {
      const patient = await Patient.findOne({ "tokens.token": token });

      if (patient) {
        patient.tokens = patient.tokens.filter((t) => t.token !== token);
        await patient.save();
      }
      return res.status(401).json({ error: "Token expired" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }

  next();
};

module.exports = checkExpiration;
