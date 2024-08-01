const passport = require('passport');
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

const backendUrl = process.env.BACKEND_URL;

// Patient Google Strategy
passport.use('google-patient', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${backendUrl}/patient/auth/google/callback`
}, async (token, tokenSecret, profile, done) =>
{
    try
    {
        let patient = await Patient.findOne({ email: profile.emails[0].value });

        if (!patient)
        {
            const tempUser = {
                name: profile.displayName,
                email: profile.emails[0].value,
                isGoogleSignUp: true,
                googleId: profile.id
            };
            return done(null, tempUser);
        }

        return done(null, patient);
    } catch (err)
    {
        return done(err, false);
    }
}));

// Doctor Google Strategy
passport.use('google-doctor', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${backendUrl}/doctor/auth/google/callback`
}, async (token, tokenSecret, profile, done) =>
{
    try
    {
        let doctor = await Doctor.findOne({ email: profile.emails[0].value });

        if (!doctor)
        {
            const tempUser = {
                name: profile.displayName,
                email: profile.emails[0].value,
                isGoogleSignUp: true,
                googleId: profile.id
            };
            return done(null, tempUser);
        }

        return done(null, doctor);
    } catch (err)
    {
        return done(err, false);
    }
}));

passport.serializeUser((user, done) =>
{
    done(null, user.id || user.googleId);
});

passport.deserializeUser(async (id, done) =>
{
    try
    {
        let user = await Patient.findById(id) || await Doctor.findById(id);
        if (!user)
        {
            user = { googleId: id };
        }
        done(null, user);
    } catch (err)
    {
        done(err, null);
    }
});

module.exports = passport;
