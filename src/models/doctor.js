const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
        required: true,
        trim: true,
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
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

doctorSchema.statics.findByCredentials = async function (email, password)
{
    const user = await this.findOne({ email });

    if (!user)
    {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
    {
        throw new Error('Unable to login');
    }

    return user;
};

// Hash password before saving
doctorSchema.pre('save', async function (next)
{
    const doc = this;

    if (doc.isModified('password'))
    {
        doc.password = await bcrypt.hash(doc.password, 8);
    }

    next();
});

const Doc = mongoose.model('Doc', doctorSchema);

module.exports = Doc;

/*
Test data:

{
    name: "Dr. John Doe",
    email: "johndoe@example.com",
    password: "password123",
    gender: "Male",
    specialization: ["Cardiology", "Internal Medicine"],
    yearsOfExperience: 15,
    qualifications: ["MD", "Board Certified in Cardiology", "Ph.D. in Internal Medicine"] 
}
*/
