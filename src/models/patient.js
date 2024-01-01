const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
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
            required: false,
            validator(value)
            {
                if (!validator.isEmail(value))
                {
                    throw new Error('Email is invalid');
                }
            },
            trim: true,
        },


        password:
        {
            type: String,
            minlength: 6,
            required: true,
            trim: true,
        },

        age:
        {
            type: Number,
            required: true,
            trim: true,
        },

        gender:
        {
            type: String,
            required: true,
            trim: true,
        }

    })

const patient = mongoose.model('patient', userSchema)

module.exports = patient;


