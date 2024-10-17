const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.userId = decoded.id; // Attach userId to request
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = requireAuth;
