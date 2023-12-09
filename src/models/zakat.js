const mongoose = require('mongoose');

const calculatorSchema = new mongoose.Schema(
    {

        userId:
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },

        zakatAmount:
        {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Calculator = mongoose.model('calculator', calculatorSchema);

module.exports = Calculator;
