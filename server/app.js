const express = require("express");
const app = express();

// Import routes
const placeRoutes = require("./routes/placeRoutes");

// MIDDLEWARES
app.use(express.json());

// ROUTES
app.use("/api/places", placeRoutes);

module.exports = app;
