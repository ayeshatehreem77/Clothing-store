const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = "mysecretkey";

const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(data.user.id).select("-password");
    if (!user) return res.status(401).send({ error: "User not found" });

    req.user = user;  // ensures user role
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = fetchuser; 
