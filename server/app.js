const express = require("express");
const cors = require("cors");

const placeRouter = require("./routes/placeRoutes");
const countryRouter = require("./routes/countryRoutes");

const app = express();

// CORS middleware
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://your-production-url.com"
      : "http://localhost:5173",
};
app.use(cors(corsOptions));

// Middleware for JSON body parsing
app.use(express.json());

// Routes
app.use("/api/places", placeRouter);
app.use("/api/country", countryRouter);

module.exports = app;
