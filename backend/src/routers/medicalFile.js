const express = require("express");
const path = require("path");
const { randomUUID } = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const auth = require("../middleware/auth");
const Patient = require("../models/patient");
const MedicalFileModel = require("../models/medicalFile");

require('dotenv').config({path: path.join(__dirname, '../.env')});

const router = express.Router();

const s3 = new S3Client(
    {
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        }
    }
)

router.get("/medical-record/:id", auth, async (req, res) =>
{
    if (req.role !== "patient")
    {
        return res.status(403).send({ error: "Only patients are authorized to add files" });
    }

    try
    {
        const patientId = req.params.id;
        const patient = await Patient.findById(patientId);
        
        if (!patient)
        {
            return res.status(404).send({ error: "Patient not found" });
        }

        
        const ext = req.query.fileType.split("/")[1];
        const key = `document/${randomUUID()}.${ext}`;

        if (!key)
        {
            res.status(404).send({ error: "File not provided" });
        }

        if (!key.includes(".pdf"))
        {
            res.status(400).send({ error: "Only .pdf files are supported" });
        }

        const putObjectCommands =
        {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            ContentType: 'application/pdf'
        };

        const command = new PutObjectCommand(putObjectCommands);
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        const medicalFileData = new MedicalFileModel({ patientId, bucket: process.env.BUCKET_NAME, key, region: process.env.REGION })
        
        await medicalFileData.save();

        res.status(200).json({ uploadUrl, key });
    } catch (e)
    {
        res.status(400).send({ error: "Could not upload medical file" });
    }
});

module.exports = router;
