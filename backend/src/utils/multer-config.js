const { join } = require("path")
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

module.exports = { profileUpload, documentUpload };