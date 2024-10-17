const mongoose = require("mongoose");
const Place = require("../models/Place");

// Get all places for the authenticated user
exports.getAllPlaces = async (req, res) => {
  try {
    console.log(req.userId);

    const places = await Place.find({ userId: req.userId });
    res.json(places);
  } catch (err) {
    console.error("Error fetching places:", err); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error fetching places", error: err.message });
  }
};

// Get a specific place by ID for the authenticated user
exports.getPlace = async (req, res) => {
  try {
    // Validate the ID format
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid place ID format." });
    }

    // Fetch the place by ID
    const place = await Place.findById(req.params.id);

    // Check if the place exists
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Check if the place belongs to the authenticated user
    if (place.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to access this place." });
    }

    res.json(place);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching place",
      error: err.message || "Internal server error.",
    });
  }
};

// POST a new place for the authenticated user
exports.createPlace = async (req, res) => {
  const { placeName, country, notes, rating, date, flag } = req.body;
  const position = req.body.position ? JSON.parse(req.body.position) : null; // Parse position

  try {
    // Save the photo's Cloudinary URL if an image was uploaded
    const photoUrl = req.file ? req.file.path : null;

    // Validate incoming data
    if (!placeName || !country || !position || !position.lat || !position.lng) {
      return res.status(400).json({
        message:
          "Place name, country, user ID, and position (lat/lng) are required.",
      });
    }

    const newPlace = await Place.create({
      placeName,
      country,
      notes,
      rating,
      date,
      userId: req.userId, // Associate the place with the authenticated user
      flag,
      position,
      photoUrl,
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

// DELETE a place by ID for the authenticated user
exports.deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    // Check if the place exists
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Check if the place belongs to the authenticated user
    if (place.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this place" });
    }

    // Delete the place
    await Place.findByIdAndDelete(req.params.id);
    res.status(204).send(); // No content to send back, just a success status
  } catch (err) {
    res.status(500).json({ message: "Error deleting place", error: err });
  }
};
