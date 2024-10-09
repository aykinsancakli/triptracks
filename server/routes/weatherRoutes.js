const express = require("express");
const weatherController = require("../controllers/weatherController");

const router = express.Router();

router.route("/by-coordinates").get(weatherController.getWeatherByCoordinates);
router
  .route("/time/by-coordinates")
  .get(weatherController.getTimeByCoordinates);
router.route("/image").get(weatherController.getImageData);

module.exports = router;
