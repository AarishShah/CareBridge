const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addressSchema = new mongoose.Schema(
    {

        state:
        {
            type: String,
            required: true,
            trim: true,
        },
        city:
        {
            type: String,
            required: true,
            trim: true,
        },
        street:
        {
            type: String,
            required: true,
            trim: true,
        },
        pinCode:
        {
            type: String,
            required: true,
            trim: true,
        },
    });

const patientSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true,
            trim: true,
        },

        email:
        {
            type: String,
            unique: true, // this will make sure that every email different
            required: true,
            trim: true,
            lowercase: true,
            validate(value)
            {
                if (!validator.isEmail(value))
                {
                    throw new Error("Email is invalid");
                }
            },
        },

        password:
        {
            type: String,
            minlength: 8,
            maxlength: 64,
            required: function () { return !this.isGoogleSignUp; },
            trim: true,
            validate(value)
            {
                // Skip validation if the user signed up with Google
                if (this.isGoogleSignUp) return;
                if (!value || value.length < 8)
                {
                    throw new Error("Password is required and should be at between 8 to 64 characters long");

                }
            },
            default: null,
        },

        isGoogleSignUp:
        {
            type: Boolean,
            default: false,
        },

        googleId:
        {
            type: String,
            default: null,
        },

        profileKey:
        {
            type: String,
            requied: false,
        },

        bucket:
        {
            type: String,
            requied: false,
        },

        region:
        {
            type: String,
            requied: false,
        },

        DOB:
        {
            type: Date,
            required: true,
            validate(value)
            {
                const currentDate = new Date();

                value.setHours(0, 0, 0, 0);
                currentDate.setHours(0, 0, 0, 0);

                if (value > currentDate)
                {
                    throw new Error(
                        "Invalid age - Date of birth cannot be in the future"
                    );
                }
            },
        },

        gender:
        {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other", "Prefer not to say"],
            trim: true,
            default: "Prefer not to say",
        },

        maritalStatus:
        {
            type: String,
            required: true,
            enum: ["Unmarried", "Married"]
        },

        occupation:
        {
            type: String,
            required: true,
        },

        address:
        {
            type: addressSchema,
            required: true,
        },

        assignedDoctors:
            [
                {
                    doctor:
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "doctor",
                    },
                    name: String,
                    email: String,
                },
            ],

        tokens:
            [
                {
                    token: {
                        type: String,
                        required: true,
                    },
                },
            ],

        role:
        {
            type: String,
            default: "patient",
            enum: ["patient"],
        },
        twoFactorSecret: {
            type: String,
            required: false,
        },
    },

    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual property for patient medical record and prescription, to link patient with medical record and prescription
// Add after defining medical record and prescription models

// Age virtual property
patientSchema.virtual("age").get(function ()
{
    const currentDate = new Date();
    const birthDate = new Date(this.DOB);

    let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
    let ageMonths = currentDate.getMonth() - birthDate.getMonth();
    let ageDays = currentDate.getDate() - birthDate.getDate();

    if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0))
    {
        ageYears--;
        ageMonths = (ageMonths + 12) % 12;
    }

    if (ageDays < 0)
    {
        const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        ageDays += lastDayOfPreviousMonth;
        ageMonths = ageMonths - 1 < 0 ? 11 : ageMonths - 1;
    }

    return { years: ageYears, months: ageMonths, days: ageDays };
});

// hide private data when sending patient object
patientSchema.methods.toJSON = function ()
{
    const patient = this;
    const patientObject = patient.toObject();

    delete patientObject.password;
    delete patientObject.tokens;

    return patientObject;
};

patientSchema.methods.generateAuthToken = async function (next)
{
    const patient = this;
    const token = jwt.sign({ _id: patient.id.toString(), role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '14d' });

    patient.tokens = patient.tokens.concat({ token });

    await patient.save();

    return token;
};

// Authentication method for the patient model
patientSchema.statics.findByCredentials = async function (email, password)
{
    const patient = await this.findOne({ email });

    if (!patient)
    {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch)
    {
        throw new Error("Unable to login");
    }

    return patient;
};

// Hash password before saving
patientSchema.pre("save", async function (next)
{
    const patient = this;

    if (patient.isModified("password") && patient.password)
    {
        patient.password = await bcrypt.hash(patient.password, 8);
    }

    next();
});

// Delete patient medical record and prescription when patient is removed
// Add after defining medical record and prescription models

const Patient = mongoose.model("patient", patientSchema);

module.exports = Patient;
