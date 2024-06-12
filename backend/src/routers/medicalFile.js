const express = require("express");
const path = require("path");
const auth = require("../middleware/auth");
const Patient = require("../models/patient");
const MedicalFileModel = require("../models/medicalFile");
const { documentUpload } = require("../utils/multer-config");

const router = express.Router();

router.post("/medical-record/:id", auth, (req, res) =>
{
  if (req.role !== "patient")
    {
    return res
      .status(403)
      .send({ error: "Only patients are authorized to add files" });
    }

  documentUpload(req, res, async (err) =>
    {
    if (err)
    {
      return res.status(400).send({ error: err.message });
    }

    try {
      const patientId = req.params.id;
      const patient = await Patient.findById(patientId);

      if (!patient) {
        return res.status(404).send({ error: "Patient not found" });
      }

      if (!req.file)
        {
            return res.status(400).send({ error: "Medical file not provided" });
        }

      const patientDocument = req.file;
      const patientDocumentPath = path.relative(
        path.join(__dirname, "../../"),
        req.file.path
      );

      const medicalFileData = new MedicalFileModel({
        patientId: patientId,
        title: patientDocument.filename,
        path: patientDocumentPath,
      });

      await medicalFileData.save();

      res.status(201).send({ message: "File uploaded successfully" });
    } catch (error) {
      res.status(400).send({ error: "Could not upload medical file" });
    }
  });
});

module.exports = router;
