const express = require("express");
const cors = require("cors");

const countryRouter = require("./routes/countryRoutes");
const placeRouter = require("./routes/placeRoutes");
const weatherRouter = require("./routes/weatherRoutes");

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

// Logging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

// Routes
app.use("/api/places", placeRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/country", countryRouter);

module.exports = app;
