const express = require("express");
const placeController = require("./../controllers/placeController");
const upload = require("../utils/multerConfig"); // Import the multer config
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(requireAuth, placeController.getAllPlaces)
  .post(requireAuth, upload.single("image"), placeController.createPlace);

router
  .route("/:id")
  .get(requireAuth, placeController.getPlace)
  .delete(requireAuth, placeController.deletePlace);

module.exports = router;
