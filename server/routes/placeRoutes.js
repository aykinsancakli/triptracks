const express = require("express");
const place = require("../models/Place");
const Place = require("../models/Place");
const router = express.Router();

// Get all places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Error fetching places", error: err });
  }
});

// Get a specific place by ID
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.find(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: "Error fetching place", error: err });
  }
});

// POST a new place
router.post("/", async (req, res) => {
  const { placeName, country, notes, date, userId } = req.body;
  console.log("Request Body:", req.body); // Log the request body

  try {
    const newPlace = await Place.create({
      placeName,
      country,
      notes,
      date,
      userId,
    });
    res.status(201).json(newPlace);
  } catch (err) {
    console.error(err); // Log the error for better visibility
    res.status(400).json({ message: "Error creating place", error: err });
  }
});

// DELETE a place by ID
router.delete("/:id", async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting place", error: err });
  }
});

module.exports = router;
