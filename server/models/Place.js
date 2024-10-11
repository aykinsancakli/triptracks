const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  notes: {
    type: String,
  },
  rating: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Implement user auth later
    required: true,
  },
  flag: {
    type: String,
  },
  position: {
    // Keep latitude and longitude in a nested object
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  photoUrl: {
    type: String,
  },
});

// This Place model defines the schema that will be used to interact with the places collection in MongoDB.
const Place = mongoose.model("Place", placeSchema);
module.exports = Place;
