const jwt = require("jsonwebtoken");
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');

const auth = async (req, res, next) =>
{
    try
    {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "thisismynewcourse");

        let user;

        // Determine the model based on the role in the decoded token
        if (decoded.role === 'doctor')
        {
            user = await Doctor.findOne({ _id: decoded._id, "tokens.token": token });
        } else if (decoded.role === 'patient')
        {
            user = await Patient.findOne({ _id: decoded._id, "tokens.token": token });
        }

        if (!user)
        {
            throw new Error();
        }

        req.token = token;
        req.user = user; // Using a generic name 'user' to accommodate both doctors and patients
        req.role = decoded.role; // You might want to use the role in your route handlers for further role-based logic
        next();
    } catch (e)
    {
        console.error("Error authenticating:", e);
        res.status(401).send({ error: "Please authenticate." });
    }
};

module.exports = auth;
