const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // Ensure you have your Cloudinary configuration here

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "places", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png"],
  },
});

// Initialize multer with the configured storage
const upload = multer({ storage });

module.exports = upload;
