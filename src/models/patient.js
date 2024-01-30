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
      maxlength: 64,
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
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property for patient medical record and prescription
// Add after defining medical record and prescription models

// Age virtual property
userSchema.virtual("age").get(function ()
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

// Authentication method for the patient model
userSchema.statics.findByCredentials = async function (email, password)
{
  const patient = await this.findOne({ email });

  if (!user)
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
userSchema.pre("save", async function (next)
{
  const patient = this;

  if (patient.isModified("password"))
  {
    patient.password = await bcrypt.hash(patient.password, 8);
  }

  next();
});

// Delete patient medical record and prescription when patient is removed
// Add after defining medical record and prescription models

const patient = mongoose.model("patient", userSchema);

module.exports = patient;

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
//     "DOB": "12/05/1995",
//     "gender": "Female"
// }
