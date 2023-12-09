const mongoose = require('mongoose');

const silverCountrySchema = new mongoose.Schema(
  {
    country:
    {
      type: String,
      required: true,
    },
    currency:
    {
      type: String,
      required: true,
    },
    rate:
    {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

const SilverCountry = mongoose.model('SilverCountry', silverCountrySchema);

module.exports = SilverCountry;
