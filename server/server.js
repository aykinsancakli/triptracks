const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const cors = require("cors");

dotenv.config({ path: "./config.env" });

const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

// Connect to MongoDB
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log("DB Connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

// API Endpoint
app.get("/api", (req, res) => {
  res.json({ places: ["trevi", "madrid", "rome"] });
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
