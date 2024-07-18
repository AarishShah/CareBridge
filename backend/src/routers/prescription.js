const express = require("express");
const Patient = require("../models/patient");
const Prescription = require("../models/prescription");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/prescription/:id", auth, async (req, res) =>
{
    if (req.role !== "doctor")
    {
        return res
        .status(403)
        .send({ error: "Only doctors are authorized to add prescriptions", });
    }

    const patientId = req.params.id;
    const doctorId = req.user._id;

    try {
        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).send({ error: 'Patient not found' });
        }

        const isAssignedDoctor = patient.assignedDoctors.some(doc => doc.doctor.toString() === doctorId.toString());

        if (!isAssignedDoctor) {
            return res.status(403).send({ error: 'Doctor not authorized to add prescription for this patient' });
        }

        const prescription = new Prescription({
            patientId,
            prescribedDrug: req.body.prescribedDrug,
            dosage: req.body.dosage,
            administrationRoute: req.body.administrationRoute,
            dosageFrequency: req.body.dosageFrequency,
            allergies: req.body.allergies,
        })

        await prescription.save();
        res.status(201).send({ prescription });
    } catch (e) {
        res.status(400).send({ error: 'Failed to create patient prescription' });
    }
}
);

router.get("/prescription", auth, async (req, res) =>
{
    const page = parseInt(req.query.page) || 1; // Default to first page
    const limit = parseInt(req.query.limit) || 6; // Default to 6 items per page
    const skip = (page - 1) * limit;

    try {
        let filter = {};
        if (req.user.role === "patient") {
        filter["id"] = req.user._id;
      }
      
      if (req.user.role === "doctor")
        {
            const assignedPatientIds = await Patient.find(
            { "assignedDoctors.doctor": req.user._id },
            "_id"
        );
        filter["id"] =
        {
          $in: assignedPatientIds.map((doc) => doc._id),
        };
      }
      console.log(filter);

      const prescription = await Prescription.find(
    
      )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCount = await Prescription.countDocuments(filter);

      res.status(200).send({
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        totalItems: totalCount,
        items: prescription,
      });
    } catch (error) {
      res.status(500).send({ error: "Error fetching patient's prescriptions" });
    }
}
);

router.delete("/prescription/:id", auth, async (req, res) =>
{
    try
    {
        const prescriptionId = req.params.id;

        const prescription = await Prescription.findById(prescriptionId);

        if (!prescription)
        {
            return res.status(404).send("Prescription not found");
        }

        await prescription.delete();

        res.status(200).send("Prescription deleted successfully");
    } catch (error)
    {
        res.status(500).send("Could not delete prescription");
    }
}
);


module.exports = router;