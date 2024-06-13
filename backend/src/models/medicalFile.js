const mongoose = require("mongoose");

const medicalFileSchema = mongoose.Schema(
    {
        id:
        {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
        },

        patientId:
        {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "Patient"
        },

        bucket: { type: String, required: true },

        key: { type: String, required: true },

        region: { type: String, required: true }
    },

    { timestamps: true, }
)

const MedicalFileModel = mongoose.model("MedicalFile", medicalFileSchema);

module.exports = MedicalFileModel;