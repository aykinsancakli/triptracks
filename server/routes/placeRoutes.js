const express = require("express");
const placeController = require("./../controllers/placeController");
const upload = require("../utils/multerConfig"); // Import the multer config

const router = express.Router();

router
  .route("/")
  .get(placeController.getAllPlaces)
  .post(upload.single("image"), placeController.createPlace); // Keep both the upload middleware and the controller

router
  .route("/:id")
  .get(placeController.getPlace)
  .delete(placeController.deletePlace);

module.exports = router;
