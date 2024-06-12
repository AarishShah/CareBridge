const mongoose = require("mongoose");

const medicalFileSchema = mongoose.Schema(
    {
        id:
        {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "Patient"
        },

        title: { type: String, required: true },

        path: { type: String, required: true },
    },

    { timestamps: true, }
)

const MedicalFileModel = mongoose.model("MedicalFile", medicalFileSchema);

module.exports = MedicalFileModel;