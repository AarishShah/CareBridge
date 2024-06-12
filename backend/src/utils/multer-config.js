const { join } = require("path")
const { format } = require("date-fns");
const fs = require("fs");
const multer = require("multer");

// To make sure the directory exists
const profilePictureDir = join(__dirname, "../../uploads/profile-pictures");
if (!fs.existsSync(profilePictureDir))
{
	fs.mkdirSync(profilePictureDir, { recursive: true });
}
// Storage location
const profileStorage = multer.diskStorage({
	destination: (_, file, callback) =>
	{
		callback(null, profilePictureDir);
  	},
  	filename: (_, file, callback) =>
	{
    	callback(null, file.originalname);
  },
});

const imageFilter = (_, file, callback) =>
{
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
	{
		return callback(new Error("Only image files are allowed"), false);
	}

	callback(null, true);
} 

// Adding file handling middleware
// single: handles one file at a time
const profileUpload = multer({
	storage: profileStorage,
  	fileFilter: imageFilter,
  	limits: { fileSize: 1000000 }, // 1MB limit
}).single("profile");

// For medical documents
const documentsDir = join(__dirname, "../../uploads/documents");
if (!fs.existsSync(documentsDir))
{
	fs.mkdirSync(documentsDir, { recursive: true });
}

const documentsStorage = multer.diskStorage({
	destination: (_, __, callback) =>
		{
			callback(null, documentsDir);
		},
	filename: (_, file, callback) =>
		{
            const formattedDate = format(new Date(), "dd-MM-yyyy")
			callback(null, `${formattedDate}-${file.originalname}`);
		}
})

const documentsFilter = (_, file,  callback) =>
{
	if (!file.originalname.match(/\.(pdf)$/))
	{
		return callback(new Error("Only .pdf files are supported"), false);
	}

	callback(null, true);
}

const documentUpload = multer({
	storage: documentsStorage,
	fileFilter: documentsFilter,
	limits: { fileSize: 5000000 }, // 5MB limit
}).single("document");

module.exports = { profileUpload, documentUpload };
