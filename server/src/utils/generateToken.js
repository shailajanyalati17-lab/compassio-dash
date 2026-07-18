const jwt = require("jsonwebtoken");

module.exports = function generateToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, businessId: user.businessId?.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
