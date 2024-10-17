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
    res.status(201).json({ user: user._id });
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
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
