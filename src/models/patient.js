const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
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

        password: {
            type: String,
            minlength: 8,
            required: true,
            trim: true,
        },

        DOB: {
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

        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other", "Prefer not to say"],
            trim: true,
            default: "Prefer not to say",
        },
    },

    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual("age").get(function () // update calculated age in better way
{
    const currentDate = new Date();
    const age = currentDate.getFullYear() - this.DOB.getFullYear();
    return age;
});

const patient = mongoose.model("patient", userSchema);

module.exports = patient;
