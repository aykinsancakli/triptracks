const express = require("express");
const countryController = require("../controllers/countryController");

const router = express.Router();

router.route("/:name").get(countryController.getCountryDataByName);
router.route("/:lat/:lng").get(countryController.getCountryByCoordinates);

module.exports = router;
