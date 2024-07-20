const passport = require('passport');
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Doctor = require('../models/doctor');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/doctor/auth/google/callback"
}, async (token, tokenSecret, profile, done) => {
    try {
        let doctor = await Doctor.findOne({ email: profile.emails[0].value });

        if (!doctor) {
            // Temporarily store the user data
            const tempUser = {
                name: profile.displayName,
                email: profile.emails[0].value,
                isGoogleSignUp: true,
                googleId: profile.id
            };

            return done(null, tempUser); // Pass the temp user to done
        }

        return done(null, doctor);
    } catch (err) {
        return done(err, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id || user.googleId);
});

passport.deserializeUser(async (id, done) => {
    try {
        const doctor = await Doctor.findById(id);
        if (doctor) {
            done(null, doctor);
        } else {
            // If doctor not found in DB, it must be a temp user
            done(null, { googleId: id });
        }
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
