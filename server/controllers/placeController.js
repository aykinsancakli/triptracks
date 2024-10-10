const mongoose = require("mongoose");
const Place = require("../models/Place");

// Get all places
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    console.error("Error fetching places:", err); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error fetching places", error: err.message });
  }
};

// Get a specific place by ID
exports.getPlace = async (req, res) => {
  try {
    // Validate the ID format (optional but recommended)
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid place ID format." });
    }

    const place = await Place.findById(req.params.id); // Use findById instead of find
    if (!place) return res.status(404).json({ message: "Place not found" });

    res.json(place);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching place",
      error: err.message || "Internal server error.",
    });
  }
};

// POST a new place
exports.createPlace = async (req, res) => {
  const { placeName, country, notes, rating, date, userId, flag, position } =
    req.body;

  try {
    // Validate incoming data (you can add more validation as needed)
    if (!placeName || !country || !userId) {
      return res
        .status(400)
        .json({ message: "Place name, country, and user ID are required." });
    }

    const newPlace = await Place.create({
      placeName,
      country,
      notes,
      rating,
      date,
      userId,
      flag,
      position,
    });
    res.status(201).json(newPlace);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating place",
      error: err.message || "Internal server error.",
    });
  }
};

// DELETE a place by ID
exports.deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    // Send a success response after deletion
    res.status(204).send(); // No content to send back, just a success status
  } catch (err) {
    res.status(500).json({ message: "Error deleting place", error: err });
  }
};
