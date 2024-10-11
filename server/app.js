const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const countryRouter = require("./routes/countryRoutes");
const placeRouter = require("./routes/placeRoutes");
const weatherRouter = require("./routes/weatherRoutes");

const app = express();

// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://your-production-url.com"
      : "http://localhost:5173",
};
app.use(cors(corsOptions));

// Routes
app.use("/api/places", placeRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/country", countryRouter);

module.exports = app;
