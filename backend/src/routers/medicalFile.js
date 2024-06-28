const express = require("express");
const path = require("path");
const { randomUUID } = require("crypto");
const { HttpRequest } = require("@smithy/protocol-http");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl, S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");
const { parseUrl } = require("@smithy/url-parser");
const { Hash } = require("@smithy/hash-node")
const { formatUrl } = require("@aws-sdk/util-format-url");

const s3 = require("../utils/s3Client");
const auth = require("../middleware/auth");
const Patient = require("../models/patient");
const MedicalFileModel = require("../models/medicalFile");

require('dotenv').config({path: path.join(__dirname, '../.env')});

const router = express.Router();

const presigner = new S3RequestPresigner({
    credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
  region: process.env.REGION,
  sha256: Hash.bind(null, "sha256"),
});

router.get("/medical-record", auth, async (req, res) =>
{
    try
    {
        let patientId;
        if (req.user.role === "doctor")
        {
            patientId = await Patient.find({ "assignedDoctors.doctor": req.user._id });
        } else
        {
            patientId = req.user._id;
        }

        if (!patientId)
        {
            return res.status(404).send({ error: "Patient record not found" });
        }

        const medicalFile = await MedicalFileModel.find({ patientId });

        if (!medicalFile)
        {
            return res.status(404).send({ error: "Medical record not found" });
        }

        let formattedUrl = [];
        let key = [];
        const presignedUrls = medicalFile.map(async (file) =>
            {
                const s3ObjectUrl = parseUrl(`https://${file.bucket}.s3.${file.region}.amazonaws.com/${file.key}`);
                const url = await presigner.presign(new HttpRequest(s3ObjectUrl));
                key.push(file.key)
                return formattedUrl.push(formatUrl(url));
            }
        )

        await Promise.all(presignedUrls);

        res.status(200).json({ presignedUrl: formattedUrl, key });
    } catch (e)
    {
        res.status(400).send({ error: "Error fetching medical file(s)" });   
    }
});

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

        const putObjectCommands =
        {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            ContentType: 'application/pdf'
        };

        const command = new PutObjectCommand(putObjectCommands);
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 4000 });

        const medicalFileData = new MedicalFileModel({ patientId, bucket: process.env.BUCKET_NAME, key, region: process.env.REGION })
        
        await medicalFileData.save();

        res.status(200).json({ uploadUrl, key });
    } catch (e)
    {
        res.status(400).send({ error: "Could not upload medical file" });
    }
});

module.exports = router;
