const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: addressSchema,
      required: true,
    },

    email: {
      type: String,
      unique: true, // this will make sure that every email different
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
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
      validate(value) {
        const currentDate = new Date();

        value.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (value > currentDate) {
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

// Authentication method for the patient model
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  const patient = this;

  if (patient.isModified("password")) {
    patient.password = await bcrypt.hash(patient.password, 8);
  }

  next();
});

const patient = mongoose.model("patient", userSchema);

module.exports = patient;

// Docstrings weren't working for me
// Test data

// {
//     "name": "Alice Smith",
//     "address": {
//         "street": "Park Avenue",
//         "city": "New York City",
//         "state": "New York",
//         "pinCode": "10018"
//     },
//     "email": "alicesmith@example.com",
//     "password": "securePassword123",
//     "DOB": "12/05/1995", // Date of Birth in YYYY-MM-DD format
//     "gender": "Female"
// }
