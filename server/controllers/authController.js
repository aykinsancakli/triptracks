const Place = require("../models/Place");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  // For debugging
  console.log(err.message, err.code);

  // Create the error object to be returned later
  let errors = { email: "", password: "" };

  // Not valid email and password
  if (err.message === "not a valid email and password") {
    errors.email = "Please enter an email";
    errors.password = "Please enter a password";
  }

  // Not valid email
  if (err.message === "not a valid email") {
    errors.email = "Please enter an email";
  }

  // Not valid password
  if (err.message === "not a valid password") {
    errors.password = "Please enter a password";
  }

  // Incorrect email
  if (err.message === "incorrect email") {
    errors.email = "Email is not registered";
  }

  // Incorrect password
  if (err.message === "incorrect password") {
    errors.password = "Incorrect password";
  }

  // Duplicate error code
  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  // Validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// Create token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// Sign Up
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

exports.checkAuth = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      return res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Logout
exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out" });
};

// Delete account
exports.deleteAccount = async (req, res) => {
  const { userId } = req.body;

  try {
    // Delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all places associated with the user
    await Place.deleteMany({ userId: userId });

    // Clear the JWT cookie
    res.clearCookie("jwt");

    // Send success response
    res.status(200).json({
      message: "Account and all associated places deleted successfully",
    });
  } catch (err) {
    console.error("Account deletion failed:", err);
    res
      .status(500)
      .json({ message: "Failed to delete account and associated places" });
  }
};
