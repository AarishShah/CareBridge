const jwt = require("jsonwebtoken");
const Patient = require('../models/patient');

const auth = async (req, res, next) =>
{
  try
  {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismynewcourse");

    const patient = await Patient.findOne({ _id: decoded._id, "tokens.token": token, });

    if (!patient)
    {
      throw new Error();
    }

    req.token = token; // for logging out, we want user to logout from only one device and not all devices
    req.patient = patient;
    next();
  }
  catch (e) { res.status(401).send({ error: "Please authenticate." }); }
};

module.exports = auth;
