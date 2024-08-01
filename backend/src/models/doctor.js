const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        trim: true
    },

    email:
    {
        type: String,
        unique: true,
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
        required: function () { return !this.isGoogleSignUp },
        trim: true,
        validate(value)
        {
            // Skip validation if google sign up is true
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
        required: false,
    },

    bucket:
    {
        type: String,
        required: false,
    },

    profileKey:
    {
        type: String,
        required: false,
    },

    region:
    {
        type: String,
        required: false,
    },

    gender:
    {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other", "Prefer not to say"],
        trim: true,
        default: "Prefer not to say",
    },

    specialization: {
        type: [String], // or just String if only one specialization is allowed
        required: true,
        trim: true
    },

    yearsOfExperience:
    {
        type: Number,
        required: true,
        min: 0
    },

    qualifications:
    {
        type: [String],
        required: true,
        trim: true
    },

    tokens:
        [
            {
                token:
                {
                    type: String,
                    required: true,
                },
            }
        ],
    assignedPatients:
        [
            {
                patient:
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "patient",
                },
                name: String,
                email: String,
            },
        ],
    role:
    {
        type: String,
        default: "doctor",
        enum: ["doctor"],
    },
    twoFactorSecret: {
        type: String,
        required: false,
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual property for patient medical record and prescription, to link doctor with medical record and prescription
// Add after defining medical record and prescription models

// hide private data when sending doctor object
doctorSchema.methods.toJSON = function ()
{
    const doctor = this;
    const doctorObject = doctor.toObject();

    delete doctorObject.password;
    delete doctorObject.tokens;

    return doctorObject;
};

doctorSchema.methods.generateAuthToken = async function (next)
{
    const doctor = this;
    const token = jwt.sign({ _id: doctor.id.toString(), role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '14d' })

    doctor.tokens = doctor.tokens.concat({ token })

    await doctor.save()

    return token;
}

doctorSchema.statics.findByCredentials = async function (email, password)
{
    const doctor = await this.findOne({ email });

    if (!doctor)
    {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch)
    {
        throw new Error('Unable to login');
    }

    return doctor;
};

// Hash password before saving
doctorSchema.pre('save', async function (next)
{
    const doctor = this;

    if (doctor.isModified('password'))
    {
        doctor.password = await bcrypt.hash(doctor.password, 8);
    }

    next();
});

const Doctor = mongoose.model('doctor', doctorSchema);

module.exports = Doctor;
