const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: true,
  },
  country: String,
  notes: String,
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Implement user auth later
    required: true,
  },
});

// This Place model defines the schema that will be used to interact with the places collection in MongoDB.
const Place = mongoose.model("Place", placeSchema);
module.exports = Place;
