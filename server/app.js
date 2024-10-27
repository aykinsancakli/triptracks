const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const countryRouter = require("./routes/countryRoutes");
const placeRouter = require("./routes/placeRoutes");
const weatherRouter = require("./routes/weatherRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.PRODUCTION_URL
      : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Routes
app.use("/api/places", placeRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/country", countryRouter);
app.use("/api", authRouter);

module.exports = app;
