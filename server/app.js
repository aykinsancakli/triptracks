const express = require("express");
const cors = require("cors");

const placeRouter = require("./routes/placeRoutes");

const app = express();

// CORS middleware
const corsOptions = {
  origin: ["http://localhost:5173"], // Allow requests from your frontend URL
};
app.use(cors(corsOptions));

// Middleware for JSON body parsing
app.use(express.json());

// Routes
app.use("/api/places", placeRouter);

module.exports = app;
