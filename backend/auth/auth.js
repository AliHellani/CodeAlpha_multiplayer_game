const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No Token Found");
    return res.status(401).json({ error: "No Token Found!" });
  }

  jwt.verify(token, "cCw~3C4546L=[.O[E{CW", (err, user) => {
    if (err) {
      console.log("Token verification Failed:", err.message);
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
