const passport = require('passport');
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Patient = require('../models/patient');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/patient/auth/google/callback"
}, async (token, tokenSecret, profile, done) => {
    try {
        let patient = await Patient.findOne({ email: profile.emails[0].value });

        if (!patient) {
            // Temporarily store the user data
            const tempUser = {
                name: profile.displayName,
                email: profile.emails[0].value,
                isGoogleSignUp: true,
                googleId: profile.id
            };

            return done(null, tempUser); // Pass the temp user to done
        }

        return done(null, patient);
    } catch (err) {
        return done(err, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id || user.googleId);
});

passport.deserializeUser(async (id, done) => {
    try {
        const patient = await Patient.findById(id);
        if (patient) {
            done(null, patient);
        } else {
            // If patient not found in DB, it must be a temp user
            done(null, { googleId: id });
        }
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
