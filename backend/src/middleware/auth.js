require('dotenv').config();
const jwt = require("jsonwebtoken");
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const auth = async (req, res, next) =>
{
    try
    {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user;

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
        req.user = user;
        req.role = decoded.role;
        next();
    } catch (e)
    {
        console.log("Error authenticating:", e);
        res.status(401).send({ error: "Please authenticate." });
    }
};

module.exports = auth;
